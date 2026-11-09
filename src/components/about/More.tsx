import { Plus } from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";

/**
 * "Xem chi tiết": native <details>, so it works without JS and with every
 * keyboard and screen reader. The full sentences that left the screen live here.
 */
export function More({ summary, children, className = "" }: { summary: string; children: ReactNode; className?: string }) {
  return (
    <details className={`group/more ${className}`}>
      <summary className="inline-flex h-10 cursor-pointer list-none items-center gap-2 rounded-full border border-line bg-surface pl-4 pr-2 text-[14px] font-semibold leading-none text-ink transition-colors duration-160 hover:border-ink [&::-webkit-details-marker]:hidden">
        {summary}
        <span
          aria-hidden="true"
          className="grid size-6 place-items-center rounded-full bg-indigo-50 transition-transform duration-240 group-open/more:rotate-45"
        >
          <Plus size={12} weight="bold" />
        </span>
      </summary>
      <div className="t-body mt-4 max-w-[60ch] space-y-3 text-ink [&_li]:relative [&_li]:pl-5 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[10px] [&_li]:before:size-1.5 [&_li]:before:rounded-full [&_li]:before:bg-lime-700 [&_li]:before:content-[''] [&_ul]:space-y-2">
        {children}
      </div>
    </details>
  );
}
