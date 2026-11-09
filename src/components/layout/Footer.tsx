import Link from "next/link";
import { EnvelopeSimple, Phone } from "@phosphor-icons/react/ssr";
import { Logo } from "@/components/ui/Logo";
import { footer, site } from "@/content/site";

/** Footer (spec 2.3): indigo-700, logo and one line, one row of links, honest data disclosure. */
export function Footer() {
  const { email, phone } = site.contact;
  return (
    <footer className="on-dark bg-indigo-700 text-white">
      <div className="container-cm flex flex-col gap-8 py-12 lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:py-16">
        <div>
          <Logo reversed />
          <p className="mt-4 max-w-[52ch] text-[15px] leading-6 text-white/85">{footer.tagline}</p>
          {(email || phone) && (
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-[15px] leading-6">
              {email && (
                <li>
                  <a href={`mailto:${email}`} className="inline-flex items-center gap-2 py-1 hover:underline">
                    <EnvelopeSimple size={18} aria-hidden="true" />
                    {email}
                  </a>
                </li>
              )}
              {phone && (
                <li>
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 py-1 hover:underline">
                    <Phone size={18} aria-hidden="true" />
                    {phone}
                  </a>
                </li>
              )}
            </ul>
          )}
        </div>
        <nav aria-label={footer.navLabel}>
          <ul className="flex flex-wrap gap-x-6 gap-y-1 lg:justify-end">
            {footer.links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-block py-1.5 text-[15px] font-semibold leading-6 text-white underline-offset-4 decoration-lime-400 decoration-2 hover:underline"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/15">
        <div className="container-cm flex flex-col gap-1 py-5 text-[13px] leading-5 text-white/72 md:flex-row md:justify-between md:gap-6">
          <p>
            {footer.copyright}
            {" · "}
            {footer.demoNote}
          </p>
          <p>{footer.mapCredit}</p>
        </div>
      </div>
    </footer>
  );
}
