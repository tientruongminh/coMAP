import { ArrowRight } from "@phosphor-icons/react/ssr";

/** The 32px nested arrow circle used by primary CTAs (spec 6.3). */
export function BtnArrow({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <span
      aria-hidden="true"
      className={`ml-1 grid size-8 place-items-center rounded-full transition-transform duration-160 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:translate-x-[3px] ${
        tone === "light" ? "bg-white/15" : "bg-ink/10"
      }`}
    >
      <ArrowRight size={16} weight="bold" />
    </span>
  );
}
