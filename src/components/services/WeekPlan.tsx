import type { CSSProperties } from "react";
import { Seq, Step } from "@/components/about/motion";

/** Gap between week cells; bars are placed on the same grid. */
const GAP = 3;

type Phase = { from: number; to: number; label: string; when: string };

/**
 * Package nhà trường as a 13-week plan (spec 0): one row per phase, each bar
 * fills its weeks in order, so the sequence and the long kiến tập stretch
 * read at a glance. Week ranges are in the accessible text of each row.
 */
export function WeekPlan({ title, weeks, total, phases }: { title: string; weeks: string; total: number; phases: readonly Phase[] }) {
  const cols = { gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))`, gap: GAP } as CSSProperties;
  return (
    <Seq amount={0.5} className="rounded-[20px] border border-line bg-surface p-5 shadow-1 sm:p-7">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="t-label text-ink-muted">{title}</h3>
        <p className="tabular text-[13px] font-semibold leading-[18px] text-ink-muted">{weeks}</p>
      </div>
      <ol className="mt-5 space-y-3 sm:mt-4 sm:space-y-2">
        {phases.map((p, i) => (
          <li key={p.label} className="grid grid-cols-[84px_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[104px_minmax(0,1fr)]">
            <span className="text-[14px] font-semibold leading-5 sm:text-[15px]">
              {p.label}
              <span className="sr-only">, {p.when}</span>
            </span>
            <span aria-hidden="true" className="relative block h-9 sm:h-8">
              <span className="absolute inset-0 grid" style={cols}>
                {Array.from({ length: total }, (_, w) => (
                  <span key={w} className="rounded-[4px] bg-paper" />
                ))}
              </span>
              <Step
                kind="growX"
                at={0.2 + i * 0.4}
                dur={0.35 + (p.to - p.from) * 0.06}
                className="absolute inset-y-0 origin-left rounded-[6px] bg-indigo-600"
                style={{
                  left: `calc((100% + ${GAP}px) * ${(p.from - 1) / total})`,
                  width: `calc((100% + ${GAP}px) * ${(p.to - p.from + 1) / total} - ${GAP}px)`,
                }}
              />
            </span>
          </li>
        ))}
      </ol>
    </Seq>
  );
}
