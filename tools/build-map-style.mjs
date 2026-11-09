#!/usr/bin/env node
/**
 * Generates public/map/co-map-style.json from the OpenFreeMap Positron style
 * (spec 4.1 and 4.2). Run once, commit the output:
 *
 *   node tools/build-map-style.mjs
 *
 * The runtime never mutates this style; it only adds Co-Map's own layers
 * (pins source, relation lines, distance ring) on top.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = "https://tiles.openfreemap.org/styles/positron";
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../public/map/co-map-style.json");

const C = {
  background: "#EFEFF4",
  residential: "#ECECF2",
  green: "#E2ECCB",
  water: "#D9DBEF",
  waterway: "#C9CCE8",
  building: "#E4E4EC",
  buildingOutline: "#D9D9E3",
  road: "#FFFFFF",
  casing: "#D6D6E2",
  boundary: "#9C9CC0",
  label: "#4A4A6E",
  labelHalo: "#F5F5F8",
  waterLabel: "#5B5E94",
  waterHalo: "#D9DBEF",
  campus: "#A6CE39",
  campusOutline: "#8DB52B",
};

/** Layers hidden in 4.2: shields, airport, aeroways, railways, country/state labels. */
const HIDDEN = [
  /^highway-shield-/,
  /^road_shield_us$/,
  /^airport$/,
  /^aeroway-/,
  /^railway/,
  /^tunnel_railway/,
  /^label_country_/,
  /^label_state$/,
  /^landcover_(ice_shelf|glacier)$/,
];

const VI_NAME = ["coalesce", ["get", "name:vi"], ["get", "name"]];

function setPaint(layer, key, value) {
  layer.paint = { ...(layer.paint ?? {}), [key]: value };
}

function recolor(layer) {
  const id = layer.id;
  const type = layer.type;

  if (HIDDEN.some((re) => re.test(id))) {
    layer.layout = { ...(layer.layout ?? {}), visibility: "none" };
    return layer;
  }

  if (type === "symbol") {
    if (layer.layout && "text-field" in layer.layout) {
      layer.layout = { ...layer.layout, "text-field": VI_NAME };
    }
    const isWater = /^water/.test(id);
    setPaint(layer, "text-color", isWater ? C.waterLabel : C.label);
    setPaint(layer, "text-halo-color", isWater ? C.waterHalo : C.labelHalo);
    setPaint(layer, "text-halo-width", 1.5);
    if (layer.paint) delete layer.paint["text-halo-blur"];
    return layer;
  }

  if (id === "background") setPaint(layer, "background-color", C.background);
  else if (id === "landuse_residential") setPaint(layer, "fill-color", C.residential);
  else if (id === "park" || id === "landcover_wood") setPaint(layer, "fill-color", C.green);
  else if (id === "water") setPaint(layer, "fill-color", C.water);
  else if (id === "waterway") setPaint(layer, "line-color", C.waterway);
  else if (id === "building") {
    layer.minzoom = 14;
    setPaint(layer, "fill-color", C.building);
    setPaint(layer, "fill-outline-color", C.buildingOutline);
  } else if (id === "road_area_pier") setPaint(layer, "fill-color", C.background);
  else if (id === "road_pier") setPaint(layer, "line-color", C.background);
  else if (/casing/.test(id) && /^(highway|tunnel)_/.test(id)) setPaint(layer, "line-color", C.casing);
  else if (/^(highway|tunnel)_/.test(id)) {
    // path, minor, major_inner, motorway_inner, *_subtle, bridges and tunnels
    setPaint(layer, "line-color", C.road);
    if (/_subtle$/.test(id)) setPaint(layer, "line-opacity", 1);
  } else if (/^boundary_/.test(id)) {
    setPaint(layer, "line-color", C.boundary);
    setPaint(layer, "line-dasharray", [2, 2]);
    setPaint(layer, "line-width", 1);
    if (layer.paint) delete layer.paint["line-opacity"];
  }
  return layer;
}

/** "The map highlights where education happens" (spec 4.2). */
const CAMPUS_CLASSES = ["school", "university", "college", "kindergarten", "library"];
const campusLayers = [
  {
    id: "co-map-campus",
    type: "fill",
    source: "openmaptiles",
    "source-layer": "landuse",
    filter: ["in", ["get", "class"], ["literal", CAMPUS_CLASSES]],
    paint: { "fill-color": C.campus, "fill-opacity": 0.28 },
  },
  {
    id: "co-map-campus-outline",
    type: "line",
    source: "openmaptiles",
    "source-layer": "landuse",
    minzoom: 13,
    filter: ["in", ["get", "class"], ["literal", CAMPUS_CLASSES]],
    paint: { "line-color": C.campusOutline, "line-opacity": 0.6, "line-width": 1 },
  },
];

const res = await fetch(BASE, { headers: { "User-Agent": "comap-demo-data/0.1" } });
if (!res.ok) throw new Error(`Fetch ${BASE} failed: ${res.status}`);
const base = await res.json();

const layers = base.layers.map((l) => recolor(structuredClone(l)));
const firstLabel = layers.findIndex((l) => l.type === "symbol");
layers.splice(firstLabel === -1 ? layers.length : firstLabel, 0, ...campusLayers);

// Keep only sources a layer actually uses (drops the unused Natural Earth raster).
const used = new Set(layers.map((l) => l.source).filter(Boolean));
const sources = Object.fromEntries(Object.entries(base.sources).filter(([k]) => used.has(k)));

const style = {
  version: 8,
  name: "Co-Map",
  metadata: {
    "co-map:generatedFrom": BASE,
    "co-map:generator": "tools/build-map-style.mjs",
  },
  sources,
  sprite: base.sprite,
  glyphs: base.glyphs,
  layers,
};

await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(style) + "\n");
console.log(`Wrote ${OUT}: ${layers.length} layers, campus layer at index ${firstLabel}.`);
