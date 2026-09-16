import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Weekend Atlas — curated Pee Dee fall haunts, farms, parks, and antiques by drive time";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TITLE = "WEEKEND ATLAS";
const BADGE = "PEE DEE REGION • SOUTH CAROLINA";
const SUB =
  "Curated Fall Haunts, Farms, State Parks & Antique Malls mapped by 20·35·50 min drive times.";
const FONT_TEXT = `${TITLE} ${BADGE} ${SUB} Hartsville Florence Cheraw 34.37 34.20 34.70 N Field guide`;

async function loadFont(family: string, weight: number) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(FONT_TEXT)}`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
      },
    },
  ).then((res) => res.text());
  const match = css.match(/src: url\(([^)]+)\)/);
  if (!match) return null;
  return fetch(match[1]).then((res) => res.arrayBuffer());
}

export default async function OpenGraphImage() {
  const [serifBold, serifReg, sans] = await Promise.all([
    loadFont("Fraunces", 700),
    loadFont("Fraunces", 500),
    loadFont("Source Sans 3", 500),
  ]);

  const fonts = [
    serifBold && { name: "Fraunces", data: serifBold, weight: 700 as const },
    serifReg && { name: "Fraunces", data: serifReg, weight: 500 as const },
    sans && { name: "Source Sans 3", data: sans, weight: 500 as const },
  ].filter(Boolean) as {
    name: string;
    data: ArrayBuffer;
    weight: 500 | 700;
  }[];

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          background: "#141b18",
          color: "#fcfbf7",
          fontFamily: fonts.length ? "Fraunces, serif" : "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            margin: 36,
            flex: 1,
            border: "1px solid #44403c",
            padding: "48px 56px 40px",
            background:
              "linear-gradient(180deg, #181f1c 0%, #141b18 58%, #121816 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                letterSpacing: "0.28em",
                fontSize: 18,
                fontFamily: fonts.length ? "Source Sans 3" : "sans-serif",
                fontWeight: 500,
                color: "#c4a35a",
                textTransform: "uppercase",
              }}
            >
              PEE DEE REGION • SOUTH CAROLINA
            </div>
            <div
              style={{
                display: "flex",
                width: 28,
                height: 28,
                borderRadius: 14,
                border: "1.5px solid #c4a35a",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  background: "#3d5c45",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 92,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 0.95,
                color: "#fcfbf7",
              }}
            >
              WEEKEND ATLAS
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 22,
                maxWidth: 920,
                fontSize: 28,
                lineHeight: 1.35,
                fontWeight: 500,
                color: "#d7d1c4",
              }}
            >
              Curated Fall Haunts, Farms, State Parks & Antique Malls mapped by
              20·35·50 min drive times.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <div style={{ display: "flex", gap: 14 }}>
              {[
                { city: "Hartsville", coord: "34.37°N" },
                { city: "Florence", coord: "34.20°N" },
                { city: "Cheraw", coord: "34.70°N" },
              ].map((hub) => (
                <div
                  key={hub.city}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "12px 18px",
                    border: "1px solid #3a4540",
                    background: "#1c2621",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#fcfbf7",
                    }}
                  >
                    {hub.city}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      marginTop: 4,
                      fontSize: 14,
                      letterSpacing: "0.14em",
                      color: "#c4a35a",
                      fontFamily: fonts.length
                        ? "Source Sans 3"
                        : "sans-serif",
                    }}
                  >
                    {hub.coord}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 16,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#9a7840",
                fontFamily: fonts.length ? "Source Sans 3" : "sans-serif",
              }}
            >
              Field guide · myweekendatlas.com
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
    },
  );
}
