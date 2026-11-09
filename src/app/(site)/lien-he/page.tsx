import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import {
  ArrowRight,
  ChatCircleText,
  Clock,
  EnvelopeSimple,
  MapPin,
  PaperPlaneTilt,
  Phone,
  PhoneCall,
  Plus,
} from "@phosphor-icons/react/ssr";
import { ConsultTrigger } from "@/components/consult/ConsultProvider";
import { ContactForm, ContactFormFromUrl } from "@/components/forms/ContactForm";
import { contactPage } from "@/content/forms";
import { faq } from "@/content/faq";
import { site } from "@/content/site";
import { locations } from "@/lib/locations";

export const metadata: Metadata = pageMetadata({ title: contactPage.metaTitle, description: contactPage.metaDescription });

/** Only the id to name map reaches the client, for the `?diem=` chip. */
const places: Record<string, string> = Object.fromEntries(locations.map((l) => [l.id, l.name]));

/** Route stops, like the numbered stops on the map covers: white stops, an indigo destination. */
const STEP_ICON = { send: PaperPlaneTilt, read: Clock, call: PhoneCall } as const;
const pill =
  "inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-surface px-4 text-[14px] font-semibold leading-5 text-ink";

export default function ContactPage() {
  const { info } = contactPage;
  const rows = [
    site.contact.email && {
      icon: <EnvelopeSimple size={18} />,
      label: info.email,
      value: (
        <a href={`mailto:${site.contact.email}`} className="underline-offset-4 decoration-[1.5px] hover:underline">
          {site.contact.email}
        </a>
      ),
    },
    site.contact.phone && {
      icon: <Phone size={18} />,
      label: info.phone,
      value: (
        <a href={`tel:${site.contact.phone.replace(/[^\d+]/g, "")}`} className="tabular underline-offset-4 decoration-[1.5px] hover:underline">
          {site.contact.phone}
        </a>
      ),
    },
    { icon: <MapPin size={18} weight="fill" />, label: info.area, value: info.areaValue },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: React.ReactNode }[];

  return (
    <>
      <section className="container-cm pb-16 pt-10 lg:pb-24 lg:pt-16">
        {/* Form first on mobile (spec 3.6); on desktop the info sits in cols 1-5 beside the form card. */}
        <div className="grid gap-10 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-6">
          <h1 className="t-h1 lg:col-span-5">{contactPage.title}</h1>

          <div className="lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1">
            <div className="rounded-[20px] border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(27,26,75,0.06),0_2px_8px_rgba(27,26,75,0.06)] sm:p-8">
              <Suspense fallback={<ContactForm places={places} />}>
                <ContactFormFromUrl places={places} />
              </Suspense>
            </div>
          </div>

          <div className="lg:col-span-5 lg:row-start-2">
            <p className="sr-only">{contactPage.commitment}</p>
            <ol className="relative grid max-w-[440px] grid-cols-3 gap-2">
              <span
                aria-hidden="true"
                className="absolute left-[22px] right-[calc((100%-1rem)/3-22px)] top-[21px] border-t-2 border-dashed border-ink-muted/45"
              />
              {contactPage.steps.map((s, i) => {
                const Icon = STEP_ICON[s.key];
                const last = i === contactPage.steps.length - 1;
                return (
                  <li key={s.key} className="relative">
                    <span
                      aria-hidden={s.stop ? undefined : true}
                      className={`tabular grid size-11 place-items-center rounded-full text-[15px] font-bold leading-none ${
                        last ? "bg-indigo-600 text-white" : "border-2 border-ink bg-surface text-ink"
                      }`}
                    >
                      {s.stop ?? <Icon size={20} weight={last ? "fill" : "bold"} />}
                    </span>
                    <span className="mt-3 block text-[14px] font-semibold leading-5 text-ink">{s.label}</span>
                  </li>
                );
              })}
            </ol>

            <dl className="mt-10 flex flex-wrap gap-2">
              {rows.map((r) => (
                <div key={r.label} className={pill}>
                  <dt className="sr-only">{r.label}</dt>
                  <dd className="flex items-center gap-2">
                    <span aria-hidden="true" className="text-indigo-700">
                      {r.icon}
                    </span>
                    {r.value}
                  </dd>
                </div>
              ))}
              <div>
                <dt className="sr-only">{info.consult}</dt>
                <dd>
                  <ConsultTrigger
                    form="chon"
                    className={`group/link ${pill} border-indigo-600 text-indigo-700 transition-colors duration-160 hover:bg-indigo-50`}
                  >
                    <ChatCircleText size={18} aria-hidden="true" />
                    {info.consultLink}
                    <ArrowRight
                      size={16}
                      aria-hidden="true"
                      className="transition-transform duration-160 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/link:translate-x-[3px]"
                    />
                  </ConsultTrigger>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section
        id="cau-hoi"
        aria-labelledby="cau-hoi-title"
        className="container-cm scroll-mt-[calc(var(--header-h,64px)+24px)] pb-16 lg:pb-24"
      >
        <div className="grid gap-8 border-t border-line pt-10 lg:grid-cols-12 lg:gap-6 lg:pt-12">
          <h2 id="cau-hoi-title" className="t-h2 lg:col-span-4">
            {contactPage.faqTitle}
          </h2>
          <div className="border-b border-line lg:col-span-7 lg:col-start-6">
            {faq.map((item) => (
              <details key={item.q} className="group border-t border-line">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 text-[17px] font-semibold leading-[26px] text-ink [&::-webkit-details-marker]:hidden">
                  <span>{item.q}</span>
                  <span
                    aria-hidden="true"
                    className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-ink transition-transform duration-240 ease-[cubic-bezier(0.22,1,0.36,1)] group-open:rotate-45"
                  >
                    <Plus size={20} />
                  </span>
                </summary>
                <p className="t-body max-w-[62ch] pb-6 pr-4 text-ink-muted sm:pr-16">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
