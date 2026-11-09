/** Vietnamese formatting and text helpers shared by every page. */

const NBSP = "\u00a0";

/** dd/mm/yyyy from an ISO date (yyyy-mm-dd or full ISO). */
export function formatDate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
}

const nf = new Intl.NumberFormat("vi-VN");
const nf1 = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 });

export function formatNumber(n: number) {
  return nf.format(n);
}

/** Straight-line distance: `850 m` under 1 km, else `2,4 km` (spec 4.6). */
export function formatDistance(km: number) {
  if (km < 1) return `${Math.max(10, Math.round((km * 1000) / 10) * 10)}${NBSP}m`;
  return `${nf1.format(km)}${NBSP}km`;
}

/**
 * Accent-insensitive normalization used for search (spec 4.5):
 * lowercase, NFD, strip combining marks, đ to d, collapse whitespace.
 */
export function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ")
    .trim();
}

/** URL-safe slug from a Vietnamese label: "Quận 1" to "quan-1". */
export function slugify(s: string) {
  return normalize(s)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Reading time in minutes: ceil(words / 200). */
export function readMinutes(text: string) {
  return Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 200));
}
