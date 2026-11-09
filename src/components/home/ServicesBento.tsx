import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import {
  ArrowRight,
  ArrowsLeftRight,
  ChalkboardTeacher,
  ChartLineUp,
  Check,
  Eye,
  IdentificationCard,
  MagnifyingGlass,
  Signature,
  Student,
  Tag,
} from "@phosphor-icons/react/ssr";
import { Reveal, RevealItem, RevealList } from "@/components/ui/Reveal";
import { services, type Audience } from "@/content/home";
import { Armed } from "./Armed";
import v from "./services.module.css";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

function AudienceChip({ children, tone = "light" }: { children: Audience; tone?: "light" | "dark" }) {
  return (
    <span
      className={`inline-flex h-7 w-fit items-center rounded-full px-3 text-[13px] font-semibold leading-none ${
        tone === "dark" ? "bg-lime-400 text-ink" : "bg-indigo-50 text-indigo-700"
      }`}
    >
      {children}
    </span>
  );
}

/** Whole-tile link (stretched over the nearest `relative` box), shown as an arrow button. */
function TileLink({ href, full, tone = "light" }: { href: string; full: string; tone?: "light" | "dark" }) {
  return (
    <Link
      href={href}
      aria-label={`${services.linkLabel}: ${full}`}
      className={`group/link grid size-10 shrink-0 place-items-center rounded-full outline-none transition-colors duration-160 after:absolute after:inset-0 after:rounded-[20px] after:content-[''] focus-visible:after:outline focus-visible:after:outline-[3px] focus-visible:after:outline-offset-2 focus-visible:after:outline-indigo-600 ${
        tone === "dark" ? "bg-lime-400 text-ink" : "bg-ink text-white"
      }`}
    >
      <ArrowRight
        size={18}
        weight="bold"
        aria-hidden="true"
        className="transition-transform duration-160 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/tile:translate-x-[3px]"
      />
    </Link>
  );
}

function TileHead({ children, link }: { children?: ReactNode; link: ReactNode }) {
  return <div className="flex min-h-10 items-start justify-between gap-4">{children ?? <span />}{link}</div>;
}

const STOP_ICONS = [MagnifyingGlass, ArrowsLeftRight, Signature, Eye, ChartLineUp];

/** Cell A: the semester plan as a route, school (lime) to site (indigo); step names on hover or focus. */
function MiniRoute({ ticks, label }: { ticks: string[]; label: string }) {
  return (
    <Armed className={`${v.root} relative mt-8 lg:mt-auto lg:pt-8`}>
      <span aria-hidden="true" className={`${v.line} absolute left-5 right-5 top-5 h-[3px] rounded-full bg-[linear-gradient(90deg,#A6CE39,#3330A8)] lg:top-[52px]`} />
      <ol aria-label={label} className="relative flex justify-between">
        {ticks.map((t, n) => {
          const Icon = STOP_ICONS[n];
          const first = n === 0;
          const last = n === ticks.length - 1;
          return (
            <li key={t} className="flex w-10 flex-col items-center">
              <span
                aria-hidden="true"
                className={`${v.stop} grid size-10 place-items-center shadow-[0_0_0_4px_var(--color-surface)] ${
                  first
                    ? "rounded-[12px] bg-lime-400 text-ink"
                    : last
                      ? "rounded-full bg-indigo-600 text-white"
                      : "rounded-full border-2 border-ink bg-surface text-ink"
                }`}
                style={i(n)}
              >
                <Icon size={18} weight="bold" />
              </span>
              <span className="mt-2.5 whitespace-nowrap text-[12px] font-semibold leading-4 text-ink-muted opacity-0 transition-opacity duration-200 group-hover/tile:opacity-100 group-focus-within/tile:opacity-100 sm:text-[13px]">
                {t}
              </span>
            </li>
          );
        })}
      </ol>
    </Armed>
  );
}

/** Cell B: a static map crop (SVG, no MapLibre); the 5 km ring opens, three sites drop in. */
function MapCrop({ ring }: { ring: string }) {
  const pins = [
    { left: "34%", top: "34%" },
    { left: "62%", top: "56%" },
    { left: "44%", top: "70%" },
  ];
  return (
    <Armed className={`${v.root} relative mt-6 h-[220px] overflow-hidden rounded-[14px] bg-[#EFEFF4] lg:h-auto lg:min-h-[240px] lg:flex-1`}>
      <svg aria-hidden="true" className="absolute inset-0 size-full" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="260" fill="#EFEFF4" />
        <path d="M0 40 L120 0 H400 V30 L250 80 L170 60 Z" fill="#ECECF2" />
        <path d="M290 190 l60 -20 l50 30 v60 h-120 z" fill="#E2ECCB" />
        <path d="M-10 214 C 60 196, 110 238, 180 226 S 300 170, 410 150" fill="none" stroke="#D9DBEF" strokeWidth="22" />
        <g fill="none" strokeLinecap="round">
          <path d="M-10 120 C 90 110, 190 132, 410 96" stroke="#D6D6E2" strokeWidth="9" />
          <path d="M-10 120 C 90 110, 190 132, 410 96" stroke="#fff" strokeWidth="6" />
          <path d="M210 -10 C 200 80, 236 160, 220 270" stroke="#D6D6E2" strokeWidth="9" />
          <path d="M210 -10 C 200 80, 236 160, 220 270" stroke="#fff" strokeWidth="6" />
          <path d="M40 -10 L 110 270 M 320 -10 L 280 270 M -10 60 L 410 40 M -10 176 L 180 168 M 260 200 L 410 214 M 130 30 L 170 250" stroke="#fff" strokeWidth="2.5" />
        </g>
        <circle className={v.ring} cx="200" cy="128" r="92" fill="#A6CE39" fillOpacity=".12" stroke="#4F6B0E" strokeWidth="1.5" strokeDasharray="5 4" />
        <circle cx="200" cy="128" r="6" fill="#1A1946" stroke="#fff" strokeWidth="2.5" />
      </svg>
      {pins.map((p, n) => (
        <span
          key={p.left}
          aria-hidden="true"
          className={`${v.drop} absolute grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-indigo-600 text-white shadow-[0_0_0_2px_#fff,0_2px_8px_rgba(27,26,75,.18)]`}
          style={{ left: p.left, top: p.top, ...i(n) }}
        >
          <ChalkboardTeacher size={15} weight="fill" />
        </span>
      ))}
      <span className="tabular absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-surface py-1 pl-1.5 pr-3 text-[13px] font-semibold leading-5 text-ink shadow-1">
        <span aria-hidden="true" className="size-4 rounded-full border-[1.5px] border-dashed border-lime-700 bg-lime-400/20" />
        {ring}
      </span>
    </Armed>
  );
}

/** Cell C, left: a site and the students around it; the ones in the ring light up and link in. */
function Radar({ label }: { label: string }) {
  const near = [
    { x: 74, y: 34 },
    { x: 150, y: 30 },
    { x: 92, y: 92 },
  ];
  const far = [
    { x: 22, y: 98 },
    { x: 206, y: 84 },
    { x: 196, y: 18 },
  ];
  return (
    <Armed className={`${v.root} relative mt-6 h-[120px]`}>
      <svg role="img" aria-label={label} viewBox="0 0 228 120" className="h-full w-full max-w-[260px]">
        <circle className={v.ring} cx="114" cy="60" r="54" fill="#A6CE39" fillOpacity=".12" stroke="#4F6B0E" strokeWidth="1.5" strokeDasharray="4 4" />
        {near.map((p, n) => (
          <path key={n} className={v.draw} style={i(n)} d={`M ${p.x} ${p.y} L 114 60`} pathLength={1} stroke="#3330A8" strokeWidth="1.5" strokeLinecap="round" />
        ))}
        {far.map((p) => (
          <circle key={`${p.x}`} cx={p.x} cy={p.y} r="5" fill="#1A1946" opacity=".18" />
        ))}
      </svg>
      {near.map((p, n) => (
        <span
          key={n}
          aria-hidden="true"
          className={`${v.drop} absolute grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ink text-white shadow-[0_0_0_2px_#fff]`}
          style={{ left: `${(p.x / 228) * 100}%`, top: `${(p.y / 120) * 100}%`, ...i(n) }}
        >
          <Student size={13} weight="fill" />
        </span>
      ))}
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-indigo-600 text-white shadow-1"
      >
        <ChalkboardTeacher size={16} weight="fill" />
      </span>
    </Armed>
  );
}

/** Cell C, right: a CV with the five vetting checks stamping in. */
function Vetted({ label }: { label: string }) {
  return (
    <Armed className={`${v.root} mt-6 flex h-[120px] items-center gap-4`}>
      <span aria-hidden="true" className="grid size-[72px] shrink-0 place-items-center rounded-[16px] bg-indigo-50 text-indigo-600">
        <IdentificationCard size={40} weight="duotone" />
      </span>
      <ol role="img" aria-label={label} className="flex gap-1.5">
        {[0, 1, 2, 3, 4].map((n) => (
          <li key={n} className={`${v.check} grid size-6 place-items-center rounded-[7px] bg-lime-400 text-ink`} style={i(n)}>
            <Check size={14} weight="bold" aria-hidden="true" />
          </li>
        ))}
      </ol>
    </Armed>
  );
}

const tile = "group/tile relative flex flex-col p-6 xl:p-8";

/**
 * S5 (spec 3.1): one card per audience, each a picture of the package: the
 * plan as a route, the 5 km ring, the students near a site, the vetted CV.
 * Names and an arrow only; the description of each package is read by screen
 * readers and lives on /dich-vu.
 */
export function ServicesBento() {
  const { a, b, c, d } = services.cells;
  return (
    <section aria-labelledby="dich-vu" className="container-cm py-12 lg:py-16">
      <Reveal className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 id="dich-vu" className="t-h2 max-w-[16ch] lg:max-w-none">
            {services.title}
          </h2>
          <p className="sr-only">{services.titleSr}</p>
        </div>
        <p className="flex h-11 w-fit shrink-0 items-center gap-2.5 rounded-full bg-indigo-50 pl-1.5 pr-4 text-[15px] font-semibold leading-6 text-ink">
          <span className="grid size-8 place-items-center rounded-full bg-lime-400" aria-hidden="true">
            <Tag size={16} weight="bold" />
          </span>
          {services.offer}
          <span className="sr-only">. {services.offerSr}</span>
        </p>
      </Reveal>

      <RevealList className="mt-8 grid grid-cols-1 gap-4 lg:mt-10 lg:grid-cols-12">
        <RevealItem className="lg:col-span-7">
          <article className={`${tile} h-full rounded-[20px] bg-surface shadow-1`}>
            <TileHead link={<TileLink href={a.href} full={a.full} />}>
              <AudienceChip>{a.audience}</AudienceChip>
            </TileHead>
            <h3 className="t-h3 mt-4">{a.title}</h3>
            <p className="sr-only">{a.sr}</p>
            <MiniRoute ticks={a.ticks} label={a.ticksSr} />
          </article>
        </RevealItem>

        <RevealItem className="lg:col-span-5 lg:row-span-2">
          <article className={`${tile} h-full rounded-[20px] bg-indigo-700 text-white shadow-1`}>
            <TileHead link={<TileLink href={b.href} full={b.full} tone="dark" />}>
              <AudienceChip tone="dark">{b.audience}</AudienceChip>
            </TileHead>
            <h3 className="t-h3 mt-4">{b.title}</h3>
            <p className="sr-only">{b.sr}</p>
            <MapCrop ring={b.ring} />
          </article>
        </RevealItem>

        <RevealItem className="lg:col-span-7">
          <div className="rounded-[20px] bg-surface shadow-1">
            <div className="px-6 pt-6 xl:px-8 xl:pt-8">
              <AudienceChip>{c.audience}</AudienceChip>
            </div>
            <div className="grid sm:grid-cols-2">
              <article className={`${tile} pt-4 xl:pt-4`}>
                <TileHead link={<TileLink href={c.href} full={c.full} />}>
                  <h3 className="t-h3">{c.title}</h3>
                </TileHead>
                <p className="sr-only">{c.sr}</p>
                <Radar label={c.nearSr} />
              </article>
              <article className={`${tile} border-t border-line pt-6 sm:border-l sm:border-t-0 sm:pt-4 xl:pt-4`}>
                <TileHead link={<TileLink href={d.href} full={d.full} />}>
                  <h3 className="t-h3">{d.title}</h3>
                </TileHead>
                <p className="sr-only">{d.sr}</p>
                <Vetted label={d.stepsSr} />
              </article>
            </div>
          </div>
        </RevealItem>
      </RevealList>
    </section>
  );
}
