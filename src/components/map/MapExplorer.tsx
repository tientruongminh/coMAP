"use client";

import { Crosshair, Faders, WarningCircle, X } from "@phosphor-icons/react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { byId, locations, stats } from "@/lib/locations";
import { distanceKm } from "@/lib/geo";
import { CITY_ANCHOR, CITY_ANCHOR_LABEL, toasts } from "@/content/site";
import { typeSlug } from "@/content/taxonomy";
import { mapPage, mapStates } from "@/content/map";
import {
  FILTER_KEYS,
  activeGroupCount,
  areasWithData,
  emptyFilters,
  filterLocations,
  optionLabel,
  parseFilters,
  toggle,
  typeCounts,
  writeFilters,
  type FilterKey,
  type Filters,
} from "@/lib/map-filters";
import { boundsOf, distanceFrom, lngLat, nearest, relatedOf, type LngLat } from "@/lib/map-relations";
import type { GeocodeResult } from "@/lib/map-search";
import { areaLong } from "@/lib/locations";
import { btn } from "@/components/ui/button";
import { useToast } from "@/components/ui/Toast";
import { insideMaxBounds, type EngineOptions, type MapEngine } from "./engine";
import type { MapFailure } from "./MapView";
import { DetailCard } from "./DetailCard";
import { FilterSurface } from "./FilterSurface";
import { MapLoading, MapPageSkeleton } from "./MapSkeleton";
import { MobileSheet, type Snap } from "./MobileSheet";
import { EmptyResults, ResultList, type EmptyKind } from "./ResultList";
import { SearchBox } from "./SearchBox";
import { MiniPin } from "./pinGlyphs";
import { useMedia } from "./useMedia";

const MapView = dynamic(() => import("./MapView"), { ssr: false, loading: () => null });

type Layout = "desktop" | "mobile";
interface Anchor {
  lngLat: LngLat;
  label: string;
}

/* ---------- padding (spec 4.4) ---------- */

const DESKTOP_PAD = { left: 432, top: 24, right: 24, bottom: 24 };
const MOBILE_PAD = { top: 72, right: 16, bottom: 148, left: 16 };
const padFor = (layout: Layout, sheetHalf: boolean) =>
  layout === "desktop"
    ? DESKTOP_PAD
    : sheetHalf
      ? { ...MOBILE_PAD, bottom: Math.round(window.innerHeight * 0.5) + 16 }
      : MOBILE_PAD;

/* ---------- URL (spec 4.10) ---------- */

function writeParams(mut: (p: URLSearchParams) => void, mode: "push" | "replace") {
  const u = new URL(window.location.href);
  mut(u.searchParams);
  const qs = u.searchParams.toString().replace(/%2C/gi, ",");
  const next = `${u.pathname}${qs ? `?${qs}` : ""}${u.hash}`;
  if (next === `${window.location.pathname}${window.location.search}${window.location.hash}`) return;
  if (mode === "push") window.history.pushState(null, "", next);
  else window.history.replaceState(null, "", next);
}

function pair(v: string | null): [number, number] | null {
  if (!v) return null;
  const [a, b] = v.split(",").map(Number);
  return Number.isFinite(a) && Number.isFinite(b) ? [a, b] : null;
}

interface Init {
  filters: Filters;
  q: string;
  chon: string | null;
  unknownChon: boolean;
  anchor: Anchor | null;
  cam: { center: LngLat; zoom: number } | null;
}

function readInitial(sp: URLSearchParams): Init {
  const rawChon = sp.get("chon");
  const chon = rawChon && byId.has(rawChon) ? rawChon : null;
  const gan = pair(sp.get("gan"));
  let anchor: Anchor | null = null;
  if (gan) {
    const ll: LngLat = [gan[1], gan[0]];
    if (insideMaxBounds(ll))
      anchor = { lngLat: ll, label: distanceKm(ll, CITY_ANCHOR) < 0.03 ? CITY_ANCHOR_LABEL : mapPage.pickedPoint };
  }
  const c = pair(sp.get("c"));
  const z = Number(sp.get("z"));
  const cam =
    c && sp.get("z") && Number.isFinite(z) && z >= 10 && z <= 18 && insideMaxBounds([c[0], c[1]])
      ? { center: [c[0], c[1]] as LngLat, zoom: z }
      : null;
  return {
    filters: parseFilters(sp),
    q: (sp.get("q") ?? "").trim().slice(0, 120),
    chon,
    unknownChon: !!rawChon && !chon,
    anchor,
    cam,
  };
}

const ellipsis = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

/**
 * /ban-do (spec 4.4 to 4.11). React owns the state and the URL; MapEngine draws.
 * The list keeps working when the map fails.
 */
export default function MapExplorer() {
  const sp = useSearchParams();
  const desktop = useMedia("(min-width: 1024px)");
  const layout: Layout | null = desktop === null ? null : desktop ? "desktop" : "mobile";
  const reduced = !!useReducedMotion();
  const toast = useToast();
  const [init] = useState(() => readInitial(new URLSearchParams(sp.toString())));

  const [filters, setFilters] = useState<Filters>(init.filters);
  const [q, setQ] = useState(init.q);
  const [input, setInput] = useState(init.q);
  const [selected, setSelected] = useState<string | null>(init.chon);
  const [anchor, setAnchor] = useState<Anchor | null>(init.anchor);
  const [hover, setHover] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [added, setAdded] = useState<{ key: FilterKey; slug: string }[]>([]);
  const [engine, setEngine] = useState<MapEngine | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [failure, setFailure] = useState<MapFailure | null>(null);
  const [mapKey, setMapKey] = useState(0);
  const [locating, setLocating] = useState(false);
  const [snap, setSnap] = useState<Snap>(init.chon ? "half" : "peek");

  const opener = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const filterBtn = useRef<HTMLButtonElement | null>(null);
  const focusHeading = useRef(false);
  const restoreFocus = useRef<string | null>(null);
  const fitResults = useRef(false);
  const camRef = useRef<{ center: LngLat; zoom: number } | null>(null);
  const camTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const selRef = useRef<string | null>(init.chon);
  const blockEsc = useRef(false);
  const closeRef = useRef<() => void>(() => {});

  /* ---------- derived ---------- */

  const results = useMemo(() => filterLocations(filters, q), [filters, q]);
  const visibleIds = useMemo(() => new Set(results.map((l) => l.id)), [results]);
  const anchorLL = anchor?.lngLat ?? null;
  const groups = useMemo(() => {
    const cmp = anchorLL
      ? (a: (typeof results)[number], b: (typeof results)[number]) => distanceFrom(anchorLL, a) - distanceFrom(anchorLL, b)
      : (a: (typeof results)[number], b: (typeof results)[number]) => a.name.localeCompare(b.name, "vi");
    return {
      sites: results.filter((l) => l.type === "internship").sort(cmp),
      schools: results.filter((l) => l.type === "school").sort(cmp),
    };
  }, [results, anchorLL]);
  const counts = useMemo(() => typeCounts(filters, q), [filters, q]);
  const selectedLoc = selected ? (byId.get(selected) ?? null) : null;
  const groupCount = activeGroupCount(filters);

  const emptyKind: EmptyKind | null = results.length
    ? null
    : filters["khu-vuc"].length > 0 && filters["khu-vuc"].every((s) => !areasWithData.has(s))
      ? "area"
      : q && filterLocations(filters, "").length > 0
        ? "search"
        : "filters";

  const chips = FILTER_KEYS.flatMap((key) =>
    filters[key].map((slug) => {
      const raw = optionLabel(key, slug);
      return { key, slug, label: key === "khu-vuc" ? areaLong(raw) : raw };
    }),
  );
  const lastAdded = added
    .filter((a) => filters[a.key].includes(a.slug))
    .slice(-2)
    .reverse()
    .map((a) => {
      const raw = optionLabel(a.key, a.slug);
      return { key: a.key, slug: a.slug, label: a.key === "khu-vuc" ? areaLong(raw) : raw };
    });

  /* ---------- engine sync ---------- */

  useEffect(() => {
    engine?.setVisible(visibleIds);
  }, [engine, visibleIds]);

  useEffect(() => {
    engine?.setHover(hover);
  }, [engine, hover]);

  useEffect(() => {
    engine?.setAnchor(anchor);
  }, [engine, anchor]);

  useEffect(() => {
    selRef.current = selected;
    blockEsc.current = filterOpen;
  });

  // Selection: dim, fly, draw relations, then fit if anything is out of view (4.8, 4.9).
  useEffect(() => {
    if (!engine || !layout) return;
    const loc = selected ? byId.get(selected) : undefined;
    if (!loc) {
      engine.setFocus(null, null);
      engine.clearRelations();
      if (layout === "mobile") engine.easePadding(padFor(layout, false));
      return;
    }
    const { partners, matches } = relatedOf(loc);
    engine.setFocus(loc.id, new Set([loc.id, ...partners.map((p) => p.id), ...matches.map((p) => p.id)]));
    const pts = [loc, ...partners, ...matches].map(lngLat);
    let live = true;
    void (async () => {
      await engine.flyTo(lngLat(loc), Math.max(engine.zoom(), 14), 1200, padFor(layout, true));
      if (!live) return;
      await engine.drawRelations(loc, partners, matches);
      if (!live) return;
      if (!engine.inView(pts)) await engine.fit(pts, { maxZoom: 15 });
    })();
    return () => {
      live = false;
    };
  }, [engine, selected, layout]);

  // Fit the results after a user filter or search change, when some are out of view.
  useEffect(() => {
    if (!engine || !fitResults.current) return;
    fitResults.current = false;
    if (selRef.current || !results.length) return;
    const pts = results.map(lngLat);
    if (!engine.inView(pts)) void engine.fit(pts, { maxZoom: 14, padding: 40 });
  }, [engine, results]);

  /* ---------- URL ---------- */

  useEffect(() => {
    if (init.unknownChon) {
      toast(toasts.unknownPoint);
      writeParams((p) => p.delete("chon"), "replace");
    }
  }, [init, toast]);

  useEffect(() => {
    writeParams((p) => {
      writeFilters(p, filters);
      if (q) p.set("q", q);
      else p.delete("q");
      if (anchor) p.set("gan", `${anchor.lngLat[1].toFixed(5)},${anchor.lngLat[0].toFixed(5)}`);
      else p.delete("gan");
    }, "replace");
  }, [filters, q, anchor]);

  useEffect(() => {
    const onPop = () => {
      const id = new URLSearchParams(window.location.search).get("chon");
      const next = id && byId.has(id) ? id : null;
      const prev = selRef.current;
      if (prev === next) return;
      if (prev && !next) restoreFocus.current = prev;
      setSelected(next);
      if (next) setSnap("half");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => () => clearTimeout(camTimer.current), []);

  /* ---------- focus ---------- */

  useEffect(() => {
    if (selected && focusHeading.current) {
      focusHeading.current = false;
      headingRef.current?.focus({ preventScroll: true });
    }
    if (!selected && restoreFocus.current) {
      const id = restoreFocus.current;
      restoreFocus.current = null;
      const el =
        (opener.current?.isConnected ? opener.current : null) ??
        document.querySelector<HTMLElement>(`[data-row="${id}"]`) ??
        engine?.pinElement(id) ??
        null;
      opener.current = null;
      el?.focus();
    }
  }, [selected, engine]);

  /* ---------- actions ---------- */

  const select = (id: string, el?: HTMLElement | null) => {
    if (!byId.has(id)) return;
    if (!selected) opener.current = el ?? null;
    focusHeading.current = true;
    setSnap("half");
    if (id === selected) {
      headingRef.current?.focus({ preventScroll: true });
      return;
    }
    setSelected(id);
    writeParams((p) => p.set("chon", id), "push");
  };

  const closeCard = () => {
    if (!selected) return;
    restoreFocus.current = selected;
    setSelected(null);
    writeParams((p) => p.delete("chon"), "push");
  };

  useEffect(() => {
    closeRef.current = closeCard;
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented || !selRef.current || blockEsc.current) return;
      if (document.querySelector("dialog[open], [aria-modal='true']")) return;
      closeRef.current();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const toggleFilter = (key: FilterKey, slug: string) => {
    const on = filters[key].includes(slug);
    setFilters((f) => toggle(f, key, slug));
    if (!on) setAdded((a) => [...a.filter((x) => !(x.key === key && x.slug === slug)), { key, slug }]);
    fitResults.current = true;
  };
  const addFilter = (key: FilterKey, slug: string) => {
    if (!filters[key].includes(slug)) toggleFilter(key, slug);
  };
  const clearFilters = () => {
    setFilters(emptyFilters());
    setAdded([]);
    fitResults.current = true;
  };
  const applyText = (text: string) => {
    setQ(text);
    fitResults.current = true;
  };
  const clearSearch = () => {
    setInput("");
    if (q) {
      setQ("");
      fitResults.current = true;
    }
  };

  const setAnchorFit = (a: Anchor) => {
    setAnchor(a);
    const pool = results.length ? results : locations;
    const near = nearest(a.lngLat, pool, 5);
    void engine?.fit([a.lngLat, ...near.map(lngLat)], { maxZoom: 15 });
  };

  const nearMe = () => {
    const city = { lngLat: CITY_ANCHOR, label: CITY_ANCHOR_LABEL };
    if (!("geolocation" in navigator)) {
      toast(toasts.geoFailed);
      setAnchorFit(city);
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const p: LngLat = [pos.coords.longitude, pos.coords.latitude];
        if (insideMaxBounds(p)) setAnchorFit({ lngLat: p, label: mapPage.yourPosition });
        else {
          toast(toasts.outsideCity);
          setAnchorFit(city);
        }
      },
      () => {
        setLocating(false);
        toast(toasts.geoFailed);
        setAnchorFit(city);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  };

  const pickAddress = (r: GeocodeResult) => {
    setInput("");
    setAnchorFit({ lngLat: [r.lng, r.lat], label: ellipsis(r.label, 36) });
  };

  const openFilters = () => setFilterOpen(true);
  const closeFilters = () => {
    setFilterOpen(false);
    requestAnimationFrame(() => filterBtn.current?.focus());
  };

  const onMoveEnd = (center: LngLat, zoom: number) => {
    camRef.current = { center, zoom };
    clearTimeout(camTimer.current);
    camTimer.current = setTimeout(() => {
      writeParams((p) => {
        p.set("z", zoom.toFixed(2));
        p.set("c", `${center[0].toFixed(5)},${center[1].toFixed(5)}`);
      }, "replace");
    }, 300);
  };

  const initialView = (): EngineOptions["initial"] => {
    if (camRef.current) return camRef.current;
    if (init.cam && !init.chon) return init.cam;
    if (anchor && !selected) {
      const near = nearest(anchor.lngLat, results.length ? results : locations, 5);
      return { bounds: boundsOf([anchor.lngLat, ...near.map(lngLat)]), maxZoom: 14, padding: 48 };
    }
    const pool = results.length ? results : locations;
    return { bounds: boundsOf(pool.map(lngLat)), maxZoom: 13, padding: 40 };
  };

  if (!layout) return <MapPageSkeleton />;

  /* ---------- shared pieces ---------- */

  const search = (floating: boolean, className: string) => (
    <SearchBox
      floating={floating}
      className={className}
      value={input}
      onValueChange={setInput}
      onApplyText={applyText}
      onClear={clearSearch}
      onPickPlace={(id) => {
        setInput("");
        select(id, null);
      }}
      onPickField={(slug) => {
        setInput("");
        addFilter("nganh", slug);
      }}
      onPickArea={(slug) => {
        setInput("");
        addFilter("khu-vuc", slug);
      }}
      onPickAddress={pickAddress}
    />
  );

  const toggles = (
    <div className="grid grid-cols-2 gap-1.5">
      {(
        [
          { slug: typeSlug.school, type: "school", label: mapPage.quickSchools(counts.schools) },
          { slug: typeSlug.internship, type: "internship", label: mapPage.quickSites(counts.sites) },
        ] as const
      ).map((t) => {
        const on = filters.loai.includes(t.slug);
        return (
          <button
            key={t.slug}
            type="button"
            aria-pressed={on}
            onClick={() => toggleFilter("loai", t.slug)}
            className={`inline-flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-full border px-2 text-[13px] font-semibold leading-[18px] tracking-[-0.01em] transition-colors duration-160 lg:min-h-10 ${
              on ? "border-ink bg-ink text-white" : "border-line bg-surface text-ink hover:border-ink-muted/60"
            }`}
          >
            <MiniPin type={t.type} size={14} className="!border" />
            <span className="truncate tabular-nums">{t.label}</span>
          </button>
        );
      })}
    </div>
  );

  const chipRow =
    chips.length > 0 || anchor ? (
      <div className="flex flex-wrap items-center gap-2">
        {chips.map((c) => (
          <button
            key={`${c.key}:${c.slug}`}
            type="button"
            onClick={() => toggleFilter(c.key, c.slug)}
            aria-label={mapPage.removeFilter(c.label)}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-indigo-50 pl-3 pr-2.5 text-[13px] font-medium text-indigo-700 transition-colors duration-160 hover:bg-[#dfdff4] lg:min-h-9"
          >
            {c.label}
            <X size={14} aria-hidden="true" />
          </button>
        ))}
        {chips.length > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="min-h-11 px-1 text-[13px] font-semibold text-ink underline decoration-[1.5px] underline-offset-4 lg:min-h-9"
          >
            {mapPage.clearAll}
          </button>
        )}
        {anchor && (
          <button
            type="button"
            onClick={() => setAnchor(null)}
            aria-label={`${mapPage.nearChip(anchor.label)}. ${mapPage.clearAnchor}`}
            className="inline-flex min-h-11 max-w-full items-center gap-1.5 rounded-full border border-ink/15 bg-paper pl-3 pr-2.5 text-[13px] font-medium text-ink transition-colors duration-160 hover:border-ink-muted/60 lg:min-h-9"
          >
            <Crosshair size={14} aria-hidden="true" className="shrink-0" />
            <span className="truncate">{mapPage.nearChip(anchor.label)}</span>
            <X size={14} aria-hidden="true" className="shrink-0" />
          </button>
        )}
      </div>
    ) : null;

  const count = (
    <p aria-live="polite" className="text-[13px] font-semibold leading-5 text-ink tabular-nums">
      {mapPage.results(results.length)}
    </p>
  );

  const listBody = emptyKind ? (
    <EmptyResults
      kind={emptyKind}
      q={q}
      lastAdded={lastAdded}
      onClearSearch={clearSearch}
      onClearFilters={clearFilters}
      onRemove={(k, s) => toggleFilter(k as FilterKey, s)}
    />
  ) : (
    <ResultList
      sites={groups.sites}
      schools={groups.schools}
      anchor={anchorLL}
      hoverId={hover}
      onSelect={(id, el) => select(id, el)}
      onHover={setHover}
    />
  );

  const legend = (
    <div className="flex flex-col gap-2 text-[12px] leading-4 text-ink-muted">
      <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="inline-flex items-center gap-1.5">
          <MiniPin type="school" size={16} />
          {mapPage.groupSchools(stats.schools).replace(/ \(.*\)$/, "")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MiniPin type="internship" size={16} />
          {mapPage.groupSites(stats.sites).replace(/ \(.*\)$/, "")}
        </span>
      </p>
      <p>{mapPage.legendNote}</p>
    </div>
  );

  const card = selectedLoc ? (
    <DetailCard
      loc={selectedLoc}
      filters={filters}
      headingRef={headingRef}
      onBack={closeCard}
      onSelect={(id, el) => select(id, el)}
      onHover={setHover}
    />
  ) : null;

  const filterSurface = (
    <AnimatePresence>
      {filterOpen && (
        <FilterSurface
          variant={layout}
          filters={filters}
          q={q}
          resultCount={results.length}
          onToggle={toggleFilter}
          onClear={clearFilters}
          onClose={closeFilters}
        />
      )}
    </AnimatePresence>
  );

  const mapArea = (
    <div className="absolute inset-0">
      {!failure && (
        <MapView
          key={`${layout}-${mapKey}`}
          mode="page"
          layout={layout}
          reduced={reduced}
          padding={padFor(layout, false)}
          initial={initialView}
          onEngine={(e) => {
            setEngine(e);
            if (!e) setMapReady(false);
          }}
          onFailure={setFailure}
          onLoad={() => setMapReady(true)}
          onSelect={(id, el) => select(id, el)}
          onHover={setHover}
          onBackgroundClick={closeCard}
          onMoveEnd={onMoveEnd}
        />
      )}
      {!mapReady && !failure && <MapLoading offsetLeft />}
      {failure && (
        <div className="absolute inset-0 grid place-items-center bg-[#EFEFF4] px-6 pb-[148px] pt-[72px] lg:pb-0 lg:pl-[432px] lg:pt-0">
          <div role="alert" className="flex max-w-[360px] flex-col items-center gap-3 text-center">
            <WarningCircle size={40} className="text-ink-muted" aria-hidden="true" />
            <h2 className="text-[16px] font-semibold leading-6 text-ink">
              {failure === "webgl" ? mapStates.noWebglTitle : mapStates.errorTitle}
            </h2>
            <p className="text-[14px] leading-[22px] text-ink-muted">
              {failure === "webgl" ? mapStates.noWebglBody : mapStates.errorBody}
            </p>
            {failure === "error" && (
              <button
                type="button"
                className={btn("secondary", "sm", "mt-1")}
                onClick={() => {
                  setFailure(null);
                  setMapKey((k) => k + 1);
                }}
              >
                {mapStates.retry}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const nearMeLabel = locating ? mapPage.locating : mapPage.nearMe;

  /* ---------- desktop ---------- */

  if (layout === "desktop") {
    return (
      <>
        {mapArea}
        <div className="absolute bottom-4 left-4 top-4 z-10 flex w-[400px] flex-col overflow-hidden rounded-[20px] bg-surface shadow-[var(--shadow-2)]">
          <div
            key={selected ?? "list"}
            inert={filterOpen}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
          >
            {card ? (
              <>
                <h1 className="sr-only">{mapPage.title}</h1>
                {card}
              </>
            ) : (
              <>
                <div className="flex flex-col gap-3 px-5 pt-6">
                  <div>
                    <h1 className="font-display text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-ink">
                      {mapPage.title}
                    </h1>
                  </div>
                  {search(false, "mt-1")}
                  {toggles}
                  <div className="flex items-center justify-between gap-3">
                    <button
                      ref={filterBtn}
                      type="button"
                      onClick={openFilters}
                      aria-expanded={filterOpen}
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-full border-[1.5px] border-ink px-3.5 text-[13px] font-semibold text-ink transition-colors duration-160 hover:bg-ink hover:text-white"
                    >
                      <Faders size={16} aria-hidden="true" />
                      {mapPage.filterButton(groupCount)}
                    </button>
                    <button
                      type="button"
                      onClick={nearMe}
                      disabled={locating}
                      aria-busy={locating || undefined}
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-2 text-[13px] font-semibold text-indigo-700 decoration-[1.5px] underline-offset-4 hover:underline disabled:opacity-70"
                    >
                      <Crosshair size={16} aria-hidden="true" />
                      {nearMeLabel}
                    </button>
                  </div>
                  {chipRow}
                  <div className="mt-1">{count}</div>
                </div>
                <div className="px-3 pb-2 pt-2">{listBody}</div>
                <div className="px-5 pb-6 pt-2">{legend}</div>
              </>
            )}
          </div>
          {filterSurface}
        </div>
      </>
    );
  }

  /* ---------- mobile ---------- */

  return (
    <>
      {mapArea}
      <h1 className="sr-only">{mapPage.title}</h1>
      <div className="absolute inset-x-3 top-3 z-30 flex items-start gap-2">
        {search(true, "min-w-0 flex-1")}
        <button
          ref={filterBtn}
          type="button"
          onClick={openFilters}
          aria-expanded={filterOpen}
          aria-label={mapPage.filterButton(groupCount)}
          className="relative grid size-12 shrink-0 place-items-center rounded-full bg-surface text-ink shadow-[var(--shadow-2)]"
        >
          <Faders size={20} aria-hidden="true" />
          {groupCount > 0 && (
            <span
              aria-hidden="true"
              className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-indigo-600 px-1 text-[11px] font-bold leading-none text-white tabular-nums"
            >
              {groupCount}
            </span>
          )}
        </button>
      </div>
      <MobileSheet
        snap={snap}
        onSnap={setSnap}
        reduced={reduced}
        fab={
          <button
            type="button"
            onClick={nearMe}
            disabled={locating}
            aria-label={nearMeLabel}
            aria-busy={locating || undefined}
            className="grid size-12 place-items-center rounded-full bg-surface text-ink shadow-[var(--shadow-2)] disabled:opacity-70"
          >
            <Crosshair size={22} aria-hidden="true" />
          </button>
        }
        header={
          card ? null : (
            <div className="flex flex-col gap-2 px-4 pb-3">
              {count}
              {toggles}
            </div>
          )
        }
      >
        {card ?? (
          <div className="flex flex-col gap-3 pb-6">
            {chipRow && <div className="px-4">{chipRow}</div>}
            <div className="px-1">{listBody}</div>
            <div className="px-4 pt-2">{legend}</div>
          </div>
        )}
      </MobileSheet>
      {filterSurface}
    </>
  );
}
