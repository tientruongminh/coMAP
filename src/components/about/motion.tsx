"use client";

import { motion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import s from "./motion.module.css";

/**
 * Small, sequenced motion for the About and Services diagrams (spec 0: an
 * animation must show the idea; a route draws, steps light up in order, a stamp lands).
 *
 * `Seq` starts one timeline when it scrolls into view; every `Step`, `Draw` and
 * `Dim` inside it reads the same "off"/"on" variants and waits `at` seconds.
 * Hydration safe: the markup never depends on the media query. Reduced motion
 * renders the final state through CSS: `[data-reveal]` in globals.css resets
 * opacity and transform, motion.module.css finishes lines and dims.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const BACK = [0.34, 1.56, 0.64, 1] as const;

type SeqTag = "div" | "ol" | "ul" | "figure";

export function Seq({
  children,
  className,
  as = "div",
  amount = 0.35,
  role,
  label,
}: {
  children: ReactNode;
  className?: string;
  as?: SeqTag;
  amount?: number;
  role?: string;
  label?: string;
}) {
  const M = motion[as];
  return (
    <M className={className} role={role} aria-label={label} initial="off" whileInView="on" viewport={{ once: true, amount }}>
      {children}
    </M>
  );
}

const kinds = {
  /** a pin or check appears */
  pop: { off: { opacity: 0, scale: 0.4 }, on: { opacity: 1, scale: 1 } },
  /** a label fades in */
  fade: { off: { opacity: 0 }, on: { opacity: 1 } },
  /** a row rises into place */
  rise: { off: { opacity: 0, y: 10 }, on: { opacity: 1, y: 0 } },
  /** a rail grows from its origin (set origin-left / origin-top) */
  growX: { off: { scaleX: 0 }, on: { scaleX: 1 } },
  growY: { off: { scaleY: 0 }, on: { scaleY: 1 } },
  /** a stamp lands: big and clear, then pressed down */
  stamp: { off: { opacity: 0, scale: 1.9 }, on: { opacity: 1, scale: 1 } },
} as const;

type StepTag = "span" | "div" | "li";

export function Step({
  children,
  className,
  style,
  as = "span",
  kind = "pop",
  at = 0,
  dur,
}: {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: StepTag;
  kind?: keyof typeof kinds;
  at?: number;
  dur?: number;
}) {
  const M = motion[as];
  const k = kinds[kind];
  const duration = dur ?? (kind === "growX" || kind === "growY" ? 0.9 : kind === "stamp" ? 0.45 : 0.45);
  return (
    <M
      data-reveal=""
      className={className}
      style={style}
      variants={{
        off: k.off,
        on: { ...k.on, transition: { delay: at, duration, ease: kind === "stamp" || kind === "pop" ? BACK : EASE } },
      }}
    >
      {children}
    </M>
  );
}

/** An SVG route that draws itself (pathLength 0 to 1). */
export function Draw({
  d,
  at = 0,
  dur = 0.9,
  stroke = "#1A1946",
  width = 2,
  dash,
  className = "",
}: {
  d: string;
  at?: number;
  dur?: number;
  stroke?: string;
  width?: number;
  /** a dashed route cannot draw with dasharray; it fades in instead */
  dash?: string;
  className?: string;
}) {
  if (dash) {
    return (
      <motion.path
        data-reveal=""
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dash}
        className={className}
        variants={{ off: { opacity: 0 }, on: { opacity: 1, transition: { delay: at, duration: dur, ease: EASE } } }}
      />
    );
  }
  return (
    <motion.path
      data-reveal=""
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${s.draw} ${className}`}
      variants={{
        off: { pathLength: 0, opacity: 0 },
        on: {
          pathLength: 1,
          opacity: 1,
          transition: { pathLength: { delay: at, duration: dur, ease: EASE }, opacity: { delay: at, duration: 0.01 } },
        },
      }}
    />
  );
}

/** Something that stays but steps back (a filtered-out dot). Final opacity 0.18. */
export function Dim({ children, className = "", style, at = 0 }: { children?: ReactNode; className?: string; style?: CSSProperties; at?: number }) {
  return (
    <motion.span
      className={`${s.dim} ${className}`}
      style={style}
      variants={{ off: { opacity: 1 }, on: { opacity: 0.18, transition: { delay: at, duration: 0.5, ease: EASE } } }}
    >
      {children}
    </motion.span>
  );
}
