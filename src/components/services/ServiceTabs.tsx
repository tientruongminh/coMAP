"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { ConsultKind } from "@/components/consult/ConsultProvider";
import { useMedia } from "./useMedia";

type Tab = { id: ConsultKind; label: string };

/**
 * D1 sticky in-page tab bar (spec 3.4). Plain anchors without JS; with JS the
 * active pill follows the section that crosses the middle of the viewport
 * (IntersectionObserver callbacks, no scroll listener). No CTA here: the header
 * already carries "Đăng ký tư vấn" a few pixels above.
 */
export function ServiceTabs({ label, tabs }: { label: string; tabs: readonly Tab[] }) {
  const [active, setActive] = useState<ConsultKind | null>(null);
  const reduce = useMedia("(prefers-reduced-motion: reduce)");
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = tabs.map((t) => document.getElementById(t.id)).filter((el): el is HTMLElement => !!el);
    if (els.length === 0) return;
    // Which section owns the reading line (45% down the viewport)? Read from
    // fresh rects, so a jump of any distance (Home key, anchor, restore) lands right.
    const pick = () => {
      const line = window.innerHeight * 0.45;
      let cur: ConsultKind | null = null;
      for (const el of els) if (el.getBoundingClientRect().top <= line) cur = el.id as ConsultKind;
      const last = els[els.length - 1];
      if (cur === last.id && last.getBoundingClientRect().bottom < line) cur = null;
      setActive(cur);
    };
    const io = new IntersectionObserver(pick, { rootMargin: "-45% 0px -54% 0px" });
    // The sections plus their neighbours before and after, so leaving the
    // tabbed range in either direction also fires a callback.
    const before = barRef.current?.previousElementSibling;
    const after = els[els.length - 1].nextElementSibling;
    [before, ...els, after].forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [tabs]);

  const go = (e: MouseEvent<HTMLAnchorElement>, id: ConsultKind) => {
    const el = document.getElementById(id);
    if (!el || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    el.focus({ preventScroll: true });
    history.replaceState(null, "", `#${id}`);
    setActive(id);
  };

  return (
    <div ref={barRef} className="sticky top-[var(--header-h)] z-30 border-b border-line bg-paper">
      <div className="container-cm flex h-[52px] items-center lg:h-14">
        <nav aria-label={label} className="-mx-1 overflow-x-auto px-1 [scrollbar-width:none]">
          <ul className="flex items-center gap-1">
            {tabs.map((t) => {
              const on = active === t.id;
              return (
                <li key={t.id}>
                  <a
                    href={`#${t.id}`}
                    aria-current={on ? "true" : undefined}
                    onClick={(e) => go(e, t.id)}
                    className={`relative inline-flex h-9 items-center whitespace-nowrap rounded-full px-3 text-[14px] font-semibold leading-none transition-colors duration-240 sm:px-4 ${
                      on ? "text-white" : "text-ink-muted hover:bg-indigo-50 hover:text-ink"
                    }`}
                  >
                    {on && (
                      <motion.span
                        layoutId="dich-vu-tab"
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full bg-ink"
                        transition={reduce ? { duration: 0 } : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                    <span className="relative">{t.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
