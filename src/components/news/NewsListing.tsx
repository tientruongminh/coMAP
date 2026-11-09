import Link from "next/link";
import Image from "next/image";
import type { MouseEvent } from "react";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { RevealItem, RevealList } from "@/components/ui/Reveal";
import {
  articleHref,
  articles,
  categoryHref,
  categoryLabel,
  categoryOrder,
  newsCopy,
  sortedArticles,
  type Article,
  type NewsCategory,
} from "@/content/news";
import { formatDate } from "@/lib/format";
import { NewsCover } from "./NewsCover";

/** Highlighter sweep on hover (6.2). */
export const sweep = (group: "card" | "lead") =>
  `bg-[linear-gradient(var(--highlighter),var(--highlighter))] bg-[length:0%_34%] bg-[position:0_88%] bg-no-repeat [box-decoration-break:clone] transition-[background-size] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
    group === "card" ? "group-hover/card:bg-[length:100%_34%]" : "group-hover/lead:bg-[length:100%_34%]"
  }`;
export const stretched =
  "outline-none after:absolute after:inset-0 after:z-10 after:content-[''] focus-visible:after:rounded-[20px] focus-visible:after:outline focus-visible:after:outline-[3px] focus-visible:after:outline-offset-2 focus-visible:after:outline-indigo-600";

export type SelectHandler = (muc: NewsCategory | null, href: string, e: MouseEvent<HTMLAnchorElement>) => void;

/**
 * Category chips (spec 3.5), single select, synced to `?muc=`. They are real
 * links, so the page works without JS; with JS the index swaps results in place.
 */
export function NewsChips({ muc, onSelect }: { muc: NewsCategory | null; onSelect?: SelectHandler }) {
  const chips: { key: NewsCategory | null; label: string; href: string }[] = [
    { key: null, label: newsCopy.all, href: "/ban-tin" },
    ...categoryOrder.map((c) => ({ key: c, label: categoryLabel[c], href: categoryHref(c) })),
  ];
  return (
    <nav aria-label={newsCopy.chipsLabel} className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:overflow-visible md:px-0">
      <ul className="flex w-max gap-2 md:w-auto md:flex-wrap md:justify-end">
        {chips.map((c) => {
          const on = c.key === muc;
          return (
            <li key={c.label}>
              <Link
                href={c.href}
                scroll={false}
                aria-current={on ? "true" : undefined}
                onClick={onSelect ? (e) => onSelect(c.key, c.href, e) : undefined}
                className={`inline-flex h-10 items-center whitespace-nowrap rounded-full border px-4 text-[14px] font-semibold leading-none transition-[background-color,border-color,color,transform] duration-160 active:scale-[0.98] ${
                  on ? "border-ink bg-ink text-white" : "border-line bg-surface text-ink hover:border-ink"
                }`}
              >
                {c.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Page title with the chips beside it on wide screens. */
export function NewsHead({ muc, onSelect }: { muc: NewsCategory | null; onSelect?: SelectHandler }) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between lg:gap-x-10">
      <h1 className="t-display">{newsCopy.title}</h1>
      <div className="lg:pb-2">
        <NewsChips muc={muc} onSelect={onSelect} />
      </div>
    </div>
  );
}

/** Category chip laid on the cover like a map label. */
function CategoryChip({ c }: { c: NewsCategory }) {
  return (
    <span className="absolute left-3 top-3 z-[1] inline-flex h-7 items-center rounded-full bg-surface px-3 text-[12px] font-semibold leading-none text-ink shadow-[var(--shadow-1)]">
      {categoryLabel[c]}
    </span>
  );
}

/** Photo when the article has one, else its map motif. */
export function CardCover({
  a,
  sizes,
  eager = false,
  className = "",
}: {
  a: Article;
  sizes: string;
  eager?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-[20px] bg-bezel ${className}`}>
      {a.image ? (
        <Image
          src={a.image.src}
          alt={a.image.alt}
          fill
          sizes={sizes}
          placeholder="empty"
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.03] group-hover/lead:scale-[1.03] motion-reduce:transform-none"
        />
      ) : (
        <NewsCover motif={a.cover} className="absolute inset-0" />
      )}
    </div>
  );
}

/**
 * Grid card: cover, category chip, title, date. No excerpt (spec 0).
 * `wide` lays an odd last card across both columns; `bare` is image and title only.
 */
export function NewsCard({
  a,
  as: H = "h2",
  bare = false,
  wide = false,
}: {
  a: Article;
  as?: "h2" | "h3";
  bare?: boolean;
  wide?: boolean;
}) {
  return (
    <article className={`group/card relative ${wide ? "md:grid md:grid-cols-12 md:items-end md:gap-6" : ""}`}>
      <div className={`relative ${wide ? "md:col-span-8" : ""}`}>
        <CardCover
          a={a}
          sizes={wide ? "(min-width: 768px) 66vw, calc(100vw - 32px)" : "(min-width: 768px) 50vw, calc(100vw - 32px)"}
          className={wide ? "aspect-[16/10] md:aspect-[2/1]" : "aspect-[16/10]"}
        />
        {!bare && <CategoryChip c={a.category} />}
      </div>
      <div className={wide ? "md:col-span-4 md:pb-6" : ""}>
        <H className="t-h3 mt-4 max-w-[30ch]">
          <Link href={articleHref(a.slug)} className={stretched}>
            <span className={sweep("card")}>{a.title}</span>
          </Link>
        </H>
        {!bare && (
          <time dateTime={a.date} className="tabular mt-2 block text-[13px] leading-[18px] text-ink-muted">
            {formatDate(a.date)}
          </time>
        )}
      </div>
    </article>
  );
}

/** Newest article in the current filter: a wide cover with the title beside it. */
function Lead({ a }: { a: Article }) {
  return (
    <article className="group/lead relative grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-6">
      <figure className="lg:col-span-8">
        <div className="relative">
          <CardCover
            a={a}
            eager
            sizes="(min-width: 1280px) 816px, (min-width: 1024px) 64vw, calc(100vw - 32px)"
            className="aspect-[4/3] sm:aspect-video"
          />
          <CategoryChip c={a.category} />
        </div>
        {a.image?.caption && (
          <figcaption className="mt-2 text-[13px] leading-[18px] text-ink-muted">{a.image.caption}</figcaption>
        )}
      </figure>
      <div className="lg:col-span-4 lg:pb-10">
        <time dateTime={a.date} className="tabular block text-[13px] leading-[18px] text-ink-muted">
          {formatDate(a.date)}
        </time>
        <h2 className="t-h2 mt-2 lg:text-[36px] lg:leading-[42px]">
          <Link href={articleHref(a.slug)} className={stretched}>
            <span className={sweep("lead")}>{a.title}</span>
          </Link>
        </h2>
        <span
          aria-hidden="true"
          className="mt-6 grid size-11 place-items-center rounded-full bg-indigo-700 text-white transition-transform duration-240 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/lead:translate-x-1.5"
        >
          <ArrowRight size={18} weight="bold" />
        </span>
      </div>
    </article>
  );
}

/** Lead plus the card grid for one filter, or the empty state. */
export function NewsList({ muc }: { muc: NewsCategory | null }) {
  const list = sortedArticles(muc ? articles.filter((a) => a.category === muc) : articles);
  if (list.length === 0) {
    return (
      <div className="rounded-[20px] border border-dashed border-line px-6 py-12 text-center md:py-16">
        <p className="t-body-l">{newsCopy.empty}</p>
        <Link
          href="/ban-tin"
          scroll={false}
          className="mt-4 inline-flex items-center gap-2 text-[15px] font-semibold leading-6 text-ink underline-offset-4 hover:underline"
        >
          {newsCopy.seeAll}
          <ArrowRight size={16} weight="bold" aria-hidden="true" />
        </Link>
      </div>
    );
  }
  const [lead, ...rest] = list;
  return (
    <>
      {/* No reveal on the lead: it holds the LCP image. */}
      <Lead a={lead} />
      {rest.length > 0 && (
        <RevealList className="mt-16 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:mt-24 lg:gap-y-20">
          {rest.map((a, i) => {
            const wide = rest.length % 2 === 1 && i === rest.length - 1;
            return (
              <RevealItem key={a.slug} className={wide ? "md:col-span-2" : undefined}>
                <NewsCard a={a} wide={wide} />
              </RevealItem>
            );
          })}
        </RevealList>
      )}
    </>
  );
}
