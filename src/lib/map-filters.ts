/**
 * Map filter model (spec 4.7): 8 multi-select groups, OR within a group,
 * AND across groups. Position-level groups (vi-tri, tinh-chat, phu-cap) must be
 * satisfied by one single position. Site-only groups never filter schools.
 */
import { locations, meta, type Location, type Position } from "@/lib/locations";
import { normalize } from "@/lib/format";
import {
  areaSlug,
  fieldSlug,
  ownershipLabel,
  ownershipSlug,
  roleKeys,
  roleLabel,
  sizeSlug,
  stipendSlug,
  typeLabel,
  typeSlug,
  workTypeSlug,
} from "@/content/taxonomy";

export const FILTER_KEYS = ["loai", "so-huu", "nganh", "vi-tri", "tinh-chat", "khu-vuc", "phu-cap", "quy-mo"] as const;
export type FilterKey = (typeof FILTER_KEYS)[number];
export type Filters = Record<FilterKey, string[]>;

export interface FilterOption {
  slug: string;
  label: string;
}

/** Groups that only describe internship sites. Schools are never removed by them. */
export const SITE_ONLY = new Set<FilterKey>(["vi-tri", "tinh-chat", "phu-cap", "quy-mo"]);
/** Groups that one position must satisfy together. */
const POSITION_LEVEL: FilterKey[] = ["vi-tri", "tinh-chat", "phu-cap"];

const entries = <K extends string>(r: Record<K, string>) => Object.entries(r) as [K, string][];

export const filterOptions: Record<FilterKey, FilterOption[]> = {
  loai: [
    { slug: typeSlug.school, label: typeLabel.school },
    { slug: typeSlug.internship, label: typeLabel.internship },
  ],
  "so-huu": [
    { slug: ownershipSlug.public, label: ownershipLabel.public },
    { slug: ownershipSlug.private, label: ownershipLabel.private },
  ],
  nganh: entries(fieldSlug).map(([label, slug]) => ({ slug, label })),
  "vi-tri": roleKeys.map((k) => ({ slug: k, label: roleLabel[k] })),
  "tinh-chat": entries(workTypeSlug).map(([label, slug]) => ({ slug, label })),
  "khu-vuc": meta.areas.map((a) => ({ slug: areaSlug(a), label: a })),
  "phu-cap": entries(stipendSlug).map(([label, slug]) => ({ slug, label })),
  "quy-mo": (["small", "medium", "large"] as const).map((s) => ({ slug: sizeSlug[s], label: meta.sizes[s] })),
};

const labelIndex = new Map<string, string>(
  FILTER_KEYS.flatMap((k) => filterOptions[k].map((o) => [`${k}:${o.slug}`, o.label] as [string, string])),
);
export const optionLabel = (key: FilterKey, slug: string) => labelIndex.get(`${key}:${slug}`) ?? slug;

export function emptyFilters(): Filters {
  return Object.fromEntries(FILTER_KEYS.map((k) => [k, []])) as unknown as Filters;
}

export function isEmpty(f: Filters) {
  return FILTER_KEYS.every((k) => f[k].length === 0);
}

export function activeGroupCount(f: Filters) {
  return FILTER_KEYS.filter((k) => f[k].length > 0).length;
}

export function toggle(f: Filters, key: FilterKey, slug: string): Filters {
  const cur = f[key];
  return { ...f, [key]: cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug] };
}

/* ---------- precomputed slugs per location ---------- */

interface Facets {
  loai: string;
  soHuu: string;
  nganh: Set<string>;
  khuVuc: string;
  quyMo: string;
  text: string;
}

const facets = new Map<string, Facets>(
  locations.map((l) => [
    l.id,
    {
      loai: typeSlug[l.type],
      soHuu: ownershipSlug[l.ownership],
      nganh: new Set(l.fields.map((f) => fieldSlug[f]).filter(Boolean)),
      khuVuc: areaSlug(l.area),
      quyMo: sizeSlug[l.size],
      text: normalize(
        [l.name, l.short, l.unit, ...l.fields, ...l.positions.map((p) => p.title), l.ward, l.area, l.address]
          .filter(Boolean)
          .join(" "),
      ),
    },
  ]),
);

export const textOf = (l: Location) => facets.get(l.id)!.text;

export function positionMatches(p: Position, f: Filters) {
  if (f["vi-tri"].length && !p.roles.some((r) => f["vi-tri"].includes(r))) return false;
  if (f["tinh-chat"].length && !f["tinh-chat"].includes(workTypeSlug[p.workType])) return false;
  if (f["phu-cap"].length && !f["phu-cap"].includes(stipendSlug[p.stipend])) return false;
  return true;
}

export const hasPositionFilter = (f: Filters) => POSITION_LEVEL.some((k) => f[k].length > 0);

/** Text filter `q`: every token must appear in the indexed text. */
export function matchesText(l: Location, q: string) {
  const tokens = normalize(q).split(" ").filter(Boolean);
  if (!tokens.length) return true;
  const t = textOf(l);
  return tokens.every((tok) => t.includes(tok));
}

export function matches(l: Location, f: Filters, q = ""): boolean {
  const x = facets.get(l.id)!;
  if (f.loai.length && !f.loai.includes(x.loai)) return false;
  if (f["so-huu"].length && !f["so-huu"].includes(x.soHuu)) return false;
  if (f.nganh.length && !f.nganh.some((s) => x.nganh.has(s))) return false;
  if (f["khu-vuc"].length && !f["khu-vuc"].includes(x.khuVuc)) return false;
  if (l.type === "internship") {
    if (f["quy-mo"].length && !f["quy-mo"].includes(x.quyMo)) return false;
    if (hasPositionFilter(f) && !l.positions.some((p) => positionMatches(p, f))) return false;
  }
  return matchesText(l, q);
}

export function filterLocations(f: Filters, q = "", list: Location[] = locations) {
  return list.filter((l) => matches(l, f, q));
}

/**
 * Live count for one option (spec 4.7): results with this group set to only this
 * option, other groups unchanged. Site-only groups count sites only, so an
 * option no site satisfies reads 0 and is disabled.
 */
export function optionCount(f: Filters, key: FilterKey, slug: string, q = "") {
  const g = { ...f, [key]: [slug] };
  const pool = SITE_ONLY.has(key) ? locations.filter((l) => l.type === "internship") : locations;
  return pool.reduce((n, l) => n + (matches(l, g, q) ? 1 : 0), 0);
}

/** Count per type with the `loai` group ignored (for the quick toggles). */
export function typeCounts(f: Filters, q = "") {
  const g = { ...f, loai: [] };
  let schools = 0;
  let sites = 0;
  for (const l of locations) {
    if (!matches(l, g, q)) continue;
    if (l.type === "school") schools++;
    else sites++;
  }
  return { schools, sites };
}

/* ---------- URL (spec 4.10) ---------- */

const valid = new Map<FilterKey, Set<string>>(FILTER_KEYS.map((k) => [k, new Set(filterOptions[k].map((o) => o.slug))]));

export function parseFilters(sp: URLSearchParams): Filters {
  const f = emptyFilters();
  for (const k of FILTER_KEYS) {
    const raw = sp.get(k);
    if (!raw) continue;
    const ok = valid.get(k)!;
    f[k] = [...new Set(raw.split(",").map((s) => s.trim()).filter((s) => ok.has(s)))];
  }
  return f;
}

export function writeFilters(sp: URLSearchParams, f: Filters) {
  for (const k of FILTER_KEYS) {
    if (f[k].length) sp.set(k, f[k].join(","));
    else sp.delete(k);
  }
}

/** Areas present in the data (14 of 22). */
export const areasWithData = new Set(locations.map((l) => areaSlug(l.area)));
