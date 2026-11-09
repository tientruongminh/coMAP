import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { MapTrifold, Tag } from "@phosphor-icons/react/ssr";
import { Hl } from "@/components/ui/Highlight";
import { Reveal } from "@/components/ui/Reveal";
import { btnArrow } from "@/components/ui/button";
import { BtnArrow } from "@/components/ui/BtnArrow";
import { ConsultTrigger, type ConsultKind } from "@/components/consult/ConsultProvider";
import { Figure } from "@/components/about/Figure";
import { IconSteps } from "@/components/services/IconSteps";
import { MatchMap } from "@/components/services/MatchMap";
import { Package } from "@/components/services/Package";
import { ServiceTabs } from "@/components/services/ServiceTabs";
import { VettingCard } from "@/components/services/VettingCard";
import { WeekPlan } from "@/components/services/WeekPlan";
import { services } from "@/content/services";

export const metadata: Metadata = pageMetadata({ title: services.metaTitle, description: services.metaDescription });

/** In-page targets clear the sticky header (html scroll-padding) and the 56px tab bar. */
const anchor = "scroll-mt-[64px] outline-none";
const photoSizes = "(min-width: 1280px) 616px, (min-width: 1024px) 50vw, calc(100vw - 32px)";
const chip = "inline-flex min-h-10 w-fit items-center gap-2.5 rounded-full bg-indigo-50 py-1.5 pl-1.5 pr-4 text-[15px] font-semibold leading-5 text-ink";
const chipIcon = "grid size-7 shrink-0 place-items-center rounded-full";

export default function ServicesPage() {
  const { intro, cta, more, promo, promoSr, student, business, vetting, school, closing } = services;
  const tabs = intro.tabs as { id: ConsultKind; label: string }[];
  const labels = { cta, more, promo, promoSr };
  const [find, unlock] = business.packages;

  return (
    <>
      {/* D1. Intro: headline, the support line as two chips, then the tabs */}
      <section className="container-cm pb-12 pt-12 lg:pb-16 lg:pt-20">
        <h1 className="t-display max-w-[18ch]">
          {intro.h1Before}
          <Hl immediate>{intro.h1Highlight}</Hl>
          {intro.h1After}
        </h1>
        <div className="mt-8 flex flex-wrap gap-3">
          <p className={chip}>
            <span aria-hidden="true" className={`${chipIcon} bg-surface`}>
              <MapTrifold size={16} weight="bold" />
            </span>
            <span className="sr-only">{intro.freeSr}</span>
            {intro.free}
          </p>
          <p className={chip}>
            <span aria-hidden="true" className={`${chipIcon} bg-lime-400`}>
              <Tag size={16} weight="bold" />
            </span>
            {intro.offer}
            <span className="sr-only">{intro.offerSr}</span>
          </p>
        </div>
      </section>

      <ServiceTabs label={intro.tabsLabel} tabs={tabs} />

      {/* D2. Sinh viên: what you get, as four stops that light up in order */}
      <section id={student.id} tabIndex={-1} aria-labelledby="dv-sinh-vien" className={`container-cm py-28 lg:py-36 ${anchor}`}>
        <Package
          id="dv-sinh-vien"
          chip={student.chip}
          title={student.title}
          form="sinh-vien"
          labels={labels}
          visual={
            <div className="space-y-4">
              <Reveal>
                <Figure src={student.image.src} alt={student.image.alt} ratio="4/3" sizes={photoSizes} />
              </Reveal>
              <div className="rounded-[20px] border border-line bg-surface p-6 shadow-1 sm:px-4">
                <IconSteps steps={student.steps} label={student.stepsLabel} />
              </div>
            </div>
          }
          details={
            <>
              <p>{student.more.body}</p>
              <p className="font-semibold">{student.more.getTitle}</p>
              <ul>
                {student.more.get.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
              <p className="font-semibold">{student.more.forTitle}</p>
              <p>{student.more.for}</p>
            </>
          }
        />
      </section>

      {/* D3. Doanh nghiệp: find the right people (map), read the right CV (vetting card) */}
      <section id={business.id} tabIndex={-1} aria-label={business.chip} className={`container-cm ${anchor}`}>
        <div className="border-t border-line py-28 lg:py-36">
          <Package
            id="dv-tim-thuc-tap-sinh"
            flip
            chip={business.chip}
            title={find.title}
            form="doanh-nghiep"
            labels={labels}
            visual={<MatchMap filters={business.match.filters} ring={business.match.ring} label={business.match.label} />}
            details={
              <>
                <p className="font-semibold">{find.fullTitle}</p>
                <p>{find.text}</p>
                <ul>
                  {find.list.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              </>
            }
          />
        </div>
        <div className="pb-28 lg:pb-36">
          <Package
            id="dv-mo-khoa-cv"
            chip={business.chip}
            title={unlock.title}
            form="doanh-nghiep"
            labels={labels}
            visual={<VettingCard steps={vetting.steps} card={vetting.card} label={vetting.title} />}
            details={
              <>
                <p className="font-semibold">{unlock.fullTitle}</p>
                <p>{unlock.text}</p>
                <ul>
                  {unlock.list.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
                <p className="font-semibold">{vetting.title}</p>
                <p>{vetting.sub}</p>
                <p className="text-ink-muted">{vetting.card.reviewer}</p>
              </>
            }
          />
        </div>
      </section>

      {/* D4. Nhà trường: a 13-week plan whose phases fill in order */}
      <section id={school.id} tabIndex={-1} aria-labelledby="dv-nha-truong" className={`container-cm ${anchor}`}>
        <div className="border-t border-line py-28 lg:py-36">
          <Package
            id="dv-nha-truong"
            flip
            chip={school.chip}
            title={school.title}
            form="nha-truong"
            labels={labels}
            visual={
              <div className="space-y-4">
                <Reveal>
                  <Figure src={school.image.src} alt={school.image.alt} ratio="4/3" sizes={photoSizes} />
                </Reveal>
                <WeekPlan title={school.timelineLabel} weeks={school.weeks} total={school.totalWeeks} phases={school.timeline} />
              </div>
            }
            details={
              <>
                <p className="font-semibold">{school.more.title}</p>
                <p>{school.more.body}</p>
                <p className="font-semibold">{school.more.timelineLabel}</p>
                <ul>
                  {school.timeline.map((t) => (
                    <li key={t.label}>
                      <span className="font-semibold">{t.when}:</span> {t.text}
                    </li>
                  ))}
                </ul>
              </>
            }
          />
        </div>
      </section>

      {/* D5. Closing */}
      <section className="container-cm pb-16 lg:pb-24">
        <Reveal className="on-dark flex flex-col gap-8 rounded-[20px] bg-indigo-700 px-6 py-10 text-white md:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-12 lg:py-14">
          <div>
            <p className="t-h2 max-w-[20ch]">{closing.line}</p>
            <p className="t-body-l mt-3 max-w-[40ch] text-white/80">{closing.sub}</p>
          </div>
          <ConsultTrigger form="chon" className={btnArrow("lime")}>
            {cta}
            <BtnArrow tone="dark" />
          </ConsultTrigger>
        </Reveal>
      </section>
    </>
  );
}
