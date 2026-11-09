"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Lime highlighter behind 1 to 3 words (spec 1.2, 6.2). Sweeps in once:
 * on load when `immediate`, otherwise when it scrolls into view.
 * Without JS or with reduced motion the band is simply there.
 */
export function Hl({ children, immediate = false, delay = 0 }: { children: ReactNode; immediate?: boolean; delay?: number }) {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- arm only on the client so SSR shows the band
    setArmed(true);
    let t: ReturnType<typeof setTimeout> | undefined;
    if (immediate) {
      t = setTimeout(() => setOn(true), 120 + delay);
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          t = setTimeout(() => setOn(true), 150 + delay);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, [immediate, delay]);

  return (
    <mark ref={ref} className="hl" data-sweep={armed ? "" : undefined} data-on={on ? "true" : undefined}>
      {children}
    </mark>
  );
}
