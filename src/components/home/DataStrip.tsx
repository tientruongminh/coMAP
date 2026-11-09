"use client";

import { Clock, Info } from "@phosphor-icons/react";
import type { CSSProperties, ReactNode } from "react";
import { internshipSites, meta, stats } from "@/lib/locations";
import { formatDate, formatNumber } from "@/lib/format";
import { dataStrip } from "@/content/home";
import { MiniPin } from "@/components/map/pinGlyphs";
import { countUp, useArm } from "./useArm";
import s from "./home.module.css";

type Key = (typeof dataStrip.items)[number]["key"];

const i = (n: number, step?: string) => ({ "--i": n, ...(step ? { "--step": step } : {}) }) as CSSProperties;

/** One mark per counted thing: the number, drawn. */
function Units({ k }: { k: Key }) {
  const n = stats[k];
  if (k === "schools")
    return (
      <span className="flex flex-wrap gap-1">
        {Array.from({ length: n }, (_, j) => (
          <span key={j} className={`${s.unit} size-2.5 rounded-[3px] bg-lime-400`} style={i(j, "40ms")} />
        ))}
      </span>
    );
  if (k === "sites") {
    // Hollow = illustrative data, solid = the one verified site (Trung tâm HiPO).
    const verified = internshipSites.filter((x) => x.source === "verified").length;
    return (
      <span className="flex flex-wrap gap-1">
        {Array.from({ length: n }, (_, j) => (
          <span
            key={j}
            className={`${s.unit} size-2.5 rounded-full ${
              j < verified ? "bg-indigo-600 shadow-[0_0_0_2px_var(--color-paper),0_0_0_3.5px_var(--color-lime-400)]" : "border-[1.5px] border-indigo-600/50"
            }`}
            style={i(j, "22ms")}
          />
        ))}
      </span>
    );
  }
  if (k === "slots")
    return (
      <span className="grid w-fit grid-cols-[repeat(23,4px)] gap-[2px]">
        {Array.from({ length: n }, (_, j) => (
          <span key={j} className={`${s.unit} size-1 rounded-[1px] bg-ink/70`} style={i(j, "5ms")} />
        ))}
      </span>
    );
  return (
    <span className="flex flex-wrap gap-1">
      {Array.from({ length: n }, (_, j) => (
        <span key={j} className={`${s.unit} size-2.5 rounded-full border-[1.5px] border-dashed border-lime-700`} style={i(j, "34ms")} />
      ))}
    </span>
  );
}

const GLYPH: Record<Key, ReactNode> = {
  schools: <MiniPin type="school" size={18} />,
  sites: <MiniPin type="internship" size={18} />,
  slots: null,
  areas: null,
};

/**
 * S2 (spec 3.1): four live numbers that count up once, each drawn as a row of
 * marks (10 squircles, 26 site dots, 115 slots, 14 areas). The one solid site
 * dot is the verified site, which is what the demo line underneath says.
 */
export function DataStrip() {
  const ref = useArm<HTMLDivElement>((el) => countUp(el, formatNumber));

  return (
    <section aria-labelledby="so-lieu" className="container-cm pb-12 pt-2 lg:pb-16 lg:pt-4">
      <h2 id="so-lieu" className="sr-only">
        {dataStrip.title}
      </h2>
      <div ref={ref} className={s.armed}>
        <dl className="grid grid-cols-2 border-y border-line lg:grid-cols-4">
          {dataStrip.items.map((it, j) => (
            <div
              key={it.key}
              className={[
                "flex flex-col gap-3 py-6 lg:py-8",
                j % 2 === 1 ? "border-l border-line pl-4 sm:pl-5" : "pr-4 sm:pr-5",
                j >= 2 ? "border-t border-line lg:border-t-0" : "",
                j === 2 ? "lg:border-l lg:pl-8" : "",
                j > 0 ? "lg:pl-8" : "",
              ].join(" ")}
            >
              <dt className="order-2 -mt-1 flex items-center gap-2 text-[15px] font-semibold leading-5 text-ink">
                {GLYPH[it.key]}
                {it.label}
                <span className="sr-only">, {it.sr}</span>
              </dt>
              <dd className="order-1">
                <span
                  data-count-to={stats[it.key]}
                  className="tabular font-display text-[44px] leading-[48px] tracking-[-0.03em] lg:text-[64px] lg:leading-[64px]"
                  style={{ fontVariationSettings: '"wdth" 112', fontWeight: 750 }}
                >
                  {formatNumber(stats[it.key])}
                </span>
              </dd>
              <dd aria-hidden="true" className="order-3 min-h-6">
                <Units k={it.key} />
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] leading-[18px] text-ink-muted">
          <p className="inline-flex items-center gap-2">
            <Info size={16} weight="bold" aria-hidden="true" className="shrink-0 text-indigo-600" />
            {dataStrip.demo}
            <span className="sr-only"> {dataStrip.demoSr}</span>
          </p>
          <p className="tabular inline-flex items-center gap-1.5">
            <Clock size={16} weight="bold" aria-hidden="true" className="shrink-0" />
            <span className="sr-only">{dataStrip.updatedSr} </span>
            <time dateTime={meta.updated}>{formatDate(meta.updated)}</time>
          </p>
        </div>
      </div>
    </section>
  );
}
