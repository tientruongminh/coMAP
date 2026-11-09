"use client";

import { Check, X } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { normalize, formatNumber } from "@/lib/format";
import {
  FILTER_KEYS,
  SITE_ONLY,
  filterOptions,
  optionCount,
  type FilterKey,
  type Filters,
} from "@/lib/map-filters";
import { areaLong } from "@/lib/locations";
import { filterCopy } from "@/content/map";
import { btn } from "@/components/ui/button";
import { MiniPin } from "./pinGlyphs";

interface Props {
  variant: "desktop" | "mobile";
  filters: Filters;
  q: string;
  resultCount: number;
  onToggle: (key: FilterKey, slug: string) => void;
  onClear: () => void;
  onClose: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Filter surface (spec 4.7): a slide-over covering the panel list on desktop,
 * a full-screen sheet on mobile. Changes apply instantly; live counts per option.
 */
export function FilterSurface({ variant, filters, q, resultCount, onToggle, onClear, onClose }: Props) {
  const reduce = useReducedMotion();
  const uid = useId();
  const root = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [areaQuery, setAreaQuery] = useState("");

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const k of FILTER_KEYS)
      for (const o of filterOptions[k]) m.set(`${k}:${o.slug}`, optionCount(filters, k, o.slug, q));
    return m;
  }, [filters, q]);

  const areaOptions = useMemo(() => {
    const nq = normalize(areaQuery);
    return filterOptions["khu-vuc"].filter((o) => !nq || normalize(o.label).includes(nq));
  }, [areaQuery]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== "Tab" || !root.current) return;
    const items = [
      ...root.current.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled]), a[href]"),
    ].filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const mobile = variant === "mobile";
  const from = mobile ? { y: "100%" } : { x: "100%" };
  const to = mobile ? { y: 0 } : { x: 0 };

  return (
    <motion.div
      ref={root}
      role="dialog"
      aria-modal={mobile ? "true" : undefined}
      aria-labelledby={`${uid}-t`}
      onKeyDown={onKeyDown}
      initial={reduce ? false : from}
      animate={to}
      exit={reduce ? { opacity: 0 } : from}
      transition={{ duration: reduce ? 0 : 0.42, ease: EASE }}
      className={`flex flex-col bg-surface ${
        mobile ? "fixed inset-0 z-[60]" : "absolute inset-0 z-20 rounded-[20px]"
      }`}
    >
      <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
        <h2 id={`${uid}-t`} className="font-display text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-ink">
          {filterCopy.title}
        </h2>
        <button
          ref={closeRef}
          type="button"
          aria-label={filterCopy.close}
          onClick={onClose}
          className="-mr-2 grid size-11 place-items-center rounded-full text-ink transition-colors duration-160 hover:bg-paper"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6">
        {FILTER_KEYS.map((key) => {
          const gid = `${uid}-${key}`;
          const isArea = key === "khu-vuc";
          return (
            <div key={key} role="group" aria-labelledby={gid} className="border-b border-line py-5 last:border-b-0">
              <h3 id={gid} className="flex items-center gap-2 text-[15px] font-semibold leading-[22px] text-ink">
                {filterCopy.groups[key]}
                {/* Site-only groups carry the indigo site pin instead of a helper line. */}
                {SITE_ONLY.has(key) && (
                  <span title={filterCopy.siteOnly} className="inline-flex">
                    <MiniPin type="internship" size={16} className="!border" />
                    <span className="sr-only">{`(${filterCopy.siteOnly})`}</span>
                  </span>
                )}
              </h3>
              {isArea ? (
                <>
                  <label htmlFor={`${gid}-q`} className="mt-3 block text-[13px] font-medium leading-[18px] text-ink-muted">
                    {filterCopy.areaSearchLabel}
                  </label>
                  <input
                    id={`${gid}-q`}
                    type="text"
                    autoComplete="off"
                    value={areaQuery}
                    onChange={(e) => setAreaQuery(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-full border border-line bg-surface px-4 text-[15px] text-ink transition-[border-color] duration-160 hover:border-ink-muted/60 focus:border-indigo-600"
                  />
                  {areaOptions.length === 0 ? (
                    <p className="mt-3 text-[14px] leading-5 text-ink-muted">{filterCopy.areaNoMatch}</p>
                  ) : (
                    <ul className="mt-2 grid grid-cols-2 gap-x-2">
                      {areaOptions.map((o) => {
                        const on = filters[key].includes(o.slug);
                        const n = counts.get(`${key}:${o.slug}`) ?? 0;
                        const off = n === 0 && !on;
                        return (
                          <li key={o.slug}>
                            <button
                              type="button"
                              role="checkbox"
                              aria-checked={on}
                              aria-disabled={off || undefined}
                              onClick={() => !off && onToggle(key, o.slug)}
                              className={`flex min-h-11 w-full items-center gap-2.5 rounded-[12px] px-1.5 text-left text-[14px] leading-5 text-ink transition-colors duration-160 ${
                                off ? "cursor-not-allowed opacity-40" : "hover:bg-paper"
                              }`}
                            >
                              <span
                                aria-hidden="true"
                                className={`grid size-5 shrink-0 place-items-center rounded-[6px] border-[1.5px] ${
                                  on ? "border-indigo-600 bg-indigo-600 text-white" : "border-ink-muted/60 bg-surface"
                                }`}
                              >
                                {on && <Check size={12} weight="bold" />}
                              </span>
                              <span className="min-w-0 flex-1 truncate">{areaLong(o.label)}</span>
                              <span className="shrink-0 text-[13px] text-ink-muted tabular-nums">{formatNumber(n)}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </>
              ) : (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {filterOptions[key].map((o) => {
                    const on = filters[key].includes(o.slug);
                    const n = counts.get(`${key}:${o.slug}`) ?? 0;
                    const off = n === 0 && !on;
                    return (
                      <li key={o.slug}>
                        <button
                          type="button"
                          aria-pressed={on}
                          aria-disabled={off || undefined}
                          onClick={() => !off && onToggle(key, o.slug)}
                          className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-[14px] font-medium leading-5 transition-colors duration-160 lg:min-h-10 ${
                            on
                              ? "border-indigo-600 bg-indigo-600 text-white"
                              : "border-line bg-surface text-ink" + (off ? "" : " hover:border-ink-muted/60")
                          } ${off ? "cursor-not-allowed opacity-40" : ""}`}
                        >
                          {on && <Check size={14} weight="bold" aria-hidden="true" />}
                          <span>{o.label}</span>
                          <span className={`tabular-nums ${on ? "text-white/80" : "text-ink-muted"}`}>{formatNumber(n)}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-line bg-surface px-6 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <button type="button" onClick={onClear} className={btn("text", "md")}>
          {filterCopy.clear}
        </button>
        <button type="button" onClick={onClose} className={btn("primary", "md")}>
          {filterCopy.show(resultCount)}
        </button>
      </div>
    </motion.div>
  );
}
