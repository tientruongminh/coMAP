import { mapPage, mapStates } from "@/content/map";
import { HCM_OUTLINE } from "./hcmOutline";

/**
 * Loading states (spec 4.1, 4.11): the TP.HCM outline at 1px `--line` with
 * `Đang tải bản đồ…`, and 6 static list rows. No shimmer.
 */
export function MapLoading({ offsetLeft = false }: { offsetLeft?: boolean }) {
  return (
    <div
      className={`absolute inset-0 grid place-items-center bg-[#EFEFF4] ${offsetLeft ? "lg:pl-[432px]" : ""}`}
      role="status"
    >
      <div className="flex flex-col items-center gap-4 px-6">
        <svg
          viewBox={`0 0 ${HCM_OUTLINE.width} ${HCM_OUTLINE.height}`}
          className="h-auto w-[min(220px,48vw)]"
          aria-hidden="true"
        >
          <path d={HCM_OUTLINE.d} fill="none" stroke="#DCDCE6" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
        </svg>
        <p className="text-[14px] leading-5 text-ink-muted">{mapStates.loading}</p>
      </div>
    </div>
  );
}

export function ListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <ul aria-hidden="true" className="flex flex-col gap-1">
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} className="flex min-h-[72px] items-start gap-3 px-3 py-3">
          <span className="size-6 shrink-0 rounded-full bg-line/70" />
          <span className="flex flex-1 flex-col gap-2 pt-0.5">
            <span className="h-3.5 w-[70%] rounded-full bg-line/80" />
            <span className="h-3 w-[45%] rounded-full bg-line/60" />
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Suspense fallback of /ban-do before the client explorer mounts. */
export function MapPageSkeleton() {
  return (
    <>
      <MapLoading offsetLeft />
      <section
        aria-labelledby="map-title-skeleton"
        className="absolute bottom-4 left-4 top-4 z-10 hidden w-[400px] flex-col overflow-hidden rounded-[20px] bg-surface shadow-[var(--shadow-2)] lg:flex"
      >
        <div className="px-6 pt-6">
          <h1 id="map-title-skeleton" className="font-display text-[20px] font-bold leading-[26px] tracking-[-0.02em]">
            {mapPage.title}
          </h1>
          <div className="mt-4 h-12 rounded-full border border-line bg-surface" />
          <div className="mt-3 flex gap-2">
            <span className="h-9 w-[150px] rounded-full bg-line/60" />
            <span className="h-9 w-[140px] rounded-full bg-line/60" />
          </div>
        </div>
        <div className="mt-4 px-3">
          <ListSkeleton />
        </div>
      </section>
      <div className="absolute inset-x-3 top-3 z-10 h-12 rounded-full bg-surface shadow-[var(--shadow-1)] lg:hidden" aria-hidden="true" />
      <div
        className="absolute inset-x-0 bottom-0 z-10 h-[132px] rounded-t-[20px] bg-surface shadow-[var(--shadow-2)] lg:hidden"
        aria-hidden="true"
      />
      <h1 className="sr-only lg:hidden">{mapPage.title}</h1>
    </>
  );
}
