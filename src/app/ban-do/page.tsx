import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import MapExplorer from "@/components/map/MapExplorer";
import { MapPageSkeleton } from "@/components/map/MapSkeleton";
import { mapPage } from "@/content/map";

export const metadata: Metadata = pageMetadata({ title: mapPage.title, description: mapPage.description });

/** /ban-do (spec 4): full-bleed map under the header, no footer. */
export default function MapPage() {
  return (
    <main
      id="noi-dung"
      className="relative h-[calc(100dvh-var(--header-h))] min-h-[480px] overflow-hidden bg-[#EFEFF4]"
    >
      <Suspense fallback={<MapPageSkeleton />}>
        <MapExplorer />
      </Suspense>
    </main>
  );
}
