"use client";

import { CaretDown, Check, WarningCircle } from "@phosphor-icons/react";
import type { InputHTMLAttributes, ReactNode, Ref, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { formsUi } from "@/content/forms";

/**
 * Form primitives (spec 5.1). Labels above inputs, 14px 600; `*` is aria-hidden
 * and the control carries aria-required; errors sit under the control in 13px
 * danger with WarningCircle and are wired through aria-describedby.
 */

const control =
  "block w-full rounded-[12px] bg-surface text-[16px] leading-6 text-ink transition-[border-color,background-color] duration-160 " +
  "placeholder:text-ink-muted read-only:bg-paper disabled:bg-paper";
const border = (invalid: boolean) =>
  invalid ? "border-[1.5px] border-danger" : "border border-ink-muted/75 hover:border-ink-muted focus:border-indigo-600";

export const ids = (id: string, help?: string, error?: string) =>
  [help ? `${id}-help` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;

export function Label({ htmlFor, required, children, as = "label" }: { htmlFor?: string; required?: boolean; children: ReactNode; as?: "label" | "legend" | "span" }) {
  const Tag = as;
  return (
    <Tag {...(as === "label" ? { htmlFor } : {})} className="mb-2 block text-[14px] font-semibold leading-5 text-ink">
      {children}
      {required && (
        <span aria-hidden="true" className="ml-0.5 text-danger">
          *
        </span>
      )}
    </Tag>
  );
}

export function FieldError({ id, children }: { id: string; children?: string }) {
  if (!children) return null;
  return (
    <p id={`${id}-error`} className="mt-2 flex items-start gap-1.5 text-[13px] leading-[18px] text-danger">
      <WarningCircle size={16} weight="regular" aria-hidden="true" className="mt-px shrink-0" />
      <span>{children}</span>
    </p>
  );
}

export function Help({ id, children }: { id: string; children?: string }) {
  if (!children) return null;
  return (
    <p id={`${id}-help`} className="mt-2 text-[13px] leading-[18px] text-ink-muted">
      {children}
    </p>
  );
}

type Common = { id: string; label: string; required?: boolean; help?: string; error?: string };

export function TextField({
  id,
  label,
  required,
  help,
  error,
  inputRef,
  ...rest
}: Common & InputHTMLAttributes<HTMLInputElement> & { inputRef?: Ref<HTMLInputElement> }) {
  return (
    <div>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <input
        id={id}
        ref={inputRef}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={ids(id, help, error)}
        className={`${control} ${border(!!error)} h-12 px-4`}
        {...rest}
      />
      <FieldError id={id}>{error}</FieldError>
      <Help id={id}>{help}</Help>
    </div>
  );
}

export function TextAreaField({
  id,
  label,
  required,
  help,
  error,
  counter,
  over,
  ...rest
}: Common & TextareaHTMLAttributes<HTMLTextAreaElement> & { counter?: string; over?: boolean }) {
  return (
    <div>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <textarea
        id={id}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={[ids(id, help, error), counter ? `${id}-count` : null].filter(Boolean).join(" ") || undefined}
        rows={5}
        className={`${control} ${border(!!error)} min-h-[144px] resize-y px-4 py-3`}
        {...rest}
      />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <FieldError id={id}>{error}</FieldError>
          <Help id={id}>{help}</Help>
        </div>
        {counter && (
          <p id={`${id}-count`} className={`tabular mt-2 shrink-0 text-[13px] leading-[18px] ${over ? "text-danger" : "text-ink-muted"}`}>
            {counter}
          </p>
        )}
      </div>
    </div>
  );
}

export function SelectField({
  id,
  label,
  required,
  help,
  error,
  options,
  placeholder = formsUi.selectPlaceholder,
  ...rest
}: Common &
  SelectHTMLAttributes<HTMLSelectElement> & {
    options: readonly { value: string; label: string }[];
    placeholder?: string;
  }) {
  return (
    <div>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <div className="relative">
        <select
          id={id}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={ids(id, help, error)}
          className={`${control} ${border(!!error)} h-12 appearance-none truncate pl-4 pr-11 ${rest.value ? "" : "text-ink-muted"}`}
          {...rest}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value} className="text-ink">
              {o.label}
            </option>
          ))}
        </select>
        <CaretDown size={18} aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink" />
      </div>
      <FieldError id={id}>{error}</FieldError>
      <Help id={id}>{help}</Help>
    </div>
  );
}

function Box({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 grid place-items-center rounded-[6px] text-white transition-opacity duration-160 ${checked ? "opacity-100" : "opacity-0"}`}
    >
      <Check size={14} weight="bold" />
    </span>
  );
}

const boxInput =
  "peer block size-5 cursor-pointer appearance-none rounded-[6px] border-[1.5px] border-ink-muted bg-surface transition-colors duration-160 " +
  "checked:border-indigo-700 checked:bg-indigo-700 aria-[invalid=true]:border-danger";

export function CheckGroup({
  id,
  label,
  required,
  error,
  options,
  value,
  onToggle,
  onBlur,
  readOnly,
}: Common & {
  options: readonly { value: string; label: string }[];
  value: string[];
  onToggle: (v: string, on: boolean) => void;
  onBlur?: () => void;
  readOnly?: boolean;
}) {
  return (
    <fieldset
      aria-describedby={error ? `${id}-error` : undefined}
      onBlur={(e) => {
        // validate once focus leaves the whole group, not between its boxes
        if (onBlur && !e.currentTarget.contains(e.relatedTarget as Node | null)) onBlur();
      }}
    >
      <Label as="legend" required={required}>
        {label}
      </Label>
      <div className="space-y-2">
        {options.map((o, i) => {
          const on = value.includes(o.value);
          return (
            <label
              key={o.value}
              className={`flex cursor-pointer items-start gap-3 rounded-[12px] border px-4 py-3 transition-colors duration-160 ${
                on ? "border-indigo-600 bg-indigo-50" : error ? "border-danger/60" : "border-line hover:border-ink-muted/75"
              }`}
            >
              <span className="relative mt-[3px] size-5 shrink-0">
                <input
                  id={i === 0 ? id : undefined}
                  type="checkbox"
                  className={boxInput}
                  checked={on}
                  aria-invalid={error ? true : undefined}
                  onChange={(e) => !readOnly && onToggle(o.value, e.target.checked)}
                />
                <Box checked={on} />
              </span>
              <span className="text-[15px] leading-6 text-ink">{o.label}</span>
            </label>
          );
        })}
      </div>
      <FieldError id={id}>{error}</FieldError>
    </fieldset>
  );
}

export function Consent({
  id,
  label,
  checked,
  error,
  onChange,
  onBlur,
  readOnly,
}: {
  id: string;
  label: string;
  checked: boolean;
  error?: string;
  onChange: (v: boolean) => void;
  onBlur?: () => void;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <span className="relative mt-[2px] size-5 shrink-0">
          <input
            id={id}
            type="checkbox"
            className={boxInput}
            checked={checked}
            aria-required="true"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            onChange={(e) => !readOnly && onChange(e.target.checked)}
            onBlur={onBlur}
          />
          <Box checked={checked} />
        </span>
        <span className="text-[14px] leading-[22px] text-ink">
          {label}
          <span aria-hidden="true" className="ml-0.5 text-danger">
            *
          </span>
        </span>
      </label>
      <FieldError id={id}>{error}</FieldError>
    </div>
  );
}

/** Visually hidden trap field named `website` (spec 5.1). Real people never see it. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute -left-[10000px] top-0 h-px w-px overflow-hidden opacity-0">
      <label>
        {formsUi.honeypot}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}

export function Banner({ children, bannerRef }: { children?: string | null; bannerRef?: Ref<HTMLDivElement> }) {
  return (
    <div ref={bannerRef} role="alert" aria-live="assertive">
      {children && (
        <div className="mb-6 flex items-start gap-3 rounded-[12px] border-[1.5px] border-danger bg-danger/[0.06] px-4 py-3 text-[14px] leading-[22px] text-ink">
          <WarningCircle size={20} aria-hidden="true" className="mt-px shrink-0 text-danger" />
          <span>{children}</span>
        </div>
      )}
    </div>
  );
}

/** Inline 16px spinner, the only spinner in the system (spec 5.5). */
export function Spinner() {
  return <span aria-hidden="true" className="spinner inline-block size-4 rounded-full border-2 border-white/35 border-t-white" />;
}
