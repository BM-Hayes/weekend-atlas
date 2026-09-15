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
          2026 is the holding year. Pins live in{" "}
          <code>data/listings.json</code> in the repo. No database. Drive times
          from the three hubs are stored on each row and filtered in the
          browser.
        </p>
        <p>
          The review queue is a file on disk. Promotion onto the map is a JSON
          edit and a deploy.
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
