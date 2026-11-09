"use client";

import { LinkSimple } from "@phosphor-icons/react/ssr";
import { btn } from "@/components/ui/button";
import { useToast } from "@/components/ui/Toast";
import { toasts } from "@/content/site";

/** Copies the clean article URL (no query, no hash) and confirms with a toast (spec 3.5). */
export function CopyLinkButton({ label }: { label: string }) {
  const toast = useToast();
  const copy = async () => {
    const url = `${window.location.origin}${window.location.pathname}`;
    try {
      await navigator.clipboard.writeText(url);
      toast(toasts.copied);
    } catch {
      toast(toasts.copyFailed);
    }
  };
  return (
    <button type="button" onClick={copy} className={btn("secondary", "sm")}>
      <LinkSimple size={16} weight="bold" aria-hidden="true" />
      {label}
    </button>
  );
}
