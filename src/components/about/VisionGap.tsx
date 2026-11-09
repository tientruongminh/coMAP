import { Draw, Seq, Step } from "./motion";
import { SchoolPin, SitePin } from "./Pins";

/**
 * A2 visual: "thu hẹp khoảng cách". Schools (lime) on the left, workplaces
 * (indigo) on the right, an empty gap between; routes draw across it one by one.
 * Geometry lives in a 1000 x 300 box; pins sit at the same percentages.
 */
const schoolsAt = [
  [90, 70],
  [200, 140],
  [80, 215],
  [190, 255],
] as const;
const sitesAt = [
  [810, 60],
  [915, 120],
  [800, 170],
  [920, 220],
  [815, 260],
] as const;
const links: [number, number][] = [
  [0, 0],
  [1, 2],
  [2, 1],
  [3, 4],
  [1, 3],
  [0, 2],
];

const curve = ([x1, y1]: readonly [number, number], [x2, y2]: readonly [number, number]) =>
  `M ${x1} ${y1} C ${x1 + 260} ${y1} ${x2 - 260} ${y2} ${x2} ${y2}`;

const pct = ([x, y]: readonly [number, number]) => ({ left: `${x / 10}%`, top: `${(y / 300) * 100}%` });

export function VisionGap({ left, right, label }: { left: string; right: string; label: string }) {
  return (
    <Seq role="img" label={label} amount={0.5}>
      <div className="relative aspect-[1000/300]">
        <svg viewBox="0 0 1000 300" className="absolute inset-0 size-full" aria-hidden="true">
          {links.map(([a, b], i) => (
            <Draw
              key={i}
              d={curve(schoolsAt[a], sitesAt[b])}
              stroke="#3330A8"
              at={0.5 + i * 0.22}
              dur={1}
              className="[stroke-width:5] md:[stroke-width:3] lg:[stroke-width:2]"
            />
          ))}
        </svg>
        {schoolsAt.map((p, i) => (
          <Step key={`s${i}`} at={i * 0.06} className="absolute -translate-x-1/2 -translate-y-1/2" style={pct(p)}>
            <SchoolPin size={32} className="max-md:!size-5 max-md:!rounded-[6px] [&_svg]:max-md:hidden" />
          </Step>
        ))}
        {sitesAt.map((p, i) => (
          <Step key={`t${i}`} at={0.2 + i * 0.06} className="absolute -translate-x-1/2 -translate-y-1/2" style={pct(p)}>
            <SitePin size={32} className="max-md:!size-5 [&_svg]:max-md:hidden" />
          </Step>
        ))}
      </div>
      <div className="mt-4 flex justify-between gap-4 text-[13px] font-semibold leading-[18px] lg:text-[15px] lg:leading-[22px]">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="size-2.5 rounded-[3px] bg-lime-400" />
          {left}
        </span>
        <span className="flex items-center gap-2">
          {right}
          <span aria-hidden="true" className="size-2.5 rounded-full bg-indigo-600" />
        </span>
      </div>
    </Seq>
  );
}
