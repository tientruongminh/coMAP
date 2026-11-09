import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { Hl } from "@/components/ui/Highlight";
import { Reveal } from "@/components/ui/Reveal";
import { btn, btnArrow } from "@/components/ui/button";
import { BtnArrow } from "@/components/ui/BtnArrow";
import { ConsultTrigger } from "@/components/consult/ConsultProvider";
import { CommunityFlow } from "@/components/about/CommunityFlow";
import { HeroPhoto } from "@/components/about/HeroPhoto";
import { MissionHub } from "@/components/about/MissionHub";
import { More } from "@/components/about/More";
import { SourceWaffle } from "@/components/about/SourceWaffle";
import { TargetDots } from "@/components/about/TargetDots";
import { TeamGrid } from "@/components/about/TeamGrid";
import { ValueTiles } from "@/components/about/ValueTiles";
import { VisionGap } from "@/components/about/VisionGap";
import { about } from "@/content/about";

export const metadata: Metadata = pageMetadata({ title: about.metaTitle, description: about.metaDescription });

/** One idea per screen (spec 0): a headline, at most one support line, then the visual. */
const section = "container-cm py-32 lg:py-36";
const eyebrow = "t-label text-lime-700";
const statement =
  "mt-4 max-w-[22ch] font-display text-[30px] font-bold leading-[36px] tracking-[-0.02em] [font-variation-settings:'wdth'_112] [text-wrap:balance] lg:text-[52px] lg:leading-[60px]";

export default function AboutPage() {
  const { intro, vision, mission, values, community, targets, team, closing } = about;
  return (
    <>
      {/* A1. Từ giảng đường đến lớp học thật */}
      <section className="container-cm pb-32 pt-10 lg:pb-24 lg:pt-16">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-6">
          <div className="lg:col-span-5">
            <h1 className="t-display max-w-[14ch]">
              {intro.h1Before}
              <Hl immediate>{intro.h1Highlight}</Hl>
              {intro.h1After}
            </h1>
            <p className="t-body-l mt-6 max-w-[40ch] text-ink-muted">{intro.sub}</p>
          </div>
          <div className="lg:col-span-7">
            <HeroPhoto src={intro.image.src} alt={intro.image.alt} from={intro.from} to={intro.to} label={intro.routeLabel} />
          </div>
        </div>
      </section>

      {/* A2. Tầm nhìn: the gap, and the routes that close it */}
      <section className={section} aria-labelledby="tam-nhin">
        <h2 id="tam-nhin" className={eyebrow}>
          {vision.title}
        </h2>
        <p className={statement}>
          {vision.before}
          <Hl>{vision.highlight}</Hl>
          {vision.after}
        </p>
        <div className="mt-12 lg:mt-16">
          <VisionGap left={vision.left} right={vision.right} label={vision.sr} />
        </div>
      </section>

      {/* A3. Sứ mệnh: one hub, four parties */}
      <section className={section} aria-labelledby="su-menh">
        <h2 id="su-menh" className={eyebrow}>
          {mission.title}
        </h2>
        <p className={statement}>{mission.line}</p>
        <div className="mt-10 lg:mt-14">
          <MissionHub rows={mission.rows} hubLabel={mission.hubLabel} />
        </div>
      </section>

      {/* A4. Giá trị cốt lõi */}
      <section className={section} aria-labelledby="gia-tri">
        <h2 id="gia-tri" className="t-h2">
          {values.title}
        </h2>
        <div className="mt-8 lg:mt-12">
          <ValueTiles />
        </div>
      </section>

      {/* A5. Vì sao là bản đồ cộng đồng: who draws it, and the check before anything is published */}
      <section className={section} aria-labelledby="ban-do-cong-dong">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-6">
          <div className="lg:col-span-4">
            <h2 id="ban-do-cong-dong" className="t-h2 max-w-[14ch]">
              {community.title}
            </h2>
            <p className="t-body-l mt-5 max-w-[34ch] text-ink-muted">{community.sub}</p>
            <More summary={community.more} className="mt-6">
              <p>{community.detail}</p>
            </More>
          </div>
          <div className="lg:col-span-8">
            <CommunityFlow contributors={community.contributors} check={community.check} publish={community.publish} label={community.sr} />
          </div>
        </div>
      </section>

      {/* A5b. Where each point comes from: one cell per point, live counts */}
      <section className={`${section} pt-0 lg:pt-0`} aria-labelledby="nguon-du-lieu">
        <div className="border-t border-line pt-32 lg:pt-36">
          <SourceWaffle
            id="nguon-du-lieu"
            title={community.sourcesTitle}
            unit={community.pointsUnit}
            label={community.waffleLabel}
            more={community.more}
            sources={community.sources}
          />
        </div>
      </section>

      {/* A6. Mục tiêu năm đầu tiên */}
      <section className={section} aria-labelledby="muc-tieu">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="muc-tieu" className="t-h2">
            {targets.title}
          </h2>
          <p className="t-small inline-flex rounded-full border border-dashed border-ink-muted px-4 py-2 text-ink-muted">{targets.caption}</p>
        </div>
        <div className="mt-8 lg:mt-12">
          <TargetDots items={targets.items} />
        </div>
      </section>

      {/* A7. Đội ngũ */}
      <section className={`${section} pt-0 lg:pt-0`} aria-labelledby="doi-ngu">
        <div className="grid gap-8 border-t border-line pt-12 lg:grid-cols-12 lg:gap-6 lg:pt-16">
          <h2 id="doi-ngu" className="t-h2 lg:col-span-4">
            {team.title}
          </h2>
          <div className="lg:col-span-8">
            <TeamGrid />
          </div>
        </div>
      </section>

      {/* A8. Closing */}
      <section className="container-cm pb-16 lg:pb-24">
        <Reveal className="flex flex-col gap-8 rounded-[20px] bg-indigo-50 px-6 py-10 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-12 lg:py-14">
          <p className="t-h2 max-w-[20ch]">{closing.line}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={closing.primaryHref} className={btnArrow("primary")}>
              {closing.primary}
              <BtnArrow />
            </Link>
            <ConsultTrigger form="chon" className={btn("secondary")}>
              {closing.secondary}
            </ConsultTrigger>
          </div>
        </Reveal>
      </section>
    </>
  );
}
