"use client";

import { ChalkboardTeacher, GraduationCap } from "@phosphor-icons/react";
import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import type { CoverMotif } from "@/content/news";
import styles from "./NewsCover.module.css";

/**
 * Map motif cover for articles without a photo (spec 0 atlas vocabulary):
 * a street grid, then the motif draws itself once in view. Pins dropping =
 * digitising, a route = matching, a 5 km ring = distance. Decorative only;
 * the card title carries the meaning.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const LAND = "var(--color-bezel)";
const STREET = "var(--color-surface)";
const WATER = "#d9dbee";
const INK = "var(--color-ink)";
const MUTED = "var(--color-ink-muted)";
const INDIGO = "var(--color-indigo-600)";
const LIME = "var(--color-lime-400)";

const draw: Variants = {
  hidden: { pathLength: 0 },
  show: (d: number = 0) => ({ pathLength: 1, transition: { duration: 0.9, ease: EASE, delay: d } }),
};
const drop: Variants = {
  hidden: { opacity: 0, y: -14 },
  show: (d: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE, delay: d } }),
};
const grow: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  show: (d: number = 0) => ({ opacity: 1, scale: 1, transition: { duration: 0.8, ease: EASE, delay: d } }),
};
const fade: Variants = {
  hidden: { opacity: 0 },
  show: (d: number = 0) => ({ opacity: 1, transition: { duration: 0.6, ease: EASE, delay: d } }),
};

function Route({ d, delay = 0, color = INK, width = 2.5 }: { d: string; delay?: number; color?: string; width?: number }) {
  return (
    <motion.path
      data-draw=""
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={draw}
      custom={delay}
    />
  );
}

function Drop({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.g data-pin="" variants={drop} custom={delay}>
      {children}
    </motion.g>
  );
}

function School({ x, y, s = 20 }: { x: number; y: number; s?: number }) {
  const g = Math.round(s * 0.6);
  return (
    <>
      <rect x={x - s / 2} y={y - s / 2} width={s} height={s} rx={s * 0.29} fill={LIME} stroke={STREET} strokeWidth={2} />
      <GraduationCap x={x - g / 2} y={y - g / 2} size={g} weight="fill" color="#1A1946" />
    </>
  );
}

function Site({ x, y, s = 20 }: { x: number; y: number; s?: number }) {
  const g = Math.round(s * 0.55);
  return (
    <>
      <circle cx={x} cy={y} r={s / 2} fill={INDIGO} stroke={STREET} strokeWidth={2} />
      <ChalkboardTeacher x={x - g / 2} y={y - g / 2} size={g} weight="fill" color="#FFFFFF" />
    </>
  );
}

function Streets() {
  return (
    <g fill="none" strokeLinecap="round">
      <rect width={320} height={180} fill={LAND} />
      <path d="M-10 146 C 50 128 110 162 170 148 S 270 116 330 132" stroke={WATER} strokeWidth={16} />
      <g stroke={STREET} strokeWidth={6}>
        <path d="M-10 50 L330 70" />
        <path d="M98 -10 L122 190" />
        <path d="M232 -10 L212 190" />
      </g>
      <g stroke={STREET} strokeWidth={2.5}>
        <path d="M-10 104 L330 96" />
        <path d="M44 -10 L58 190" />
        <path d="M160 -10 L172 190" />
        <path d="M280 -10 L296 190" />
        <path d="M-10 18 L330 30" />
        <path d="M120 60 L330 -6" />
      </g>
    </g>
  );
}

const ROUTE_STOPS: [number, number][] = [
  [84, 100],
  [132, 118],
  [180, 82],
  [228, 98],
  [276, 60],
];

function RouteMotif() {
  const d = `M40 128 ${ROUTE_STOPS.map(([x, y]) => `L${x} ${y}`).join(" ")}`;
  return (
    <>
      <Route d={d} delay={0.15} />
      <Drop>
        <School x={40} y={128} />
      </Drop>
      {ROUTE_STOPS.map(([x, y], i) => {
        const last = i === ROUTE_STOPS.length - 1;
        return (
          <Drop key={i} delay={0.3 + i * 0.16}>
            <circle cx={x} cy={y} r={9} fill={last ? INDIGO : STREET} stroke={last ? STREET : INK} strokeWidth={2} />
            <text
              x={x}
              y={y + 3.5}
              textAnchor="middle"
              fontSize={10}
              fontWeight={700}
              fill={last ? "#FFFFFF" : INK}
              fontFamily="var(--font-sans)"
            >
              {i + 1}
            </text>
          </Drop>
        );
      })}
    </>
  );
}

function PinsMotif() {
  const schools: [number, number][] = [
    [70, 62],
    [192, 44],
    [252, 120],
  ];
  const sites: [number, number][] = [
    [38, 112],
    [120, 36],
    [142, 98],
    [214, 86],
    [288, 58],
    [104, 150],
  ];
  const all = [...schools.map((p) => ({ p, s: true })), ...sites.map((p) => ({ p, s: false }))].sort(
    (a, b) => a.p[0] - b.p[0],
  );
  return (
    <>
      <motion.circle
        data-pin=""
        cx={142}
        cy={98}
        r={17}
        fill="none"
        stroke={INDIGO}
        strokeOpacity={0.35}
        strokeWidth={2}
        variants={grow}
        custom={1.2}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
      {all.map(({ p: [x, y], s }, i) => (
        <Drop key={`${x}-${y}`} delay={0.1 + i * 0.09}>
          {s ? <School x={x} y={y} /> : <Site x={x} y={y} />}
        </Drop>
      ))}
    </>
  );
}

function WardsMotif() {
  const old = [
    "M60 30 L150 24 L160 92 L70 100 Z",
    "M150 24 L250 34 L240 96 L160 92 Z",
    "M70 100 L160 92 L170 160 L80 160 Z",
    "M160 92 L240 96 L262 156 L170 160 Z",
  ];
  const merged = "M150 24 L250 34 L240 96 L262 156 L170 160 L160 92 Z";
  return (
    <>
      <g fill="none" stroke={MUTED} strokeWidth={1.5} strokeDasharray="4 5" strokeOpacity={0.7}>
        {old.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <motion.path data-pin="" d={merged} fill={INDIGO} fillOpacity={0.1} stroke="none" variants={fade} custom={0.9} />
      <Route d={merged} color={INDIGO} width={3} delay={0.1} />
      <Drop delay={1}>
        <Site x={206} y={110} s={22} />
      </Drop>
    </>
  );
}

function RingMotif() {
  const c: [number, number] = [164, 92];
  const inside: [number, number][] = [
    [116, 60],
    [204, 134],
    [214, 54],
  ];
  const outside: [number, number][] = [
    [36, 142],
    [292, 34],
  ];
  return (
    <>
      <motion.circle
        data-pin=""
        cx={c[0]}
        cy={c[1]}
        r={66}
        fill={INDIGO}
        fillOpacity={0.06}
        stroke={INDIGO}
        strokeWidth={2}
        strokeDasharray="5 6"
        variants={grow}
        custom={0.2}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
      {inside.map(([x, y], i) => (
        <Route key={`r${i}`} d={`M${x} ${y} Q ${(x + c[0]) / 2} ${Math.min(y, c[1]) - 14} ${c[0]} ${c[1]}`} delay={0.7 + i * 0.15} width={2} />
      ))}
      {[...inside, ...outside].map(([x, y], i) => (
        <Drop key={`s${i}`} delay={0.45 + i * 0.08}>
          <School x={x} y={y} />
        </Drop>
      ))}
      <Drop>
        <Site x={c[0]} y={c[1]} s={24} />
      </Drop>
    </>
  );
}

function HubMotif() {
  const c: [number, number] = [160, 92];
  const sites: [number, number][] = [
    [58, 46],
    [272, 42],
    [262, 146],
    [70, 140],
  ];
  return (
    <>
      {sites.map(([x, y], i) => (
        <Route key={`r${i}`} d={`M${c[0]} ${c[1]} Q ${(x + c[0]) / 2} ${c[1]} ${x} ${y}`} delay={0.25 + i * 0.12} width={2} />
      ))}
      {sites.map(([x, y], i) => (
        <Drop key={`s${i}`} delay={0.8 + i * 0.12}>
          <Site x={x} y={y} />
        </Drop>
      ))}
      <Drop>
        <School x={c[0]} y={c[1]} s={28} />
      </Drop>
    </>
  );
}

const MOTIFS: Record<CoverMotif, () => ReactNode> = {
  route: RouteMotif,
  pins: PinsMotif,
  wards: WardsMotif,
  ring: RingMotif,
  hub: HubMotif,
};

export function NewsCover({ motif, className = "" }: { motif: CoverMotif; className?: string }) {
  const Motif = MOTIFS[motif];
  return (
    <div aria-hidden="true" className={`${styles.cover} overflow-hidden bg-bezel ${className}`}>
      <motion.svg
        viewBox="0 0 320 180"
        preserveAspectRatio="xMidYMid slice"
        className="block size-full"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
      >
        <Streets />
        <Motif />
      </motion.svg>
    </div>
  );
}
