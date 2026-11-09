import Image from "next/image";
import { initials, team } from "@/content/team";

/**
 * Team from src/content/team.ts (spec 3.2 A7). Handles 1 to 5 people.
 * No photo: an 80px indigo-50 circle with ink initials.
 */
export function TeamGrid() {
  const cols = team.length === 1 ? "" : team.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <ul className={`grid gap-x-6 gap-y-10 ${cols}`}>
      {team.map((m) => (
        <li key={m.name} className="flex items-start gap-5">
          {m.photo ? (
            <Image src={m.photo} alt="" width={80} height={80} className="size-20 shrink-0 rounded-full object-cover" />
          ) : (
            <span
              aria-hidden="true"
              className="grid size-20 shrink-0 place-items-center rounded-full bg-indigo-50 font-display text-[24px] font-bold tracking-[-0.02em] text-ink [font-variation-settings:'wdth'_112]"
            >
              {initials(m.name)}
            </span>
          )}
          <div className="pt-1">
            <p className="font-display text-[22px] font-bold leading-[28px] tracking-[-0.01em] [font-variation-settings:'wdth'_112]">{m.name}</p>
            <p className="t-label mt-1 text-lime-700">{m.role}</p>
            <p className="t-body mt-2 max-w-[40ch] text-ink-muted">{m.line}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
