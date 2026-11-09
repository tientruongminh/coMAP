"use client";

import type { ReactNode } from "react";
import { useArm } from "./useArm";

/** A div armed for a one-shot CSS entrance (see useArm), for server-rendered sections. */
export function Armed({ className, children, amount }: { className?: string; children: ReactNode; amount?: number }) {
  const ref = useArm<HTMLDivElement>(undefined, amount);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
