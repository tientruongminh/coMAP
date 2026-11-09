"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Media query as state. `null` on the server and during hydration. */
export function useMedia(query: string): boolean | null {
  const subscribe = useCallback(
    (cb: () => void) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => null,
  );
}
