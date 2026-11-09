/**
 * Button class recipes (spec 6.3). Interactive controls are full pill.
 * Apply to <button>, <a> or <Link> alike.
 */
type Variant = "primary" | "secondary" | "text" | "lime" | "inverse";
type Size = "md" | "sm";

const base =
  "group/btn inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-sans font-semibold " +
  "transition-[transform,background-color,color,border-color,opacity] duration-160 ease-[cubic-bezier(0.22,1,0.36,1)] " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 select-none";

const variants: Record<Variant, string> = {
  primary: "bg-indigo-700 text-white hover:bg-indigo-600",
  secondary: "border-[1.5px] border-ink text-ink hover:bg-ink hover:text-white",
  text: "text-ink underline-offset-4 decoration-[1.5px] hover:underline !px-0",
  lime: "bg-lime-400 text-ink hover:bg-[#b5da4e]",
  inverse: "border-[1.5px] border-white/80 text-white hover:bg-white hover:text-indigo-700",
};

const sizes: Record<Size, string> = {
  md: "h-12 px-6 text-[15px]",
  sm: "h-10 px-4 text-[14px]",
};

export function btn(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `${base} ${sizes[size]} ${variants[variant]} ${extra}`;
}

/** Primary CTA with the arrow nested in a 32px circle; pair with <BtnArrow/>. */
export function btnArrow(variant: Variant = "primary", extra = "") {
  return `${base} h-12 pl-6 pr-2 text-[15px] ${variants[variant]} ${extra}`;
}
