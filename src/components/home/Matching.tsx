"use client";

import {
  ArrowUpRight,
  Brain,
  ChalkboardTeacher,
  ChartBar,
  ChatText,
  Confetti,
  Handshake,
  NotePencil,
  Scales,
  SealCheck,
  ShieldCheck,
  UsersThree,
  type Icon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from "react";
import { MiniPin } from "@/components/map/pinGlyphs";
import { matching, type OutcomeId, type TaskId } from "@/content/home";
import { useArm } from "./useArm";
import m from "./match.module.css";

type Key = `o${OutcomeId}` | `t${TaskId}`;
type Geo = { w: number; h: number; y: Partial<Record<Key, number>> };

const O_ICON: Record<OutcomeId, Icon> = { 1: Brain, 2: NotePencil, 3: ChartBar, 4: Handshake, 5: Scales };
const T_ICON: Record<TaskId, Icon> = { a: ChalkboardTeacher, b: ChatText, c: UsersThree, d: Confetti, e: ShieldCheck };

const LINKS = matching.links.map(([o, t]) => [`o${o}`, `t${t}`] as [Key, Key]);
const OUT = new Map(matching.outcomes.map((o) => [`o${o.id}` as Key, o]));
const TASK = new Map(matching.tasks.map((t) => [`t${t.id}` as Key, t]));
const label = (k: Key) => (k[0] === "o" ? OUT.get(k)!.label : TASK.get(k)!.label);
const partners = (k: Key) => LINKS.filter((l) => l.includes(k)).map(([o, t]) => (o === k ? t : o));
const covered = new Set(LINKS.map(([o]) => o)).size;

/**
 * W2 (spec 3.1 S4): five learning outcomes of the syllabus (lime, the school
 * side) meet five tasks of the HiPO job description (indigo, the site side).
 * The six connector lines draw once in sequence, then the 5/5 seal stamps in.
 * Hovering, focusing or tapping an item isolates its lines and shows its full
 * sentence in the strip under the plate, where the seal sits at rest.
 */
export function Matching() {
  const uid = useId();
  const ref = useArm<HTMLDivElement>(undefined, 0.4);
  const laneRef = useRef<HTMLDivElement>(null);
  const chips = useRef(new Map<Key, HTMLElement>());
  const [geo, setGeo] = useState<Geo | null>(null);
  const [active, setActive] = useState<Key | null>(null);

  useEffect(() => {
    const lane = laneRef.current;
    if (!lane) return;
    const ro = new ResizeObserver(() => {
      const box = lane.getBoundingClientRect();
      const y: Geo["y"] = {};
      chips.current.forEach((el, k) => {
        const r = el.getBoundingClientRect();
        y[k] = Math.round(r.top - box.top + r.height / 2);
      });
      setGeo({ w: Math.round(box.width), h: Math.round(box.height), y });
    });
    ro.observe(lane);
    return () => ro.disconnect();
  }, []);

  const hot = useMemo(() => (active ? new Set<Key>([active, ...partners(active)]) : null), [active]);

  const touch = (k: Key | null) => {
    const el = ref.current;
    if (el && k) {
      el.dataset.on = "";
      el.dataset.touched = "";
    }
    setActive(k);
  };

  const chip = (k: Key, Glyph: Icon, text: string) => {
    const on = active === k;
    const near = !on && !!hot?.has(k);
    const school = k[0] === "o";
    return (
      <li key={k} className={school ? "justify-self-end" : "justify-self-start"}>
        <button
          type="button"
          ref={(el) => void (el ? chips.current.set(k, el) : chips.current.delete(k))}
          aria-pressed={on}
          aria-describedby={`${uid}-${k}`}
          onPointerEnter={(e) => e.pointerType === "mouse" && touch(k)}
          onPointerLeave={(e) => e.pointerType === "mouse" && touch(null)}
          onFocus={() => touch(k)}
          onBlur={() => touch(null)}
          onClick={() => touch(k)}
          className={[
            "flex h-11 items-center gap-2.5 rounded-full border bg-surface pl-1.5 text-[15px] font-semibold leading-5 outline-offset-2 transition-[opacity,background-color,border-color,color] duration-200 md:h-12 md:pl-2",
            school ? "pr-1.5 md:pr-4" : "pr-4",
            on ? "border-ink bg-ink text-white" : near ? "border-ink text-ink" : "border-line text-ink",
            hot && !hot.has(k) ? "opacity-40" : "",
          ].join(" ")}
        >
          <span
            className={`grid size-8 shrink-0 place-items-center ${
              school ? "rounded-[10px] bg-lime-400 text-ink" : "rounded-full bg-indigo-600 text-white"
            }`}
          >
            <Glyph size={17} weight="bold" aria-hidden="true" />
          </span>
          <span className={school ? "sr-only md:not-sr-only" : ""}>{text}</span>
        </button>
      </li>
    );
  };

  return (
    <div className="bezel">
      <div ref={ref} className={`${m.root} bezel-core`}>
        <div className="grid grid-cols-[auto_minmax(48px,1fr)_auto] gap-y-5 px-4 pb-6 pt-5 md:px-8 md:pb-8 md:pt-7">
          {/* Column heads: the pin says which side is the school, which the site. */}
          <h3 className="flex items-center justify-end gap-2 text-[14px] font-semibold leading-5 text-ink md:text-[15px]">
            <span className="sr-only">{matching.left.titleSr} </span>
            <MiniPin type="school" size={20} />
            {matching.left.short}
          </h3>
          <span />
          <div className="flex items-center gap-2">
            <h3 className="flex items-center gap-2 text-[14px] font-semibold leading-5 text-ink md:text-[15px]">
              <span className="sr-only">{matching.right.titleSr} </span>
              <MiniPin type="internship" size={20} />
              {matching.right.short}
            </h3>
            <Link
              href={matching.right.href}
              aria-label={matching.right.linkSr}
              title={matching.right.linkSr}
              className="grid size-7 place-items-center rounded-full border border-line text-ink transition-colors duration-160 hover:border-ink"
            >
              <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
            </Link>
          </div>

          <ul aria-label={matching.outcomesSr} className="grid gap-2 md:gap-3">
            {matching.outcomes.map((o) => chip(`o${o.id}`, O_ICON[o.id], o.label))}
          </ul>

          {/* Lane: the connector lines (visual only; each item's detail names its links). */}
          <div ref={laneRef} aria-hidden="true" className="relative">
            {geo && (
              <svg className="absolute inset-0 overflow-visible" width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`}>
                <defs>
                  <linearGradient id={`${uid}-g`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={geo.w} y2="0">
                    <stop offset="0" stopColor="#A6CE39" />
                    <stop offset="1" stopColor="#3330A8" />
                  </linearGradient>
                </defs>
                {LINKS.map(([o, t], i) => {
                  const y1 = geo.y[o] ?? 0;
                  const y2 = geo.y[t] ?? 0;
                  const w = geo.w;
                  const on = !!hot && hot.has(o) && hot.has(t) && (active === o || active === t);
                  const off = !!hot && !on;
                  const style = { "--i": i } as CSSProperties;
                  return (
                    <g key={`${o}${t}`}>
                      <path
                        d={`M 6 ${y1} C ${w * 0.5} ${y1} ${w * 0.5} ${y2} ${w - 6} ${y2}`}
                        pathLength={1}
                        fill="none"
                        stroke={`url(#${uid}-g)`}
                        strokeLinecap="round"
                        strokeWidth={on ? 3 : 2}
                        opacity={off ? 0.12 : on ? 1 : 0.7}
                        className={m.link}
                        style={style}
                      />
                      <circle cx={6} cy={y1} r={3.5} fill="#A6CE39" opacity={off ? 0.2 : 1} className={m.end} style={style} />
                      <circle cx={w - 6} cy={y2} r={3.5} fill="#3330A8" opacity={off ? 0.2 : 1} className={m.end} style={style} />
                    </g>
                  );
                })}
              </svg>
            )}
          </div>

          <ul aria-label={matching.tasksSr} className="grid gap-2 md:gap-3">
            {matching.tasks.map((t) => chip(`t${t.id}`, T_ICON[t.id], t.label))}
          </ul>
        </div>

        {/* Strip: the seal at rest, one item's full sentence while it is hovered, focused or tapped. */}
        <div className="grid min-h-[84px] items-center border-t border-line px-4 py-3 md:min-h-[72px] md:px-8">
          <p
            className={`${m.seal} col-start-1 row-start-1 flex items-center gap-2 font-display text-[28px] leading-8 tracking-[-0.02em] text-ink transition-opacity duration-200 ${
              active ? "opacity-0" : ""
            }`}
            style={{ fontVariationSettings: '"wdth" 112', fontWeight: 750 }}
          >
            <SealCheck size={28} weight="fill" aria-hidden="true" className="text-lime-700" />
            {matching.coverage(covered, matching.outcomes.length)}
            <span className="sr-only">{matching.coverageSr}</span>
          </p>
          {[...OUT.keys(), ...TASK.keys()].map((k) => {
            const school = k[0] === "o";
            const vis = active === k ? "opacity-100" : "opacity-0";
            const it = school ? OUT.get(k)! : TASK.get(k)!;
            return (
              <p
                key={k}
                id={`${uid}-${k}`}
                className={`col-start-1 row-start-1 flex items-start gap-3 text-[15px] leading-[22px] text-ink transition-opacity duration-200 ${vis}`}
              >
                <span
                  className={`mt-px inline-flex h-6 shrink-0 items-center rounded-full px-2.5 text-[12px] font-semibold leading-none transition-opacity duration-200 ${vis} ${
                    school ? "bg-lime-400 text-ink" : "bg-indigo-600 text-white"
                  }`}
                >
                  {school ? `${matching.left.itemPrefix} ${k.slice(1)}` : label(k)}
                </span>
                {it.text}
                <span className="sr-only">
                  {" "}
                  {school ? matching.matchesSr : matching.servesSr} {partners(k).map(label).join(", ")}.
                </span>
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}
