"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { btn } from "@/components/ui/button";
import { formsUi } from "@/content/forms";
import { Spinner } from "./fields";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Submit button with the one allowed spinner (spec 5.5). Stays focusable while busy. */
export function SubmitButton({ busy, children, className = "" }: { busy: boolean; children: ReactNode; className?: string }) {
  return (
    <button
      type="submit"
      aria-disabled={busy || undefined}
      className={btn("primary", "md", `w-full aria-disabled:cursor-progress aria-disabled:hover:bg-indigo-700 ${className}`)}
    >
      {busy ? (
        <>
          <Spinner />
          <span>{formsUi.submitting}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

/** Small pill chip for the hidden context (`Quan tâm: …`, `Tài liệu: …`). */
export function ContextChip({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-indigo-50 py-1.5 pl-3 pr-4 text-[14px] font-medium leading-5 text-indigo-700">
      <span aria-hidden="true" className="shrink-0">
        {icon}
      </span>
      <span className="min-w-0 truncate">{children}</span>
    </span>
  );
}

/**
 * Success panel (spec 5.5): the ĐÃ NHẬN stamp lands (scale 1.2 to 1, 320ms),
 * then the title, the code and the masked phone. Focus moves to the title.
 */
export function SuccessPanel({
  title,
  code,
  phone,
  titleId,
  children,
}: {
  title: string;
  code: string;
  phone: string;
  titleId?: string;
  children?: ReactNode;
}) {
  const reduce = useReducedMotion();
  const heading = useRef<HTMLHeadingElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const { body } = formsUi.success;

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    // The form above was taller: on a page (not the dialog) the panel can end
    // up behind the sticky header or above the fold.
    const r = root.current?.getBoundingClientRect();
    if (r && (r.top < 72 || r.top > window.innerHeight - 160)) {
      root.current?.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    }
    // Mount only: `reduce` does not change while the panel is shown.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={root} className="flex flex-col items-center py-6 text-center">
      <motion.span
        className="stamp"
        initial={reduce ? false : { opacity: 0, scale: 1.2, rotate: -6 }}
        animate={{ opacity: 1, scale: 1, rotate: -6 }}
        transition={{ duration: 0.32, ease: EASE }}
      >
        {formsUi.success.stamp}
      </motion.span>
      <h2 id={titleId} ref={heading} tabIndex={-1} className="t-h3 mt-6 outline-none!">
        {title}
      </h2>
      <p className="t-body mt-3 max-w-[40ch] text-ink-muted">
        {body.code}
        <strong className="tabular font-semibold text-ink">{code}</strong>
        {body.call}
        <span className="tabular whitespace-nowrap font-semibold text-ink">{phone}</span>
        {body.tail}
      </p>
      {children && <div className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:justify-center">{children}</div>}
    </div>
  );
}
