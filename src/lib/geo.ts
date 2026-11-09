/** Old-HCMC bounding box (Củ Chi → Cần Giờ). The map never leaves this. */
export const HCM_BOUNDS: [[number, number], [number, number]] = [
  [106.35, 10.35],
  [107.05, 11.18],
];

/** Default view: inner districts + TP. Thủ Đức, where the demo data lives. */
export const HCM_CORE_BOUNDS: [[number, number], [number, number]] = [
  [106.585, 10.7],
  [106.815, 10.875],
];

export const HCM_CENTER: [number, number] = [106.70, 10.79];

export function insideHCM(lng: number, lat: number) {
  const [[w, s], [e, n]] = HCM_BOUNDS;
  return lng >= w && lng <= e && lat >= s && lat <= n;
}

/** Great-circle distance in km. */
export function distanceKm(a: [number, number], b: [number, number]) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[1] - a[1]);
  const dLng = toRad(b[0] - a[0]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[1])) * Math.cos(toRad(b[1])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function formatKm(km: number) {
  if (km < 1) return `${Math.round(km * 1000 / 10) * 10} m`;
  return `${km.toFixed(km < 10 ? 1 : 0).replace(".", ",")} km`;
}

/** Quadratic bezier arc between two points, bulging to the left of a→b. */
export function arc(a: [number, number], b: [number, number], bend = 0.22, steps = 48) {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const cx = mx - dy * bend;
  const cy = my + dx * bend;
  const pts: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    pts.push([u * u * a[0] + 2 * u * t * cx + t * t * b[0], u * u * a[1] + 2 * u * t * cy + t * t * b[1]]);
  }
  return pts;
}
