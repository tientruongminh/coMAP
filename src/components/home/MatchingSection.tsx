import { Info } from "@phosphor-icons/react/ssr";
import { Hl } from "@/components/ui/Highlight";
import { Reveal } from "@/components/ui/Reveal";
import { matching } from "@/content/home";
import { Matching } from "./Matching";

/** S4 (spec 3.1, W2): the product's core logic, shown rather than described. */
export function MatchingSection() {
  return (
    <section aria-labelledby="chuan-dau-ra" className="container-cm py-12 lg:py-16">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-x-6">
        <Reveal className="lg:order-2 lg:col-span-5 lg:col-start-8 xl:pl-6">
          <p className="inline-flex h-7 items-center gap-1.5 rounded-full border border-line px-3 text-[12px] font-semibold uppercase leading-none tracking-[0.08em] text-ink-muted">
            <Info size={14} weight="bold" aria-hidden="true" />
            {matching.chip}
            <span className="sr-only normal-case">: {matching.smallPrint}</span>
          </p>
          {/* Three beats, like the plate: left list, the meeting, right list. */}
          <h2 id="chuan-dau-ra" className="t-h2 mt-4 lg:text-[40px] lg:leading-[48px] xl:text-[48px] xl:leading-[56px]">
            <span className="whitespace-nowrap lg:block">{matching.titleBefore.trim()}</span>{" "}
            <Hl>{matching.titleMark}</Hl>{" "}
            <span className="whitespace-nowrap lg:block">{matching.titleAfter.trim()}</span>
          </h2>
          <p className="sr-only">{matching.titleSr}</p>
        </Reveal>
        <div className="lg:order-1 lg:col-span-7">
          <Matching />
        </div>
      </div>
    </section>
  );
}
