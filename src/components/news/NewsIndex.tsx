"use client";

import { motion, useReducedMotion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { isNewsCategory, type NewsCategory } from "@/content/news";
import { NewsHead, NewsList, type SelectHandler } from "./NewsListing";

/**
 * Client half of /ban-tin. The server already rendered the right filter from
 * `?muc=`; chip clicks then update the URL with history.pushState (which Next
 * syncs into useSearchParams) and swap the results in place, no round trip.
 */
export function NewsIndex() {
  const params = useSearchParams();
  const raw = params.get("muc");
  const muc: NewsCategory | null = isNewsCategory(raw) ? raw : null;
  const [changed, setChanged] = useState(false);
  const reduce = useReducedMotion();

  const onSelect: SelectHandler = (next, href, e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (next === muc) return;
    setChanged(true);
    window.history.pushState(null, "", href);
  };

  return (
    <>
      <NewsHead muc={muc} onSelect={onSelect} />
      <motion.div
        key={muc ?? "tat-ca"}
        className="mt-8 lg:mt-10"
        initial={changed && !reduce ? { opacity: 0, y: 8 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      >
        <NewsList muc={muc} />
      </motion.div>
    </>
  );
}
