import type { ReactNode } from "react";
import { Tag } from "@phosphor-icons/react/ssr";
import { btnArrow } from "@/components/ui/button";
import { BtnArrow } from "@/components/ui/BtnArrow";
import { ConsultTrigger, type ConsultKind } from "@/components/consult/ConsultProvider";
import { More } from "@/components/about/More";
import { AudienceChip } from "./AudienceChip";

/**
 * One service package, one grammar (spec 0, D2 to D4): audience chip and title,
 * a visual of what you get, then the promo chip, the CTA and "Xem chi tiết".
 * Phones read head, visual, actions; from `lg` the visual takes six columns and
 * the text column alternates sides (`flip`).
 */
export function Package({
  id,
  chip,
  title,
  form,
  flip = false,
  visual,
  details,
  labels,
}: {
  id: string;
  chip: string;
  title: string;
  form: ConsultKind;
  flip?: boolean;
  visual: ReactNode;
  details: ReactNode;
  labels: { cta: string; more: string; promo: string; promoSr: string };
}) {
  const text = flip ? "lg:col-start-8" : "lg:col-start-1";
  return (
    <article aria-labelledby={id} className="grid gap-10 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-0">
      <div className={`lg:col-span-5 lg:row-start-1 lg:self-end ${text}`}>
        <AudienceChip>{chip}</AudienceChip>
        <h2 id={id} className="t-h2 mt-4 max-w-[14ch] [text-wrap:balance]">
          {title}
        </h2>
      </div>

      <div className={`lg:col-span-6 lg:row-span-2 lg:row-start-1 lg:self-center ${flip ? "lg:col-start-1" : "lg:col-start-7"}`}>{visual}</div>

      <div className={`lg:col-span-5 lg:row-start-2 lg:mt-8 lg:self-start ${text}`}>
        <div className="flex flex-wrap items-center gap-3">
          <ConsultTrigger form={form} className={btnArrow("primary")}>
            {labels.cta}
            <BtnArrow />
          </ConsultTrigger>
          <p className="inline-flex h-8 items-center gap-1.5 rounded-full bg-lime-400 pl-2.5 pr-3 text-[13px] font-semibold leading-none text-ink">
            <Tag size={14} weight="bold" aria-hidden="true" />
            {labels.promo}
            <span className="sr-only">{labels.promoSr}</span>
          </p>
        </div>
        <More summary={labels.more} className="mt-4">
          {details}
        </More>
      </div>
    </article>
  );
}
