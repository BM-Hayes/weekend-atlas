import Link from "next/link";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <p className="text-[11px] uppercase tracking-[0.2em] text-[#6b6356]">
        myweekendatlas.com
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display-loaded)] text-4xl">
        A tool, not a directory
      </h1>
      <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-[#2b271f]">
        <p>
          Weekend Atlas answers one question: what is open this weekend in the
          Pee Dee, and how long is the drive from Hartsville, Florence, or
          Cheraw.
        </p>
        <p>
          It is not a directory. No tickets. No phone number. No live chat.
          Official pages stay on the operator’s own site.
        </p>
        <p>
          2026 is the holding year. The map reads the <code>listings</code>{" "}
          table in Supabase. Pins are a seed set — parks, farms, markets, dated
          fall events — marked operator, verified, community, or unverified.
        </p>
        <p>
          The review queue exists so people can suggest a place. Promotion from
          queue to map is manual until the map path is boringly stable. Then it
          gets automated.
        </p>
        <p>Pee Dee Fall first. Other regions later, if this one earns it.</p>
      </div>
      <p className="mt-8">
        <Link href="/" className="underline underline-offset-4">
          Open the map
        </Link>
      </p>
    </main>
  );
}
