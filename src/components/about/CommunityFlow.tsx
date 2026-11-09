import { SealCheck } from "@phosphor-icons/react/ssr";
import type { CSSProperties, ReactNode } from "react";
import { Draw, Seq, Step } from "./motion";
import { SchoolPin, SitePin, StudentPin } from "./Pins";

/**
 * A5 visual: how a community map is made. Schools, sites and students add
 * data; every route passes through the Co-Map check (the seal lands) before
 * anything reaches the map. Two layouts: a row on desktop, a column on mobile.
 */

type P = readonly [number, number];
const pinFor = [SchoolPin, SitePin, StudentPin];

function MapTile({ style, at }: { style: CSSProperties; at: number }) {
  return (
    <div className="absolute overflow-hidden rounded-[14px] bg-[#EFEFF4] shadow-1" style={style}>
      <svg viewBox="0 0 180 120" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden="true">
        <path d="M -5 84 C 50 70 90 92 185 60" stroke="#FFFFFF" strokeWidth="7" fill="none" />
        <path d="M 62 -5 C 70 40 58 80 74 125" stroke="#FFFFFF" strokeWidth="5" fill="none" />
        <path d="M 120 -5 L 132 125" stroke="#FFFFFF" strokeWidth="4" fill="none" />
      </svg>
      <Step at={at} className="absolute left-[28%] top-[34%] -translate-x-1/2 -translate-y-1/2">
        <SchoolPin size={22} />
      </Step>
      <Step at={at + 0.12} className="absolute left-[72%] top-[30%] -translate-x-1/2 -translate-y-1/2">
        <SitePin size={22} />
      </Step>
      <Step at={at + 0.24} className="absolute left-[52%] top-[70%] -translate-x-1/2 -translate-y-1/2">
        <SitePin size={22} />
      </Step>
    </div>
  );
}

function Check({ style, at }: { style: CSSProperties; at: number }) {
  return (
    <Step
      kind="stamp"
      at={at}
      className="absolute grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-indigo-600 bg-indigo-50 text-indigo-600 lg:size-16"
      style={style}
    >
      <SealCheck size={30} weight="fill" aria-hidden="true" />
    </Step>
  );
}

function Label({ children, className = "", style }: { children: ReactNode; className?: string; style: CSSProperties }) {
  return (
    <span className={`absolute whitespace-nowrap text-[13px] font-semibold leading-[18px] lg:text-[14px] ${className}`} style={style}>
      {children}
    </span>
  );
}

export function CommunityFlow({
  contributors,
  check,
  publish,
  label,
}: {
  contributors: readonly string[];
  check: string;
  publish: string;
  label: string;
}) {
  // Desktop: 720 x 300
  const W = 720;
  const H = 300;
  const d = (p: P): CSSProperties => ({ left: `${(p[0] / W) * 100}%`, top: `${(p[1] / H) * 100}%` });
  const from: P[] = [
    [36, 60],
    [36, 150],
    [36, 240],
  ];
  const hub: P = [392, 150];

  // Mobile: 340 x 470
  const w = 340;
  const h = 470;
  const m = (p: P): CSSProperties => ({ left: `${(p[0] / w) * 100}%`, top: `${(p[1] / h) * 100}%` });
  const top: P[] = [
    [56, 34],
    [170, 34],
    [284, 34],
  ];
  const mhub: P = [170, 222];

  return (
    <>
      <Seq role="img" label={label} amount={0.5} className="relative hidden aspect-[720/300] md:block">
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full" aria-hidden="true">
          {from.map((p, i) => (
            <Draw key={i} d={`M 150 ${p[1]} C 270 ${p[1]} 250 ${hub[1]} 352 ${hub[1]}`} at={0.35 + i * 0.15} dur={0.8} width={2} />
          ))}
          <Draw d={`M 434 ${hub[1]} L 512 ${hub[1]}`} at={1.75} dur={0.4} width={2} stroke="#3330A8" />
        </svg>
        {from.map((p, i) => {
          const Pin = pinFor[i];
          return (
            <span key={i}>
              <Step at={i * 0.1} className="absolute -translate-x-1/2 -translate-y-1/2" style={d(p)}>
                <Pin size={34} />
              </Step>
              <Label className="ml-7 -translate-y-1/2" style={d(p)}>
                {contributors[i]}
              </Label>
            </span>
          );
        })}
        <Check style={d(hub)} at={1.3} />
        <Label className="mt-12 -translate-x-1/2" style={d(hub)}>
          {check}
        </Label>
        <MapTile style={{ left: `${(512 / W) * 100}%`, top: `${(80 / H) * 100}%`, width: `${(196 / W) * 100}%`, height: `${(140 / H) * 100}%` }} at={2.1} />
        <Label className="mt-[86px] -translate-x-1/2" style={d([610, 150])}>
          {publish}
        </Label>
      </Seq>

      <Seq role="img" label={label} amount={0.4} className="relative aspect-[340/470] md:hidden">
        <svg viewBox={`0 0 ${w} ${h}`} className="absolute inset-0 size-full" aria-hidden="true">
          {top.map((p, i) => (
            <Draw key={i} d={`M ${p[0]} 84 C ${p[0]} 150 ${mhub[0]} 130 ${mhub[0]} 190`} at={0.35 + i * 0.15} dur={0.8} width={2.5} />
          ))}
          <Draw d={`M ${mhub[0]} 284 L ${mhub[0]} 318`} at={1.75} dur={0.3} width={2.5} stroke="#3330A8" />
        </svg>
        {top.map((p, i) => {
          const Pin = pinFor[i];
          return (
            <span key={i}>
              <Step at={i * 0.1} className="absolute -translate-x-1/2 -translate-y-1/2" style={m(p)}>
                <Pin size={32} />
              </Step>
              <Label className="mt-6 -translate-x-1/2" style={m(p)}>
                {contributors[i]}
              </Label>
            </span>
          );
        })}
        <Check style={m(mhub)} at={1.3} />
        <Label className="mt-9 -translate-x-1/2" style={m(mhub)}>
          {check}
        </Label>
        <MapTile style={{ left: `${(70 / w) * 100}%`, top: `${(318 / h) * 100}%`, width: `${(200 / w) * 100}%`, height: `${(120 / h) * 100}%` }} at={2.1} />
        <Label className="-translate-x-1/2" style={m([170, 446])}>
          {publish}
        </Label>
      </Seq>
    </>
  );
}
