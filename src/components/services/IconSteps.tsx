import type { CSSProperties } from "react";
import { BookOpenText, ChatsCircle, FileText, MapPin } from "@phosphor-icons/react/ssr";
import { Seq, Step } from "@/components/about/motion";

const icons = { chat: ChatsCircle, book: BookOpenText, pin: MapPin, doc: FileText } as const;

/**
 * What a package gives you, as stops on one route (spec 0): the route draws and
 * each stop lights up lime in order. A column on phones, a row from `sm` up.
 * The lit icon is a second, decorative copy; the label is written once.
 */
export function IconSteps({ steps, label }: { steps: readonly { icon: string; label: string }[]; label: string }) {
  const n = steps.length;
  const inset = { left: `${50 / n}%`, right: `${50 / n}%` };
  const step = 0.45;
  return (
    <Seq amount={0.6} className="relative">
      {/* phone: vertical route through the icon centres */}
      <span aria-hidden="true" className="absolute bottom-6 left-6 top-6 w-[2px] -translate-x-1/2 bg-line sm:hidden" />
      <Step kind="growY" at={0.15} dur={step * (n - 1)} className="absolute bottom-6 left-6 top-6 w-[2px] origin-top -translate-x-1/2 bg-ink sm:hidden" />
      {/* sm and up: horizontal route */}
      <span aria-hidden="true" className="absolute top-6 hidden h-[2px] -translate-y-1/2 bg-line sm:block" style={inset} />
      <Step kind="growX" at={0.15} dur={step * (n - 1)} className="absolute top-6 hidden h-[2px] origin-left -translate-y-1/2 bg-ink sm:block" style={inset} />

      <ol
        aria-label={label}
        className="relative grid gap-6 sm:[grid-template-columns:repeat(var(--n),minmax(0,1fr))] sm:gap-2"
        style={{ "--n": n } as CSSProperties}
      >
        {steps.map((s, i) => {
          const Icon = icons[s.icon as keyof typeof icons] ?? FileText;
          return (
            <li key={s.label} className="flex items-center gap-4 sm:flex-col sm:gap-3 sm:text-center">
              <span aria-hidden="true" className="relative grid size-12 shrink-0 place-items-center rounded-full border border-line bg-surface text-ink-muted">
                <Icon size={22} />
                <Step at={0.15 + i * step} className="absolute inset-[-1px] grid place-items-center rounded-full bg-lime-400 text-ink">
                  <Icon size={22} weight="fill" />
                </Step>
              </span>
              <span className="text-[15px] font-semibold leading-5 sm:max-w-[13ch] sm:text-[14px]">{s.label}</span>
            </li>
          );
        })}
      </ol>
    </Seq>
  );
}
