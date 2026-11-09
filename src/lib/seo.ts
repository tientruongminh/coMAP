import type { Metadata } from "next";
import { site } from "@/content/site";

type ShareImage = { url: string; alt: string; width?: number; height?: number };

/** The site share card (1200x630), rendered from the live hero map. */
export const shareImage: ShareImage = {
  url: "/og/co-map.png",
  width: 1200,
  height: 630,
  alt: site.shareImageAlt,
};

type OpenGraph = NonNullable<Metadata["openGraph"]>;

/**
 * Per-page metadata. Next replaces a parent's `openGraph` and `twitter`
 * objects wholesale, so every page states its full share card here instead of
 * inheriting one piece of it.
 */
export function pageMetadata({
  title,
  description,
  shareTitle = `${title} | ${site.name}`,
  image = shareImage,
  openGraph,
  ...rest
}: {
  title: string;
  description: string;
  shareTitle?: string;
  image?: ShareImage;
  openGraph?: OpenGraph;
} & Omit<Metadata, "title" | "description" | "openGraph" | "twitter">): Metadata {
  return {
    title,
    description,
    ...rest,
    openGraph: {
      type: "website",
      locale: "vi_VN",
      siteName: site.name,
      title: shareTitle,
      description,
      images: [image],
      ...openGraph,
    } as OpenGraph,
    twitter: { card: "summary_large_image", title: shareTitle, description, images: [image] },
  };
}
