/** Audience chip (spec 3.4): indigo-50 pill, 13px semibold, same as the Home bento. */
export function AudienceChip({ children }: { children: string }) {
  return (
    <span className="inline-flex h-7 w-fit items-center rounded-full bg-indigo-50 px-3 text-[13px] font-semibold leading-none text-indigo-700">
      {children}
    </span>
  );
}
