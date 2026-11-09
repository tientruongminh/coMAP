import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { NewsHead, NewsList } from "@/components/news/NewsListing";
import { NewsIndex } from "@/components/news/NewsIndex";
import { newsCopy } from "@/content/news";

export const metadata: Metadata = pageMetadata({ title: newsCopy.title, description: newsCopy.metaDescription });

/**
 * Reading `searchParams` here makes this part request time, so `?muc=` is
 * already applied in the first HTML. The static shell shows the unfiltered list.
 */
async function NewsResults({ searchParams }: { searchParams: PageProps<"/ban-tin">["searchParams"] }) {
  await searchParams;
  return <NewsIndex />;
}

export default function NewsPage({ searchParams }: PageProps<"/ban-tin">) {
  return (
    <div className="container-cm pb-16 pt-10 lg:pb-24 lg:pt-14">
      <Suspense
        fallback={
          <>
            <NewsHead muc={null} />
            <div className="mt-8 lg:mt-10">
              <NewsList muc={null} />
            </div>
          </>
        }
      >
        <NewsResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
