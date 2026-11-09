import Image from "next/image";
import { imageCaption } from "@/content/site";
import { Draw, Seq, Step } from "./motion";
import { SchoolPin, SitePin } from "./Pins";

/**
 * A1 visual: the classroom photo annotated like the map. A lime school pin
 * (giảng đường) and a route that draws to an indigo site pin on the blackboard
 * (lớp học thật). Geometry is in a 400 x 300 box that matches the 4:3 crop.
 * On phones the two pin labels stay off: the H1 right above already names both
 * ends, and the pin colours carry the rest (spec 0, 30 words per phone frame).
 */
export function HeroPhoto({
  src,
  alt,
  from,
  to,
  label,
}: {
  src: string;
  alt: string;
  from: string;
  to: string;
  label: string;
}) {
  return (
    <figure>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-bezel">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1280px) 720px, (min-width: 1024px) 58vw, calc(100vw - 32px)"
          placeholder="empty"
          loading="eager"
          fetchPriority="high"
          className="object-cover"
        />
        <Seq className="absolute inset-0" role="img" label={label} amount={0.4}>
          <svg viewBox="0 0 400 300" className="absolute inset-0 size-full" aria-hidden="true">
            <Draw d="M 52 252 C 120 252 150 196 196 160 S 252 112 282 110" stroke="#FFFFFF" width={6} at={0.35} dur={1.3} />
            <Draw d="M 52 252 C 120 252 150 196 196 160 S 252 112 282 110" stroke="#3330A8" width={3} at={0.35} dur={1.3} />
          </svg>
          <Step at={0.1} className="absolute left-[13%] top-[84%] -translate-x-1/2 -translate-y-1/2">
            <SchoolPin size={36} />
          </Step>
          <Step
            kind="fade"
            at={0.2}
            className="absolute left-[13%] top-[84%] ml-6 -translate-y-1/2 hidden whitespace-nowrap rounded-full bg-surface px-3 py-1 text-[13px] font-semibold leading-[18px] text-ink shadow-1 sm:block"
          >
            {from}
          </Step>
          <Step at={1.55} className="absolute left-[70.5%] top-[36.6%] -translate-x-1/2 -translate-y-1/2">
            <SitePin size={36} />
          </Step>
          <Step
            kind="fade"
            at={1.7}
            className="absolute left-[70.5%] top-[36.6%] mt-7 -translate-x-1/2 hidden whitespace-nowrap rounded-full bg-surface px-3 py-1 text-[13px] font-semibold leading-[18px] text-ink shadow-1 sm:block"
          >
            {to}
          </Step>
        </Seq>
      </div>
      <figcaption className="mt-3 text-[13px] leading-[18px] text-ink-muted">{imageCaption}</figcaption>
    </figure>
  );
}
