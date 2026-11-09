"use client";

import { Buildings, GraduationCap, Plus, Student, UsersThree } from "@phosphor-icons/react/ssr";
import { useId, useState } from "react";
import { LogoMark } from "@/components/ui/Logo";
import { Seq, Step } from "./motion";

type Row = { key: string; label: string; gain: string; text: string };

const icons = { "xa-hoi": UsersThree, "nha-truong": GraduationCap, "doanh-nghiep": Buildings, "sinh-vien": Student } as const;

/**
 * A3 visual: Co-Map as the hub, four parties hanging off one rail. Each tile
 * opens the full mission sentence for that party (one at a time). On desktop the
 * rail draws from the hub outward; on mobile a spine runs down the list.
 */
export function MissionHub({ rows, hubLabel }: { rows: readonly Row[]; hubLabel: string }) {
  const [open, setOpen] = useState<string | null>(null);
  const uid = useId();

  return (
    <Seq amount={0.3} className="relative">
      <span className="sr-only">{hubLabel}</span>
      {/* Desktop hub and rail */}
      <div aria-hidden="true" className="relative hidden h-[120px] lg:block">
        <Step at={0} className="absolute left-1/2 top-0 grid size-14 -translate-x-1/2 place-items-center rounded-full bg-surface shadow-1">
          <LogoMark size={32} />
        </Step>
        <Step kind="growY" at={0.25} dur={0.35} className="absolute left-1/2 top-14 h-8 w-[2px] origin-top -translate-x-1/2 bg-ink" />
        <Step kind="growX" at={0.55} dur={0.6} className="absolute left-[12.5%] right-[12.5%] top-[88px] h-[2px] bg-ink" />
        {[12.5, 37.5, 62.5, 87.5].map((x, i) => (
          <Step
            key={x}
            kind="growY"
            at={1.05 + i * 0.08}
            dur={0.3}
            className="absolute top-[88px] h-8 w-[2px] origin-top -translate-x-1/2 bg-ink"
            style={{ left: `${x}%` }}
          />
        ))}
      </div>

      <div className="relative pl-10 sm:pl-0">
        {/* Mobile hub and spine */}
        <div aria-hidden="true" className="sm:hidden">
          <Step at={0} className="absolute -top-1 left-0 grid size-9 place-items-center rounded-full bg-surface shadow-1">
            <LogoMark size={22} />
          </Step>
          <Step kind="growY" at={0.2} dur={0.8} className="absolute bottom-8 left-[17px] top-9 w-[2px] origin-top bg-ink" />
        </div>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {rows.map((r, i) => {
            const Icon = icons[r.key as keyof typeof icons] ?? UsersThree;
            const isOpen = open === r.key;
            const panel = `${uid}-${r.key}`;
            return (
              <Step as="li" kind="rise" key={r.key} at={0.3 + i * 0.12} className="relative">
                <span aria-hidden="true" className="absolute -left-[22px] top-[37px] h-[2px] w-[22px] bg-ink sm:hidden" />
                <div
                  className={`rounded-[20px] border bg-surface transition-[border-color,box-shadow] duration-240 ${
                    isOpen ? "border-ink shadow-2" : "border-line hover:border-ink-muted"
                  }`}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panel}
                    onClick={() => setOpen(isOpen ? null : r.key)}
                    className="flex w-full items-center gap-4 rounded-[20px] p-4 text-left lg:flex-col lg:items-start lg:gap-5 lg:p-6"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-indigo-50 text-indigo-700 lg:size-12">
                      <Icon size={22} weight="duotone" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="t-h3 block">{r.label}</span>
                      <span className="t-small mt-1 hidden text-ink-muted sm:block">{r.gain}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`grid size-8 shrink-0 place-items-center rounded-full border border-line transition-transform duration-240 lg:absolute lg:right-5 lg:top-5 ${
                        isOpen ? "rotate-45 bg-ink text-white" : "text-ink"
                      }`}
                    >
                      <Plus size={14} weight="bold" />
                    </span>
                  </button>
                  <div
                    id={panel}
                    className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className={`overflow-hidden ${isOpen ? "" : "invisible"}`}>
                      <p className="t-body px-4 pb-5 text-ink lg:px-6 lg:pb-6">{r.text}</p>
                    </div>
                  </div>
                </div>
              </Step>
            );
          })}
        </ul>
      </div>
    </Seq>
  );
}
