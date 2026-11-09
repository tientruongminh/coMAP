/**
 * Shared lead validation (spec 5.1 to 5.6). The consult dialog, the Liên hệ
 * form and POST /api/lead all run these exact rules, so a message the browser
 * shows is the message the server would return.
 *
 * Kept free of `data/locations.json` so client bundles stay small: callers pass
 * the known school ids in `refs` when they have them (the server always does).
 */
import { fieldSlug } from "@/content/taxonomy";
import {
  contactTopicOptions,
  errorCopy,
  fieldLabels,
  otherOption,
  packageOptions,
  schoolTopicOptions,
  type FieldKey,
  type LeadType,
} from "@/content/forms";

export type { LeadType, FieldKey } from "@/content/forms";

export const LEAD_TYPES: LeadType[] = ["sinh-vien", "doanh-nghiep", "nha-truong", "lien-he"];
export const isLeadType = (v: unknown): v is LeadType => typeof v === "string" && (LEAD_TYPES as string[]).includes(v);

export type FieldValue = string | string[] | boolean;
export type LeadValues = Partial<Record<FieldKey, FieldValue>>;
export type LeadErrors = Partial<Record<FieldKey, string>>;

export interface SchemaRefs {
  /** Known school ids for `truong`. Without it any non-empty value is accepted. */
  schoolIds?: readonly string[];
}

type Kind = "text" | "tel" | "email" | "select" | "checks" | "textarea" | "consent";

interface Rule {
  key: FieldKey;
  kind: Kind;
  required: boolean;
  /** Allowed values for select/checks. `null` means "resolved from refs". */
  options?: readonly string[] | null;
  /** Field only exists when this returns true (conditional "khác" fields). */
  when?: (v: LeadValues) => boolean;
}

const TEXT_MIN = 2;
const TEXT_MAX = 120;
const MSG_MIN = 10;
const MSG_MAX = 1000;

export const FIELD_SLUGS = Object.values(fieldSlug);

const phone: Rule = { key: "soDienThoai", kind: "tel", required: true };
const consent: Rule = { key: "dongY", kind: "consent", required: true };

/** Field order per form. The first invalid field in this order receives focus. */
export const RULES: Record<LeadType, Rule[]> = {
  "sinh-vien": [
    { key: "hoTen", kind: "text", required: true },
    { key: "truong", kind: "select", required: true, options: null },
    { key: "tenTruong", kind: "text", required: true, when: (v) => v.truong === otherOption.truong.value },
    { key: "chuyenNganh", kind: "select", required: true, options: [...FIELD_SLUGS, otherOption.chuyenNganh.value] },
    { key: "tenNganh", kind: "text", required: true, when: (v) => v.chuyenNganh === otherOption.chuyenNganh.value },
    phone,
    consent,
  ],
  "doanh-nghiep": [
    { key: "tenDoanhNghiep", kind: "text", required: true },
    { key: "nguoiLienHe", kind: "text", required: true },
    phone,
    { key: "goi", kind: "checks", required: true, options: packageOptions.map((o) => o.value) },
    consent,
  ],
  "nha-truong": [
    { key: "tenCoSo", kind: "text", required: true },
    { key: "nguoiLienHe", kind: "text", required: true },
    { key: "chucVu", kind: "text", required: true },
    phone,
    { key: "noiDung", kind: "checks", required: true, options: schoolTopicOptions.map((o) => o.value) },
    consent,
  ],
  "lien-he": [
    { key: "hoTen", kind: "text", required: true },
    phone,
    { key: "email", kind: "email", required: false },
    { key: "chuDe", kind: "select", required: true, options: contactTopicOptions.map((o) => o.value) },
    { key: "loiNhan", kind: "textarea", required: true },
    consent,
  ],
};

export const PHONE_RE = /^(0|\+84)(3|5|7|8|9)\d{8}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Strip spaces, dots and hyphens; return `0xxxxxxxxx` or null (spec 5.1). */
export function normalizePhone(raw: string): string | null {
  const s = raw.replace(/[\s.\-]/g, "");
  if (!PHONE_RE.test(s)) return null;
  return s.startsWith("+84") ? `0${s.slice(3)}` : s;
}

/** Keep the first 2 and last 3 digits: `09•• ••• 678` (spec 5.5). */
export function maskPhone(normalized: string): string {
  const d = normalized.replace(/\D/g, "");
  if (d.length < 6) return "•••";
  const head = d.slice(0, 2);
  const tail = d.slice(-3);
  const hidden = d.length - 5;
  const dots = "•".repeat(hidden);
  // group like 0912 345 678: 4, 3, 3
  const first = (head + dots).slice(0, 4);
  const middle = (head + dots).slice(4);
  return `${first}${middle ? ` ${middle}` : ""} ${tail}`;
}

const cleanText = (v: unknown) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ") : "");
const cleanMessage = (v: unknown) => (typeof v === "string" ? v.replace(/\r\n/g, "\n").trim() : "");
const label = (k: FieldKey) => fieldLabels[k];

function optionsFor(rule: Rule, refs?: SchemaRefs): readonly string[] | undefined {
  if (rule.options !== null) return rule.options;
  return refs?.schoolIds ? [...refs.schoolIds, otherOption.truong.value] : undefined;
}

export function rulesFor(type: LeadType, values: LeadValues): Rule[] {
  return RULES[type].filter((r) => !r.when || r.when(values));
}

/** Validate one field. Returns the error message, or undefined when valid. */
export function validateField(type: LeadType, key: FieldKey, values: LeadValues, refs?: SchemaRefs): string | undefined {
  const rule = rulesFor(type, values).find((r) => r.key === key);
  if (!rule) return undefined;
  const raw = values[key];

  switch (rule.kind) {
    case "text": {
      const t = cleanText(raw);
      if (!t) return rule.required ? errorCopy.required(label(key)) : undefined;
      if (t.length < TEXT_MIN) return errorCopy.min(label(key), TEXT_MIN);
      if (t.length > TEXT_MAX) return errorCopy.max(label(key), String(TEXT_MAX));
      return undefined;
    }
    case "tel": {
      const t = cleanText(raw);
      if (!t) return errorCopy.phoneEmpty;
      return normalizePhone(t) ? undefined : errorCopy.phoneInvalid;
    }
    case "email": {
      const t = cleanText(raw);
      if (!t) return undefined;
      return t.length <= 160 && EMAIL_RE.test(t) ? undefined : errorCopy.email;
    }
    case "select": {
      const t = typeof raw === "string" ? raw : "";
      const opts = optionsFor(rule, refs);
      if (!t || (opts && !opts.includes(t))) return errorCopy.select[key];
      return undefined;
    }
    case "checks": {
      const opts = optionsFor(rule, refs) ?? [];
      const picked = Array.isArray(raw) ? raw.filter((x) => opts.includes(x)) : [];
      return picked.length ? undefined : errorCopy.checks[key];
    }
    case "textarea": {
      const t = cleanMessage(raw);
      if (!t) return errorCopy.message.required;
      if (t.length < MSG_MIN) return errorCopy.message.min;
      if (t.length > MSG_MAX) return errorCopy.message.max;
      return undefined;
    }
    case "consent":
      return raw === true ? undefined : errorCopy.consent;
  }
}

export type LeadResult =
  | { ok: true; fields: Record<string, string | string[] | boolean> }
  | { ok: false; errors: LeadErrors };

/** Validate a whole form and return the normalized fields stored in leads.jsonl. */
export function validateLead(type: LeadType, input: unknown, refs?: SchemaRefs): LeadResult {
  const values = (input && typeof input === "object" ? input : {}) as LeadValues;
  const errors: LeadErrors = {};
  const fields: Record<string, string | string[] | boolean> = {};

  for (const rule of rulesFor(type, values)) {
    const msg = validateField(type, rule.key, values, refs);
    if (msg) {
      errors[rule.key] = msg;
      continue;
    }
    const raw = values[rule.key];
    switch (rule.kind) {
      case "tel":
        fields[rule.key] = normalizePhone(cleanText(raw)) as string;
        break;
      case "email": {
        const t = cleanText(raw);
        if (t) fields[rule.key] = t;
        break;
      }
      case "checks": {
        const opts = optionsFor(rule, refs) ?? [];
        fields[rule.key] = (raw as string[]).filter((x, i, a) => opts.includes(x) && a.indexOf(x) === i);
        break;
      }
      case "textarea":
        fields[rule.key] = cleanMessage(raw);
        break;
      case "consent":
        fields[rule.key] = true;
        break;
      default:
        fields[rule.key] = cleanText(raw);
    }
  }
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, fields };
}

/** Message length helpers for the live counter on the Liên hệ form. */
export const MESSAGE_MAX = MSG_MAX;
export const messageLength = (v: unknown) => cleanMessage(v).length;
