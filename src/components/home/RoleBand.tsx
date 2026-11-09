import { ArrowRight, Clock, Student } from "@phosphor-icons/react/ssr";
import { ConsultTrigger } from "@/components/consult/ConsultProvider";
import { Hl } from "@/components/ui/Highlight";
import { Reveal } from "@/components/ui/Reveal";
import { MiniPin } from "@/components/map/pinGlyphs";
import { roleBand } from "@/content/home";

/**
 * On dark the highlighted words are ink (spec 6.2), so the lime has to sit
 * behind the whole glyph height, not as a low band, or ink lands on indigo.
 * The sweep is kept: 0% to 100% width at full height.
 */
const SOLID_HL =
  "[&_mark.hl]:bg-[length:100%_100%] [&_mark.hl[data-sweep]]:bg-[length:0%_100%] [&_mark.hl[data-sweep][data-on=true]]:bg-[length:100%_100%] [&_mark.hl]:px-[0.1em] [&_mark.hl]:whitespace-nowrap";

/** The map's own marks: you (the ink anchor), the school pin, the site pin. */
function RoleGlyph({ icon }: { icon: (typeof roleBand.rows)[number]["icon"] }) {
  if (icon === "school") return <MiniPin type="school" size={40} />;
  if (icon === "site") return <MiniPin type="internship" size={40} />;
  return (
    <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-white bg-ink text-white">
      <Student size={21} weight="fill" />
    </span>
  );
}

/** S8 (spec 3.1): full-bleed indigo band, one row per role, each opens its form. */
export function RoleBand() {
  return (
    <section aria-labelledby="vai-tro" className="on-dark border-b border-white/15 bg-indigo-700 text-white">
      <div className="container-cm grid gap-8 py-12 lg:grid-cols-12 lg:items-center lg:gap-x-6 lg:py-16">
        <Reveal className="lg:col-span-5">
          <h2 id="vai-tro" className={`t-h2 max-w-[14ch] lg:text-[48px] lg:leading-[56px] ${SOLID_HL}`}>
            {roleBand.titleBefore}
            <Hl>{roleBand.titleMark}</Hl>
          </h2>
          <p className="mt-5 inline-flex items-center gap-2 text-[15px] font-semibold leading-6 text-white/85">
            <Clock size={18} weight="bold" aria-hidden="true" className="text-lime-400" />
            {roleBand.callback}
            <span className="sr-only">. {roleBand.callbackSr}</span>
          </p>
        </Reveal>
        <ul className="border-b border-white/20 lg:col-span-7">
          {roleBand.rows.map((r) => (
            <li key={r.form} className="border-t border-white/20">
              <ConsultTrigger
                form={r.form}
                ariaLabel={r.sr}
                className="group/role flex min-h-[72px] w-full items-center gap-4 py-3 text-left outline-offset-[-3px] lg:min-h-[88px]"
              >
                <RoleGlyph icon={r.icon} />
                <span
                  className="flex-1 font-display text-[22px] leading-[28px] tracking-[-0.02em] sm:text-[28px] sm:leading-[34px]"
                  style={{ fontVariationSettings: '"wdth" 112', fontWeight: 700 }}
                >
                  {r.label}
                </span>
                <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-lime-400 text-ink">
                  <ArrowRight
                    size={20}
                    weight="bold"
                    className="transition-transform duration-160 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/role:translate-x-1"
                  />
                </span>
              </ConsultTrigger>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
