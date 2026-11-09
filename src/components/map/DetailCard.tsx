"use client";

import {
  ArrowUpRight,
  CaretLeft,
  CaretRight,
  Clock,
  ClockCounterClockwise,
  Coins,
  EnvelopeSimple,
  FilePdf,
  Flag,
  Globe,
  Info,
  LinkSimple,
  LockSimple,
  MapPin,
  NavigationArrow,
  Phone,
  X,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { areaLong, fullAddress, meta, type DocumentRef, type Location } from "@/lib/locations";
import { formatDate, formatDistance } from "@/lib/format";
import { documentKindLabel, ownershipLabel, sourceLabel } from "@/content/taxonomy";
import { toasts } from "@/content/site";
import { detailCopy, mapPage } from "@/content/map";
import { hasPositionFilter, positionMatches, type Filters } from "@/lib/map-filters";
import { distanceFrom, domainOf, lngLat, relatedOf } from "@/lib/map-relations";
import { btn, btnArrow } from "@/components/ui/button";
import { BtnArrow } from "@/components/ui/BtnArrow";
import { useToast } from "@/components/ui/Toast";
import { ConsultTrigger, useConsult } from "@/components/consult/ConsultProvider";
import { Chip } from "./ResultList";
import { MiniPin } from "./pinGlyphs";

interface Props {
  loc: Location;
  filters: Filters;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onBack: () => void;
  onSelect: (id: string, el: HTMLElement) => void;
  onHover: (id: string | null) => void;
}

const ACTION =
  "inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-[14px] font-semibold text-ink underline-offset-4 decoration-[1.5px] transition-colors duration-160 hover:underline";

const KIND_ORDER: DocumentRef["kind"][] = ["program", "syllabus", "plan", "jd"];

/** Public and demo sources get a chip; a verified card carries the stamp alone. */
function SourceChip({ source }: { source: Location["source"] }) {
  if (source === "verified") return null;
  if (source === "public")
    return (
      <Chip>
        <Globe size={14} aria-hidden="true" />
        {sourceLabel.public}
      </Chip>
    );
  return (
    <Chip className="border-dashed border-ink-muted/50">
      <Info size={14} aria-hidden="true" />
      {sourceLabel.demo}
    </Chip>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="py-2.5">
      <dt className="text-[13px] leading-[18px] text-ink-muted">{label}</dt>
      <dd className="mt-0.5 text-[15px] leading-[22px] text-ink">{children}</dd>
    </div>
  );
}

/** Contact row: the icon is the visible label, the word stays for screen readers. */
function IconRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-1.5">
      <dt className="shrink-0 pt-px text-indigo-700">
        <span aria-hidden="true">{icon}</span>
        <span className="sr-only">{label}</span>
      </dt>
      <dd className="min-w-0 text-[15px] leading-[22px] text-ink">{children}</dd>
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-[16px] font-semibold leading-6 text-ink">{children}</h3>;
}

/** Detail card (spec 4.8). Replaces the list in the panel, or fills the mobile sheet. */
export function DetailCard({ loc, filters, headingRef, onBack, onSelect, onHover }: Props) {
  const toast = useToast();
  const uid = useId();
  const school = loc.type === "school";
  const { partners, matches } = useMemo(() => relatedOf(loc), [loc]);
  const posFilter = hasPositionFilter(filters);
  const [doc, setDoc] = useState<DocumentRef | null>(null);

  const docGroups = KIND_ORDER.map((k) => ({ kind: k, items: loc.documents.filter((d) => d.kind === k) })).filter(
    (g) => g.items.length > 0,
  );
  const demo = loc.source === "demo";
  const domain = loc.website ? domainOf(loc.website) : null;
  const here = lngLat(loc);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast(toasts.copied);
    } catch {
      toast(toasts.copyFailed);
    }
  };

  const relList = (items: Location[]) => (
    <ul className="mt-2 flex flex-col">
      {items.map((o) => (
        <li key={o.id}>
          <button
            type="button"
            data-rel={o.id}
            onClick={(e) => onSelect(o.id, e.currentTarget)}
            onMouseEnter={() => onHover(o.id)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(o.id)}
            onBlur={() => onHover(null)}
            className="-mx-2 flex min-h-11 w-[calc(100%+16px)] items-center gap-3 rounded-[12px] px-2 py-2 text-left transition-colors duration-160 hover:bg-paper"
          >
            <MiniPin type={o.type} size={20} />
            <span className="min-w-0 flex-1 truncate text-[14px] font-medium leading-5 text-ink">{o.short ?? o.name}</span>
            <span title={mapPage.straightLine} className="shrink-0 text-[13px] text-ink-muted tabular-nums">
              {formatDistance(distanceFrom(here, o))}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <article aria-labelledby={`${uid}-h`} className="flex flex-col">
      <div className="px-6 pt-4">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label={detailCopy.backLabel}
            className="-ml-3 inline-flex h-11 items-center gap-1.5 rounded-full px-3 text-[14px] font-semibold text-ink transition-colors duration-160 hover:bg-paper"
          >
            <CaretLeft size={16} weight="bold" aria-hidden="true" />
            {detailCopy.back}
          </button>
          {loc.source === "verified" && <span className="stamp shrink-0">{detailCopy.verifiedStamp}</span>}
        </div>

        <div className="mt-3 flex items-start gap-4">
          <MiniPin type={loc.type} size={48} />
          <div className="min-w-0 flex-1">
            <h2
              ref={headingRef}
              id={`${uid}-h`}
              tabIndex={-1}
              className="font-display text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-ink outline-none"
            >
              {loc.name}
            </h2>
            {loc.unit && <p className="mt-1 text-[14px] leading-5 text-ink-muted">{loc.unit}</p>}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <SourceChip source={loc.source} />
          <Chip>{ownershipLabel[loc.ownership]}</Chip>
          {!school && <Chip>{meta.sizes[loc.size]}</Chip>}
        </div>
      </div>

      <dl className="mt-3 border-y border-line px-6 pb-2.5">
        <Row label={school ? detailCopy.rows.fields : detailCopy.rows.siteFields}>
          <span className="mt-1 flex flex-wrap gap-1.5">
            {loc.fields.map((f) => (
              <Chip key={f}>{f}</Chip>
            ))}
          </span>
        </Row>
        <IconRow icon={<MapPin size={18} weight="fill" />} label={detailCopy.rows.address}>
          {fullAddress(loc)}
          <span className="block text-[13px] leading-[18px] text-ink-muted">
            <span className="sr-only">{`${detailCopy.rows.area}: `}</span>
            {detailCopy.areaValue(areaLong(loc.area))}
          </span>
        </IconRow>
        {!school && loc.phone && (
          <IconRow icon={<Phone size={18} weight="fill" />} label={detailCopy.rows.phone}>
            {demo ? (
              <span className="tabular-nums">{loc.phone}</span>
            ) : (
              <a href={`tel:${loc.phone.replace(/\s/g, "")}`} className="tabular-nums underline-offset-4 hover:underline">
                {loc.phone}
              </a>
            )}
          </IconRow>
        )}
        {!school && loc.email && (
          <IconRow icon={<EnvelopeSimple size={18} weight="fill" />} label={detailCopy.rows.email}>
            {demo ? (
              <span className="break-all">{loc.email}</span>
            ) : (
              <a href={`mailto:${loc.email}`} className="break-all underline-offset-4 hover:underline">
                {loc.email}
              </a>
            )}
          </IconRow>
        )}
        {loc.website && domain && (
          <IconRow icon={<Globe size={18} weight="fill" />} label={detailCopy.rows.website}>
            <a
              href={loc.website}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={detailCopy.openWebsite(domain)}
              className="inline-flex items-center gap-1 break-all font-medium text-indigo-700 underline-offset-4 hover:underline"
            >
              {domain}
              <ArrowUpRight size={14} weight="bold" aria-hidden="true" className="shrink-0" />
            </a>
          </IconRow>
        )}
      </dl>

      <div className="flex flex-col gap-7 px-6 pb-6 pt-5">
        {loc.description && <p className="text-[15px] leading-6 text-ink">{loc.description}</p>}

        {!school && loc.positions.length > 0 && (
          <section>
            <SectionTitle>{detailCopy.positions(loc.positions.length)}</SectionTitle>
            <ul className="mt-3 flex flex-col gap-2">
              {loc.positions.map((p, i) => {
                const hit = posFilter && positionMatches(p, filters);
                const stipend = [p.stipend, p.stipendNote].filter(Boolean).join(" · ");
                return (
                  <li
                    key={`${p.title}-${i}`}
                    className={`rounded-[14px] border border-line px-4 py-3 ${hit ? "border-l-4 border-l-lime-400" : ""}`}
                  >
                    <p className="text-[15px] font-semibold leading-[22px] text-ink">
                      {p.title}
                      {hit && <span className="sr-only">. {detailCopy.matchingPosition}</span>}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Chip>
                        <Clock size={14} aria-hidden="true" />
                        {p.workType}
                      </Chip>
                      <Chip>
                        <Coins size={14} aria-hidden="true" />
                        {stipend}
                      </Chip>
                    </div>
                    {(p.schedule || p.slots) && (
                      <p className="mt-2 text-[13px] leading-[18px] text-ink-muted">
                        {[p.schedule, p.slots ? detailCopy.slots(p.slots) : null].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {docGroups.length > 0 && (
          <section>
            <SectionTitle>{detailCopy.documents}</SectionTitle>
            <div className="mt-2 flex flex-col gap-3">
              {docGroups.map((g) => (
                <div key={g.kind}>
                  <h4 className="text-[13px] font-medium leading-[18px] text-ink-muted">{documentKindLabel[g.kind]}</h4>
                  <ul className="mt-1">
                    {g.items.map((d) => (
                      <li key={d.title}>
                        <button
                          type="button"
                          onClick={() => setDoc(d)}
                          className="-mx-2 flex min-h-11 w-[calc(100%+16px)] items-center gap-3 rounded-[12px] px-2 py-2 text-left transition-colors duration-160 hover:bg-paper"
                        >
                          <FilePdf size={20} className="shrink-0 text-indigo-600" aria-hidden="true" />
                          <span className="min-w-0 flex-1 text-[14px] font-medium leading-5 text-ink">{d.title}</span>
                          <CaretRight size={16} className="shrink-0 text-ink-muted" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <SectionTitle>
            {school ? detailCopy.partnerSites(partners.length) : detailCopy.partnerSchools(partners.length)}
          </SectionTitle>
          {partners.length > 0 ? (
            <>
              {relList(partners)}
              {partners.some((p) => p.source === "demo") && (
                <p className="mt-1 text-[12px] leading-4 text-ink-muted">{detailCopy.includesDemo}</p>
              )}
            </>
          ) : (
            <p className="mt-2 text-[14px] leading-5 text-ink-muted">{detailCopy.noPartners}</p>
          )}
          {matches.length > 0 && (
            <div className="mt-4">
              <h4 className="text-[14px] font-semibold leading-5 text-ink">
                {school ? detailCopy.maybeFit : detailCopy.sameField}
              </h4>
              {relList(matches)}
            </div>
          )}
        </section>

        {!school && (
          <ConsultTrigger form="sinh-vien" context={{ diem: loc.id }} className={btnArrow("primary", "self-start")}>
            {detailCopy.consult}
            <BtnArrow />
          </ConsultTrigger>
        )}

        <div className="-mx-2 flex flex-wrap gap-1">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className={ACTION}
          >
            <NavigationArrow size={16} aria-hidden="true" />
            {detailCopy.directions}
          </a>
          <button type="button" onClick={copyLink} className={ACTION}>
            <LinkSimple size={16} aria-hidden="true" />
            {detailCopy.copyLink}
          </button>
          <Link href={`/lien-he?chu-de=bao-sai&diem=${loc.id}`} aria-label={detailCopy.reportLabel} className={ACTION}>
            <Flag size={16} aria-hidden="true" />
            {detailCopy.report}
          </Link>
        </div>

        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] leading-4 text-ink-muted">
          <span className="inline-flex items-start gap-1">
            <Info size={14} aria-hidden="true" className="shrink-0" />
            <span>
              <span className="sr-only">{detailCopy.sourceLabel}</span>
              {meta.source[loc.source]}
            </span>
          </span>
          <span className="inline-flex items-center gap-1 tabular-nums">
            <ClockCounterClockwise size={14} aria-hidden="true" className="shrink-0" />
            <span className="sr-only">{detailCopy.updatedLabel}</span>
            {formatDate(meta.updated)}
          </span>
        </p>
      </div>

      <DocDialog doc={doc} owner={loc} onClose={() => setDoc(null)} />
    </article>
  );
}

function DocDialog({ doc, owner, onClose }: { doc: DocumentRef | null; owner: Location; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const { open } = useConsult();
  const uid = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (doc && !d.open) d.showModal();
    if (!doc && d.open) d.close();
  }, [doc]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={`${uid}-t`}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
      className="m-auto w-[min(480px,calc(100%-32px))] rounded-[20px] bg-surface p-0 text-ink shadow-[var(--shadow-2)] backdrop:bg-ink/40"
    >
      {doc && (
        <div className="relative p-6">
          <button
            type="button"
            aria-label={detailCopy.docClose}
            onClick={() => ref.current?.close()}
            className="absolute right-3 top-3 grid size-11 place-items-center rounded-full text-ink transition-colors duration-160 hover:bg-paper"
          >
            <X size={20} aria-hidden="true" />
          </button>
          <FilePdf size={32} className="text-indigo-600" aria-hidden="true" />
          <h2 id={`${uid}-t`} className="mt-3 pr-10 font-display text-[20px] font-bold leading-[26px] tracking-[-0.02em]">
            {doc.title}
          </h2>
          <p className="mt-1 text-[14px] leading-5 text-ink-muted">
            {documentKindLabel[doc.kind]} · {owner.short ?? owner.name}
          </p>
          <p className="mt-4 flex items-start gap-2 text-[15px] leading-6">
            <LockSimple size={18} weight="fill" aria-hidden="true" className="mt-[3px] shrink-0 text-ink-muted" />
            {detailCopy.docDialogBody}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className={btn("primary", "md")}
              onClick={() => {
                const title = doc.title;
                ref.current?.close();
                open("chon", { taiLieu: title, diem: owner.id });
              }}
            >
              {detailCopy.docConsult}
            </button>
            <button type="button" className={btn("secondary", "md")} onClick={() => ref.current?.close()}>
              {detailCopy.docClose}
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
