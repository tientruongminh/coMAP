import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { articleHref, categoryLabel, latestArticles, type Article } from "@/content/news";
import { formatDate } from "@/lib/format";
import { newsSection } from "@/content/home";
import { NewsCover } from "@/components/news/NewsCover";
import { Reveal, RevealItem, RevealList } from "@/components/ui/Reveal";

/** Photo when the article has one, else its map motif (the same cover as on /ban-tin). */
function Cover({ a, lead }: { a: Article; lead: boolean }) {
  if (a.image)
    return (
      <Image
        src={a.image.src}
        alt={a.image.alt}
        fill
        sizes={lead ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 42vw, 120px"}
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.03]"
      />
    );
  return <NewsCover motif={a.cover} className="absolute inset-0" />;
}

/**
 * S7 (spec 3.1): the two newest articles as picture, category and title; the
 * rest are one tap away. On phones the second shrinks to a thumbnail row.
 */
export function LatestNews() {
  const items = latestArticles(2);
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="ban-tin" className="container-cm py-12 lg:py-16">
      <Reveal className="flex items-end justify-between gap-6">
        <h2 id="ban-tin" className="t-h2">
          {newsSection.title}
        </h2>
        <Link
          href={newsSection.allLink.href}
          className="group/all inline-flex h-11 items-center gap-2 rounded-full border border-line pl-4 pr-3 text-[15px] font-semibold leading-6 text-ink transition-colors duration-160 hover:border-ink"
        >
          {newsSection.allLink.label}
          <span className="sr-only">{newsSection.allLink.sr}</span>
          <ArrowRight size={16} weight="bold" aria-hidden="true" className="transition-transform duration-160 group-hover/all:translate-x-[3px]" />
        </Link>
      </Reveal>

      <RevealList className="mt-8 grid gap-4 lg:mt-10 lg:grid-cols-12 lg:gap-6">
        {items.map((a, n) => {
          const lead = n === 0;
          return (
            <RevealItem key={a.slug} className={lead ? "lg:col-span-7" : "lg:col-span-5"}>
              <article
                className={`group/card relative h-full ${
                  lead ? "flex flex-col gap-4" : "flex items-center gap-4 lg:flex-col lg:items-stretch"
                }`}
              >
                <div
                  className={`relative shrink-0 overflow-hidden rounded-[20px] bg-bezel ${
                    lead ? "aspect-[16/10] lg:aspect-[16/9]" : "aspect-square w-[104px] lg:aspect-[5/4] lg:w-full"
                  }`}
                >
                  <Cover a={a} lead={lead} />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold leading-[18px] text-lime-700">
                    {categoryLabel[a.category]}
                    <span className="sr-only">
                      , {newsSection.dateSr} <time dateTime={a.date}>{formatDate(a.date)}</time>
                    </span>
                  </p>
                  <h3
                    className={`mt-1.5 font-display tracking-[-0.02em] text-ink ${
                      lead ? "text-[24px] leading-[30px] lg:text-[32px] lg:leading-[38px]" : "text-[18px] leading-6 lg:text-[20px] lg:leading-[26px]"
                    }`}
                    style={{ fontVariationSettings: '"wdth" 112', fontWeight: 700 }}
                  >
                    <Link
                      href={articleHref(a.slug)}
                      className="outline-none after:absolute after:inset-0 after:rounded-[20px] after:content-[''] focus-visible:after:outline focus-visible:after:outline-[3px] focus-visible:after:outline-offset-2 focus-visible:after:outline-indigo-600"
                    >
                      <span className="bg-[linear-gradient(var(--highlighter),var(--highlighter))] bg-[length:0%_34%] bg-[position:0_88%] bg-no-repeat [box-decoration-break:clone] transition-[background-size] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:bg-[length:100%_34%]">
                        {a.title}
                      </span>
                    </Link>
                  </h3>
                </div>
              </article>
            </RevealItem>
          );
        })}
      </RevealList>
    </section>
  );
}
