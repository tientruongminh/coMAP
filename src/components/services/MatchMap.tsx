import { Check } from "@phosphor-icons/react/ssr";
import { Dim, Draw, Seq, Step } from "@/components/about/motion";
import { SitePin } from "@/components/about/Pins";

/** Stage is 400 x 300; HTML marks sit at the same points in %. */
const W = 400;
const H = 300;
const SITE = [250, 160] as const;
const R = 80;

/** Students on the map. `out` is the filter that drops them; matches have none. */
const dots: { at: readonly [number, number]; out?: number }[] = [
  { at: [200, 115] },
  { at: [318, 170] },
  { at: [235, 222] },
  { at: [282, 108], out: 0 },
  { at: [330, 98], out: 0 },
  { at: [190, 168], out: 1 },
  { at: [175, 262], out: 1 },
  { at: [292, 216], out: 2 },
  { at: [60, 70], out: 3 },
  { at: [112, 232], out: 3 },
  { at: [46, 168], out: 3 },
  { at: [150, 42], out: 3 },
  { at: [356, 54], out: 3 },
  { at: [368, 252], out: 3 },
  { at: [124, 132], out: 3 },
];

const T0 = 0.3;
const GAP = 0.55;
const lit = (i: number) => T0 + i * GAP;
const pct = (x: number, y: number) => ({ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` });
const ring = `M ${SITE[0] - R} ${SITE[1]} a ${R} ${R} 0 1 0 ${2 * R} 0 a ${R} ${R} 0 1 0 ${-2 * R} 0`;

/**
 * Package A, "tìm thực tập sinh" as a map (spec 0): the four filters switch on
 * one by one, students who do not fit step back, the 5 km ring closes around
 * the site and the remaining matches draw a route to it.
 */
export function MatchMap({ filters, ring: ringLabel, label }: { filters: readonly string[]; ring: string; label: string }) {
  const done = lit(filters.length - 1) + 0.6;
  return (
    <Seq amount={0.5} className="rounded-[20px] border border-line bg-surface p-3 shadow-1 sm:p-4">
      <ul className="flex flex-wrap gap-1.5 p-1 sm:gap-2">
        {filters.map((f, i) => (
          <li key={f} className="relative inline-flex h-8 items-center gap-1.5 overflow-hidden rounded-full border border-line pl-2 pr-3 text-[13px] font-semibold leading-none">
            <Step kind="fade" at={lit(i)} className="absolute inset-0 rounded-full bg-lime-400" />
            <span aria-hidden="true" className="relative grid size-4 place-items-center rounded-full border border-line bg-surface">
              <Step at={lit(i) + 0.1} className="grid size-4 place-items-center rounded-full bg-ink text-white">
                <Check size={10} weight="bold" />
              </Step>
            </span>
            <span className="relative">{f}</span>
          </li>
        ))}
      </ul>

      <div role="img" aria-label={label} className="relative mt-3 aspect-[4/3] overflow-hidden rounded-[14px] bg-[#EFEFF4]">
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full" aria-hidden="true">
          <g fill="none" stroke="#FFFFFF" strokeLinecap="round" className="[stroke-width:8] lg:[stroke-width:6]">
            <path d="M -10 196 C 110 186 220 150 410 138" />
            <path d="M 150 -10 C 162 96 196 196 178 310" />
            <path d="M 300 -10 L 338 310" />
            <path d="M -10 64 C 90 80 180 60 260 30" />
          </g>
          <path d={ring} fill="#3330A8" fillOpacity={0.06} />
          <Draw d={ring} at={lit(3)} dur={0.5} stroke="#3330A8" width={1.5} dash="5 5" />
          {dots
            .filter((d) => d.out === undefined)
            .map((d, i) => (
              <Draw key={i} d={`M ${d.at[0]} ${d.at[1]} L ${SITE[0]} ${SITE[1]}`} at={done + i * 0.15} dur={0.5} stroke="#3330A8" width={2} />
            ))}
        </svg>

        {dots.map((d, i) => {
          const style = pct(d.at[0], d.at[1]);
          const mark = "absolute block size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-ink sm:size-4";
          return d.out === undefined ? (
            <span key={i} aria-hidden="true" className="absolute -translate-x-1/2 -translate-y-1/2" style={style}>
              <Step at={done + 0.3} className="absolute -inset-[5px] rounded-full bg-lime-400" />
              <span className="relative block size-3.5 rounded-full border-2 border-white bg-ink sm:size-4" />
            </span>
          ) : (
            <Dim key={i} at={lit(d.out) + 0.15} className={mark} style={style} />
          );
        })}

        <span className="absolute -translate-x-1/2 -translate-y-1/2" style={pct(SITE[0], SITE[1])}>
          <SitePin size={34} />
        </span>
        <Step
          kind="fade"
          at={lit(3) + 0.2}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-indigo-600 bg-surface px-2 py-0.5 text-[12px] font-semibold leading-4 text-indigo-700"
          style={pct(SITE[0], SITE[1] - R)}
        >
          {ringLabel}
        </Step>
      </div>
    </Seq>
  );
}
