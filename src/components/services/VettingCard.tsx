import { CaretDown, Check, EnvelopeSimple, LockSimple, Phone, User, UserCircle } from "@phosphor-icons/react/ssr";
import { Seq, Step } from "@/components/about/motion";

const icons = [User, Phone, EnvelopeSimple];
/** Redacted bar widths, so the three rows do not look machine made. */
const BAR = ["62%", "44%", "76%"];

type Card = {
  chip: string;
  chipSr: string;
  title: string;
  line: string;
  redacted: readonly string[];
  redactedNote: string;
  rowDone: string;
  stamp: string;
};

/**
 * Package B, "mở khóa CV" (spec 0, W3): a sample CV whose contact rows stay
 * locked while the five vetting steps tick in order, then NHÓM A lands.
 * Each step opens its explanation on tap or Enter (native <details>).
 */
export function VettingCard({
  steps,
  card,
  label,
}: {
  steps: readonly { title: string; short?: string; text: string }[];
  card: Card;
  label: string;
}) {
  const tick = (i: number) => 0.4 + i * 0.4;
  return (
    <Seq amount={0.4} className="rounded-[20px] border border-line bg-surface p-5 shadow-1 sm:p-7">
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-full bg-bezel text-ink-muted">
          <UserCircle size={28} />
        </span>
        <div className="min-w-0">
          <p className="tabular font-display text-[22px] font-bold leading-7 tracking-[-0.01em] [font-variation-settings:'wdth'_112]">
            {card.title}
            <span className="sr-only">. {card.line}</span>
          </p>
          <span className="mt-1 inline-flex h-6 items-center rounded-full border border-dashed border-ink-muted px-2.5 text-[12px] font-semibold leading-none text-ink-muted">
            {card.chip}
            <span className="sr-only">{card.chipSr}</span>
          </span>
        </div>
        <Step kind="stamp" at={tick(steps.length) + 0.1} className="ml-auto mt-1 shrink-0">
          <span className="stamp bg-surface">{card.stamp}</span>
        </Step>
      </div>

      <ul className="mt-5 space-y-2.5">
        {card.redacted.map((r, i) => {
          const Icon = icons[i] ?? LockSimple;
          return (
            <li key={r} className="flex items-center gap-3">
              <Icon size={16} className="shrink-0 text-ink-muted" aria-hidden="true" />
              <span aria-hidden="true" className="block h-2.5 rounded-full bg-bezel" style={{ width: BAR[i % BAR.length] }} />
              <LockSimple size={14} weight="bold" className="ml-auto shrink-0 text-ink-muted" aria-hidden="true" />
              <span className="sr-only">
                {r} {card.redactedNote}
              </span>
            </li>
          );
        })}
      </ul>

      <ol aria-label={label} className="mt-5 divide-y divide-line border-t border-line">
        {steps.map((s, i) => (
          <li key={s.title}>
            <details className="group/row">
              <summary className="-mx-2 flex min-h-14 cursor-pointer list-none items-center gap-3 rounded-[12px] px-2 py-2 transition-colors duration-160 hover:bg-paper [&::-webkit-details-marker]:hidden">
                <span aria-hidden="true" className="relative grid size-7 shrink-0 place-items-center rounded-full border border-line bg-paper">
                  <Step at={tick(i)} className="absolute inset-[-1px] grid place-items-center rounded-full bg-lime-400 text-ink">
                    <Check size={14} weight="bold" />
                  </Step>
                </span>
                <span className="text-[15px] font-semibold leading-5">{s.short ?? s.title}</span>
                <span className="sr-only">: {card.rowDone}</span>
                <CaretDown size={16} aria-hidden="true" className="ml-auto shrink-0 text-ink-muted transition-transform duration-240 group-open/row:rotate-180" />
              </summary>
              <p className="t-small max-w-[48ch] pb-4 pl-10 text-ink-muted">
                {s.short && <span className="font-semibold text-ink">{s.title}: </span>}
                {s.text}
              </p>
            </details>
          </li>
        ))}
      </ol>
    </Seq>
  );
}
