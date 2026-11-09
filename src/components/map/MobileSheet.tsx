"use client";

import { animate, motion, useDragControls, useMotionValue, type PanInfo } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { mapPage } from "@/content/map";

export type Snap = "peek" | "half" | "full";

const PEEK = 132;
const TOP_CLEAR = 72;
const SPRING = { type: "spring" as const, stiffness: 420, damping: 40 };

interface Props {
  snap: Snap;
  onSnap: (s: Snap) => void;
  reduced: boolean;
  /** Always visible: handle row, count, quick toggles (fits the 132px peek). */
  header: ReactNode;
  /** Floating near-me button, 16px above the sheet. Hidden at full height. */
  fab?: ReactNode;
  children: ReactNode;
}

/**
 * Mobile bottom sheet (spec 4.4): peek 132px, half 50dvh, full 92dvh.
 * Dragged by its handle and header with Motion, snaps with a spring.
 */
export function MobileSheet({ snap, onSnap, reduced, header, fab, children }: Props) {
  const root = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ vh: 0, parent: 0, head: 88 });
  const controls = useDragControls();
  const y = useMotionValue(10000);

  useLayoutEffect(() => {
    const parent = root.current?.parentElement;
    const head = headRef.current;
    if (!parent || !head) return;
    const measure = () =>
      setBox({ vh: window.innerHeight, parent: parent.clientHeight, head: head.offsetHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(parent);
    ro.observe(head);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // 92dvh, capped so the floating search bar (12px inset + 48px) stays uncovered.
  const full = Math.max(PEEK, Math.min(Math.round(box.vh * 0.92), box.parent - TOP_CLEAR));
  const half = Math.min(full, Math.max(PEEK, Math.round(box.vh * 0.5)));
  const heightOf = (s: Snap) => (s === "full" ? full : s === "half" ? half : PEEK);
  const yOf = (s: Snap) => full - heightOf(s);

  const first = useRef(true);
  useEffect(() => {
    if (!box.vh) return;
    const target = full - (snap === "full" ? full : snap === "half" ? half : PEEK);
    if (first.current || reduced) {
      first.current = false;
      y.set(target);
      return;
    }
    const a = animate(y, target, SPRING);
    return () => a.stop();
  }, [snap, full, half, box.vh, reduced, y]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const projected = y.get() + info.velocity.y * 0.18;
    const order: Snap[] = ["full", "half", "peek"];
    let best: Snap = snap;
    let bestD = Infinity;
    for (const s of order) {
      const d = Math.abs(yOf(s) - projected);
      if (d < bestD) {
        bestD = d;
        best = s;
      }
    }
    if (best === snap) {
      if (reduced) y.set(yOf(best));
      else animate(y, yOf(best), SPRING);
    } else onSnap(best);
  };

  const cycle = () => onSnap(snap === "peek" ? "half" : snap === "half" ? "full" : "peek");

  return (
    <motion.section
      ref={root}
      aria-label={mapPage.sheetLabel}
      drag="y"
      dragListener={false}
      dragControls={controls}
      dragConstraints={{ top: 0, bottom: Math.max(0, full - PEEK) }}
      dragElastic={0.06}
      dragMomentum={false}
      onDragEnd={onDragEnd}
      style={{ y, height: full, visibility: box.vh ? "visible" : "hidden" }}
      className="absolute inset-x-0 bottom-0 z-20 flex flex-col rounded-t-[20px] bg-surface shadow-[var(--shadow-2)]"
    >
      {fab && snap !== "full" && <div className="absolute -top-16 right-4">{fab}</div>}
      <div
        ref={headRef}
        onPointerDown={(e) => controls.start(e)}
        className="shrink-0 touch-none select-none"
      >
        <button
          type="button"
          onClick={cycle}
          aria-label={mapPage.sheetExpand}
          aria-expanded={snap !== "peek"}
          className="flex h-11 w-full items-center justify-center"
        >
          <span className="h-1 w-9 rounded-full bg-line" aria-hidden="true" />
        </button>
        {header}
      </div>
      <div
        className="min-h-0 overflow-y-auto overscroll-contain"
        style={{ height: Math.max(0, heightOf(snap) - box.head) }}
      >
        {children}
      </div>
    </motion.section>
  );
}
