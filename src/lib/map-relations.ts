/**
 * Relations between points (spec 4.8, 4.9, 4.12): partners from the data,
 * field matches by shared field, nearest by straight-line distance.
 */
import { byId, internshipSites, schools, type Location } from "@/lib/locations";
import { arc, distanceKm } from "@/lib/geo";

export type LngLat = [number, number];

export const lngLat = (l: Pick<Location, "lng" | "lat">): LngLat => [l.lng, l.lat];

export const distanceFrom = (anchor: LngLat, l: Location) => distanceKm(anchor, lngLat(l));

export function partnersOf(l: Location): Location[] {
  if (l.type === "internship") {
    return (l.partners ?? []).map((id) => byId.get(id)).filter((x): x is Location => !!x);
  }
  return internshipSites.filter((s) => s.partners?.includes(l.id));
}

const shareField = (a: Location, b: Location) => a.fields.some((f) => b.fields.includes(f));

/** Nearest non-partner points of the other type with a shared field. */
export function fieldMatchesOf(l: Location, limit = 5): Location[] {
  const partnerIds = new Set(partnersOf(l).map((p) => p.id));
  const pool = l.type === "school" ? internshipSites : schools;
  const here = lngLat(l);
  return pool
    .filter((o) => !partnerIds.has(o.id) && shareField(l, o))
    .sort((a, b) => distanceKm(here, lngLat(a)) - distanceKm(here, lngLat(b)))
    .slice(0, limit);
}

export function relatedOf(l: Location, matchLimit = 5) {
  return { partners: partnersOf(l), matches: fieldMatchesOf(l, matchLimit) };
}

export function nearest(anchor: LngLat, list: Location[], n: number) {
  return [...list].sort((a, b) => distanceFrom(anchor, a) - distanceFrom(anchor, b)).slice(0, n);
}

/** Relation curve (spec 4.9): quadratic Bézier, 18% left bend, 32 samples. */
export const relationCurve = (from: LngLat, to: LngLat) => arc(from, to, 0.18, 31);

/** A circle polygon around `center` with `km` radius (hero 5 km ring). */
export function circlePolygon(center: LngLat, km: number, steps = 96): GeoJSON.Polygon {
  const [lng, lat] = center;
  const dLat = km / 110.574;
  const dLng = km / (111.32 * Math.cos((lat * Math.PI) / 180));
  const ring: LngLat[] = [];
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    ring.push([lng + dLng * Math.cos(a), lat + dLat * Math.sin(a)]);
  }
  return { type: "Polygon", coordinates: [ring] };
}

export function boundsOf(points: LngLat[]): [[number, number], [number, number]] {
  let w = Infinity, s = Infinity, e = -Infinity, n = -Infinity;
  for (const [x, y] of points) {
    w = Math.min(w, x); e = Math.max(e, x);
    s = Math.min(s, y); n = Math.max(n, y);
  }
  return [[w, s], [e, n]];
}

/** "hcmussh.edu.vn/giaoduc" from a website URL. */
export function domainOf(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
}
