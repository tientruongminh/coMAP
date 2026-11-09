import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Flag, X } from "@phosphor-icons/react/ssr";
import { Figure } from "@/components/about/Figure";
import { CopyLinkButton } from "@/components/news/CopyLinkButton";
import { NewsCard } from "@/components/news/NewsListing";
import { NewsCover } from "@/components/news/NewsCover";
import { RevealItem, RevealList } from "@/components/ui/Reveal";
import {
  articleHref,
  articleMinutes,
  articles,
  categoryHref,
  categoryLabel,
  getArticle,
  newsCopy,
  parseBody,
  relatedArticles,
  type Block,
} from "@/content/news";
import { site } from "@/content/site";
import { formatDate, slugify } from "@/lib/format";

/**
 * Every slug is listed in generateStaticParams, so all six pages are fully
 * prerendered and their prefetch carries the whole page. The dev validator
 * still treats `params` as URL data on article to article navigation, so this
 * segment opts out of instant validation instead of adding a skeleton that
 * would never be seen in production.
 */
export const instant = false;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/ban-tin/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return pageMetadata({
    title: a.title,
    description: a.excerpt,
    shareTitle: a.title,
    alternates: { canonical: articleHref(a.slug) },
    ...(a.image ? { image: { url: a.image.src, alt: a.image.alt } } : {}),
    openGraph: { type: "article", publishedTime: a.date, authors: [newsCopy.author] },
  });
}

/** One body block. Bullets get a route-stop marker; the pair reads as crossed out then checked. */
function BodyBlock({ b }: { b: Block }) {
  switch (b.kind) {
    case "h2":
      return (
        <h2
          id={slugify(b.text)}
          className="mt-12 font-display text-[22px] font-bold leading-[28px] tracking-[-0.01em] [font-variation-settings:'wdth'_112] [text-wrap:balance] lg:text-[24px] lg:leading-[30px]"
        >
          {b.text}
        </h2>
      );
    case "ul":
      return (
        <ul className="mt-4 flex flex-col gap-3">
          {b.items.map((t) => (
            <li key={t} className="t-body-l flex gap-3.5">
              <span aria-hidden="true" className="mt-[9px] size-2.5 shrink-0 rounded-[3px] bg-lime-400 ring-2 ring-lime-400/30" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      );
    case "compare":
      return (
        <div className="mt-4 grid gap-2">
          <p className="flex gap-3 rounded-[14px] border border-dashed border-line px-4 py-3 text-ink-muted">
            <X size={20} weight="bold" aria-hidden="true" className="mt-[3px] shrink-0 text-danger" />
            <span>
              <span className="t-label block text-ink-muted">{newsCopy.instead}</span>
              <s className="t-body-l decoration-ink-muted/60">{b.instead}</s>
            </span>
          </p>
          <p className="flex gap-3 rounded-[14px] border border-line bg-surface px-4 py-3 shadow-[var(--shadow-1)]">
            <Check size={20} weight="bold" aria-hidden="true" className="mt-[3px] shrink-0 text-lime-700" />
            <span>
              <span className="t-label block text-lime-700">{newsCopy.better}</span>
              <span className="t-body-l">{b.better}</span>
            </span>
          </p>
        </div>
      );
    case "takeaway":
      return (
        <aside
          aria-label={newsCopy.takeaway}
          className="mt-12 flex gap-4 rounded-[20px] bg-ink px-5 py-5 text-white md:px-7 md:py-6"
        >
          <Flag size={22} weight="fill" aria-hidden="true" className="mt-[3px] shrink-0 text-lime-400" />
          <p className="t-body-l font-medium">{b.text}</p>
        </aside>
      );
    case "lead":
      return null;
    default:
      return <p className="t-body-l mt-3 text-ink">{b.text}</p>;
  }
}

export default async function ArticlePage({ params }: PageProps<"/ban-tin/[slug]">) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();

  const blocks = parseBody(a.body);
  const lead = blocks.find((b) => b.kind === "lead");
  const related = relatedArticles(a, 2);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.excerpt,
    datePublished: a.date,
    inLanguage: "vi",
    author: { "@type": "Organization", name: newsCopy.author },
    publisher: { "@type": "Organization", name: site.name },
    ...(a.image ? { image: a.image.src } : {}),
  };

  return (
    <>
      <article className="container-cm pb-16 pt-8 lg:pb-24 lg:pt-12">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <header className="mx-auto max-w-[800px]">
          <nav aria-label={newsCopy.breadcrumbLabel}>
            <ol className="flex flex-wrap items-center gap-2 text-[14px] font-semibold leading-5">
              <li>
                <Link
                  href="/ban-tin"
                  className="inline-flex h-8 items-center gap-1.5 text-ink-muted underline-offset-4 hover:text-ink hover:underline"
                >
                  <ArrowLeft size={14} weight="bold" aria-hidden="true" />
                  {newsCopy.title}
                </Link>
              </li>
              <li>
                <Link
                  href={categoryHref(a.category)}
                  className="inline-flex h-8 items-center rounded-full bg-surface px-3 text-[12px] text-ink shadow-[var(--shadow-1)] transition-colors duration-160 hover:bg-indigo-50"
                >
                  {categoryLabel[a.category]}
                </Link>
              </li>
            </ol>
          </nav>
          <h1 className="t-h1 mt-4 lg:text-[44px] lg:leading-[50px]">{a.title}</h1>
          <p className="t-small tabular mt-4 text-ink-muted">
            <time dateTime={a.date}>{formatDate(a.date)}</time>
            {" · "}
            {newsCopy.readTime(articleMinutes(a))}
            <span className="sr-only">
              {" · "}
              {newsCopy.author}
            </span>
          </p>
        </header>

        {a.image ? (
          <Figure
            src={a.image.src}
            alt={a.image.alt}
            caption={a.image.caption}
            eager
            sizes="(min-width: 1088px) 1040px, calc(100vw - 32px)"
            className="mx-auto mt-8 max-w-[1040px] lg:mt-10"
          />
        ) : (
          <NewsCover motif={a.cover} className="mx-auto mt-8 aspect-[16/9] max-w-[1040px] rounded-[20px] md:aspect-[21/9] lg:mt-10" />
        )}

        <div className="mx-auto mt-10 max-w-[800px] lg:mt-12">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_200px] md:items-start md:gap-10">
            {lead?.kind === "lead" && <p className="t-body-l text-[19px] font-medium leading-[30px] text-ink">{lead.text}</p>}
            <p className="rounded-[20px] border border-line bg-surface px-5 py-4 md:px-6 md:py-5">
              <span className="block font-display text-[44px] font-bold leading-[48px] tracking-[-0.02em] text-indigo-700 [font-variation-settings:'wdth'_112]">
                {a.stat.value}
              </span>
              <span className="t-small mt-1 block text-ink-muted">{a.stat.label}</span>
            </p>
          </div>

          <div className="max-w-[68ch]">
            {blocks.map((b, i) => (
              <BodyBlock key={i} b={b} />
            ))}
          </div>

          <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
            <CopyLinkButton label={newsCopy.copyLink} />
            <Link
              href="/ban-tin"
              className="group/all inline-flex items-center gap-2 text-[15px] font-semibold leading-6 text-ink underline-offset-4 hover:underline"
            >
              <ArrowLeft
                size={16}
                weight="bold"
                aria-hidden="true"
                className="transition-transform duration-160 group-hover/all:-translate-x-[3px]"
              />
              {newsCopy.back}
            </Link>
          </footer>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="lien-quan" className="container-cm pb-16 lg:pb-24">
          <h2 id="lien-quan" className="t-h2">
            {newsCopy.related}
          </h2>
          <RevealList className="mt-8 grid gap-x-6 gap-y-12 md:grid-cols-2 lg:mt-10">
            {related.map((r) => (
              <RevealItem key={r.slug}>
                <NewsCard a={r} as="h3" bare />
              </RevealItem>
            ))}
          </RevealList>
        </section>
      )}
    </>
  );
}
