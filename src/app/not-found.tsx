import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap } from "@phosphor-icons/react/ssr";
import { Footer } from "@/components/layout/Footer";
import { BtnArrow } from "@/components/ui/BtnArrow";
import { btn, btnArrow } from "@/components/ui/button";
import { notFoundCopy as copy } from "@/content/not-found";

export const metadata: Metadata = { title: copy.title };

/**
 * Pure CSS draw so the 404 needs no client JS: a solid mask reveals the dashed
 * route in 900ms, then the empty pin settles. Reduced motion skips both
 * animations and shows the finished drawing (same markup either way).
 */
const css = `
@media (prefers-reduced-motion: no-preference) {
  .nf-reveal { stroke-dasharray: 1; stroke-dashoffset: 1; animation: nf-draw 900ms cubic-bezier(0.22,1,0.36,1) 200ms forwards; }
  .nf-pin { opacity: 0; transform: scale(1.2); transform-origin: 284px 34px; animation: nf-pin 320ms cubic-bezier(0.22,1,0.36,1) 1000ms forwards; }
}
@keyframes nf-draw { to { stroke-dashoffset: 0; } }
@keyframes nf-pin { to { opacity: 1; transform: scale(1); } }
`;

const ROUTE = "M44 104 C92 104 100 62 146 62 C190 62 198 98 234 98 C256 98 262 70 272 50";

/** A school pin on a faint street tile, a dashed route that wanders off, and a pin with nothing in it. */
function LostRoute() {
  return (
    <div aria-hidden="true" className="mx-auto w-[320px] max-w-full overflow-hidden rounded-[20px] bg-bezel">
      <style>{css}</style>
      <svg viewBox="0 0 320 140" className="block h-auto w-full" fill="none">
        <g stroke="var(--color-surface)" strokeLinecap="round">
          <path d="M-10 36 L330 48" strokeWidth={5} />
          <path d="M112 -10 L128 150" strokeWidth={5} />
          <path d="M-10 122 L330 112" strokeWidth={2.5} />
          <path d="M56 -10 L66 150" strokeWidth={2.5} />
          <path d="M206 -10 L196 150" strokeWidth={2.5} />
          <path d="M268 -10 L284 150" strokeWidth={2.5} />
        </g>
        <mask id="nf-mask" maskUnits="userSpaceOnUse" x={0} y={0} width={320} height={140}>
          <path className="nf-reveal" pathLength={1} d={ROUTE} stroke="#fff" strokeWidth={8} strokeLinecap="round" />
        </mask>
        <path d={ROUTE} mask="url(#nf-mask)" stroke="var(--color-ink)" strokeWidth={2.5} strokeLinecap="round" strokeDasharray="2 7" />
        <g className="nf-pin">
          <circle cx={284} cy={34} r={15} fill="var(--color-surface)" stroke="var(--color-indigo-600)" strokeWidth={2} strokeDasharray="4 4" />
        </g>
        <rect x={27} y={87} width={34} height={34} rx={10} fill="var(--color-lime-400)" stroke="var(--color-surface)" strokeWidth={2.5} />
        <GraduationCap x={35} y={95} size={18} weight="fill" color="#1A1946" />
      </svg>
    </div>
  );
}

/** 404 (spec 3.7). Rendered by the root layout, so it brings its own main and footer. */
export default function NotFound() {
  return (
    <>
      <main id="noi-dung" className="flex flex-1 items-center">
        <div className="container-cm flex flex-col items-center py-20 text-center lg:py-32">
          <LostRoute />
          <h1 className="t-h1 mt-10 lg:mt-12">{copy.title}</h1>
          <p className="t-body-l mt-4 max-w-[44ch] text-ink-muted">{copy.body}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <Link href={copy.primary.href} className={btnArrow("primary")}>
              {copy.primary.label}
              <BtnArrow />
            </Link>
            <Link href={copy.secondary.href} className={btn("text")}>
              {copy.secondary.label}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
