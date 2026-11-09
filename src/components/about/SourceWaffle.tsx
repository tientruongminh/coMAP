import { SealCheck } from "@phosphor-icons/react/ssr";
import { formatNumber } from "@/lib/format";
import { locations, type Source } from "@/lib/locations";
import { sourceLabel } from "@/content/taxonomy";
import { More } from "./More";
import { Seq, Step } from "./motion";
import { SourceChip } from "./SourceChip";

const order: Source[] = ["verified", "public", "demo"];

const cell: Record<Source, string> = {
  verified: "bg-indigo-600 text-white",
  public: "bg-surface border-[1.5px] border-ink",
  demo: "bg-paper border-[1.5px] border-dashed border-ink-muted",
};

/**
 * A5 sources: every point on the map is one cell, coloured by where its data
 * comes from. Counts are live from data/locations.json; definitions open below.
 */
export function SourceWaffle({
  id,
  title,
  unit,
  label,
  more,
  sources,
}: {
  id?: string;
  title: string;
  unit: string;
  label: string;
  more: string;
  sources: readonly { source: Source; text: string }[];
}) {
  const count = (s: Source) => locations.filter((l) => l.source === s).length;
  const cells = order.flatMap((s) => Array.from({ length: count(s) }, () => s));

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-6">
      <div className="lg:col-span-4">
        <h2 id={id} className="t-label text-ink-muted">
          {title}
        </h2>
        <p className="mt-2 font-display text-[44px] font-bold leading-[48px] tracking-[-0.02em] [font-variation-settings:'wdth'_112] lg:text-[56px] lg:leading-[60px]">
          <span className="tabular">{formatNumber(cells.length)}</span> <span className="text-[20px] lg:text-[24px]">{unit}</span>
        </p>
      </div>
      <div className="lg:col-span-8">
        <Seq as="ol" role="img" label={`${label}: ${order.map((s) => `${sourceLabel[s]} ${count(s)}`).join(", ")}.`} amount={0.5} className="grid grid-cols-9 gap-1.5 sm:grid-cols-12 sm:gap-2">
          {cells.map((s, i) => (
            <Step as="li" key={i} at={i * 0.025} className={`grid aspect-square place-items-center rounded-[6px] ${cell[s]}`}>
              {s === "verified" && <SealCheck size={14} weight="fill" aria-hidden="true" />}
            </Step>
          ))}
        </Seq>
        <ul className="mt-5 flex flex-wrap gap-2">
          {order.map((s) => (
            <li key={s}>
              <SourceChip source={s} count={count(s)} compact />
            </li>
          ))}
        </ul>
        <More summary={more} className="mt-5">
          <dl className="space-y-3">
            {sources.map((s) => (
              <div key={s.source}>
                <dt className="font-semibold">{sourceLabel[s.source]}</dt>
                <dd className="text-ink-muted">{s.text}</dd>
              </div>
            ))}
          </dl>
        </More>
      </div>
    </div>
  );
}
