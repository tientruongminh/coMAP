"use client";

import { useEffect, useRef } from "react";

/**
 * Arms an element for a one-shot entrance, without React state:
 * - server and no-JS: no attribute, so the final state is what renders;
 * - reduced motion, or already scrolled past: never armed, final state;
 * - otherwise `data-armed` (hidden start) until 35% is in view, then `data-on`.
 * `onShow` runs once at that moment (count-ups, path draws).
 */
export function useArm<T extends HTMLElement>(onShow?: (el: T) => void, amount = 0.35) {
  const ref = useRef<T>(null);
  const cb = useRef(onShow);

  useEffect(() => {
    cb.current = onShow;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().bottom < 0) return;
    el.dataset.armed = "";
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        el.dataset.on = "";
        cb.current?.(el);
      },
      { threshold: amount },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [amount]);

  return ref;
}

/** Counts every `[data-count-to]` text node inside `root` up from 0, in place. */
export function countUp(root: HTMLElement, format: (n: number) => string, ms = 1200) {
  const nodes = [...root.querySelectorAll<HTMLElement>("[data-count-to]")];
  const items = nodes
    .map((el) => ({ el, to: Number(el.dataset.countTo), text: el.firstChild }))
    .filter((x) => x.text && Number.isFinite(x.to));
  if (!items.length) return;
  const t0 = performance.now();
  const tick = (t: number) => {
    const p = Math.min(1, (t - t0) / ms);
    const e = 1 - Math.pow(1 - p, 3);
    for (const it of items) it.text!.nodeValue = format(Math.round(it.to * e));
    if (p < 1) requestAnimationFrame(tick);
  };
  for (const it of items) it.text!.nodeValue = format(0);
  requestAnimationFrame(tick);
}
