/**
 * Imperative MapLibre wrapper shared by /ban-do and the hero (spec 4.1 to 4.9, 4.12).
 * React owns state; this class owns the map, the HTML pins, clusters, relation
 * lines, the anchor and the 5 km ring. Nothing here mutates the vendored style
 * except the layers it adds itself.
 */
import maplibregl, {
  type GeoJSONSource,
  type Map as MLMap,
  type Marker,
  type PaddingOptions,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./map.css";
import type { Location } from "@/lib/locations";
import { typeLabel } from "@/content/taxonomy";
import { mapLocale, pinCopy } from "@/content/map";
import { boundsOf, circlePolygon, lngLat, relationCurve, type LngLat } from "@/lib/map-relations";
import type { PinGlyphMarkup } from "./pinGlyphs";

export const MAX_BOUNDS: [[number, number], [number, number]] = [
  [106.36, 10.36],
  [107.03, 11.16],
];
export const insideMaxBounds = ([lng, lat]: LngLat) =>
  lng >= MAX_BOUNDS[0][0] && lng <= MAX_BOUNDS[1][0] && lat >= MAX_BOUNDS[0][1] && lat <= MAX_BOUNDS[1][1];

const STYLE_URL = "/map/co-map-style.json";
const MASK_URL = "/map/hcm-cu.geojson";
const LIME = "#A6CE39";
const INDIGO = "#3330A8";
const CLEAR = "rgba(51,48,168,0)";

type Bounds = [[number, number], [number, number]];

export interface EngineOptions {
  mode: "page" | "hero";
  layout: "desktop" | "mobile";
  locations: Location[];
  glyphs: PinGlyphMarkup;
  reduced: boolean;
  padding: PaddingOptions;
  initial: { center: LngLat; zoom: number } | { bounds: Bounds; maxZoom: number; padding: number };
  onSelect?: (id: string, el: HTMLElement) => void;
  onHover?: (id: string | null) => void;
  onBackgroundClick?: () => void;
  onMoveEnd?: (center: LngLat, zoom: number) => void;
  onUserGesture?: () => void;
  onLoad?: () => void;
  onError?: () => void;
}

interface Pin {
  loc: Location;
  marker: Marker;
  el: HTMLButtonElement;
  shown: boolean;
}

interface ClusterMarker {
  marker: Marker;
  el: HTMLButtonElement;
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const truncate = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

/** cubic-bezier(0.22, 1, 0.36, 1), the system easing (spec 6.8). */
function easeOutSoft(t: number) {
  const p1x = 0.22, p1y = 1, p2x = 0.36, p2y = 1;
  const bx = (u: number) => 3 * (1 - u) * (1 - u) * u * p1x + 3 * (1 - u) * u * u * p2x + u * u * u;
  const by = (u: number) => 3 * (1 - u) * (1 - u) * u * p1y + 3 * (1 - u) * u * u * p2y + u * u * u;
  let lo = 0, hi = 1, u = t;
  for (let i = 0; i < 24; i++) {
    u = (lo + hi) / 2;
    if (bx(u) < t) lo = u;
    else hi = u;
  }
  return by(u);
}

function mixHex(a: string, b: string, t: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

function donut(size: number, s: number, k: number) {
  const r = (size - 4) / 2;
  const c = 2 * Math.PI * r;
  const n = s + k;
  const ls = (c * s) / n;
  const ks = (c * k) / n;
  const mid = size / 2;
  const seg = (len: number, offset: number, color: string) =>
    len > 0
      ? `<circle cx="${mid}" cy="${mid}" r="${r}" fill="none" stroke="${color}" stroke-width="4" stroke-dasharray="${len} ${c}" stroke-dashoffset="${-offset}"/>`
      : "";
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">${seg(ls, 0, LIME)}${seg(ks, ls, INDIGO)}</svg>`;
}

const emptyFC = (): GeoJSON.FeatureCollection => ({ type: "FeatureCollection", features: [] });

export class MapEngine {
  readonly map: MLMap;
  private opts: EngineOptions;
  private pins = new Map<string, Pin>();
  private clusters = new Map<number, ClusterMarker>();
  private visible: Set<string>;
  private keep: Set<string> | null = null;
  private selected: string | null = null;
  private hovered: string | null = null;
  private loaded = false;
  private gotTiles = false;
  private destroyed = false;
  private anchor: Marker | null = null;
  private relToken = 0;
  private raf = 0;
  private timers: ReturnType<typeof setTimeout>[] = [];
  private ringCenter: LngLat | null = null;
  private relPending: { from: Location; partners: Location[]; matches: Location[]; resolve: () => void } | null = null;

  constructor(container: HTMLElement, opts: EngineOptions) {
    this.opts = opts;
    this.visible = new Set(opts.locations.map((l) => l.id));
    const page = opts.mode === "page";

    this.map = new maplibregl.Map({
      container,
      style: STYLE_URL,
      center: [106.6958, 10.7826],
      zoom: 11,
      minZoom: 10,
      maxZoom: 18,
      maxPitch: 0,
      maxBounds: MAX_BOUNDS,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
      attributionControl: false,
      cooperativeGestures: opts.mode === "hero",
      locale: mapLocale,
      fadeDuration: opts.reduced ? 0 : 300,
    });
    this.map.touchZoomRotate.disableRotation();
    this.map.keyboard.disableRotation();
    container.classList.add("cm-map", `cm-map--${opts.mode}-${opts.layout}`);

    const mobile = opts.layout === "mobile";
    this.map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      page && mobile ? "top-right" : "bottom-right",
    );
    if (page) {
      if (!mobile) this.map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
      this.map.addControl(new maplibregl.ScaleControl({ unit: "metric" }), mobile ? "top-left" : "bottom-left");
    } else if (!mobile) {
      // Hero (spec 3.1 S1): scale bar and attribution bottom right.
      this.map.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-right");
    }

    // Small screens: start with the attribution folded behind its (i) button.
    // MapLibre unfolds it as soon as the first source reports its attribution,
    // long before "idle" on a slow connection, so fold it on that same event.
    if (mobile) {
      const fold = () => {
        const el = container.querySelector(".maplibregl-compact-show");
        if (!el) return;
        el.classList.remove("maplibregl-compact-show");
        this.map.off("styledata", fold);
        this.map.off("sourcedata", fold);
      };
      this.map.on("styledata", fold);
      this.map.on("sourcedata", fold);
    }

    this.map.setPadding(opts.padding);
    const init = opts.initial;
    if ("bounds" in init) {
      this.map.fitBounds(init.bounds, { padding: init.padding, maxZoom: init.maxZoom, animate: false });
    } else {
      this.map.jumpTo({ center: init.center, zoom: init.zoom });
    }

    for (const l of opts.locations) this.pins.set(l.id, this.makePin(l));

    this.map.on("load", this.onLoad);
    this.map.on("error", () => {
      if (!this.gotTiles && !this.destroyed) opts.onError?.();
    });
    this.map.on("data", (e) => {
      if ((e as { sourceId?: string; tile?: unknown }).sourceId === "openmaptiles" && (e as { tile?: unknown }).tile) {
        this.gotTiles = true;
      }
    });
    this.map.on("moveend", () => {
      const c = this.map.getCenter();
      opts.onMoveEnd?.([c.lng, c.lat], this.map.getZoom());
    });
    this.map.on("dragstart", () => opts.onUserGesture?.());
    this.map.on("zoomstart", (e) => {
      if ((e as { originalEvent?: Event }).originalEvent) opts.onUserGesture?.();
    });
    this.map.on("click", (e) => {
      const t = e.originalEvent.target as Element | null;
      if (t?.closest(".cm-pin, .cm-cluster, .maplibregl-ctrl")) return;
      opts.onBackgroundClick?.();
    });
  }

  /* ---------- lifecycle ---------- */

  private onLoad = () => {
    if (this.destroyed) return;
    this.loaded = true;
    const m = this.map;
    m.addSource("cm-ring", { type: "geojson", data: emptyFC() });
    m.addLayer({
      id: "cm-ring-fill",
      type: "fill",
      source: "cm-ring",
      paint: { "fill-color": LIME, "fill-opacity": 0.1 },
    });
    m.addLayer({
      id: "cm-ring-line",
      type: "line",
      source: "cm-ring",
      paint: { "line-color": "#4F6B0E", "line-width": 1.5, "line-dasharray": [3, 2] },
    });
    m.addSource("cm-rel-dash", { type: "geojson", data: emptyFC() });
    m.addLayer({
      id: "cm-rel-dash",
      type: "line",
      source: "cm-rel-dash",
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-color": "#55557A",
        "line-width": 1.5,
        "line-dasharray": [2, 2],
        "line-opacity": 0,
        "line-opacity-transition": { duration: this.opts.reduced ? 0 : 300, delay: 0 },
      },
    });
    m.addSource("cm-rel", { type: "geojson", data: emptyFC(), lineMetrics: true });
    m.addLayer({
      id: "cm-rel",
      type: "line",
      source: "cm-rel",
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-width": 2.5,
        "line-gradient": ["interpolate", ["linear"], ["line-progress"], 0, CLEAR, 1, CLEAR],
        "line-opacity": 1,
        "line-opacity-transition": { duration: 0, delay: 0 },
      },
    });

    if (this.opts.mode === "page") {
      m.addSource("cm-pts", {
        type: "geojson",
        data: this.clusterData(),
        cluster: true,
        clusterRadius: 48,
        clusterMaxZoom: 14,
        clusterProperties: {
          schools: ["+", ["case", ["==", ["get", "type"], "school"], 1, 0]],
          sites: ["+", ["case", ["==", ["get", "type"], "internship"], 1, 0]],
        },
      });
      // Invisible layer so the clustered tiles load; the visible markers are HTML.
      m.addLayer({
        id: "cm-pts-ghost",
        type: "circle",
        source: "cm-pts",
        paint: { "circle-radius": 1, "circle-opacity": 0, "circle-stroke-opacity": 0 },
      });
      m.on("render", this.syncClusters);
    } else {
      this.showHeroPins();
    }

    this.applyClasses();
    if (this.ringCenter) this.setRing(this.ringCenter);
    if (this.relPending) {
      const p = this.relPending;
      this.relPending = null;
      void this.drawRelations(p.from, p.partners, p.matches).then(p.resolve);
    }
    void this.addMask();
    this.opts.onLoad?.();
  };

  private async addMask() {
    try {
      const res = await fetch(MASK_URL);
      if (!res.ok || this.destroyed) return;
      const gj = (await res.json()) as GeoJSON.FeatureCollection | GeoJSON.Feature;
      const feat = "features" in gj ? gj.features[0] : gj;
      const g = feat?.geometry;
      if (!g || this.destroyed) return;
      const rings: GeoJSON.Position[][] =
        g.type === "Polygon" ? [g.coordinates[0]] : g.type === "MultiPolygon" ? g.coordinates.map((p) => p[0]) : [];
      if (!rings.length) return;
      const world: GeoJSON.Position[] = [
        [100, 4],
        [114, 4],
        [114, 18],
        [100, 18],
        [100, 4],
      ];
      const before = this.map.getLayer("cm-ring-fill") ? "cm-ring-fill" : undefined;
      this.map.addSource("cm-mask", {
        type: "geojson",
        data: { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [world, ...rings] } },
      });
      this.map.addSource("cm-mask-line", {
        type: "geojson",
        data: { type: "Feature", properties: {}, geometry: { type: "MultiLineString", coordinates: rings } },
      });
      this.map.addLayer(
        { id: "cm-mask", type: "fill", source: "cm-mask", paint: { "fill-color": "#F5F5F8", "fill-opacity": 0.88 } },
        before,
      );
      this.map.addLayer(
        {
          id: "cm-mask-line",
          type: "line",
          source: "cm-mask-line",
          paint: { "line-color": INDIGO, "line-opacity": 0.5, "line-width": 1, "line-dasharray": [3, 2] },
        },
        before,
      );
    } catch {
      /* P2 detail: skip silently when missing (spec 4.2). */
    }
  }

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    this.timers.forEach(clearTimeout);
    this.map.remove();
  }

  /* ---------- pins ---------- */

  private makePin(l: Location): Pin {
    const el = document.createElement("button");
    el.type = "button";
    el.className = `cm-pin cm-pin--${l.type === "school" ? "school" : "site"}`;
    el.dataset.id = l.id;
    el.setAttribute("aria-label", pinCopy.aria(l.name, typeLabel[l.type], l.ward));
    const glyph = l.type === "school" ? this.opts.glyphs.school : this.opts.glyphs.site;
    el.innerHTML = `<span class="cm-pin__in"><span class="cm-pin__body">${glyph}</span><span class="cm-pin__tip" aria-hidden="true">${escapeHtml(
      truncate(l.short ?? l.name, 28),
    )}</span></span>`;
    el.addEventListener("mouseenter", () => this.opts.onHover?.(l.id));
    el.addEventListener("mouseleave", () => this.opts.onHover?.(null));
    el.addEventListener("focus", () => this.opts.onHover?.(l.id));
    el.addEventListener("blur", () => this.opts.onHover?.(null));
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      this.opts.onSelect?.(l.id, el);
    });
    const marker = new maplibregl.Marker({ element: el, anchor: "center" }).setLngLat(lngLat(l));
    return { loc: l, marker, el, shown: false };
  }

  private showPin(p: Pin, on: boolean) {
    if (on === p.shown) return;
    p.shown = on;
    if (on) p.marker.addTo(this.map);
    else p.marker.remove();
  }

  private showHeroPins() {
    const order = [...this.pins.values()].sort((a, b) => b.loc.lat - a.loc.lat);
    order.forEach((p, i) => {
      if (!this.opts.reduced) {
        p.el.classList.add("is-drop");
        p.el.style.setProperty("--d", `${i * 40}ms`);
        this.timers.push(setTimeout(() => p.el.classList.remove("is-drop"), i * 40 + 340));
      }
      this.showPin(p, true);
    });
  }

  /** Points always drawn as single pins: the selection and its related points. */
  private pinned() {
    if (!this.selected) return new Set<string>();
    return new Set([this.selected, ...(this.keep ?? [])]);
  }

  private clusterData(): GeoJSON.FeatureCollection {
    const pinned = this.pinned();
    return {
      type: "FeatureCollection",
      features: [...this.pins.values()]
        .filter((p) => this.visible.has(p.loc.id) && !pinned.has(p.loc.id))
        .map((p) => ({
          type: "Feature",
          properties: { id: p.loc.id, type: p.loc.type },
          geometry: { type: "Point", coordinates: lngLat(p.loc) },
        })),
    };
  }

  private refreshClusterSource() {
    if (!this.loaded || this.opts.mode !== "page") return;
    const src = this.map.getSource("cm-pts") as GeoJSONSource | undefined;
    if (!src) return;
    for (const c of this.clusters.values()) c.marker.remove();
    this.clusters.clear();
    src.setData(this.clusterData());
    this.syncClusters();
  }

  private syncClusters = () => {
    if (this.destroyed || !this.map.getSource("cm-pts") || !this.map.isSourceLoaded("cm-pts")) return;
    const feats = this.map.querySourceFeatures("cm-pts");
    const wantPins = this.pinned();
    for (const id of [...wantPins]) if (!this.pins.has(id)) wantPins.delete(id);
    const wantClusters = new Map<number, { coords: LngLat; n: number; s: number; k: number }>();
    for (const f of feats) {
      const p = f.properties as Record<string, unknown>;
      if (p.cluster) {
        const id = p.cluster_id as number;
        if (!wantClusters.has(id)) {
          const g = f.geometry as GeoJSON.Point;
          wantClusters.set(id, {
            coords: g.coordinates as LngLat,
            n: p.point_count as number,
            s: p.schools as number,
            k: p.sites as number,
          });
        }
      } else if (typeof p.id === "string") {
        wantPins.add(p.id);
      }
    }
    for (const [id, pin] of this.pins) this.showPin(pin, wantPins.has(id));
    for (const [id, c] of this.clusters) {
      if (!wantClusters.has(id)) {
        c.marker.remove();
        this.clusters.delete(id);
      }
    }
    const dim = !!this.selected;
    for (const [id, info] of wantClusters) {
      let c = this.clusters.get(id);
      if (!c) {
        c = this.makeCluster(id, info);
        this.clusters.set(id, c);
        c.marker.addTo(this.map);
      }
      c.el.classList.toggle("is-dim", dim);
    }
  };

  private makeCluster(id: number, info: { coords: LngLat; n: number; s: number; k: number }): ClusterMarker {
    const size = info.n < 5 ? 40 : info.n < 15 ? 48 : 56;
    const el = document.createElement("button");
    el.type = "button";
    el.className = "cm-cluster";
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.setAttribute("aria-label", pinCopy.cluster(info.n, info.s, info.k));
    el.innerHTML = `<span class="cm-cluster__in">${donut(size, info.s, info.k)}<span>${info.n}</span></span>`;
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      const src = this.map.getSource("cm-pts") as GeoJSONSource | undefined;
      if (!src) return;
      void src.getClusterExpansionZoom(id).then((z) => {
        if (this.destroyed) return;
        this.map.easeTo({ center: info.coords, zoom: Math.min(z + 0.2, 18), duration: this.opts.reduced ? 0 : 600 });
      });
    });
    const marker = new maplibregl.Marker({ element: el, anchor: "center" }).setLngLat(info.coords);
    return { marker, el };
  }

  private applyClasses() {
    for (const [id, p] of this.pins) {
      p.el.classList.toggle("is-selected", id === this.selected);
      p.el.classList.toggle("is-hover", id === this.hovered);
      const dim = this.keep ? !this.keep.has(id) && id !== this.selected : false;
      p.el.classList.toggle("is-dim", dim);
      if (id === this.selected) p.el.setAttribute("aria-current", "true");
      else p.el.removeAttribute("aria-current");
    }
  }

  /** Filtered set (spec 4.7). Points outside it leave the map unless related to the selection. */
  setVisible(ids: Set<string>) {
    this.visible = ids;
    if (this.opts.mode === "hero") return;
    this.refreshClusterSource();
  }

  /**
   * Selection and emphasis. `keep` are the ids at full opacity; everything else
   * dims to 35% when `keep` is set. On /ban-do the selection and `keep` are
   * lifted out of the clusters.
   */
  setFocus(selected: string | null, keep: Set<string> | null) {
    this.selected = selected;
    this.keep = keep;
    this.applyClasses();
    this.refreshClusterSource();
  }

  setHover(id: string | null) {
    if (id === this.hovered) return;
    this.hovered = id;
    for (const [pid, p] of this.pins) p.el.classList.toggle("is-hover", pid === id);
  }

  pinElement(id: string) {
    const p = this.pins.get(id);
    return p?.shown ? p.el : null;
  }

  /* ---------- anchor and ring (4.6, 4.12) ---------- */

  setAnchor(a: { lngLat: LngLat; label: string } | null) {
    this.anchor?.remove();
    this.anchor = null;
    if (!a) return;
    const el = document.createElement("div");
    el.className = "cm-anchor";
    el.setAttribute("aria-hidden", "true");
    el.setAttribute("role", "presentation");
    el.innerHTML = `<span class="cm-anchor__dot"></span><span class="cm-anchor__label">${escapeHtml(a.label)}</span>`;
    this.anchor = new maplibregl.Marker({ element: el, anchor: "center" }).setLngLat(a.lngLat).addTo(this.map);
  }

  setRing(center: LngLat | null, km = 5) {
    this.ringCenter = center;
    if (!this.loaded || this.destroyed) return;
    const src = this.map.getSource("cm-ring") as GeoJSONSource | undefined;
    src?.setData(
      center ? { type: "Feature", properties: {}, geometry: circlePolygon(center, km) } : emptyFC(),
    );
  }

  /* ---------- relation lines (4.9) ---------- */

  private gradientAt(p: number, c0: string, c1: string): maplibregl.ExpressionSpecification {
    if (p <= 0.002) return ["interpolate", ["linear"], ["line-progress"], 0, CLEAR, 1, CLEAR];
    if (p >= 0.998) return ["interpolate", ["linear"], ["line-progress"], 0, c0, 1, c1];
    return ["interpolate", ["linear"], ["line-progress"], 0, c0, p, mixHex(c0, c1, p), p + 0.001, CLEAR, 1, CLEAR];
  }

  /**
   * Solid partner lines with a lime (school end) to indigo (site end) gradient,
   * revealed from the selected end over 700ms; dashed field-match lines fade in
   * after. Resolves when everything is drawn.
   */
  drawRelations(from: Location, partners: Location[], matches: Location[]): Promise<void> {
    // An async caller (the hero auto-cycle) can still be mid-step after unmount.
    if (this.destroyed) return Promise.resolve();
    if (!this.loaded) {
      this.relPending?.resolve();
      return new Promise((resolve) => {
        this.relPending = { from, partners, matches, resolve };
      });
    }
    const token = ++this.relToken;
    cancelAnimationFrame(this.raf);
    const m = this.map;
    const a = lngLat(from);
    const line = (to: Location): GeoJSON.Feature => ({
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates: relationCurve(a, lngLat(to)) },
    });
    const c0 = from.type === "school" ? LIME : INDIGO;
    const c1 = from.type === "school" ? INDIGO : LIME;
    const solid = m.getSource("cm-rel") as GeoJSONSource;
    const dash = m.getSource("cm-rel-dash") as GeoJSONSource;
    m.setPaintProperty("cm-rel-dash", "line-opacity-transition", { duration: 0, delay: 0 });
    m.setPaintProperty("cm-rel-dash", "line-opacity", 0);
    m.setPaintProperty("cm-rel", "line-opacity-transition", { duration: 0, delay: 0 });
    m.setPaintProperty("cm-rel", "line-opacity", 1);
    solid.setData({ type: "FeatureCollection", features: partners.map(line) });
    dash.setData({ type: "FeatureCollection", features: matches.map(line) });

    const showDash = () => {
      m.setPaintProperty("cm-rel-dash", "line-opacity-transition", { duration: this.opts.reduced ? 0 : 300, delay: 0 });
      m.setPaintProperty("cm-rel-dash", "line-opacity", 0.6);
    };

    if (this.opts.reduced || partners.length === 0) {
      m.setPaintProperty("cm-rel", "line-gradient", this.gradientAt(1, c0, c1));
      showDash();
      return new Promise((resolve) => {
        const t = setTimeout(resolve, this.opts.reduced ? 0 : 300);
        this.timers.push(t);
      });
    }

    return new Promise((resolve) => {
      const start = performance.now();
      const tick = (now: number) => {
        if (token !== this.relToken || this.destroyed) return resolve();
        const t = Math.min(1, (now - start) / 700);
        m.setPaintProperty("cm-rel", "line-gradient", this.gradientAt(easeOutSoft(t), c0, c1));
        if (t < 1) {
          this.raf = requestAnimationFrame(tick);
        } else {
          showDash();
          this.timers.push(setTimeout(resolve, matches.length ? 300 : 0));
        }
      };
      m.setPaintProperty("cm-rel", "line-gradient", this.gradientAt(0, c0, c1));
      this.raf = requestAnimationFrame(tick);
    });
  }

  clearRelations() {
    this.relPending?.resolve();
    this.relPending = null;
    if (!this.loaded || this.destroyed) return;
    const token = ++this.relToken;
    cancelAnimationFrame(this.raf);
    const m = this.map;
    const d = this.opts.reduced ? 0 : 200;
    m.setPaintProperty("cm-rel", "line-opacity-transition", { duration: d, delay: 0 });
    m.setPaintProperty("cm-rel", "line-opacity", 0);
    m.setPaintProperty("cm-rel-dash", "line-opacity-transition", { duration: d, delay: 0 });
    m.setPaintProperty("cm-rel-dash", "line-opacity", 0);
    this.timers.push(
      setTimeout(() => {
        if (token !== this.relToken || this.destroyed) return;
        (m.getSource("cm-rel") as GeoJSONSource | undefined)?.setData(emptyFC());
        (m.getSource("cm-rel-dash") as GeoJSONSource | undefined)?.setData(emptyFC());
      }, d + 20),
    );
  }

  /* ---------- camera ---------- */

  setPadding(p: PaddingOptions) {
    this.opts.padding = p;
    this.map.setPadding(p);
  }

  /** Animated padding change (mobile sheet height), keeping the camera otherwise. */
  easePadding(p: PaddingOptions) {
    this.opts.padding = p;
    if (this.opts.reduced) this.map.setPadding(p);
    else this.map.easeTo({ padding: p, duration: 360, easing: easeOutSoft });
  }

  /** Stops any running camera move first, so the promise belongs to this move only. */
  private moveDone(): Promise<void> {
    this.map.stop();
    return new Promise((resolve) => this.map.once("moveend", () => resolve()));
  }

  zoom() {
    return this.map.getZoom();
  }

  /** `padding`, when given, becomes the map padding (animated with the move). */
  flyTo(center: LngLat, zoom: number, duration = 1200, padding?: PaddingOptions): Promise<void> {
    const done = this.moveDone();
    if (padding) this.opts.padding = padding;
    const pad = padding ? { padding } : {};
    if (this.opts.reduced) this.map.jumpTo({ center, zoom, ...pad });
    else this.map.flyTo({ center, zoom, duration, essential: true, curve: 1.42, ...pad });
    return done;
  }

  easeTo(center: LngLat, zoom: number, duration = 2200): Promise<void> {
    const done = this.moveDone();
    if (this.opts.reduced) this.map.jumpTo({ center, zoom });
    else this.map.easeTo({ center, zoom, duration, easing: easeOutSoft });
    return done;
  }

  fit(points: LngLat[], o: { padding?: number; maxZoom?: number; duration?: number } = {}): Promise<void> {
    if (!points.length) return Promise.resolve();
    const done = this.moveDone();
    this.map.fitBounds(boundsOf(points), {
      padding: o.padding ?? 48,
      maxZoom: o.maxZoom ?? 15,
      duration: this.opts.reduced ? 0 : (o.duration ?? 1200),
      easing: easeOutSoft,
      animate: !this.opts.reduced,
    });
    return done;
  }

  jumpTo(center: LngLat, zoom: number) {
    this.map.jumpTo({ center, zoom });
  }

  /** True when every point sits inside the padded viewport. */
  inView(points: LngLat[], margin = 24) {
    const pad = this.opts.padding;
    const c = this.map.getContainer();
    const w = c.clientWidth;
    const h = c.clientHeight;
    return points.every((pt) => {
      const p = this.map.project(pt);
      return (
        p.x >= (pad.left ?? 0) + margin &&
        p.x <= w - (pad.right ?? 0) - margin &&
        p.y >= (pad.top ?? 0) + margin &&
        p.y <= h - (pad.bottom ?? 0) - margin
      );
    });
  }
}
