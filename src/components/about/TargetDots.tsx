import { Buildings, Student } from "@phosphor-icons/react/ssr";
import { Seq, Step } from "./motion";

type Item = { key: string; value: string; label: string; sr: string; dots: number; unit: string };

/**
 * A6: each target as a unit chart. 4.800 students are 48 dots of 100;
 * 30+ businesses are 30 workplace circles and an open one for the "+".
 */
export function TargetDots({ items }: { items: readonly Item[] }) {
  return (
    <ul className="grid gap-4 md:grid-cols-2 lg:gap-6">
      {items.map((t, ti) => {
        const student = t.key === "sinh-vien";
        const Icon = student ? Student : Buildings;
        const dot = student ? "rounded-full bg-ink" : "rounded-full bg-indigo-600";
        return (
          <li key={t.key} className="flex flex-col rounded-[20px] border border-line bg-surface p-6 lg:p-8">
            <p className="flex items-end justify-between gap-4">
              <span className="tabular font-display text-[48px] font-bold leading-[52px] tracking-[-0.02em] [font-variation-settings:'wdth'_112] lg:text-[72px] lg:leading-[76px]">
                {t.value}
              </span>
              <span className="mb-2 inline-flex items-center gap-2 text-[15px] font-semibold leading-6 lg:mb-3">
                <Icon size={20} weight="duotone" aria-hidden="true" />
                {t.label}
                <span className="sr-only"> {t.sr}</span>
              </span>
            </p>
            <div aria-hidden="true" className="mt-6 border-t border-line pt-6">
              <Seq amount={0.5} className="grid grid-cols-12 gap-1.5 lg:gap-2">
                {Array.from({ length: t.dots }, (_, i) => (
                  <Step key={i} at={ti * 0.2 + i * 0.018} className={`block aspect-square ${dot}`} />
                ))}
                {!student && (
                  <Step at={ti * 0.2 + t.dots * 0.018} className="block aspect-square rounded-full border-[1.5px] border-dashed border-indigo-600" />
                )}
              </Seq>
            </div>
            <p className="mt-4 inline-flex items-center gap-1.5 text-[13px] leading-[18px] text-ink-muted">
              <span aria-hidden="true" className={`size-2.5 ${dot}`} />= {t.unit}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
