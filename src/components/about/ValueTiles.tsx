import { Check, Clock } from "@phosphor-icons/react/ssr";
import { formatDate } from "@/lib/format";
import { meta } from "@/lib/locations";
import { about } from "@/content/about";
import { More } from "./More";
import { Draw, Seq, Step } from "./motion";
import { SchoolPin, SitePin, StudentPin } from "./Pins";

const card = "flex flex-col rounded-[20px] border border-line bg-surface p-6 lg:p-8";
const stage = "relative overflow-hidden rounded-[14px] bg-paper";

/** A4 "Phối hợp": school, student and employer; the three edges draw, then a match check lands. */
function FitTile() {
  const v = about.values.fit;
  // 400 x 240 box
  const school = [200, 48] as const;
  const student = [80, 172] as const;
  const employer = [320, 172] as const;
  const at = (p: readonly [number, number]) => ({ left: `${p[0] / 4}%`, top: `${(p[1] / 240) * 100}%` });
  const pin = "absolute -translate-x-1/2 -translate-y-1/2";
  const below = "absolute mt-[26px] -translate-x-1/2 whitespace-nowrap text-[13px] font-semibold leading-[18px]";
  return (
    <div className={card}>
      <Seq role="img" label={v.text} className={`${stage} aspect-[400/240]`} amount={0.5}>
        <svg viewBox="0 0 400 240" className="absolute inset-0 size-full" aria-hidden="true">
          <Draw d={`M ${school[0]} ${school[1]} L ${student[0]} ${student[1]}`} at={0.35} dur={0.6} width={2.5} />
          <Draw d={`M ${school[0]} ${school[1]} L ${employer[0]} ${employer[1]}`} at={0.75} dur={0.6} width={2.5} />
          <Draw d={`M ${student[0]} ${student[1]} L ${employer[0]} ${employer[1]}`} at={1.15} dur={0.6} width={2.5} />
        </svg>
        <Step at={0} className={pin} style={at(school)}>
          <SchoolPin size={36} />
        </Step>
        <Step at={0.1} className={pin} style={at(student)}>
          <StudentPin size={36} />
        </Step>
        <Step at={0.2} className={pin} style={at(employer)}>
          <SitePin size={36} />
        </Step>
        <span className="absolute ml-7 -translate-y-1/2 whitespace-nowrap text-[13px] font-semibold leading-[18px]" style={at(school)}>
          {v.nodes.school}
        </span>
        <span className={below} style={at(student)}>
          {v.nodes.student}
        </span>
        <span className={below} style={at(employer)}>
          {v.nodes.employer}
        </span>
        <Step
          kind="stamp"
          at={1.75}
          className="absolute left-1/2 top-[56%] grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-lime-400 text-ink shadow-1"
        >
          <Check size={20} weight="bold" aria-hidden="true" />
        </Step>
      </Seq>
      <h3 className="t-h3 mt-6">{v.title}</h3>
    </div>
  );
}

/** A4 "Chính xác": three records get checked in order, then the ĐÃ XÁC MINH stamp lands. */
function AccuracyTile() {
  const v = about.values.accuracy;
  return (
    <div className={card}>
      <Seq className={`${stage} flex aspect-[400/240] flex-col justify-center px-5 sm:px-8`} amount={0.5}>
        <ul className="divide-y divide-line">
          {v.checks.map((c, i) => (
            <li key={c} className="flex items-center justify-between gap-3 py-2.5 lg:py-3">
              <span className="text-[15px] font-semibold leading-6">{c}</span>
              <span className="relative grid size-7 place-items-center rounded-[8px] border border-line bg-surface">
                <Step at={0.3 + i * 0.4} className="absolute inset-[-1px] grid place-items-center rounded-[8px] bg-lime-400 text-ink">
                  <Check size={16} weight="bold" aria-hidden="true" />
                </Step>
                <span className="sr-only">{v.checkedLabel}</span>
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-[13px] leading-[18px] text-ink-muted">
            <Clock size={14} aria-hidden="true" />
            <span className="tabular">
              <span className="sr-only">{v.updated} </span>
              {formatDate(meta.updated)}
            </span>
          </span>
          <Step kind="stamp" at={1.65}>
            <span className="stamp bg-surface">{v.stamp}</span>
          </Step>
        </div>
      </Seq>
      <h3 className="t-h3 mt-6">{v.title}</h3>
    </div>
  );
}

/** Both tiles share one "Xem chi tiết": the diagrams carry the idea, the sentences wait below. */
export function ValueTiles() {
  const { fit, accuracy, more } = about.values;
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
        <FitTile />
        <AccuracyTile />
      </div>
      <More summary={more} className="mt-6">
        {[fit, accuracy].map((v) => (
          <p key={v.title}>
            <span className="font-semibold">{v.title}: </span>
            {v.text}
          </p>
        ))}
      </More>
    </>
  );
}
