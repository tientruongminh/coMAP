"use client";

import { MapTrifold, X } from "@phosphor-icons/react";
import Link from "next/link";
import type { ReactNode } from "react";
import { areaLong, type Location } from "@/lib/locations";
import { formatDistance } from "@/lib/format";
import { filterCopy, mapPage, mapStates } from "@/content/map";
import { distanceFrom, type LngLat } from "@/lib/map-relations";
import { btn } from "@/components/ui/button";
import { MiniPin } from "./pinGlyphs";

export function Chip({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex min-h-6 items-center gap-1 rounded-full border border-line bg-paper px-2.5 py-0.5 text-[12px] font-medium leading-4 text-ink ${className}`}
    >
      {children}
    </span>
  );
}

interface RowProps {
  loc: Location;
  anchor: LngLat | null;
  hovered: boolean;
  onSelect: (id: string, el: HTMLElement) => void;
  onHover: (id: string | null) => void;
}

/** Result row (spec 4.4, trimmed by spec 0): mini pin, name, one meta line, distance. */
export function ResultRow({ loc, anchor, hovered, onSelect, onHover }: RowProps) {
  return (
    <li>
      <button
        type="button"
        data-row={loc.id}
        onClick={(e) => onSelect(loc.id, e.currentTarget)}
        onMouseEnter={() => onHover(loc.id)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(loc.id)}
        onBlur={() => onHover(null)}
        className={`flex min-h-[60px] w-full items-start gap-3 rounded-[14px] px-3 py-3 text-left transition-colors duration-160 hover:bg-paper ${
          hovered ? "bg-paper" : ""
        }`}
      >
        <MiniPin type={loc.type} size={24} className="mt-0.5" />
        <span className="min-w-0 flex-1">
          <span className="flex items-start gap-3">
            <span className="line-clamp-2 min-w-0 flex-1 text-[15px] font-semibold leading-5 text-ink">{loc.name}</span>
            {anchor && (
              <span
                title={mapPage.straightLine}
                className="shrink-0 pt-px text-[13px] leading-[18px] text-ink-muted tabular-nums"
              >
                {formatDistance(distanceFrom(anchor, loc))}
              </span>
            )}
          </span>
          <span className="mt-0.5 block truncate text-[13px] leading-[18px] text-ink-muted">
            {mapPage.rowMeta(loc.ward, areaLong(loc.area))}
          </span>
        </span>
      </button>
    </li>
  );
}

interface ListProps {
  sites: Location[];
  schools: Location[];
  anchor: LngLat | null;
  hoverId: string | null;
  onSelect: (id: string, el: HTMLElement) => void;
  onHover: (id: string | null) => void;
}

/** Grouped list: sites first, then schools (spec 4.4). */
export function ResultList({ sites, schools, anchor, hoverId, onSelect, onHover }: ListProps) {
  const groups = [
    { key: "sites", title: mapPage.groupSites(sites.length), items: sites },
    { key: "schools", title: mapPage.groupSchools(schools.length), items: schools },
  ].filter((g) => g.items.length > 0);
  return (
    <div className="flex flex-col gap-3">
      {groups.map((g) => (
        <section key={g.key} aria-labelledby={`grp-${g.key}`}>
          <h2 id={`grp-${g.key}`} className="px-3 pb-1 text-[13px] font-semibold leading-[18px] text-ink-muted">
            {g.title}
          </h2>
          <ul className="flex flex-col">
            {g.items.map((l) => (
              <ResultRow
                key={l.id}
                loc={l}
                anchor={anchor}
                hovered={hoverId === l.id}
                onSelect={onSelect}
                onHover={onHover}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export type EmptyKind = "area" | "search" | "filters";

interface EmptyProps {
  kind: EmptyKind;
  q: string;
  lastAdded: { key: string; label: string; slug: string }[];
  onClearSearch: () => void;
  onClearFilters: () => void;
  onRemove: (key: string, slug: string) => void;
}

/** Empty states (spec 4.11): MapTrifold 40px muted, no illustration. */
export function EmptyResults({ kind, q, lastAdded, onClearSearch, onClearFilters, onRemove }: EmptyProps) {
  const title =
    kind === "area" ? mapStates.emptyAreaTitle : kind === "search" ? mapStates.noSearchTitle(q) : mapStates.noResultsTitle;
  const body =
    kind === "area" ? mapStates.emptyAreaBody : kind === "search" ? mapStates.noSearchBody : mapStates.noResultsBody;
  return (
    <div className="flex flex-col items-start gap-3 px-3 py-6">
      <MapTrifold size={40} className="text-ink-muted" aria-hidden="true" />
      <h2 className="text-[16px] font-semibold leading-6 text-ink">{title}</h2>
      <p className="text-[14px] leading-[22px] text-ink-muted">{body}</p>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        {kind === "area" && (
          <Link href="/lien-he?chu-de=dua-len-ban-do" className={btn("secondary", "sm")}>
            {mapStates.emptyAreaCta}
          </Link>
        )}
        {kind === "search" && (
          <button type="button" onClick={onClearSearch} className={btn("secondary", "sm")}>
            {mapPage.clearSearch}
          </button>
        )}
        {kind === "filters" && (
          <>
            <button type="button" onClick={onClearFilters} className={btn("secondary", "sm")}>
              {filterCopy.clear}
            </button>
            {lastAdded.map((a) => (
              <button
                key={`${a.key}:${a.slug}`}
                type="button"
                onClick={() => onRemove(a.key, a.slug)}
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line bg-surface pl-4 pr-3 text-[14px] font-medium text-ink transition-colors duration-160 hover:border-ink-muted/60"
              >
                {mapStates.removeLast(a.label)}
                <X size={14} aria-hidden="true" />
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
