/**
 * Team (spec 3.2 A7). Only real people, added by the founders.
 * Never invent members, never add student ID numbers or AI faces.
 */
export interface TeamMember {
  name: string;
  role: string;
  line: string;
  /** path under /public, optional */
  photo?: string;
}

export const team: TeamMember[] = [
  {
    name: "Phạm Thị Hà Chi",
    role: "Trưởng nhóm",
    line: "Sinh viên ngành Giáo dục học, Trường ĐH KHXH&NV, ĐHQG-HCM",
  },
];

/** Initials for the photo fallback: the last two words, as Vietnamese names are used ("Hà Chi" to "HC"). */
export function initials(name: string) {
  const w = name.trim().split(/\s+/);
  return w
    .slice(-2)
    .map((x) => x[0]?.toUpperCase() ?? "")
    .join("");
}
