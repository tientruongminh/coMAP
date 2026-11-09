/**
 * Accent-insensitive typeahead over the dataset (spec 4.5).
 * `su pham` finds "Sư phạm", `thu duc` finds TP. Thủ Đức.
 */
import { locations, meta, type Location } from "@/lib/locations";
import { normalize } from "@/lib/format";
import { areaSlug, fieldSlug } from "@/content/taxonomy";

/**
 * Normalized text with punctuation folded to spaces and padded with a space on
 * each side, so `at()` can test word boundaries: "thu" must start a word, and
 * never matches inside "thuc" (thực) or "duc" inside a longer word.
 */
const bounded = (s: string) => ` ${normalize(s).replace(/[^\p{L}\p{N}]+/gu, " ").trim()} `;

/** `q` starts at a word boundary in padded text `t`; its last word may be partial (typeahead). */
const at = (t: string, q: string) => t.includes(` ${q}`);

interface Indexed {
  loc: Location;
  name: string;
  short: string;
  fields: string;
  ward: string;
  place: string;
  all: string;
}

const index: Indexed[] = locations.map((l) => {
  const name = bounded(l.name);
  const short = bounded(l.short ?? "");
  const fields = bounded([...l.fields, ...l.positions.map((p) => p.title)].join(" "));
  const ward = bounded(l.ward);
  const place = bounded([l.area, l.address].join(" "));
  return {
    loc: l,
    name,
    short,
    fields,
    ward,
    place,
    all: [name, short, bounded(l.unit ?? ""), fields, ward, place].join(" "),
  };
});

const tokensOf = (q: string) => bounded(q).split(" ").filter(Boolean);

/** 0 when `q` is whole words in `t`, 1 when its last word is only a prefix ("1" of "10"), 2 when absent. */
const fit = (t: string, q: string) => (t.includes(` ${q} `) ? 0 : at(t, q) ? 1 : 2);

/** Lower is better. A whole-phrase hit always beats scattered token hits; whole words beat prefixes. */
function rank(x: Indexed, phrase: string, tokens: string[]) {
  if (x.name.startsWith(` ${phrase}`) || x.short.startsWith(` ${phrase}`)) return 0;
  const tiers = [Math.min(fit(x.name, phrase), fit(x.short, phrase)), fit(x.ward, phrase), fit(x.place, phrase)];
  for (let i = 0; i < tiers.length; i++) if (tiers[i] < 2) return 1 + i * 2 + tiers[i];
  if (tokens.every((t) => at(x.name, t) || at(x.short, t))) return 7;
  if (at(x.fields, phrase)) return 8;
  return 9;
}

export function searchLocations(q: string, limit = 5): Location[] {
  const tokens = tokensOf(q);
  if (!tokens.length) return [];
  const phrase = tokens.join(" ");
  return index
    .filter((x) => tokens.every((t) => at(x.all, t)))
    .map((x) => ({ x, r: rank(x, phrase, tokens) }))
    .sort((a, b) => a.r - b.r || a.x.loc.name.localeCompare(b.x.loc.name, "vi"))
    .slice(0, limit)
    .map((e) => e.x.loc);
}

const fieldIndex = Object.entries(fieldSlug).map(([label, slug]) => ({ label, slug, n: bounded(label) }));
const areaIndex = meta.areas.map((label) => ({ label, slug: areaSlug(label), n: bounded(label) }));

function matchLabels<T extends { n: string }>(list: T[], q: string) {
  const tokens = tokensOf(q);
  if (!tokens.length) return [];
  return list.filter((x) => tokens.every((t) => at(x.n, t)));
}

export const searchFields = (q: string) => matchLabels(fieldIndex, q).slice(0, 4);
export const searchAreas = (q: string) => matchLabels(areaIndex, q).slice(0, 4);

export interface GeocodeResult {
  label: string;
  lat: number;
  lng: number;
}
