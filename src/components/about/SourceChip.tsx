import { Globe, Info, SealCheck } from "@phosphor-icons/react/ssr";
import type { Source } from "@/lib/locations";
import { sourceLabel } from "@/content/taxonomy";

/**
 * Data source chip, same look as the map detail card (spec 4.8):
 * verified is indigo-50 with SealCheck, public is paper with Globe,
 * demo is paper with a dashed border and Info. `count` adds a tabular tally;
 * `compact` is the 28px legend size.
 */
export function SourceChip({ source, count, compact = false }: { source: Source; count?: number; compact?: boolean }) {
  const look =
    source === "verified"
      ? "bg-indigo-50 text-indigo-700 border border-indigo-50"
      : source === "public"
        ? "bg-paper text-ink border border-line"
        : "bg-paper text-ink border border-dashed border-ink-muted";
  const Icon = source === "verified" ? SealCheck : source === "public" ? Globe : Info;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full font-semibold leading-none ${look} ${
        compact ? "h-7 px-2.5 text-[12px]" : "h-8 px-3 text-[13px]"
      }`}
    >
      <Icon size={compact ? 14 : 16} weight={source === "verified" ? "fill" : "regular"} aria-hidden="true" />
      {sourceLabel[source]}
      {count !== undefined && <span className="tabular -mr-1 ml-0.5 rounded-full bg-surface px-1.5 py-0.5 text-ink">{count}</span>}
    </span>
  );
}
