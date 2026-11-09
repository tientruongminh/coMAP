"use client";

import dynamic from "next/dynamic";

/** Paper skeleton in the shape of the final plate: legend, role switch, caption. */
function PlateSkeleton() {
  return (
    <div className="absolute inset-0 bg-[#EFEFF4]" aria-hidden="true">
      {/* Same boxes as HeroMap: role switch, legend (lg), caption card. */}
      <div className="absolute left-2 top-2 h-12 w-[178px] rounded-full bg-surface/80 lg:left-auto lg:right-4 lg:top-4 lg:w-[372px]" />
      <div className="absolute left-4 top-4 hidden h-8 w-[148px] rounded-full bg-surface/80 lg:block" />
      <div className="absolute inset-x-2 bottom-2 h-[72px] rounded-[16px] bg-surface/80 lg:bottom-4 lg:left-4 lg:right-auto lg:w-[320px]" />
    </div>
  );
}

const HeroMap = dynamic(() => import("@/components/map/HeroMap"), {
  ssr: false,
  loading: () => <PlateSkeleton />,
});

/**
 * The double-bezel plate of the hero (spec 3.1 S1, 6.4). MapLibre is only
 * downloaded on the client, after the H1 has painted.
 */
export function HeroPlate({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bezel h-[440px] lg:h-[clamp(560px,78dvh,720px)] lg:rounded-r-none lg:pr-0 ${className}`}
    >
      <div className="bezel-core relative h-full bg-[#EFEFF4] lg:rounded-r-none">
        <HeroMap />
      </div>
    </div>
  );
}
