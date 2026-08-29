import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getSupabase } from "@/lib/supabase";
import type { SuggestPayload } from "@/lib/types";

const QUEUE_FILE = path.join(process.cwd(), "data", "queue.json");

export async function POST(req: Request) {
  const body = (await req.json()) as SuggestPayload;
  if (!body?.name?.trim() || !body?.note?.trim()) {
    return NextResponse.json({ ok: false, error: "missing" }, { status: 400 });
  }

  const row = {
    name: body.name.trim(),
    city: body.city?.trim() || null,
    kind: body.kind || null,
    website: body.website || null,
    note: body.note.trim(),
    from_hub: body.fromHub,
    status: "queued",
    raw: body,
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase.from("review_queue").insert(row);
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, dest: "supabase" });
  }

  let existing: unknown[] = [];
  try {
    const raw = await fs.readFile(QUEUE_FILE, "utf8");
    existing = JSON.parse(raw);
  } catch {
    existing = [];
  }
  existing.push(row);
  await fs.writeFile(QUEUE_FILE, JSON.stringify(existing, null, 2));
  return NextResponse.json({ ok: true, dest: "file" });
}
