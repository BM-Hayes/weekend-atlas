import { Badge } from "./Badge";
import { driveLabel, hoursForWeekend } from "@/lib/weekend";
import type { HubId, Place } from "@/lib/types";
import { HUBS } from "@/lib/hubs";

export function PlacePanel({
  place,
  hub,
  onClose,
}: {
  place: Place;
  hub: HubId;
  onClose: () => void;
}) {
  const minutes = place.driveMinutes[hub];
  return (
    <aside className="border-t border-[#cbbd9e] bg-[#f7f0e0] p-4 md:border-t-0 md:border-l">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="m-0 text-[11px] uppercase tracking-[0.14em] text-[#6b6356]">
            {place.kind} · {place.city}
          </p>
          <h2 className="mt-1 font-[family-name:var(--font-display-loaded)] text-2xl leading-tight">
            {place.name}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="border border-[#cbbd9e] px-2 py-1 text-xs uppercase tracking-wider"
        >
          Close
        </button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge kind={place.badge} />
        <span className="text-sm text-[#3d5a46]">
          {driveLabel(minutes)} from {HUBS[hub].label}
        </span>
      </div>
      <p className="mt-3 text-[15px] leading-relaxed">{place.oneLiner}</p>
      <p className="mt-2 text-sm leading-relaxed text-[#3f3a32]">
        {place.whyThisWeekend}
      </p>
      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
        <dt className="text-[#6b6356]">This weekend</dt>
        <dd>{hoursForWeekend(place)}</dd>
        <dt className="text-[#6b6356]">Drive</dt>
        <dd>
          HTV {place.driveMinutes.hartsville}m · FLO{" "}
          {place.driveMinutes.florence}m · CHW {place.driveMinutes.cheraw}m
        </dd>
        <dt className="text-[#6b6356]">Source</dt>
        <dd className="text-[#3f3a32]">{place.source}</dd>
      </dl>
      {place.website ? (
        <a
          href={place.website}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block text-sm underline decoration-[#b85c38] underline-offset-4"
        >
          Official page
        </a>
      ) : null}
    </aside>
  );
}
