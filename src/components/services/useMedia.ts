"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a media query without a hydration mismatch: the server
 * snapshot is `null`, so the first render matches SSR and the real value
 * arrives right after hydration.
 */
export function useMedia(query: string): boolean | null {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", onChange);
      return () => m.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore<boolean | null>(
    subscribe,
    () => window.matchMedia(query).matches,
    () => null,
  );
}
