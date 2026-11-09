"use client";

import { MapPin, X } from "@phosphor-icons/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { BtnArrow } from "@/components/ui/BtnArrow";
import { btn, btnArrow } from "@/components/ui/button";
import { contactPage, contactTopicOptions, fieldLabels, formHeads, formsUi } from "@/content/forms";
import { MESSAGE_MAX, messageLength, type LeadValues } from "@/lib/lead-schema";
import { formatNumber } from "@/lib/format";
import { Banner, Consent, Honeypot, Label, SelectField, TextAreaField, TextField } from "./fields";
import { SubmitButton, SuccessPanel } from "./parts";
import { useLeadForm } from "./useLeadForm";

/**
 * Liên hệ form card (spec 3.6, 5.4). `?chu-de=` presets the topic and a known
 * `?diem=` shows the location chip, so `Báo thông tin chưa đúng` on a map card
 * lands here ready to write.
 */
const TOPICS: readonly string[] = contactTopicOptions.map((o) => o.value);
const TITLE_ID = "gui-loi-nhan";

type Places = Record<string, string>;

/** Reads the query string; the Suspense fallback renders `ContactForm` without it. */
export function ContactFormFromUrl({ places }: { places: Places }) {
  const params = useSearchParams();
  const topic = params.get("chu-de");
  const diem = params.get("diem");
  return (
    <ContactForm
      places={places}
      topic={topic && TOPICS.includes(topic) ? topic : undefined}
      diem={diem && places[diem] ? diem : undefined}
    />
  );
}

export function ContactForm({ places, topic, diem }: { places: Places; topic?: string; diem?: string }) {
  const initial = (): LeadValues => (topic ? { chuDe: topic } : {});
  const [values, setValues] = useState<LeadValues>(initial);
  const [place, setPlace] = useState<string | undefined>(diem);
  const heading = useRef<HTMLHeadingElement>(null);

  // Same instance, new query (the route stays mounted): apply the new preset.
  const key = `${topic ?? ""}|${diem ?? ""}`;
  const [seen, setSeen] = useState(key);
  if (seen !== key) {
    setSeen(key);
    if (topic) setValues((v) => ({ ...v, chuDe: topic }));
    setPlace(diem);
  }

  const lf = useLeadForm({
    type: "lien-he",
    idPrefix: "lh",
    values,
    setValues: (update) => setValues((v) => update(v)),
    context: { diem: place },
  });

  const head = formHeads["lien-he"];
  const count = messageLength(values.loiNhan);

  if (lf.status === "success" && lf.result) {
    return (
      <div aria-live="polite">
        <SuccessPanel title={formsUi.success.contactTitle} code={lf.result.code} phone={lf.result.phone}>
          <Link href="/ban-do" className={btnArrow("primary", "w-full sm:w-auto")}>
            {formsUi.success.openMap}
            <BtnArrow />
          </Link>
        </SuccessPanel>
        <p className="text-center">
          <button
            type="button"
            className={btn("text", "md")}
            onClick={() => {
              lf.reset();
              setPlace(undefined);
              requestAnimationFrame(() => heading.current?.focus());
            }}
          >
            {formsUi.success.another}
          </button>
        </p>
      </div>
    );
  }

  const placeName = place ? places[place] : undefined;

  return (
    <form noValidate onSubmit={lf.submit} aria-labelledby={TITLE_ID} aria-busy={lf.busy || undefined}>
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2 id={TITLE_ID} ref={heading} tabIndex={-1} className="t-h3 outline-none!">
          {head.title}
        </h2>
        <p className="shrink-0 text-[13px] leading-[18px] text-ink-muted">{formsUi.legend}</p>
      </div>
      <Banner bannerRef={lf.bannerRef}>{lf.banner}</Banner>
      <Honeypot value={lf.honey} onChange={lf.setHoney} />

      <div className="space-y-5">
        <TextField {...lf.text("hoTen")} autoComplete="name" />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField {...lf.text("soDienThoai")} type="tel" inputMode="tel" autoComplete="tel" />
          <TextField {...lf.text("email")} type="email" inputMode="email" autoComplete="email" />
        </div>
        <SelectField {...lf.select("chuDe")} options={contactTopicOptions} />

        {placeName && (
          <div role="group" aria-labelledby="lh-diem-label">
            <Label as="span">
              <span id="lh-diem-label">{fieldLabels.diem}</span>
            </Label>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex min-h-10 max-w-full items-center gap-2 rounded-full bg-indigo-50 py-2 pl-3 pr-4 text-[14px] font-medium leading-5 text-indigo-700">
                <MapPin size={16} aria-hidden="true" className="shrink-0" />
                <span className="min-w-0">{placeName}</span>
              </span>
              <button
                type="button"
                aria-label={contactPage.removePlaceLabel(placeName)}
                disabled={lf.busy}
                onClick={() => {
                  setPlace(undefined);
                  requestAnimationFrame(() => document.getElementById(lf.id("loiNhan"))?.focus());
                }}
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line px-3 text-[14px] font-semibold text-ink transition-colors duration-160 hover:border-ink-muted/75 hover:bg-paper"
              >
                <X size={16} aria-hidden="true" />
                {contactPage.removePlace}
              </button>
            </div>
          </div>
        )}

        <TextAreaField
          {...lf.text("loiNhan")}
          counter={formsUi.counter(formatNumber(count), formatNumber(MESSAGE_MAX))}
          over={count > MESSAGE_MAX}
        />
        <div className="pt-1">
          <Consent {...lf.consent()} />
        </div>
      </div>

      <SubmitButton busy={lf.busy} className="mt-8">
        {head.submit}
      </SubmitButton>
    </form>
  );
}
