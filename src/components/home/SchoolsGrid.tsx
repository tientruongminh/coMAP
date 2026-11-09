"use client";

import { ArrowRight, Info } from "@phosphor-icons/react";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { internshipSites, schools, stats } from "@/lib/locations";
import { formatNumber } from "@/lib/format";
import { schoolMono } from "@/content/taxonomy";
import { schoolsSection } from "@/content/home";
import { Reveal } from "@/components/ui/Reveal";
import { MiniPin } from "@/components/map/pinGlyphs";
import { makeAtlas } from "./atlas";
import { useArm } from "./useArm";
import s from "./home.module.css";

/* Real positions of the schools, then nudged apart just enough that no two
   monogram pins overlap at phone size; a leader line runs back to the true spot. */
const ATLAS = makeAtlas(schools, 50, 40);
const MIN = 60;
const PINS = (() => {
  const pts = schools.map((l) => {
    const p = ATLAS.project(l);
    return { l, x0: p.x, y0: p.y, x: p.x, y: p.y };
  });
  for (let it = 0; it < 60; it++) {
    for (let a = 0; a < pts.length; a++) {
      for (let b = a + 1; b < pts.length; b++) {
        const A = pts[a];
        const B = pts[b];
        const dx = B.x - A.x;
        const dy = B.y - A.y;
        const d = Math.hypot(dx, dy) || 1;
        if (d >= MIN) continue;
        const push = (MIN - d) / 2;
        const ux = d === 1 && dx === 0 && dy === 0 ? 0 : dx / d;
        const uy = d === 1 && dx === 0 && dy === 0 ? 1 : dy / d;
        A.x -= ux * push;
        A.y -= uy * push;
        B.x += ux * push;
        B.y += uy * push;
      }
    }
  }
  const r = (n: number) => Math.round(n * 10) / 10;
  return pts
    .map((p) => ({ ...p, x: r(p.x), y: r(p.y) }))
    .sort((a, b) => a.l.lng - b.l.lng)
    .map((p, i) => ({ ...p, i }));
})();
const SITES = internshipSites
  .map((l) => ATLAS.project(l))
  .filter((p) => p.x > 8 && p.y > 8 && p.x < ATLAS.w - 8 && p.y < ATLAS.h - 8);
const pct = (v: number, of: number) => `${Math.round((v / of) * 10000) / 100}%`;

/**
 * S6 (spec 3.1): the schools where they really are. Monogram pins drop onto a
 * small atlas (faint dots are the internship sites around them); hovering,
 * focusing or tapping a pin names it in the card beside the map.
 */
export function SchoolsGrid() {
  const [pick, setPick] = useState("ussh-giaoduc");
  const ref = useArm<HTMLDivElement>(undefined, 0.3);
  const sc = schools.find((x) => x.id === pick) ?? schools[0];
  const name = sc.short ?? sc.name;
  const { w, h } = ATLAS;
  const grid: number[] = [];
  for (let k = 2; k * ATLAS.pxPerKm < Math.max(w, h); k += 2) grid.push(k * ATLAS.pxPerKm);

  return (
    <section aria-labelledby="truong-dao-tao" className="container-cm py-12 lg:py-16">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-x-6">
        <div className="lg:col-span-5">
          <Reveal>
            <h2 id="truong-dao-tao" className="t-h2 max-w-[12ch] lg:text-[48px] lg:leading-[56px]">
              {schoolsSection.title(formatNumber(stats.schools))}
            </h2>
            <p className="mt-4 flex items-center gap-2 text-[14px] leading-5 text-ink-muted">
              <Info size={16} weight="bold" aria-hidden="true" className="shrink-0 text-indigo-600" />
              {schoolsSection.note}
              <span className="sr-only"> {schoolsSection.noteSr}</span>
            </p>
          </Reveal>

          {/* The picked school: short name, programmes, a way onto the big map. */}
          <div className="relative mt-8 hidden max-w-[380px] items-center gap-4 rounded-[20px] bg-surface p-5 shadow-[var(--shadow-1)] lg:flex">
            <Card name={name} full={sc.name} fields={sc.fields.length} id={sc.id} />
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="bezel">
            <div ref={ref} className={`${s.armed} bezel-core relative bg-[#EFEFF4]`} style={{ aspectRatio: `${w} / ${h}` }}>
              <svg viewBox={`0 0 ${w} ${h}`} className="absolute inset-0 size-full" aria-hidden="true">
                <g stroke="#fff" strokeWidth="1" opacity=".9">
                  {grid.map((g) => (
                    <path key={`v${g}`} d={`M ${g} 0 V ${h}`} />
                  ))}
                  {grid.map((g) => (
                    <path key={`h${g}`} d={`M 0 ${g} H ${w}`} />
                  ))}
                </g>
                {SITES.map((p) => (
                  <circle key={`${p.x},${p.y}`} cx={p.x} cy={p.y} r="4" fill="#3330A8" opacity=".22" />
                ))}
                {PINS.map((p) =>
                  Math.hypot(p.x - p.x0, p.y - p.y0) > 6 ? (
                    <g key={p.l.id}>
                      <path d={`M ${p.x0} ${p.y0} L ${p.x} ${p.y}`} stroke="#1A1946" strokeWidth="1.5" opacity=".5" />
                      <circle cx={p.x0} cy={p.y0} r="3" fill="#1A1946" />
                    </g>
                  ) : null,
                )}
              </svg>
              <ul aria-label={schoolsSection.pinsLabel}>
                {PINS.map((p) => {
                  const on = p.l.id === pick;
                  const pickIt = () => setPick(p.l.id);
                  return (
                    <li
                      key={p.l.id}
                      className={`${s.drop} absolute`}
                      style={{ left: pct(p.x, w), top: pct(p.y, h), zIndex: on ? 2 : 1, "--i": p.i, "--step": "70ms" } as CSSProperties}
                    >
                      <button
                        type="button"
                        aria-pressed={on}
                        onPointerEnter={(e) => e.pointerType === "mouse" && pickIt()}
                        onFocus={pickIt}
                        onClick={pickIt}
                        className={`grid size-[30px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[9px] border-2 border-white font-display text-[12px] leading-none shadow-[var(--shadow-1)] outline-offset-2 transition-[scale,background-color,color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] lg:size-10 lg:rounded-[12px] lg:text-[15px] ${
                          on ? "scale-115 bg-ink text-lime-400" : "bg-lime-400 text-ink hover:scale-110"
                        }`}
                        style={{ fontVariationSettings: '"wdth" 112', fontWeight: 750 }}
                      >
                        {schoolMono[p.l.id]}
                        <span className="sr-only">, {p.l.short ?? p.l.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="relative mt-4 flex items-center gap-4 rounded-[20px] bg-surface p-4 shadow-[var(--shadow-1)] lg:hidden">
            <Card name={name} full={sc.name} fields={sc.fields.length} id={sc.id} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({ name, full, fields, id }: { name: string; full: string; fields: number; id: string }) {
  return (
    <>
      <MiniPin type="school" size={36} />
      <p aria-live="polite" className="min-w-0 flex-1">
        <span className="block truncate text-[17px] font-semibold leading-6 text-ink">{name}</span>
        <span className="tabular block text-[14px] leading-5 text-ink-muted">{schoolsSection.fieldCount(fields)}</span>
      </p>
      <Link
        href={`/ban-do?chon=${id}`}
        aria-label={schoolsSection.openLabel(full)}
        className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-white outline-none transition-colors duration-160 after:absolute after:inset-0 after:rounded-[20px] after:content-[''] hover:bg-indigo-600 focus-visible:after:outline focus-visible:after:outline-[3px] focus-visible:after:outline-offset-2 focus-visible:after:outline-indigo-600"
      >
        <ArrowRight size={18} weight="bold" aria-hidden="true" />
      </Link>
    </>
  );
}
