"use client";

import { ArrowRight, ChalkboardTeacher, Crosshair, GraduationCap, Student, X } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { byId, internshipSites, locations, type Location } from "@/lib/locations";
import { formatDistance, formatNumber } from "@/lib/format";
import { CITY_ANCHOR, CITY_ANCHOR_LABEL, toasts } from "@/content/site";
import { typeLabel } from "@/content/taxonomy";
import { heroCopy, mapPage } from "@/content/map";
import { heroMap as copy } from "@/content/home";
import { boundsOf, distanceFrom, fieldMatchesOf, lngLat, nearest, partnersOf, type LngLat } from "@/lib/map-relations";
import { useToast } from "@/components/ui/Toast";
import { insideMaxBounds, type MapEngine } from "./engine";
import type { MapFailure } from "./MapView";
import { HCM_OUTLINE } from "./hcmOutline";
import { MiniPin } from "./pinGlyphs";
import { useMedia } from "./useMedia";

const MapView = dynamic(() => import("./MapView"), { ssr: false, loading: () => null });

type Role = "student" | "school" | "business";
const ROLES: Role[] = ["student", "school", "business"];
const ROLE_ICON = { student: Student, school: GraduationCap, business: ChalkboardTeacher } as const;
const SCHOOL_ID = "ussh-giaoduc";
const SITE_ID = "hipo";
const RING_KM = 5;
/** Pins drop in 40ms apart over 300ms (spec 4.12); the first role move waits for them. */
const INTRO_MS = locations.length * 40 + 300;
const EASE = [0.22, 1, 0.36, 1] as const;

/*
 * Map padding = the area the overlays cover, so every camera move (the 5 km
 * ring, the partner lines) lands in the clear part of the plate:
 * role switch on top (8 + 48), caption card at the bottom (8 + 72).
 */
const DESKTOP_PAD = { top: 72, right: 24, bottom: 112, left: 24 };
const MOBILE_PAD = { top: 64, right: 10, bottom: 88, left: 10 };
/** Extra padding per camera move, on top of the map padding above. */
const FIT_PAD = { desktop: { ring: 16, rel: 48 }, mobile: { ring: 4, rel: 24 } };

interface Anchor {
  lngLat: LngLat;
  label: string;
  isUser: boolean;
}
const CITY: Anchor = { lngLat: CITY_ANCHOR, label: CITY_ANCHOR_LABEL, isUser: false };

interface Popover {
  id: string;
  x: number;
  y: number;
  below: boolean;
  /** Plate width, to keep the popover inside it. */
  w: number;
  pin: HTMLElement;
}

const short = (l: Location) => l.short ?? l.name;

/** The corners of the box around a ring of `km` around `c`, for fitBounds. */
function ringBox(c: LngLat, km: number): LngLat[] {
  const dLat = km / 110.574;
  const dLng = km / (111.32 * Math.cos((c[1] * Math.PI) / 180));
  return [
    [c[0] - dLng, c[1] - dLat],
    [c[0] + dLng, c[1] + dLat],
  ];
}

/** The three role views, computed once from the data. */
function roleData(anchor: Anchor) {
  const school = byId.get(SCHOOL_ID)!;
  const site = byId.get(SITE_ID)!;
  const schoolPartners = partnersOf(school);
  const sitePartners = partnersOf(site);
  const siteMatches = fieldMatchesOf(site, 8);
  const inRing = internshipSites
    .map((s) => ({ s, d: distanceFrom(anchor.lngLat, s) }))
    .filter((x) => x.d <= RING_KM)
    .sort((a, b) => a.d - b.d);
  return {
    student: {
      inRing,
      nearest3: nearest(anchor.lngLat, internshipSites, 3),
      href: `/ban-do?gan=${anchor.lngLat[1].toFixed(5)},${anchor.lngLat[0].toFixed(5)}`,
    },
    school: {
      loc: school,
      partners: schoolPartners,
      matches: [] as Location[],
      href: `/ban-do?chon=${school.id}`,
    },
    business: {
      loc: site,
      partners: sitePartners,
      matches: siteMatches,
      href: `/ban-do?chon=${site.id}`,
    },
  };
}

/** A short sample of the relation lines the map draws: solid = partner, dashed = same field. */
function LineGlyph({ dashed = false }: { dashed?: boolean }) {
  return (
    <svg width="18" height="6" viewBox="0 0 18 6" aria-hidden="true" className="shrink-0">
      {dashed ? (
        <path d="M1 3 H17" stroke="#3330A8" strokeOpacity=".7" strokeWidth="1.5" strokeDasharray="3 2.5" />
      ) : (
        <>
          <defs>
            <linearGradient id="cm-hero-line" x1="0" x2="1">
              <stop offset="0" stopColor="#A6CE39" />
              <stop offset="1" stopColor="#3330A8" />
            </linearGradient>
          </defs>
          <path d="M1 3 H17" stroke="url(#cm-hero-line)" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

/** Big tabular number with a short label, the caption's only text. */
function Count({ n, children }: { n: number; children: ReactNode }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span
        className="tabular font-display text-[28px] leading-8 tracking-[-0.02em] text-ink"
        style={{ fontVariationSettings: '"wdth" 112', fontWeight: 700 }}
      >
        {formatNumber(n)}
      </span>
      <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold leading-4 text-ink">{children}</span>
    </span>
  );
}

/**
 * Wordless distance ruler: the anchor on the left, the 5 km ring edge on the
 * right, one dot per site inside the ring at its real distance. The three
 * nearest are full pins. Names and distances are in the sr-only list.
 */
function Ruler({ items, nearestIds, k }: { items: { s: Location; d: number }[]; nearestIds: Set<string>; k: string }) {
  return (
    <span aria-hidden="true" className="relative mt-1 block h-4">
      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line" />
      <span className="absolute left-0 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-ink" />
      <span className="absolute right-0 top-1/2 h-3 w-0 -translate-y-1/2 border-l-[1.5px] border-dashed border-lime-700" />
      {items.map(({ s, d }, i) => {
        const big = nearestIds.has(s.id);
        return (
          <motion.span
            key={`${k}-${s.id}`}
            data-reveal=""
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.15 + i * 0.05 }}
            className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${
              big ? "z-10 size-3 border-2 border-surface bg-indigo-600" : "size-1.5 bg-indigo-600/45"
            }`}
            style={{ left: `${Math.min(100, (d / RING_KM) * 100)}%` }}
          />
        );
      })}
    </span>
  );
}

/**
 * The live matching map inside the home hero plate (spec 3.1 S1, 4.12).
 * Contract: default export, no props, fills its positioned parent.
 */
export default function HeroMap() {
  const desktop = useMedia("(min-width: 1024px)");
  const layout = desktop === false ? "mobile" : "desktop";
  const reduced = !!useReducedMotion();
  const toast = useToast();
  const uid = useId();

  const root = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const introDone = useRef(false);

  const [engine, setEngine] = useState<MapEngine | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [failure, setFailure] = useState<MapFailure | null>(null);
  const [role, setRole] = useState<Role>("student");
  const [auto, setAuto] = useState(true);
  const [step, setStep] = useState(0);
  const [dwell, setDwell] = useState<Role | null>(null);
  const [inView, setInView] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [anchor, setAnchor] = useState<Anchor>(CITY);
  const [locating, setLocating] = useState(false);
  const [pop, setPop] = useState<Popover | null>(null);

  const data = useMemo(() => roleData(anchor), [anchor]);
  const cycling = auto && !reduced;

  /* ---------- pause while out of view or the tab is hidden ---------- */

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    const onVis = () => setHidden(document.visibilityState === "hidden");
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  /* ---------- role views ---------- */

  useEffect(() => {
    if (!engine || !loaded) return;
    let live = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const settle = () => {
      if (live) setDwell(role);
    };
    const pad = FIT_PAD[layout];

    engine.clearRelations();
    if (role === "student") {
      const v = data.student;
      engine.setRing(anchor.lngLat, RING_KM);
      engine.setAnchor({ lngLat: anchor.lngLat, label: anchor.label });
      engine.setFocus(null, new Set(v.inRing.map((x) => x.s.id)));
      // Fit the whole ring between the overlays, whatever the plate width.
      const move = () => {
        introDone.current = true;
        if (!live) return;
        void engine
          .fit(ringBox(anchor.lngLat, RING_KM), { padding: pad.ring, maxZoom: 13.5, duration: 2200 })
          .then(settle);
      };
      if (!introDone.current && !reduced) timers.push(setTimeout(move, INTRO_MS));
      else move();
    } else {
      const v = data[role];
      engine.setRing(null);
      engine.setAnchor(null);
      engine.setFocus(v.loc.id, new Set([v.loc.id, ...v.partners.map((p) => p.id), ...v.matches.map((p) => p.id)]));
      const pts = [v.loc, ...v.partners, ...v.matches].map(lngLat);
      void (async () => {
        await engine.fit(pts, { padding: pad.rel, maxZoom: 13, duration: 2200 });
        if (!live) return;
        settle();
        await engine.drawRelations(v.loc, v.partners, v.matches);
      })();
    }
    return () => {
      live = false;
      timers.forEach(clearTimeout);
    };
  }, [engine, loaded, role, anchor, data, reduced, layout]);

  /* ---------- auto-cycle ---------- */

  const stopCycle = () => {
    if (auto) setAuto(false);
  };

  const advance = () => {
    if (!cycling) return;
    const next = step + 1;
    setStep(next);
    setRole(ROLES[next % ROLES.length]);
    if (next >= ROLES.length) setAuto(false);
  };

  const pickRole = (r: Role) => {
    setAuto(false);
    setPop(null);
    setRole(r);
  };

  /* ---------- popover ---------- */

  const openPopover = (id: string, pin: HTMLElement) => {
    setAuto(false);
    const box = root.current?.getBoundingClientRect();
    const r = pin.getBoundingClientRect();
    if (!box) return;
    const x = r.left + r.width / 2 - box.left;
    const yTop = r.top - box.top;
    const below = yTop < 180;
    setPop({ id, x, y: below ? r.bottom - box.top + 10 : yTop - 10, below, w: box.width, pin });
  };

  const closePopover = (restore: boolean) => {
    const p = pop;
    setPop(null);
    if (restore && p?.pin.isConnected) p.pin.focus();
  };

  useEffect(() => {
    if (pop) popRef.current?.focus({ preventScroll: true });
  }, [pop]);

  const onPopKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      closePopover(true);
    }
  };

  /* ---------- near me ---------- */

  const nearMe = () => {
    setAuto(false);
    setPop(null);
    if (!("geolocation" in navigator)) {
      toast(toasts.geoFailed);
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const p: LngLat = [pos.coords.longitude, pos.coords.latitude];
        if (insideMaxBounds(p)) setAnchor({ lngLat: p, label: mapPage.yourPosition, isUser: true });
        else {
          toast(toasts.outsideCity);
          setAnchor(CITY);
        }
      },
      () => {
        setLocating(false);
        toast(toasts.geoFailed);
        setAnchor(CITY);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  };

  /* ---------- render ---------- */

  const view = role === "student" ? data.student : data[role];
  const popLoc = pop ? byId.get(pop.id) : undefined;
  const showProgress = cycling && dwell === role;
  const paused = !inView || hidden;
  const nearestIds = new Set(data.student.nearest3.map((s) => s.id));
  const anchorKey = `${anchor.lngLat[0]},${anchor.lngLat[1]}`;
  const iconBtn =
    "grid size-9 shrink-0 place-items-center rounded-full transition-colors duration-160 disabled:opacity-60";

  return (
    <div
      ref={root}
      className="absolute inset-0 overflow-hidden rounded-[inherit]"
      onFocus={(e) => {
        if (e.target !== popRef.current) stopCycle();
      }}
    >
      {failure ? (
        <div className="absolute inset-0 grid place-items-center bg-[#EFEFF4]" aria-hidden="true">
          <svg viewBox={`0 0 ${HCM_OUTLINE.width} ${HCM_OUTLINE.height}`} className="h-auto w-[min(260px,56%)]">
            <path d={HCM_OUTLINE.d} fill="none" stroke="#DCDCE6" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      ) : (
        <MapView
          key={layout}
          mode="hero"
          layout={layout}
          reduced={reduced}
          padding={layout === "desktop" ? DESKTOP_PAD : MOBILE_PAD}
          initial={() => ({ bounds: boundsOf(locations.map(lngLat)), maxZoom: 11.6, padding: 48 })}
          onEngine={(e) => {
            setEngine(e);
            if (!e) setLoaded(false);
          }}
          onLoad={() => setLoaded(true)}
          onFailure={setFailure}
          onSelect={openPopover}
          onBackgroundClick={() => setPop(null)}
          onUserGesture={() => {
            setAuto(false);
            setPop(null);
          }}
        />
      )}

      {/* Role switch: icons, the active role spelled out; every role spelled out from lg. */}
      <div
        role="group"
        aria-label={copy.rolesLabel}
        className="absolute left-2 top-2 z-10 flex rounded-full bg-surface p-1 shadow-[var(--shadow-2)] lg:left-auto lg:right-4 lg:top-4"
      >
        {ROLES.map((r) => {
          const on = r === role;
          const Icon = ROLE_ICON[r];
          return (
            <button
              key={r}
              type="button"
              aria-pressed={on}
              onClick={() => pickRole(r)}
              className={`relative inline-flex min-h-10 min-w-10 items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap rounded-full px-2.5 text-[13px] font-semibold leading-[18px] transition-colors duration-160 lg:px-3.5 ${
                on ? "bg-ink pr-3.5 text-white" : "text-ink hover:bg-paper"
              }`}
            >
              <Icon size={18} weight={on ? "fill" : "regular"} aria-hidden="true" />
              <span className={on ? "" : "sr-only lg:not-sr-only"}>{copy.roles[r]}</span>
              {on && showProgress && (
                <span
                  key={`${r}-${step}`}
                  aria-hidden="true"
                  onAnimationEnd={advance}
                  style={{ animationPlayState: paused ? "paused" : "running" }}
                  className="cm-progress absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-lime-400"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend chip, desktop only: on small plates the caption carries the pin glyphs. */}
      <p className="absolute left-4 top-4 z-10 hidden items-center gap-3 rounded-full bg-surface px-3 py-2 text-[12px] font-semibold leading-4 text-ink shadow-[var(--shadow-1)] lg:inline-flex">
        <span className="inline-flex items-center gap-1.5">
          <MiniPin type="school" size={18} />
          {copy.legendSchool}
          <span className="sr-only">{copy.legendSchoolSr}</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MiniPin type="internship" size={18} />
          {copy.legendSite}
          <span className="sr-only">{copy.legendSiteSr}</span>
        </span>
      </p>

      {/* Caption card: one big live number per role, then icon actions. */}
      <div className="absolute inset-x-2 bottom-2 z-10 flex min-h-[72px] items-center gap-3 rounded-[16px] bg-surface py-2.5 pl-4 pr-2.5 shadow-[var(--shadow-2)] lg:bottom-4 lg:left-4 lg:right-auto lg:w-[320px]">
        <div aria-live={auto ? "off" : "polite"} className="min-w-0 flex-1">
          {role === "student" ? (
            <>
              <Count n={data.student.inRing.length}>
                <MiniPin type="internship" size={16} />
                {copy.inRing}
                <span className="sr-only">{copy.aroundSr(anchor.isUser ? copy.yourPosition : anchor.label)}</span>
              </Count>
              <Ruler items={data.student.inRing} nearestIds={nearestIds} k={anchorKey} />
              <h3 id={`${uid}-near`} className="sr-only">
                {copy.rulerSr}
              </h3>
              <ol aria-labelledby={`${uid}-near`} className="sr-only">
                {data.student.nearest3.map((s) => (
                  <li key={s.id}>
                    {short(s)}, {formatDistance(distanceFrom(anchor.lngLat, s))}
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <motion.div
              key={role}
              data-reveal=""
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <span className="flex items-center gap-1.5 text-[12px] font-semibold leading-4 text-ink-muted">
                <MiniPin type={data[role].loc.type} size={16} />
                {short(data[role].loc)}
              </span>
              <span className="mt-0.5 flex flex-wrap items-baseline gap-x-4">
                <Count n={data[role].partners.length}>
                  <LineGlyph />
                  {copy.partners}
                  <span className="sr-only">{copy.solidSr}</span>
                </Count>
                {role === "business" && (
                  <Count n={data.business.matches.length}>
                    <LineGlyph dashed />
                    {copy.sameField}
                    <span className="sr-only">{copy.dashedSr}</span>
                  </Count>
                )}
              </span>
            </motion.div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {role === "student" && (
            <button
              type="button"
              onClick={nearMe}
              disabled={locating}
              aria-busy={locating || undefined}
              aria-label={locating ? copy.locating : copy.nearMe}
              title={copy.nearMe}
              className={`${iconBtn} bg-paper text-ink hover:bg-indigo-50`}
            >
              <Crosshair size={18} aria-hidden="true" className={locating ? "spinner" : undefined} />
            </button>
          )}
          <Link
            href={view.href}
            aria-label={copy.seeOnMap}
            title={copy.seeOnMap}
            className={`${iconBtn} group/go bg-ink text-white hover:bg-indigo-700`}
          >
            <ArrowRight
              size={18}
              weight="bold"
              aria-hidden="true"
              className="transition-transform duration-160 group-hover/go:translate-x-0.5"
            />
          </Link>
        </div>
      </div>

      {/* Pin popover */}
      {pop && popLoc && (
        <div
          ref={popRef}
          role="dialog"
          aria-labelledby={`${uid}-pop`}
          tabIndex={-1}
          onKeyDown={onPopKey}
          className="absolute z-20 w-[260px] rounded-[16px] bg-surface p-4 shadow-[var(--shadow-2)] outline-none"
          style={{
            left: Math.max(12, Math.min(pop.x - 130, pop.w - 272)),
            top: pop.y,
            transform: pop.below ? undefined : "translateY(-100%)",
          }}
        >
          <div className="flex items-start gap-3">
            <MiniPin type={popLoc.type} size={28} />
            <h3 id={`${uid}-pop`} className="min-w-0 flex-1 text-[15px] font-semibold leading-5 text-ink">
              {popLoc.name}
            </h3>
            <button
              type="button"
              aria-label={heroCopy.closePopover}
              onClick={() => closePopover(true)}
              className="-mr-2 -mt-2 grid size-9 shrink-0 place-items-center rounded-full text-ink-muted hover:bg-paper hover:text-ink"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] leading-4">
            <span className="rounded-full bg-paper px-2.5 py-1 font-medium text-ink">{typeLabel[popLoc.type]}</span>
            <span className="text-ink-muted">
              {heroCopy.fromAnchor(formatDistance(distanceFrom(anchor.lngLat, popLoc)))}
            </span>
          </div>
          <Link
            href={`/ban-do?chon=${popLoc.id}`}
            className="mt-3 inline-flex min-h-8 items-center gap-1 text-[13px] font-semibold text-indigo-700 underline decoration-[1.5px] underline-offset-4"
          >
            {heroCopy.seeDetail}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  );
}
