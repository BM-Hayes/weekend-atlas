#!/usr/bin/env node
/**
 * Weekend Atlas — suggestion queue review
 *
 *   node scripts/approve-queue.mjs
 *   npm run queue:review
 *
 * Walks data/queue.json one row at a time.
 * Approve appends a listing to data/listings.json and drops the row.
 * Drive times are estimated, not routed:
 *   haversine miles × 1.33 min/mi (45 mph) × 1.12 winding factor
 * Hubs: Hartsville, Florence, Cheraw.
 */

import fs from "node:fs/promises";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const QUEUE_PATH = path.join(ROOT, "data", "queue.json");
const LISTINGS_PATH = path.join(ROOT, "data", "listings.json");

const HUBS = {
  hartsville: { name: "Hartsville", coordinates: [-80.0754, 34.3743] },
  florence: { name: "Florence", coordinates: [-79.7626, 34.1954] },
  cheraw: { name: "Cheraw", coordinates: [-79.8845, 34.6974] },
};

const CATEGORIES = ["haunts", "antiques", "parks", "farms"];
const SEASONS = ["fall", "year-round", "spring", "summer"];

const EARTH_RADIUS_MI = 3958.7613;
const MIN_PER_MILE = 1.33;
const WINDING = 1.12;

const CATEGORY_ALIASES = {
  h: "haunts",
  haunt: "haunts",
  haunts: "haunts",
  event: "haunts",
  a: "antiques",
  antique: "antiques",
  antiques: "antiques",
  market: "antiques",
  thrift: "antiques",
  p: "parks",
  park: "parks",
  parks: "parks",
  trail: "parks",
  garden: "parks",
  water: "parks",
  refuge: "parks",
  downtown: "parks",
  museum: "parks",
  f: "farms",
  farm: "farms",
  farms: "farms",
};

const SEASON_ALIASES = {
  fall: "fall",
  autumn: "fall",
  halloween: "fall",
  year: "year-round",
  "year-round": "year-round",
  yearround: "year-round",
  y: "year-round",
  spring: "spring",
  summer: "summer",
};

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function haversineMiles(from, to) {
  const [lng1, lat1] = from;
  const [lng2, lat2] = to;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_MI * Math.asin(Math.min(1, Math.sqrt(a)));
}

function driveMinutes(from, to) {
  const miles = haversineMiles(from, to);
  return Math.max(1, Math.round(miles * MIN_PER_MILE * WINDING));
}

function estimateDriveTimes(coords) {
  return {
    hartsville: driveMinutes(HUBS.hartsville.coordinates, coords),
    florence: driveMinutes(HUBS.florence.coordinates, coords),
    cheraw: driveMinutes(HUBS.cheraw.coordinates, coords),
  };
}

function milesFromHubs(coords) {
  return {
    hartsville: haversineMiles(HUBS.hartsville.coordinates, coords),
    florence: haversineMiles(HUBS.florence.coordinates, coords),
    cheraw: haversineMiles(HUBS.cheraw.coordinates, coords),
  };
}

function slugify(value) {
  const slug = String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug || "place";
}

function uniqueId(base, listings) {
  const taken = new Set(listings.map((row) => row.id));
  if (!taken.has(base)) return base;
  for (let n = 2; n < 100; n += 1) {
    const next = `${base}-${n}`;
    if (!taken.has(next)) return next;
  }
  return `${base}-${Date.now()}`;
}

function normalizeCategory(value) {
  const key = String(value || "")
    .trim()
    .toLowerCase();
  return CATEGORY_ALIASES[key] || "";
}

function normalizeSeason(value, category) {
  const key = String(value || "")
    .trim()
    .toLowerCase();
  if (SEASON_ALIASES[key]) return SEASON_ALIASES[key];
  if (category === "haunts") return "fall";
  return "year-round";
}

/**
 * Accept "lng, lat" or "lat, lng". Pee Dee lats are ~33–36, lngs ~-82–-78.
 */
function parseCoords(value) {
  if (Array.isArray(value) && value.length >= 2) {
    const a = Number(value[0]);
    const b = Number(value[1]);
    if (Number.isFinite(a) && Number.isFinite(b)) return orderCoords(a, b);
    return null;
  }
  if (value && typeof value === "object") {
    const lng = Number(value.lng ?? value.lon ?? value.longitude);
    const lat = Number(value.lat ?? value.latitude);
    if (Number.isFinite(lng) && Number.isFinite(lat)) return [lng, lat];
  }
  const text = String(value || "").trim();
  if (!text) return null;
  const parts = text.split(/[,\s]+/).filter(Boolean);
  if (parts.length < 2) return null;
  const a = Number(parts[0]);
  const b = Number(parts[1]);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return orderCoords(a, b);
}

function orderCoords(a, b) {
  const aLooksLat = a >= 32 && a <= 37;
  const bLooksLng = b <= -77 && b >= -83;
  const aLooksLng = a <= -77 && a >= -83;
  const bLooksLat = b >= 32 && b <= 37;
  if (aLooksLat && bLooksLng) return [b, a];
  if (aLooksLng && bLooksLat) return [a, b];
  if (Math.abs(a) > Math.abs(b)) return [a, b];
  return [b, a];
}

function coordsFromQueue(item) {
  const raw = item?.raw && typeof item.raw === "object" ? item.raw : {};
  return (
    parseCoords(item.coordinates) ||
    parseCoords(raw.coordinates) ||
    parseCoords(item.lng != null ? [item.lng, item.lat] : null) ||
    parseCoords(raw.lng != null ? [raw.lng, raw.lat] : null) ||
    parseCoords(
      item.longitude != null ? [item.longitude, item.latitude] : null,
    ) ||
    null
  );
}

function listingShape(row) {
  const shaped = {
    id: row.id,
    title: row.title,
    category: row.category,
    season: row.season,
    tagline: row.tagline,
    coordinates: row.coordinates,
    city: row.city,
    driveTimes: {
      hartsville: row.driveTimes.hartsville,
      florence: row.driveTimes.florence,
      cheraw: row.driveTimes.cheraw,
    },
  };
  if (row.link) shaped.link = row.link;
  return shaped;
}

async function readJson(filePath, fallback) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw.replace(/^\uFEFF/, ""));
    return parsed;
  } catch (err) {
    if (err && err.code === "ENOENT") return fallback;
    throw err;
  }
}

async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const body =
    filePath === LISTINGS_PATH
      ? formatListings(asListings(value))
      : `${JSON.stringify(value, null, 2)}\n`;
  await fs.writeFile(filePath, body, "utf8");
}

function compactNumber(n) {
  if (!Number.isFinite(n)) return "0";
  if (Number.isInteger(n)) return String(n);
  return String(Math.round(n * 1e6) / 1e6);
}

function formatListings(listings) {
  const rows = listings.map((row) => listingShape(row));
  if (rows.length === 0) return "[]\n";
  const blocks = rows.map((row) => {
    const lines = [
      `    "id": ${JSON.stringify(row.id)},`,
      `    "title": ${JSON.stringify(row.title)},`,
      `    "category": ${JSON.stringify(row.category)},`,
      `    "season": ${JSON.stringify(row.season)},`,
      `    "tagline": ${JSON.stringify(row.tagline)},`,
      `    "coordinates": [${compactNumber(row.coordinates[0])}, ${compactNumber(row.coordinates[1])}],`,
      `    "city": ${JSON.stringify(row.city)},`,
      `    "driveTimes": { "hartsville": ${row.driveTimes.hartsville}, "florence": ${row.driveTimes.florence}, "cheraw": ${row.driveTimes.cheraw} }`,
    ];
    if (row.link) {
      lines[lines.length - 1] += ",";
      lines.push(`    "link": ${JSON.stringify(row.link)}`);
    }
    return `  {\n${lines.join("\n")}\n  }`;
  });
  return `[\n${blocks.join(",\n")}\n]\n`;
}

function asQueue(value) {
  if (Array.isArray(value)) return value;
  if (value && Array.isArray(value.items)) return value.items;
  return [];
}

function asListings(value) {
  return Array.isArray(value) ? value : [];
}

function draftFromQueue(item, listings) {
  const raw = item?.raw && typeof item.raw === "object" ? item.raw : {};
  const title = String(item.title || item.name || raw.name || "").trim();
  const city = String(item.city || raw.city || "").trim();
  const category = normalizeCategory(
    item.category || item.kind || raw.category || raw.kind,
  );
  const season = normalizeSeason(
    item.season || raw.season,
    category,
  );
  const tagline = String(
    item.tagline || item.note || raw.note || raw.tagline || "",
  )
    .trim()
    .replace(/\s+/g, " ");
  const link = String(item.link || item.website || raw.website || raw.link || "")
    .trim();
  const coordinates = coordsFromQueue(item);
  const driveTimes = coordinates ? estimateDriveTimes(coordinates) : null;
  const id = uniqueId(slugify(title), listings);

  return {
    id,
    title,
    category,
    season,
    tagline,
    coordinates,
    city,
    driveTimes,
    link,
  };
}

function line(label, value) {
  const pad = label.padEnd(12);
  return `  ${pad} ${value}`;
}

function fmtCoords(coords) {
  if (!coords) return "(need lng, lat)";
  return `[${coords[0]}, ${coords[1]}]`;
}

function fmtDrive(draft) {
  if (!draft.coordinates || !draft.driveTimes) return "(waiting on coordinates)";
  const miles = milesFromHubs(draft.coordinates);
  return ["hartsville", "florence", "cheraw"]
    .map((hub) => {
      const min = draft.driveTimes[hub];
      const mi = miles[hub].toFixed(1);
      const flag = min > 90 ? "  ! over 90" : "";
      return `${hub} ${min} min (${mi} mi)${flag}`;
    })
    .join("\n                 ");
}

function printBanner() {
  console.log("");
  console.log("Weekend Atlas · queue review");
  console.log("Approve writes data/listings.json and drops the row from data/queue.json.");
  console.log("Drive times: haversine × 1.33 min/mi × 1.12 winding. Not turn-by-turn.");
  console.log("");
}

function printItem(item, index, total, draft) {
  const submitted = item.created_at || item.createdAt || "";
  console.log("------------------------------------------------------------");
  console.log(`Queue ${index + 1} of ${total}`);
  console.log("------------------------------------------------------------");
  console.log(line("name", item.name || item.title || "(none)"));
  console.log(line("city", item.city || "(none)"));
  console.log(line("kind", item.kind || item.category || "(none)"));
  console.log(line("website", item.website || item.link || "(none)"));
  console.log(line("from", item.from_hub || item.fromHub || "(none)"));
  console.log(line("when", submitted || "(none)"));
  if (item.note) {
    console.log(line("note", String(item.note).trim()));
  }
  console.log("");
  console.log("Draft listing");
  console.log(line("id", draft.id));
  console.log(line("title", draft.title || "(need title)"));
  console.log(line("category", draft.category || "(need haunts|antiques|parks|farms)"));
  console.log(line("season", draft.season || "(need season)"));
  console.log(line("tagline", draft.tagline || "(need tagline)"));
  console.log(line("city", draft.city || "(need city)"));
  console.log(line("coords", fmtCoords(draft.coordinates)));
  console.log(line("link", draft.link || "(none)"));
  console.log(line("drive", fmtDrive(draft)));
  console.log("------------------------------------------------------------");
}

function missingFields(draft) {
  const missing = [];
  if (!draft.title) missing.push("title");
  if (!CATEGORIES.includes(draft.category)) missing.push("category");
  if (!SEASONS.includes(draft.season)) missing.push("season");
  if (!draft.tagline) missing.push("tagline");
  if (!draft.city) missing.push("city");
  if (!draft.coordinates) missing.push("coordinates");
  return missing;
}

async function ask(rl, prompt, fallback = "") {
  const suffix = fallback === "" ? "" : ` [${fallback}]`;
  const answer = await rl.question(`${prompt}${suffix}: `);
  const trimmed = answer.trim();
  return trimmed === "" ? fallback : trimmed;
}

async function editDraft(rl, draft, listings) {
  console.log("");
  console.log("Edit fields. Enter keeps the current value.");
  console.log("Coordinates: lng, lat   e.g.  -79.3412, 34.3555");
  console.log("Category: haunts | antiques | parks | farms");
  console.log("Season:   fall | year-round | spring | summer");
  console.log("");

  const title = await ask(rl, "Title", draft.title);
  const categoryRaw = await ask(rl, "Category", draft.category);
  const category = normalizeCategory(categoryRaw) || draft.category;
  const seasonRaw = await ask(rl, "Season", draft.season);
  const season = normalizeSeason(seasonRaw, category);
  const tagline = await ask(rl, "Tagline", draft.tagline);
  const city = await ask(rl, "City", draft.city);
  const coordsRaw = await ask(
    rl,
    "Coordinates (lng, lat)",
    draft.coordinates ? `${draft.coordinates[0]}, ${draft.coordinates[1]}` : "",
  );
  const link = await ask(rl, "Link", draft.link);

  const coordinates = parseCoords(coordsRaw);
  const idBase = slugify(title);
  const keepId = draft.id === idBase || draft.id.startsWith(`${idBase}-`);
  const id = keepId ? draft.id : uniqueId(idBase, listings);

  return {
    id,
    title: title.trim(),
    category,
    season,
    tagline: tagline.trim(),
    coordinates,
    city: city.trim(),
    driveTimes: coordinates ? estimateDriveTimes(coordinates) : null,
    link: link.trim(),
  };
}

async function ensureReady(rl, draft, listings) {
  let next = { ...draft };
  while (true) {
    const missing = missingFields(next);
    if (missing.length === 0) return next;
    console.log("");
    console.log(`Need before approve: ${missing.join(", ")}`);
    next = await editDraft(rl, next, listings);
  }
}

async function main() {
  printBanner();

  const queue = asQueue(await readJson(QUEUE_PATH, []));
  let listings = asListings(await readJson(LISTINGS_PATH, [])).map(listingShape);

  if (queue.length === 0) {
    console.log("Queue is empty. Nothing to review.");
    return;
  }

  const rl = readline.createInterface({ input, output });
  const stats = { approved: 0, rejected: 0, skipped: 0 };

  try {
    let i = 0;
    while (i < queue.length) {
      const item = queue[i];
      let draft = draftFromQueue(item, listings);
      printItem(item, i, queue.length, draft);

      const choice = (
        await ask(rl, "[A]pprove  [E]dit  [D]elete  [S]kip  [Q]uit", "")
      )
        .trim()
        .toLowerCase();

      if (choice === "q" || choice === "quit") {
        console.log("Stopped. Remaining rows stay in the queue.");
        break;
      }

      if (choice === "s" || choice === "skip" || choice === "") {
        stats.skipped += 1;
        i += 1;
        continue;
      }

      if (choice === "d" || choice === "delete" || choice === "reject") {
        queue.splice(i, 1);
        await writeJson(QUEUE_PATH, queue);
        stats.rejected += 1;
        console.log("Rejected. Removed from queue.");
        continue;
      }

      if (choice === "e" || choice === "edit") {
        draft = await editDraft(rl, draft, listings);
        printItem(item, i, queue.length, draft);
        const again = (await ask(rl, "Approve this edit?", "y"))
          .trim()
          .toLowerCase();
        if (again === "n" || again === "no") {
          stats.skipped += 1;
          i += 1;
          continue;
        }
      } else if (choice !== "a" && choice !== "approve") {
        console.log("Use A, E, D, S, or Q.");
        continue;
      }

      draft = await ensureReady(rl, draft, listings);
      draft.driveTimes = estimateDriveTimes(draft.coordinates);
      const listing = listingShape(draft);

      const over = Object.entries(listing.driveTimes).filter(
        ([, minutes]) => minutes > 90,
      );
      if (over.length > 0) {
        console.log(
          `Note: over 90 min from ${over.map(([hub]) => hub).join(", ")}. Still in the 90-minute box from at least one hub? Check before you keep it.`,
        );
        const keep = (await ask(rl, "Keep it anyway?", "n"))
          .trim()
          .toLowerCase();
        if (keep !== "y" && keep !== "yes") {
          stats.skipped += 1;
          i += 1;
          continue;
        }
      }

      listings = [...listings, listing];
      await writeJson(LISTINGS_PATH, listings);
      queue.splice(i, 1);
      await writeJson(QUEUE_PATH, queue);
      stats.approved += 1;
      console.log(`Approved → ${listing.id}  (${listing.city})`);
    }
  } finally {
    rl.close();
  }

  console.log("");
  console.log(
    `Done. approved ${stats.approved} · rejected ${stats.rejected} · skipped ${stats.skipped} · queue left ${queue.length}`,
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
