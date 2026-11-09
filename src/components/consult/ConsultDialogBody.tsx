"use client";

import { ArrowLeft, Briefcase, CaretRight, FilePdf, GraduationCap, MapPin, Student, X } from "@phosphor-icons/react";
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { Banner, CheckGroup, Consent, Honeypot, SelectField, TextField } from "@/components/forms/fields";
import { ContextChip, SubmitButton, SuccessPanel } from "@/components/forms/parts";
import { useLeadForm } from "@/components/forms/useLeadForm";
import { BtnArrow } from "@/components/ui/BtnArrow";
import { btn, btnArrow } from "@/components/ui/button";
import { formHeads, formsUi, otherOption, packageOptions, picker, schoolTopicOptions } from "@/content/forms";
import { fieldSlug } from "@/content/taxonomy";
import type { LeadValues } from "@/lib/lead-schema";
import { byId, meta, schools } from "@/lib/locations";
import type { ConsultContext, ConsultKind, FormParam } from "./ConsultProvider";
import type { ConsultBodyProps } from "./types";

/**
 * Consult dialog body (spec 5.1 to 5.5): a 560px modal on desktop, a full-height
 * sheet on mobile. Focus is trapped, Esc and the scrim close it, the page behind
 * does not scroll, and focus returns to the trigger.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const TITLE_ID = "consult-title";
const MAP_PATH = "/ban-do";

const SCHOOL_IDS = schools.map((s) => s.id);
const schoolOptions = [...schools.map((s) => ({ value: s.id, label: s.name })), otherOption.truong];
const majorOptions = [...meta.fields.map((f) => ({ value: fieldSlug[f], label: f })), otherOption.chuyenNganh];
/** Role glyphs in the map vocabulary: a site is an indigo circle, a school a lime squircle. */
const ROLE = {
  "sinh-vien": { Icon: Student, shape: "rounded-full bg-ink text-white" },
  "doanh-nghiep": { Icon: Briefcase, shape: "rounded-full bg-indigo-600 text-white" },
  "nha-truong": { Icon: GraduationCap, shape: "rounded-[29%] bg-lime-400 text-ink" },
} as const;

const DESKTOP = "(min-width: 768px)";
const subscribe = (cb: () => void) => {
  const m = window.matchMedia(DESKTOP);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const useDesktop = () =>
  useSyncExternalStore(
    subscribe,
    () => window.matchMedia(DESKTOP).matches,
    () => true,
  );

const TABBABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]';

function tabbables(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>(TABBABLE)).filter(
    (el) => el.tabIndex >= 0 && !el.closest('[aria-hidden="true"]') && el.getClientRects().length > 0,
  );
}

function urlWith(form: FormParam) {
  const u = new URL(window.location.href);
  u.searchParams.set("form", form);
  return `${u.pathname}?${u.searchParams.toString()}${u.hash}`;
}

/** Context that pre-fills an untouched draft: a school pin fills the school fields. */
function defaultsFor(kind: ConsultKind, ctx: ConsultContext): LeadValues {
  const school = ctx.diem && SCHOOL_IDS.includes(ctx.diem) ? byId.get(ctx.diem) : undefined;
  if (!school) return {};
  if (kind === "sinh-vien") return { truong: school.id };
  if (kind === "nha-truong") return { tenCoSo: school.name };
  return {};
}

export default function ConsultDialogBody({ form, context, drafts, setDrafts, lastKind, setLastKind, onClose }: ConsultBodyProps) {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const desktop = useDesktop();
  const isPresent = useIsPresent();
  const panel = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [doneFor, setDoneFor] = useState<FormParam | null>(null);
  const done = doneFor === form;

  // What had focus before the dialog took it (children focus in passive effects, after this).
  useLayoutEffect(() => {
    const a = document.activeElement;
    opener.current = a instanceof HTMLElement && a !== document.body ? a : null;
  }, []);

  useEffect(() => {
    if (!isPresent) return;
    const root = document.documentElement;
    const prev = { overflow: root.style.overflow, gutter: root.style.scrollbarGutter };
    if (window.innerWidth > root.clientWidth) root.style.scrollbarGutter = "stable";
    root.style.overflow = "hidden";

    // Capture phase on window: runs before page-level handlers (mobile menu,
    // map card) and stops them, so Esc and Tab belong to the dialog alone.
    const onKey = (e: KeyboardEvent) => {
      const el = panel.current;
      if (!el) return;
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      e.stopPropagation();
      const items = tabbables(el);
      const active = document.activeElement as HTMLElement | null;
      const inside = !!active && el.contains(active) && active !== el;
      if (!items.length) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (!inside || active === first)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (!inside || active === last)) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey, true);
    const panelEl = panel.current;
    const back = opener;

    return () => {
      window.removeEventListener("keydown", onKey, true);
      root.style.overflow = prev.overflow;
      root.style.scrollbarGutter = prev.gutter;
      // Closed by Back, a link or Esc: hand focus back to the trigger.
      const a = document.activeElement;
      const target = back.current;
      if (target?.isConnected && (!a || a === document.body || panelEl?.contains(a))) target.focus({ preventScroll: true });
    };
  }, [isPresent, onClose]);

  const go = (f: FormParam) => {
    setDoneFor(null);
    router.replace(urlWith(f), { scroll: false });
  };

  const transition = reduce
    ? { duration: 0 }
    : desktop
      ? { duration: 0.42, ease: EASE }
      : { type: "spring" as const, stiffness: 420, damping: 40 };

  return (
    <div className="fixed inset-0 z-[70]">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-ink/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduce ? 0 : 0.24, ease: EASE }}
        onClick={onClose}
      />
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center md:items-center md:p-6">
        <motion.div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-labelledby={TITLE_ID}
          tabIndex={-1}
          className="pointer-events-auto relative flex w-full flex-col overflow-hidden bg-surface shadow-[0_12px_32px_-8px_rgba(27,26,75,0.18)] outline-none! max-md:h-[calc(100dvh-12px)] max-md:rounded-t-[20px] md:max-h-[min(880px,calc(100dvh-48px))] md:w-[560px] md:rounded-[20px]"
          initial={reduce ? { opacity: 0 } : desktop ? { opacity: 0, y: 16 } : { opacity: 1, y: "100%" }}
          animate={reduce ? { opacity: 1 } : desktop ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : desktop ? { opacity: 0, y: 16, transition: { duration: 0.24, ease: EASE } } : { y: "100%" }}
          transition={transition}
        >
          <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-line px-3 md:px-4">
            {form !== "chon" && !done ? (
              <a
                href="?form=chon"
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                  e.preventDefault();
                  go("chon");
                }}
                className="inline-flex h-11 items-center gap-2 rounded-full px-3 text-[14px] font-semibold text-ink transition-colors duration-160 hover:bg-paper"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                {formsUi.back}
              </a>
            ) : (
              <span className="px-3 text-[13px] font-semibold leading-[18px] text-ink-muted">{formsUi.dialogLabel}</span>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label={formsUi.close}
              className="grid size-11 place-items-center rounded-full text-ink transition-colors duration-160 hover:bg-paper"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          <div
            ref={scroller}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[max(32px,env(safe-area-inset-bottom))] pt-6 md:px-8 md:pb-10 md:pt-7"
          >
            <AnimatePresence mode="wait" initial={false} onExitComplete={() => scroller.current?.scrollTo({ top: 0 })}>
              <motion.div
                key={form}
                initial={reduce ? false : { opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, x: -12 }}
                transition={{ duration: 0.24, ease: EASE }}
              >
                {form === "chon" ? (
                  <Picker
                    lastKind={lastKind}
                    onChoose={(k) => {
                      setLastKind(k);
                      go(k);
                    }}
                  />
                ) : (
                  <ConsultForm
                    kind={form}
                    context={context}
                    drafts={drafts}
                    setDrafts={setDrafts}
                    pathname={pathname}
                    onClose={onClose}
                    onSuccess={() => setDoneFor(form)}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- picker -- */

function Picker({ lastKind, onChoose }: { lastKind: ConsultKind | null; onChoose: (k: ConsultKind) => void }) {
  const opts = picker.options;
  const [active, setActive] = useState(() => Math.max(0, opts.findIndex((o) => o.kind === lastKind)));
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const heading = useRef<HTMLHeadingElement>(null);

  // The dialog opens on its title (no ring); Tab then lands on the roving option.
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, []);

  // Radio semantics with a roving tab stop; arrows move, Enter or Space chooses.
  const onKey = (e: ReactKeyboardEvent, i: number) => {
    const n = opts.length;
    let j = -1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") j = (i + 1) % n;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") j = (i - 1 + n) % n;
    else if (e.key === "Home") j = 0;
    else if (e.key === "End") j = n - 1;
    if (j < 0) return;
    e.preventDefault();
    setActive(j);
    items.current[j]?.focus();
  };

  return (
    <div>
      <h2 id={TITLE_ID} ref={heading} tabIndex={-1} className="t-h3 outline-none!">
        {picker.title}
      </h2>
      <div role="radiogroup" aria-labelledby={TITLE_ID} className="mt-6 grid gap-3 sm:grid-cols-3">
        {opts.map((o, i) => {
          const role = ROLE[o.kind];
          const checked = o.kind === lastKind;
          return (
            <button
              key={o.kind}
              ref={(el) => {
                items.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              aria-labelledby={`role-${o.kind}`}
              aria-describedby={`role-${o.kind}-desc`}
              tabIndex={i === active ? 0 : -1}
              onKeyDown={(e) => onKey(e, i)}
              onFocus={() => setActive(i)}
              onClick={() => onChoose(o.kind)}
              className={`group/opt relative flex min-h-[76px] w-full items-center gap-4 rounded-[20px] border px-4 py-3 text-left transition-[background-color,border-color,transform] duration-160 active:scale-[0.98] sm:min-h-[156px] sm:flex-col sm:items-start sm:justify-between sm:p-4 ${
                checked ? "border-indigo-600 bg-indigo-50" : "border-line bg-surface hover:border-ink-muted/75 hover:bg-paper"
              }`}
            >
              <span
                aria-hidden="true"
                className={`grid size-12 shrink-0 place-items-center transition-transform duration-240 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/opt:-translate-y-0.5 sm:size-14 ${role.shape}`}
              >
                <role.Icon size={26} weight="fill" />
              </span>
              <span id={`role-${o.kind}`} className="min-w-0 flex-1 text-[17px] font-semibold leading-6 text-ink sm:flex-none">
                {o.label}
              </span>
              <span id={`role-${o.kind}-desc`} className="sr-only">
                {o.desc}
              </span>
              <CaretRight
                size={20}
                aria-hidden="true"
                className="shrink-0 text-ink transition-transform duration-160 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/opt:translate-x-[3px] sm:absolute sm:right-4 sm:top-4"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ forms -- */

function ConsultForm({
  kind,
  context,
  drafts,
  setDrafts,
  pathname,
  onClose,
  onSuccess,
}: {
  kind: ConsultKind;
  context: ConsultContext;
  drafts: ConsultBodyProps["drafts"];
  setDrafts: ConsultBodyProps["setDrafts"];
  pathname: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const defaults = defaultsFor(kind, context);
  const values: LeadValues = { ...defaults, ...drafts[kind] };
  const heading = useRef<HTMLHeadingElement>(null);

  const lf = useLeadForm({
    type: kind,
    idPrefix: `cm-${kind}`,
    values,
    setValues: (update) => setDrafts((d) => ({ ...d, [kind]: update({ ...defaults, ...d[kind] }) })),
    refs: { schoolIds: SCHOOL_IDS },
    context: { diem: context.diem, goi: kind === "doanh-nghiep" ? context.goi : undefined, taiLieu: context.taiLieu },
    onSuccess: () => {
      setDrafts((d) => ({ ...d, [kind]: {} }));
      onSuccess();
    },
  });

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, []);

  if (lf.status === "success" && lf.result) {
    const onMap = pathname === MAP_PATH;
    return (
      <SuccessPanel title={formsUi.success.title} code={lf.result.code} phone={lf.result.phone} titleId={TITLE_ID}>
        <button type="button" onClick={onClose} className={btn(onMap ? "primary" : "secondary", "md", "w-full sm:w-auto")}>
          {formsUi.success.close}
        </button>
        {!onMap && (
          <Link href={MAP_PATH} className={btnArrow("primary", "w-full sm:w-auto")}>
            {formsUi.success.openMap}
            <BtnArrow />
          </Link>
        )}
      </SuccessPanel>
    );
  }

  const head = formHeads[kind];
  const place = context.diem ? byId.get(context.diem) : undefined;
  const tel = { type: "tel", inputMode: "tel", autoComplete: "tel" } as const;

  return (
    <form noValidate onSubmit={lf.submit} aria-busy={lf.busy || undefined}>
      <div className="flex items-baseline justify-between gap-4">
        <h2 id={TITLE_ID} ref={heading} tabIndex={-1} className="t-h3 outline-none!">
          {head.title}
        </h2>
        <p className="shrink-0 text-[13px] leading-[18px] text-ink-muted">{formsUi.legend}</p>
      </div>
      {(place || context.taiLieu) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {place && <ContextChip icon={<MapPin size={16} />}>{formsUi.interest(place.name)}</ContextChip>}
          {context.taiLieu && <ContextChip icon={<FilePdf size={16} />}>{formsUi.document(context.taiLieu)}</ContextChip>}
        </div>
      )}
      <div className="mt-5">
        <Banner bannerRef={lf.bannerRef}>{lf.banner}</Banner>
      </div>
      <Honeypot value={lf.honey} onChange={lf.setHoney} />

      <div className="space-y-5">
        {kind === "sinh-vien" && (
          <>
            <TextField {...lf.text("hoTen")} autoComplete="name" />
            <SelectField {...lf.select("truong")} options={schoolOptions} />
            {values.truong === otherOption.truong.value && <TextField {...lf.text("tenTruong")} />}
            <SelectField {...lf.select("chuyenNganh")} options={majorOptions} />
            {values.chuyenNganh === otherOption.chuyenNganh.value && <TextField {...lf.text("tenNganh")} />}
            <TextField {...lf.text("soDienThoai")} {...tel} />
          </>
        )}
        {kind === "doanh-nghiep" && (
          <>
            <TextField {...lf.text("tenDoanhNghiep")} autoComplete="organization" />
            <TextField {...lf.text("nguoiLienHe")} autoComplete="name" />
            <TextField {...lf.text("soDienThoai")} {...tel} />
            <CheckGroup {...lf.checks("goi")} options={packageOptions} />
          </>
        )}
        {kind === "nha-truong" && (
          <>
            <TextField {...lf.text("tenCoSo")} list="cm-school-names" autoComplete="off" />
            <datalist id="cm-school-names">
              {schools.map((s) => (
                <option key={s.id} value={s.name} />
              ))}
            </datalist>
            <TextField {...lf.text("nguoiLienHe")} autoComplete="name" />
            <TextField {...lf.text("chucVu")} autoComplete="organization-title" />
            <TextField {...lf.text("soDienThoai")} {...tel} />
            <CheckGroup {...lf.checks("noiDung")} options={schoolTopicOptions} />
          </>
        )}
        <div className="pt-1">
          <Consent {...lf.consent()} />
        </div>
      </div>

      <SubmitButton busy={lf.busy} className="mt-8">
        {head.submit}
      </SubmitButton>
    </form>
  );
}
