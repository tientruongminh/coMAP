"use client";

import { Funnel, MapPinLine, Path, SealCheck } from "@phosphor-icons/react";
import { useId, useState, type CSSProperties } from "react";
import { Hl } from "@/components/ui/Highlight";
import { Reveal } from "@/components/ui/Reveal";
import { byId, locations } from "@/lib/locations";
import { howItWorks } from "@/content/home";
import { arcPath, makeAtlas } from "./atlas";
import { useArm } from "./useArm";
import h from "./how.module.css";

const FIELD = howItWorks.filterChip;
const FROM = byId.get("ussh-giaoduc")!;
const TO = byId.get("hipo")!;

/* Real positions of every pin, west to east so they drop like a sweep. */
const ATLAS = makeAtlas(locations, 21, 30);
const PINS = [...locations]
  .sort((a, b) => a.lng - b.lng)
  .map((l, i) => ({ l, i, ...ATLAS.project(l), on: l.fields.includes(FIELD), end: l.id === FROM.id || l.id === TO.id }));
const A = ATLAS.project(FROM);
const B = ATLAS.project(TO);
const ROUTE = arcPath(A, B, -0.28);
const pct = (v: number, of: number) => `${Math.round((v / of) * 1000) / 10}%`;

const ICONS = [MapPinLine, Funnel, Path];

function Stage({ describedBy }: { describedBy: string[] }) {
  const { w, h: H } = ATLAS;
  const grid: number[] = [];
  for (let k = 2; k * ATLAS.pxPerKm < Math.max(w, H); k += 2) grid.push(k * ATLAS.pxPerKm);
  return (
    <div className="bezel">
      <div className="bezel-core relative bg-[#EFEFF4]" style={{ aspectRatio: `${w} / ${H}` }}>
        <svg viewBox={`0 0 ${w} ${H}`} className="absolute inset-0 size-full" role="img" aria-label={howItWorks.stageLabel}>
          <defs>
            <linearGradient id="cm-how-route" gradientUnits="userSpaceOnUse" x1={A.x} y1={A.y} x2={B.x} y2={B.y}>
              <stop offset="0" stopColor="#A6CE39" />
              <stop offset="1" stopColor="#3330A8" />
            </linearGradient>
          </defs>
          <g stroke="#fff" strokeWidth="1" opacity=".9">
            {grid.map((g) => (
              <path key={`v${g}`} d={`M ${g} 0 V ${H}`} />
            ))}
            {grid.map((g) => (
              <path key={`h${g}`} d={`M 0 ${g} H ${w}`} />
            ))}
          </g>
          <path
            d={ROUTE}
            pathLength={1}
            fill="none"
            stroke="url(#cm-how-route)"
            strokeWidth="3.5"
            strokeLinecap="round"
            className={h.route}
          />
          {PINS.map((p) => (
            <g key={p.l.id} className={h.pin} style={{ "--i": p.i } as CSSProperties}>
              <g className={p.on ? undefined : h.ghost}>
                <g className={p.end ? h.end : undefined}>
                  {p.l.type === "school" ? (
                    <rect x={p.x - 8} y={p.y - 8} width="16" height="16" rx="5" fill="#A6CE39" stroke="#fff" strokeWidth="2.5" />
                  ) : (
                    <circle cx={p.x} cy={p.y} r="6.5" fill="#3330A8" stroke="#fff" strokeWidth="2.5" />
                  )}
                </g>
              </g>
            </g>
          ))}
        </svg>

        {/* Filter chip: the step 2 control, pressed by the sequence. */}
        <span className={`${h.chip} absolute left-3 top-3 inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold leading-none shadow-[var(--shadow-1)] lg:left-4 lg:top-4`}>
          <Funnel size={14} weight="bold" aria-hidden="true" />
          {FIELD}
        </span>

        {/* Verified seal beside the route's end (Trung tâm HiPO is the one verified site).
            Beside, not above: HiPO sits near the plate's top edge. */}
        <span
          className="pointer-events-none absolute"
          style={{ left: pct(B.x, w), top: pct(B.y, H), transform: "translate(0, -50%)" }}
        >
          <span className={`${h.stamp} ml-3 block lg:ml-4`}>
            <span className="grid size-7 place-items-center rounded-full bg-surface text-lime-700 shadow-[var(--shadow-2)] lg:size-9">
              <SealCheck size={22} weight="fill" aria-hidden="true" className="lg:size-7" />
              <span className="sr-only">{howItWorks.verifiedSr}</span>
            </span>
          </span>
        </span>

        {/* Stop details: one at a time, only while a stop is hovered, focused or tapped. */}
        <div className="pointer-events-none absolute inset-x-3 bottom-3 grid lg:inset-x-4 lg:bottom-4">
          {howItWorks.stops.map((s, i) => (
            <p
              key={s.title}
              id={describedBy[i]}
              data-detail={i + 1}
              className={`${h.detail} col-start-1 row-start-1 w-fit max-w-[44ch] rounded-[12px] bg-surface px-3.5 py-2.5 text-[14px] leading-5 text-ink shadow-[var(--shadow-2)]`}
            >
              {s.detail}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * S3 (spec 3.1): three steps shown on a small real-coordinate map instead of
 * described. Pins drop (digitised data), the Giáo dục học chip filters them
 * (matching by learning outcome), a route draws from ĐH KHXH&NV to the
 * verified site (coordination). The stops beside it light up in time.
 */
export function HowItWorks() {
  const uid = useId();
  const ids = howItWorks.stops.map((_, i) => `${uid}-d${i}`);
  const [focus, setFocus] = useState<number | null>(null);
  const ref = useArm<HTMLDivElement>(undefined, 0.45);

  const touch = (n: number | null) => {
    const el = ref.current;
    if (el && n !== null) {
      el.dataset.on = "";
      el.dataset.touched = "";
    }
    setFocus(n);
  };

  return (
    <section aria-labelledby="cach-hoat-dong" className="container-cm py-12 lg:py-16">
      <div
        ref={ref}
        data-focus={focus ?? undefined}
        className={`${h.root} ${h.ease} grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-x-6`}
      >
        <div className="lg:col-span-5">
          <Reveal>
            <h2 id="cach-hoat-dong" className="t-h2 max-w-[14ch] lg:text-[48px] lg:leading-[56px]">
              {howItWorks.titleBefore}
              <Hl>{howItWorks.titleMark}</Hl>
            </h2>
            <p className="sr-only">{howItWorks.titleSr}</p>
          </Reveal>

          {/* Stops: a vertical route on desktop, a row of three below the map on phones. */}
          <ol className="relative mt-10 hidden lg:block">
            <span aria-hidden="true" className="absolute bottom-6 left-[21px] top-6 w-0.5 bg-line" />
            <span aria-hidden="true" className={`${h.rail} absolute bottom-6 left-[21px] top-6 w-0.5 bg-ink`} />
            {howItWorks.stops.map((s, i) => (
              <Stop key={s.title} i={i} verb={s.verb} title={s.title} describedBy={ids[i]} focus={focus} onFocus={touch} />
            ))}
          </ol>
        </div>

        <div className="lg:col-span-7">
          <Stage describedBy={ids} />
          <ol className="relative mt-5 grid grid-cols-3 gap-2 lg:hidden">
            <span aria-hidden="true" className="absolute left-[16.6%] right-[16.6%] top-[21px] h-0.5 bg-line" />
            <span aria-hidden="true" className={`${h.railX} absolute left-[16.6%] right-[16.6%] top-[21px] h-0.5 bg-ink`} />
            {howItWorks.stops.map((s, i) => (
              <Stop key={s.title} i={i} verb={s.verb} title={s.title} describedBy={ids[i]} focus={focus} onFocus={touch} compact />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Stop({
  i,
  verb,
  title,
  describedBy,
  focus,
  onFocus,
  compact = false,
}: {
  i: number;
  verb: string;
  title: string;
  describedBy: string;
  focus: number | null;
  onFocus: (n: number | null) => void;
  compact?: boolean;
}) {
  const n = i + 1;
  const Icon = ICONS[i];
  const on = focus === n;
  const dot = [h.dot, i === 1 ? h.dot2 : i === 2 ? h.dot3 : ""].join(" ");
  return (
    <li className={compact ? "relative" : "relative py-2"}>
      <button
        type="button"
        aria-pressed={on}
        aria-describedby={describedBy}
        onPointerEnter={(e) => e.pointerType === "mouse" && onFocus(n)}
        onPointerLeave={(e) => e.pointerType === "mouse" && onFocus(null)}
        onFocus={() => onFocus(n)}
        onBlur={() => onFocus(null)}
        onClick={() => onFocus(n)}
        className={`group/stop flex w-full rounded-[16px] text-left outline-offset-2 ${
          compact ? "flex-col items-center gap-2 text-center" : "items-center gap-5 py-2 pr-3"
        }`}
      >
        <span
          className={`${dot} relative z-10 grid size-11 shrink-0 place-items-center rounded-full shadow-[0_0_0_5px_var(--color-paper)] ${
            on ? "ring-2 ring-lime-400 ring-offset-2 ring-offset-paper" : ""
          }`}
        >
          <Icon size={20} weight="bold" aria-hidden="true" />
        </span>
        <span
          className={`font-display tracking-[-0.02em] text-ink transition-colors ${
            compact ? "text-[18px] leading-6" : "text-[32px] leading-10"
          } ${focus && !on ? "text-ink/45" : ""}`}
          style={{ fontVariationSettings: '"wdth" 112', fontWeight: 750 }}
        >
          {verb}
          <span className="sr-only">: {title}</span>
        </span>
      </button>
    </li>
  );
}
