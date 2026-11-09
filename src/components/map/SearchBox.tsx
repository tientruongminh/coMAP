"use client";

import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { Location } from "@/lib/locations";
import { areaLong } from "@/lib/locations";
import { searchAreas, searchFields, searchLocations, type GeocodeResult } from "@/lib/map-search";
import { mapPage, searchGroups } from "@/content/map";
import { MiniPin } from "./pinGlyphs";

type Option =
  | { kind: "place"; key: string; loc: Location }
  | { kind: "field"; key: string; label: string; slug: string }
  | { kind: "area"; key: string; label: string; slug: string }
  | { kind: "address"; key: string; r: GeocodeResult };

type GeoState = { status: "idle" | "loading" | "done" | "error"; q: string; results: GeocodeResult[] };

export interface SearchBoxProps {
  value: string;
  onValueChange: (v: string) => void;
  onApplyText: (q: string) => void;
  onClear: () => void;
  onPickPlace: (id: string) => void;
  onPickField: (slug: string) => void;
  onPickArea: (slug: string) => void;
  onPickAddress: (r: GeocodeResult) => void;
  className?: string;
  /** shadow for the floating mobile bar */
  floating?: boolean;
}

/**
 * Search with typeahead (spec 4.5): a combobox over a grouped listbox.
 * Địa điểm, Chuyên ngành, Khu vực, then Địa chỉ from /api/geocode (≥3 chars, 350ms debounce).
 */
export function SearchBox(props: SearchBoxProps) {
  const { value, onValueChange } = props;
  const uid = useId();
  const inputId = `${uid}-q`;
  const listId = `${uid}-list`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [geo, setGeo] = useState<GeoState>({ status: "idle", q: "", results: [] });
  const inputRef = useRef<HTMLInputElement>(null);

  const query = value.trim();

  const places = useMemo(() => (query ? searchLocations(query, 5) : []), [query]);
  const fields = useMemo(() => (query ? searchFields(query) : []), [query]);
  const areas = useMemo(() => (query ? searchAreas(query) : []), [query]);
  const wantsAddress = query.length >= 3;

  useEffect(() => {
    if (!wantsAddress) return;
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setGeo({ status: "loading", q: query, results: [] });
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`, { signal: ctrl.signal });
        if (!res.ok) throw new Error("geocode");
        const body = (await res.json()) as GeocodeResult[];
        setGeo({ status: "done", q: query, results: Array.isArray(body) ? body.slice(0, 3) : [] });
      } catch {
        if (!ctrl.signal.aborted) setGeo({ status: "error", q: query, results: [] });
      }
    }, 350);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query, wantsAddress]);

  const geoForQuery = geo.q === query ? geo : { status: "loading" as const, q: query, results: [] };
  const addresses = wantsAddress && geoForQuery.status === "done" ? geoForQuery.results : [];

  const options: Option[] = [
    ...places.map((loc) => ({ kind: "place" as const, key: `p-${loc.id}`, loc })),
    ...fields.map((f) => ({ kind: "field" as const, key: `f-${f.slug}`, label: f.label, slug: f.slug })),
    ...areas.map((a) => ({ kind: "area" as const, key: `a-${a.slug}`, label: a.label, slug: a.slug })),
    ...addresses.map((r, i) => ({ kind: "address" as const, key: `g-${i}`, r })),
  ];

  const addressNote =
    wantsAddress && (geoForQuery.status === "loading" || geoForQuery.status === "idle")
      ? searchGroups.addressLoading
      : wantsAddress && geoForQuery.status === "error"
        ? searchGroups.addressFailed
        : null;

  const showList = open && query.length > 0 && (options.length > 0 || addressNote !== null);
  const activeIndex = active < options.length ? active : -1;
  const optId = (i: number) => `${uid}-opt-${i}`;

  const close = () => {
    setOpen(false);
    setActive(-1);
  };

  const pick = (o: Option) => {
    close();
    if (o.kind === "place") props.onPickPlace(o.loc.id);
    else if (o.kind === "field") props.onPickField(o.slug);
    else if (o.kind === "area") props.onPickArea(o.slug);
    else props.onPickAddress(o.r);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (options.length ? (i + 1) % options.length : -1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (options.length ? (i <= 0 ? options.length - 1 : i - 1) : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (showList && activeIndex >= 0) pick(options[activeIndex]);
      else {
        close();
        props.onApplyText(query);
      }
    } else if (e.key === "Escape") {
      if (showList) {
        e.preventDefault();
        e.stopPropagation();
        close();
      }
    }
  };

  const indexOf = new Map(options.map((o, i) => [o.key, i]));
  const renderGroup = (label: string, items: Option[], render: (o: Option) => React.ReactNode, note?: string | null) => {
    if (!items.length && !note) return null;
    const hid = `${uid}-g-${label}`;
    return (
      <li role="presentation" className="py-1">
        <p id={hid} className="px-4 pb-1 pt-2 text-[12px] font-semibold leading-4 text-ink-muted">
          {label}
        </p>
        <ul role="group" aria-labelledby={hid}>
          {items.map((o) => {
            const i = indexOf.get(o.key) ?? -1;
            return (
              <li
                key={o.key}
                id={optId(i)}
                role="option"
                aria-selected={i === activeIndex}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(o)}
                className={`mx-2 flex min-h-11 cursor-pointer items-center gap-3 rounded-[12px] px-2 py-2 text-[14px] leading-5 ${
                  i === activeIndex ? "bg-indigo-50" : ""
                }`}
              >
                {render(o)}
              </li>
            );
          })}
          {note && (
            <li
              role="option"
              aria-disabled="true"
              aria-selected={false}
              className="mx-2 px-2 py-2 text-[13px] leading-[18px] text-ink-muted"
            >
              {note}
            </li>
          )}
        </ul>
      </li>
    );
  };

  return (
    <div className={`relative ${props.className ?? ""}`}>
      <label htmlFor={inputId} className="sr-only">
        {mapPage.searchLabel}
      </label>
      <MagnifyingGlass
        size={20}
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
      />
      <input
        ref={inputRef}
        id={inputId}
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={showList && activeIndex >= 0 ? optId(activeIndex) : undefined}
        autoComplete="off"
        enterKeyHint="search"
        spellCheck={false}
        placeholder={mapPage.searchPlaceholder}
        value={value}
        onChange={(e) => {
          onValueChange(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onBlur={close}
        onKeyDown={onKeyDown}
        className={`h-12 w-full rounded-full border border-line bg-surface pl-11 pr-12 placeholder-shown:pr-4 text-[15px] leading-6 text-ink placeholder:text-ink-muted/90 transition-[border-color] duration-160 hover:border-ink-muted/60 focus:border-indigo-600 ${
          props.floating ? "shadow-[var(--shadow-2)]" : ""
        }`}
      />
      {value && (
        <button
          type="button"
          aria-label={mapPage.clearSearch}
          onClick={() => {
            props.onClear();
            close();
            inputRef.current?.focus();
          }}
          className="absolute right-1.5 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-ink-muted transition-colors duration-160 hover:bg-paper hover:text-ink"
        >
          <X size={18} aria-hidden="true" />
        </button>
      )}
      <ul
        id={listId}
        role="listbox"
        aria-label={mapPage.searchLabel}
        hidden={!showList}
        className="absolute inset-x-0 top-[calc(100%+8px)] z-30 max-h-[min(420px,60dvh)] overflow-y-auto rounded-[20px] border border-line bg-surface py-1 shadow-[var(--shadow-2)]"
      >
        {showList && (
          <>
            {renderGroup(searchGroups.places, options.filter((o) => o.kind === "place"), (o) =>
              o.kind === "place" ? (
                <>
                  <MiniPin type={o.loc.type} size={22} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{o.loc.name}</span>
                    <span className="block truncate text-[12px] leading-4 text-ink-muted">
                      {mapPage.rowMeta(o.loc.ward, areaLong(o.loc.area))}
                    </span>
                  </span>
                </>
              ) : null,
            )}
            {renderGroup(searchGroups.fields, options.filter((o) => o.kind === "field"), (o) =>
              o.kind === "field" ? <span className="min-w-0 flex-1 truncate">{o.label}</span> : null,
            )}
            {renderGroup(searchGroups.areas, options.filter((o) => o.kind === "area"), (o) =>
              o.kind === "area" ? <span className="min-w-0 flex-1 truncate">{areaLong(o.label)}</span> : null,
            )}
            {renderGroup(
              searchGroups.addresses,
              options.filter((o) => o.kind === "address"),
              (o) => (o.kind === "address" ? <span className="min-w-0 flex-1">{o.r.label}</span> : null),
              addresses.length ? null : addressNote,
            )}
          </>
        )}
      </ul>
    </div>
  );
}
