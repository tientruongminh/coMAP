"use client";

import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { fieldHelp, fieldLabels, formsUi } from "@/content/forms";
import {
  RULES,
  maskPhone,
  normalizePhone,
  rulesFor,
  validateField,
  type FieldKey,
  type FieldValue,
  type LeadErrors,
  type LeadType,
  type LeadValues,
  type SchemaRefs,
} from "@/lib/lead-schema";

/**
 * Form state for every lead form (spec 5.1, 5.5).
 * - Validate on blur; once a field shows an error, re-validate it on change.
 * - Submit validates everything and focuses the first invalid field.
 * - POST /api/lead; 400 maps errors onto fields, 429 and network errors show a banner.
 * Values are owned by the caller so the dialog can keep drafts while closed.
 */
export type Status = "idle" | "submitting" | "success";

export interface LeadFormOptions {
  type: LeadType;
  /** Prefix for element ids, unique per form instance on the page. */
  idPrefix: string;
  values: LeadValues;
  setValues: (update: (v: LeadValues) => LeadValues) => void;
  refs?: SchemaRefs;
  /** Hidden context stored with the lead (location id, document, package). */
  context?: Record<string, string | undefined>;
  onSuccess?: () => void;
}

const TIMEOUT_MS = 15_000;

function prune(errors: LeadErrors, type: LeadType, values: LeadValues): LeadErrors {
  const live = new Set(rulesFor(type, values).map((r) => r.key));
  const next: LeadErrors = {};
  for (const [k, v] of Object.entries(errors) as [FieldKey, string | undefined][]) if (v && live.has(k)) next[k] = v;
  return next;
}

export function useLeadForm({ type, idPrefix, values, setValues, refs, context, onSuccess }: LeadFormOptions) {
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [banner, setBanner] = useState<string | null>(null);
  const [result, setResult] = useState<{ code: string; phone: string } | null>(null);
  const [honey, setHoney] = useState("");
  const [focusKey, setFocusKey] = useState<{ key: FieldKey } | null>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  const busy = status === "submitting";
  const id = (k: FieldKey) => `${idPrefix}-${k}`;
  const required = (k: FieldKey) => RULES[type].some((r) => r.key === k && r.required);

  // Move focus once the error state has rendered, so assistive tech reads the message.
  useEffect(() => {
    if (!focusKey) return;
    document.getElementById(`${idPrefix}-${focusKey.key}`)?.focus();
  }, [focusKey, idPrefix]);

  useEffect(() => {
    if (banner) bannerRef.current?.scrollIntoView({ block: "nearest" });
  }, [banner]);

  // Routes stay mounted (hidden) after navigation: start clean when shown again.
  useLayoutEffect(
    () => () => {
      setStatus((s) => (s === "success" ? "idle" : s));
      setBanner(null);
    },
    [],
  );

  function set(k: FieldKey, value: FieldValue) {
    if (busy) return;
    const next = { ...values, [k]: value };
    setValues((v) => ({ ...v, [k]: value }));
    setErrors((e) => {
      const kept = prune(e, type, next);
      if (e[k]) kept[k] = validateField(type, k, next, refs);
      return kept;
    });
  }

  function blur(k: FieldKey) {
    if (busy) return;
    setErrors((e) => ({ ...e, [k]: validateField(type, k, values, refs) }));
  }

  function toggle(k: FieldKey, option: string, on: boolean) {
    const cur = Array.isArray(values[k]) ? (values[k] as string[]) : [];
    set(k, on ? [...cur.filter((x) => x !== option), option] : cur.filter((x) => x !== option));
  }

  function showErrors(next: LeadErrors) {
    setErrors(next);
    const first = rulesFor(type, values).find((r) => next[r.key]);
    if (first) setFocusKey({ key: first.key });
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;

    const errs: LeadErrors = {};
    for (const r of rulesFor(type, values)) {
      const msg = validateField(type, r.key, values, refs);
      if (msg) errs[r.key] = msg;
    }
    if (Object.keys(errs).length) {
      showErrors(errs);
      return;
    }

    setStatus("submitting");
    setBanner(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type,
          fields: values,
          context: context ? Object.fromEntries(Object.entries(context).filter(([, v]) => v)) : {},
          sourcePage: window.location.pathname,
          website: honey,
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; code?: string; errors?: LeadErrors } | null;

      if (res.ok && data?.ok && data.code) {
        const phone = normalizePhone(String(values.soDienThoai ?? "")) ?? "";
        setResult({ code: data.code, phone: maskPhone(phone) });
        setErrors({});
        setStatus("success");
        onSuccess?.();
        return;
      }
      setStatus("idle");
      if (res.status === 400 && data?.errors && Object.keys(data.errors).length) {
        showErrors(data.errors);
        return;
      }
      setBanner(res.status === 429 ? formsUi.banners.rate : formsUi.banners.network);
    } catch {
      setStatus("idle");
      setBanner(formsUi.banners.network);
    }
  }

  function reset() {
    setValues(() => ({}));
    setErrors({});
    setBanner(null);
    setResult(null);
    setHoney("");
    setStatus("idle");
  }

  /** Common props for TextField / SelectField / TextAreaField. */
  function field(k: FieldKey) {
    return {
      id: id(k),
      label: fieldLabels[k],
      required: required(k),
      help: fieldHelp[k],
      error: errors[k],
      onBlur: () => blur(k),
    };
  }

  function text(k: FieldKey) {
    return {
      ...field(k),
      value: typeof values[k] === "string" ? (values[k] as string) : "",
      onChange: (e: { target: { value: string } }) => set(k, e.target.value),
      readOnly: busy,
    };
  }

  function select(k: FieldKey) {
    return {
      ...field(k),
      value: typeof values[k] === "string" ? (values[k] as string) : "",
      onChange: (e: { target: { value: string } }) => set(k, e.target.value),
      "aria-readonly": busy || undefined,
    };
  }

  function checks(k: FieldKey) {
    return {
      id: id(k),
      label: fieldLabels[k],
      required: required(k),
      error: errors[k],
      value: Array.isArray(values[k]) ? (values[k] as string[]) : [],
      onToggle: (option: string, on: boolean) => toggle(k, option, on),
      onBlur: () => blur(k),
      readOnly: busy,
    };
  }

  function consent() {
    return {
      id: id("dongY"),
      label: formsUi.consent,
      checked: values.dongY === true,
      error: errors.dongY,
      onChange: (v: boolean) => set("dongY", v),
      onBlur: () => blur("dongY"),
      readOnly: busy,
    };
  }

  return {
    values,
    errors,
    status,
    busy,
    banner,
    bannerRef,
    result,
    honey,
    setHoney,
    id,
    set,
    blur,
    submit,
    reset,
    text,
    select,
    checks,
    consent,
  };
}

export type LeadForm = ReturnType<typeof useLeadForm>;
