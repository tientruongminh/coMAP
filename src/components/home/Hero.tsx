import Link from "next/link";
import { Hl } from "@/components/ui/Highlight";
import { BtnArrow } from "@/components/ui/BtnArrow";
import { btn, btnArrow } from "@/components/ui/button";
import { ConsultTrigger } from "@/components/consult/ConsultProvider";
import { hero } from "@/content/home";
import { HeroPlate } from "./HeroPlate";

/*
 * Layout math, measured against the section (container query units, so the
 * scrollbar never causes overflow the way 100vw would):
 * - the H1 must stay on exactly 2 lines inside cols 1 to 5 of the 1232px grid;
 *   "ngành Giáo dục." measures about 8.7em in Archivo 750 wdth 112.
 * - the plate bleeds to the right viewport edge.
 */
const TITLE_FLUID = "lg:text-[clamp(40px,calc((min(100cqw_-_48px,1232px)*0.41667_-_14px)/8.9),64px)] lg:leading-[1.125]";
const PLATE_BLEED = "lg:mr-[calc(-1*max(24px,(100cqw_-_1232px)/2))]";

/** S1 (spec 3.1, W1): headline left, live map plate bleeding off the right edge. */
export function Hero() {
  return (
    <section className="@container overflow-x-clip" aria-labelledby="hero-title">
      <div className="container-cm grid grid-cols-1 lg:min-h-[calc(100dvh-72px)] lg:grid-cols-12 lg:items-center lg:gap-x-6">
        <div className="pb-8 pt-10 sm:pt-14 lg:col-span-5 lg:py-16">
          <h1 id="hero-title" className={`t-display ${TITLE_FLUID}`}>
            <span className="block">{hero.titleLine1}</span>
            <span className="block whitespace-nowrap">
              <Hl immediate>{hero.titleLine2}</Hl>
            </span>
          </h1>
          <p className="t-body-l mt-5 max-w-[46ch] text-ink-muted lg:mt-6 lg:text-[20px] lg:leading-8">
            {hero.sub}
            <span className="sr-only"> {hero.subSr}</span>
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3 lg:mt-9">
            <Link href={hero.primary.href} className={btnArrow("primary")}>
              {hero.primary.label}
              <BtnArrow />
            </Link>
            <ConsultTrigger form="chon" className={btn("secondary")}>
              {hero.secondary.label}
            </ConsultTrigger>
          </div>
        </div>
        <div className="-mx-1 pb-10 md:-mx-3 lg:col-span-7 lg:mx-0 lg:py-10">
          <HeroPlate className={PLATE_BLEED} />
        </div>
      </div>
    </section>
  );
}
