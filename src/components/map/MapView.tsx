"use client";

import { useEffect, useRef, useState } from "react";
import { locations as allLocations } from "@/lib/locations";
import { mapPage } from "@/content/map";
import { MapEngine, type EngineOptions } from "./engine";
import { PinGlyphSource, readGlyphs } from "./pinGlyphs";

export type MapFailure = "error" | "webgl";

export interface MapViewProps {
  mode: EngineOptions["mode"];
  layout: EngineOptions["layout"];
  reduced: boolean;
  padding: EngineOptions["padding"];
  /** Read once, when the engine is created. */
  initial: EngineOptions["initial"] | (() => EngineOptions["initial"]);
  regionLabel?: string;
  onEngine: (engine: MapEngine | null) => void;
  onFailure: (kind: MapFailure) => void;
  onSelect?: EngineOptions["onSelect"];
  onHover?: EngineOptions["onHover"];
  onBackgroundClick?: EngineOptions["onBackgroundClick"];
  onMoveEnd?: EngineOptions["onMoveEnd"];
  onUserGesture?: EngineOptions["onUserGesture"];
  onLoad?: EngineOptions["onLoad"];
}

export function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Mounts one MapEngine. Callbacks are read through a ref so the engine is
 * created once per mount. Loaded only on the client (next/dynamic, ssr: false).
 */
export default function MapView(props: MapViewProps) {
  const box = useRef<HTMLDivElement>(null);
  const [glyphEl, setGlyphEl] = useState<HTMLDivElement | null>(null);
  const latest = useRef(props);
  useEffect(() => {
    latest.current = props;
  });

  useEffect(() => {
    const el = box.current;
    if (!el || !glyphEl) return;
    const p = latest.current;
    if (!hasWebGL()) {
      p.onFailure("webgl");
      return;
    }
    let engine: MapEngine;
    try {
      engine = new MapEngine(el, {
        mode: p.mode,
        layout: p.layout,
        reduced: p.reduced,
        padding: p.padding,
        initial: typeof p.initial === "function" ? p.initial() : p.initial,
        locations: allLocations,
        glyphs: readGlyphs(glyphEl),
        onSelect: (id, target) => latest.current.onSelect?.(id, target),
        onHover: (id) => latest.current.onHover?.(id),
        onBackgroundClick: () => latest.current.onBackgroundClick?.(),
        onMoveEnd: (c, z) => latest.current.onMoveEnd?.(c, z),
        onUserGesture: () => latest.current.onUserGesture?.(),
        onLoad: () => latest.current.onLoad?.(),
        onError: () => latest.current.onFailure("error"),
      });
    } catch {
      p.onFailure("webgl");
      return;
    }
    p.onEngine(engine);
    return () => {
      latest.current.onEngine(null);
      engine.destroy();
    };
  }, [glyphEl]);

  return (
    <div className="absolute inset-0">
      <div
        ref={box}
        role="region"
        aria-label={props.regionLabel ?? mapPage.mapRegionLabel}
        className="h-full w-full"
      />
      <PinGlyphSource refCallback={setGlyphEl} />
    </div>
  );
}
