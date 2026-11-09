import Link from "next/link";
import { site } from "@/content/site";

/**
 * Co-Map lockup (spec 6.7): the map legend itself, a school (lime squircle)
 * and a site (indigo circle) joined by a route, plus a live-text wordmark.
 */
export function LogoMark({ reversed = false, size = 32 }: { reversed?: boolean; size?: number }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true" className="shrink-0">
      <path
        d="M12 21 Q12 11 21 11"
        fill="none"
        stroke={reversed ? "#A6CE39" : "#1A1946"}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <rect x="3" y="21" width="18" height="16" rx="6" fill="#A6CE39" />
      <circle cx="29" cy="11" r="8" fill={reversed ? "#FFFFFF" : "#3330A8"} />
      <circle cx="29" cy="11" r="2.75" fill={reversed ? "#28258A" : "#FFFFFF"} />
    </svg>
  );
}

export function Wordmark({ reversed = false, className = "" }: { reversed?: boolean; className?: string }) {
  return (
    <span
      className={`font-display text-[22px] leading-none tracking-[-0.02em] ${reversed ? "text-white" : "text-ink"} ${className}`}
      style={{ fontVariationSettings: '"wdth" 112', fontWeight: 750 }}
    >
      Co<span className={reversed ? "text-white" : "text-indigo-600"}>-</span>Map
    </span>
  );
}

export function Logo({ reversed = false }: { reversed?: boolean }) {
  return (
    <Link
      href="/"
      aria-label={site.logoLabel}
      className="inline-flex items-center gap-[10px] rounded-full"
    >
      <LogoMark reversed={reversed} />
      <Wordmark reversed={reversed} />
    </Link>
  );
}
