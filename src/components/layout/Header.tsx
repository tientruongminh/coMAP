"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { btn } from "@/components/ui/button";
import { ConsultTrigger } from "@/components/consult/ConsultProvider";
import { header, nav, site } from "@/content/site";

const EASE = [0.22, 1, 0.36, 1] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Site header (spec 2.2). Transparent on paper at the top; once the sentinel
 * 8px below the top leaves view it turns solid paper with a hairline.
 * IntersectionObserver only, never a scroll listener.
 */
export function Header() {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const s = document.getElementById("top-sentinel");
    if (!s) return;
    const io = new IntersectionObserver(([e]) => setSolid(!e.isIntersecting));
    io.observe(s);
    return () => io.disconnect();
  }, []);

  // close the mobile menu on navigation (and when Activity hides the route)
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset transient UI on route change
    setMenu(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 h-[var(--header-h)] transition-[background-color,border-color] duration-240 ${
        solid || menu ? "border-b border-line bg-paper" : "border-b border-transparent bg-paper/0"
      }`}
    >
      <a href="#noi-dung" className="sr-only-focusable absolute left-4 top-3 z-[60] rounded-full bg-ink px-4 py-2 text-[14px] text-white">
        {header.skipToContent}
      </a>
      <div className="container-cm flex h-full items-center justify-between gap-6">
        <Logo />
        <nav aria-label={header.mainNavLabel} className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {nav.map((l) => {
              const active = isActive(pathname, l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative inline-block whitespace-nowrap py-2 text-[15px] font-medium leading-5 text-ink after:absolute after:inset-x-0 after:-bottom-[2px] after:h-[3px] after:rounded-full after:bg-lime-400 after:transition-opacity after:duration-160 ${
                      active ? "after:opacity-100" : "after:opacity-0 hover:after:opacity-50"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <ConsultTrigger form="chon" className={btn("primary", "sm", "max-sm:hidden lg:h-11 lg:px-5")}>
            {header.cta}
          </ConsultTrigger>
          <button
            type="button"
            className="relative grid size-11 place-items-center rounded-full text-ink hover:bg-ink/5 lg:hidden"
            aria-label={menu ? header.closeMenu : header.openMenu}
            aria-expanded={menu}
            aria-controls="mobile-menu"
            onClick={() => setMenu((v) => !v)}
          >
            <span aria-hidden="true" className="relative block h-3.5 w-5">
              <span
                className={`absolute left-0 h-[2px] w-5 rounded-full bg-ink transition-transform duration-240 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  menu ? "top-[6px] rotate-45" : "top-[1px]"
                }`}
              />
              <span
                className={`absolute left-0 h-[2px] w-5 rounded-full bg-ink transition-transform duration-240 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  menu ? "top-[6px] -rotate-45" : "top-[11px]"
                }`}
              />
            </span>
          </button>
        </div>
      </div>
      <MobileMenu open={menu} onClose={() => setMenu(false)} pathname={pathname} />
    </header>
  );
}

function MobileMenu({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  const reduce = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    const first = panel.current?.querySelector<HTMLElement>("a,button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      // trap focus inside the sheet, including the menu toggle above it
      const toggle = document.querySelector<HTMLElement>('[aria-controls="mobile-menu"]');
      const items = [toggle, ...panel.current.querySelectorAll<HTMLElement>("a,button")].filter(Boolean) as HTMLElement[];
      const i = items.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && i <= 0) {
        e.preventDefault();
        items[items.length - 1].focus();
      } else if (!e.shiftKey && i === items.length - 1) {
        e.preventDefault();
        items[0].focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label={header.mainNavLabel}
          className="fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 flex flex-col overflow-y-auto bg-paper lg:hidden"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: EASE }}
        >
          <nav className="container-cm flex-1 pt-6">
            <ul className="flex flex-col">
              {nav.map((l, i) => {
                const active = isActive(pathname, l.href);
                return (
                  <motion.li
                    key={l.href}
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.42, ease: EASE, delay: reduce ? 0 : 0.04 * i }}
                    className="border-b border-line"
                  >
                    <Link
                      href={l.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className="t-h1 block py-4 !text-[32px] !leading-[40px]"
                    >
                      {active ? <mark className="hl">{l.label}</mark> : l.label}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </nav>
          <div className="container-cm sticky bottom-0 border-t border-line bg-paper pb-[max(24px,env(safe-area-inset-bottom))] pt-4">
            <ConsultTrigger form="chon" onClick={onClose} className={btn("primary", "md", "w-full")}>
              {header.cta}
            </ConsultTrigger>
            <p className="mt-3 text-center text-[14px] leading-5 text-ink-muted">
              {[site.contact.phone, site.contact.email].filter(Boolean).join(" · ") || site.responseLine}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
