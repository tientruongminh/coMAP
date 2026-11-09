import type { NextRequest } from "next/server";

/**
 * Address lookup for the map search (spec 4.6). Proxies Photon, biased to
 * Hồ Con Rùa and clipped to old TP.HCM. Returns [{label, lat, lng}].
 * No query text is logged.
 */
const PHOTON = "https://photon.komoot.io/api/";
const BBOX = { w: 106.36, s: 10.36, e: 107.03, n: 11.16 };
const MAX_CACHE = 200;
const TIMEOUT_MS = 5000;

interface Result {
  label: string;
  lat: number;
  lng: number;
}

interface PhotonFeature {
  geometry?: { coordinates?: [number, number] };
  properties?: Record<string, string | undefined>;
}

const cache = new Map<string, Result[]>();

function remember(key: string, value: Result[]) {
  if (cache.has(key)) cache.delete(key);
  cache.set(key, value);
  if (cache.size > MAX_CACHE) cache.delete(cache.keys().next().value as string);
}

function labelOf(p: Record<string, string | undefined>) {
  const street = p.housenumber && p.street ? `${p.housenumber} ${p.street}` : p.street;
  const city = p.city && /h[oồ] ch[ií] minh/i.test(p.city) ? "TP.HCM" : p.city;
  const parts = [p.name, street, p.district, city].filter((x): x is string => !!x && x.trim() !== "");
  return [...new Set(parts)].join(", ");
}

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") ?? "").trim().slice(0, 120);
  if (q.length < 3) return Response.json([]);

  const key = q.toLowerCase();
  const hit = cache.get(key);
  if (hit) {
    remember(key, hit);
    return Response.json(hit);
  }

  const url = new URL(PHOTON);
  url.searchParams.set("q", q);
  url.searchParams.set("limit", "5");
  url.searchParams.set("lat", "10.7826");
  url.searchParams.set("lon", "106.6958");
  url.searchParams.set("bbox", `${BBOX.w},${BBOX.s},${BBOX.e},${BBOX.n}`);

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "comap-demo-data/0.1", Accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (!res.ok) return Response.json({ error: "upstream" }, { status: 502 });
    const body = (await res.json()) as { features?: PhotonFeature[] };
    const out: Result[] = [];
    for (const f of body.features ?? []) {
      const c = f.geometry?.coordinates;
      if (!c) continue;
      const [lng, lat] = c;
      if (lng < BBOX.w || lng > BBOX.e || lat < BBOX.s || lat > BBOX.n) continue;
      const label = labelOf(f.properties ?? {});
      if (!label || out.some((r) => r.label === label)) continue;
      out.push({ label, lat: Math.round(lat * 1e5) / 1e5, lng: Math.round(lng * 1e5) / 1e5 });
    }
    remember(key, out);
    return Response.json(out);
  } catch {
    return Response.json({ error: "unavailable" }, { status: 504 });
  }
}
