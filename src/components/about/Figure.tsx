import Image from "next/image";
import { imageCaption } from "@/content/site";

/**
 * One of the four documentary photos (spec 6.10): 20px radius, lazy,
 * caption `Ảnh minh họa.` in 13px muted. `ratio` picks the crop.
 */
export function Figure({
  src,
  alt,
  ratio = "16/9",
  sizes,
  className = "",
  caption = imageCaption,
  eager = false,
}: {
  src: string;
  alt: string;
  ratio?: "16/9" | "4/3";
  sizes: string;
  className?: string;
  caption?: string;
  /** above-the-fold images load eagerly with high fetch priority */
  eager?: boolean;
}) {
  return (
    <figure className={className}>
      <div className={`relative overflow-hidden rounded-[20px] bg-bezel ${ratio === "4/3" ? "aspect-[4/3]" : "aspect-video"}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          placeholder="empty"
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          className="object-cover"
        />
      </div>
      <figcaption className="mt-3 text-[13px] leading-[18px] text-ink-muted">{caption}</figcaption>
    </figure>
  );
}
