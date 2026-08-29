"use client";

import Link from "next/link";
import { useState } from "react";
import { HUB_ORDER, HUBS } from "@/lib/hubs";
import type { HubId, PlaceKind, SuggestPayload } from "@/lib/types";

const KINDS: PlaceKind[] = [
  "trail",
  "water",
  "garden",
  "farm",
  "market",
  "museum",
  "downtown",
  "event",
  "refuge",
];

export default function SuggestPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<SuggestPayload>({
    name: "",
    city: "",
    kind: "",
    website: "",
    note: "",
    fromHub: "hartsville",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/suggest", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      setError("Could not queue that. Try again later.");
      return;
    }
    setSent(true);
  }

  return (
    <main className="mx-auto max-w-xl px-5 py-10">
      <p className="text-[11px] uppercase tracking-[0.2em] text-[#6b6356]">
        Weekend Atlas · review queue
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display-loaded)] text-4xl">
        Suggest a place
      </h1>
      <p className="mt-3 text-[#3f3a32]">
        No tickets, no phone, no chat. If it is open on a weekend and you can
        drive there from Hartsville, Florence, or Cheraw, put it in the queue.
        Automation comes after the map is stable.
      </p>
      {sent ? (
        <p className="mt-8 border border-[#cbbd9e] bg-[#efe4c8] p-4">
          Queued. It will not hit the map until someone checks hours.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 grid gap-4">
          <label className="grid gap-1 text-sm">
            Name
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border border-[#cbbd9e] bg-[#f7f0e0] px-3 py-2"
            />
          </label>
          <label className="grid gap-1 text-sm">
            Town
            <input
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="border border-[#cbbd9e] bg-[#f7f0e0] px-3 py-2"
            />
          </label>
          <label className="grid gap-1 text-sm">
            Kind
            <select
              value={form.kind}
              onChange={(e) =>
                setForm({ ...form, kind: e.target.value as PlaceKind | "" })
              }
              className="border border-[#cbbd9e] bg-[#f7f0e0] px-3 py-2"
            >
              <option value="">Unsure</option>
              {KINDS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            Official page
            <input
              type="url"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="border border-[#cbbd9e] bg-[#f7f0e0] px-3 py-2"
              placeholder="https://"
            />
          </label>
          <label className="grid gap-1 text-sm">
            Why this weekend
            <textarea
              required
              rows={4}
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="border border-[#cbbd9e] bg-[#f7f0e0] px-3 py-2"
            />
          </label>
          <label className="grid gap-1 text-sm">
            You usually start from
            <select
              value={form.fromHub}
              onChange={(e) =>
                setForm({ ...form, fromHub: e.target.value as HubId })
              }
              className="border border-[#cbbd9e] bg-[#f7f0e0] px-3 py-2"
            >
              {HUB_ORDER.map((id) => (
                <option key={id} value={id}>
                  {HUBS[id].label}
                </option>
              ))}
            </select>
          </label>
          {error ? <p className="text-sm text-[#8a4a32]">{error}</p> : null}
          <button
            type="submit"
            className="border border-[#1c1914] bg-[#1c1914] px-4 py-2 text-[#f3ead8]"
          >
            Add to queue
          </button>
        </form>
      )}
      <p className="mt-8">
        <Link href="/" className="underline underline-offset-4">
          Back to the map
        </Link>
      </p>
    </main>
  );
}
