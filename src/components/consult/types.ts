import type { Dispatch, SetStateAction } from "react";
import type { LeadValues } from "@/lib/lead-schema";
import type { ConsultContext, ConsultKind, FormParam } from "./ConsultProvider";

/** Unsent values per form, kept in memory while the dialog is closed (spec 5.5). */
export type Drafts = Partial<Record<ConsultKind, LeadValues>>;

export interface ConsultBodyProps {
  form: FormParam;
  context: ConsultContext;
  drafts: Drafts;
  setDrafts: Dispatch<SetStateAction<Drafts>>;
  /** Last role chosen in the picker, checked when the visitor goes back. */
  lastKind: ConsultKind | null;
  setLastKind: (k: ConsultKind) => void;
  onClose: () => void;
}
