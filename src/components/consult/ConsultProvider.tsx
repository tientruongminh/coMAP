"use client";

import { useRouter } from "next/navigation";
import { createContext, Suspense, useCallback, useContext, useMemo, useRef, useState, type ReactNode, type MouseEvent } from "react";
import ConsultDialog from "./ConsultDialog";

/**
 * Global consult dialog plumbing (spec 2.1, 5.1).
 * The URL param `?form=` is the open state, so deep links work on every route;
 * the extra context (location, document, package) lives here in memory.
 */
export type ConsultKind = "sinh-vien" | "doanh-nghiep" | "nha-truong";
export type FormParam = ConsultKind | "chon";
export interface ConsultContext {
  /** location id */
  diem?: string;
  /** package preselect for doanh-nghiep: "tim-thuc-tap-sinh" | "mo-khoa-cv" */
  goi?: string;
  /** document title the visitor asked about */
  taiLieu?: string;
}

export const FORM_PARAMS: FormParam[] = ["sinh-vien", "doanh-nghiep", "nha-truong", "chon"];
export const isFormParam = (v: unknown): v is FormParam => typeof v === "string" && (FORM_PARAMS as string[]).includes(v);

interface ConsultApi {
  open: (form: FormParam, context?: ConsultContext) => void;
  close: () => void;
  context: ConsultContext;
}

const Ctx = createContext<ConsultApi | null>(null);

export function useConsult() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useConsult must be used inside <ConsultProvider>");
  return v;
}

function urlWith(form: FormParam | null) {
  const u = new URL(window.location.href);
  if (form) u.searchParams.set("form", form);
  else u.searchParams.delete("form");
  const q = u.searchParams.toString();
  return `${u.pathname}${q ? `?${q}` : ""}${u.hash}`;
}

export function ConsultProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [context, setContext] = useState<ConsultContext>({});
  const returnFocus = useRef<HTMLElement | null>(null);

  const open = useCallback(
    (form: FormParam, ctx: ConsultContext = {}) => {
      returnFocus.current = document.activeElement as HTMLElement | null;
      setContext(ctx);
      router.push(urlWith(form), { scroll: false });
    },
    [router],
  );

  const close = useCallback(() => {
    router.replace(urlWith(null), { scroll: false });
    const el = returnFocus.current;
    if (el && document.contains(el)) requestAnimationFrame(() => el.focus());
  }, [router]);

  const api = useMemo(() => ({ open, close, context }), [open, close, context]);

  return (
    <Ctx.Provider value={api}>
      {children}
      <Suspense fallback={null}>
        <ConsultDialog />
      </Suspense>
    </Ctx.Provider>
  );
}

/**
 * Link-like trigger. Works without JS (plain `?form=` href); with JS it keeps the
 * current path and query (the map state on /ban-do) and passes context.
 */
export function ConsultTrigger({
  form,
  context,
  className,
  children,
  ariaLabel,
  onClick,
}: {
  form: FormParam;
  context?: ConsultContext;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
  /** Runs before the dialog opens, e.g. to close the mobile menu that holds the trigger. */
  onClick?: () => void;
}) {
  const { open } = useConsult();
  return (
    <a
      href={`?form=${form}`}
      aria-label={ariaLabel}
      className={className}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        onClick?.();
        open(form, context);
      }}
    >
      {children}
    </a>
  );
}
