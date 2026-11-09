"use client";

import { AnimatePresence } from "motion/react";
import { useSearchParams } from "next/navigation";
import { lazy, Suspense, useEffect, useState } from "react";
import { packageOptions } from "@/content/forms";
import { isFormParam, useConsult, type ConsultContext, type ConsultKind } from "./ConsultProvider";
import type { Drafts } from "./types";

/**
 * Consult dialog (spec 5.1). `?form=` is the open state. The body (forms, school
 * list) is a separate chunk, fetched when the browser is idle, so the 10 schools
 * and location names stay out of every route's first load.
 * Drafts live here, so closing and reopening in the same page session keeps them.
 */
const load = () => import("./ConsultDialogBody");
const Body = lazy(load);

const GOI: readonly string[] = packageOptions.map((o) => o.value);

export default function ConsultDialog() {
  const params = useSearchParams();
  const raw = params.get("form");
  const form = isFormParam(raw) ? raw : null;
  const { context, close } = useConsult();

  const [drafts, setDrafts] = useState<Drafts>({});
  const [lastKind, setLastKind] = useState<ConsultKind | null>(null);

  // Each open() passes a fresh context: preselect its package once (spec 5.3).
  const [seen, setSeen] = useState<ConsultContext>(context);
  if (seen !== context) {
    setSeen(context);
    const goi = context.goi;
    if (goi && GOI.includes(goi)) {
      setDrafts((d) => {
        const cur = d["doanh-nghiep"] ?? {};
        const picked = Array.isArray(cur.goi) ? cur.goi : [];
        return { ...d, "doanh-nghiep": { ...cur, goi: picked.includes(goi) ? picked : [...picked, goi] } };
      });
    }
  }

  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number; cancelIdleCallback?: (id: number) => void };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => void load());
      return () => w.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(() => void load(), 2000);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {form && (
        <Suspense key="consult-dialog" fallback={null}>
          <Body
            form={form}
            context={context}
            drafts={drafts}
            setDrafts={setDrafts}
            lastKind={lastKind}
            setLastKind={setLastKind}
            onClose={close}
          />
        </Suspense>
      )}
    </AnimatePresence>
  );
}
