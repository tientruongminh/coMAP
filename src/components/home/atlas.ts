import type { Location } from "@/lib/locations";

/** km per degree at TP.HCM's latitude (about 10.8°N). */
const KX = 109.4;
const KY = 110.6;

type LatLng = Pick<Location, "lat" | "lng">;

/**
 * A flat projection of real coordinates into an SVG box, for the small
 * wordless map plates of the home page (no tiles, no MapLibre).
 */
export function makeAtlas(list: LatLng[], pxPerKm: number, margin: number) {
  const lngs = list.map((l) => l.lng);
  const lats = list.map((l) => l.lat);
  const minLng = Math.min(...lngs);
  const maxLat = Math.max(...lats);
  const r = (n: number) => Math.round(n * 10) / 10;
  const w = r((Math.max(...lngs) - minLng) * KX * pxPerKm + 2 * margin);
  const h = r((maxLat - Math.min(...lats)) * KY * pxPerKm + 2 * margin);
  const project = (l: LatLng) => ({
    x: r(margin + (l.lng - minLng) * KX * pxPerKm),
    y: r(margin + (maxLat - l.lat) * KY * pxPerKm),
  });
  return { w, h, pxPerKm, project };
}

/** A gentle arc between two points, bowing to the left of the direction of travel. */
export function arcPath(a: { x: number; y: number }, b: { x: number; y: number }, bow = 0.22) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const cx = mx - dy * bow;
  const cy = my + dx * bow;
  return `M ${a.x} ${a.y} Q ${Math.round(cx * 10) / 10} ${Math.round(cy * 10) / 10} ${b.x} ${b.y}`;
}
