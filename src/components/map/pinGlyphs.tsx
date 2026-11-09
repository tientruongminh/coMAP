"use client";

import { ChalkboardTeacher, GraduationCap } from "@phosphor-icons/react";
import type { LocationType } from "@/lib/locations";

/**
 * Phosphor glyphs for the HTML pins (spec 4.3, 6.6). Pins are plain DOM built
 * outside React, so the icons render once here, hidden, and the engine copies
 * their SVG markup. No hand-drawn icons.
 */
export interface PinGlyphMarkup {
  school: string;
  site: string;
}

export function PinGlyphSource({ refCallback }: { refCallback: (el: HTMLDivElement | null) => void }) {
  return (
    <div ref={refCallback} hidden aria-hidden="true">
      <span data-glyph="school">
        <GraduationCap weight="fill" size={18} color="#1A1946" />
      </span>
      <span data-glyph="site">
        <ChalkboardTeacher weight="fill" size={17} color="#FFFFFF" />
      </span>
    </div>
  );
}

export function readGlyphs(el: HTMLElement): PinGlyphMarkup {
  return {
    school: el.querySelector('[data-glyph="school"]')?.innerHTML ?? "",
    site: el.querySelector('[data-glyph="site"]')?.innerHTML ?? "",
  };
}

/** The pin as a React element: list rows (24px), legends, the detail header (48px). */
export function MiniPin({ type, size = 24, className = "" }: { type: LocationType; size?: number; className?: string }) {
  const school = type === "school";
  const glyph = Math.round(size * (school ? 0.53 : 0.53));
  return (
    <span
      aria-hidden="true"
      className={`inline-grid shrink-0 place-items-center border-2 border-white shadow-[var(--shadow-1)] ${
        school ? "bg-lime-400 text-ink" : "rounded-full bg-indigo-600 text-white"
      } ${className}`}
      style={{ width: size, height: size, borderRadius: school ? Math.round(size * 0.29) : "50%" }}
    >
      {school ? <GraduationCap weight="fill" size={glyph} /> : <ChalkboardTeacher weight="fill" size={glyph} />}
    </span>
  );
}
