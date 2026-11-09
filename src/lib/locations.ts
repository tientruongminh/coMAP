import raw from "../../data/locations.json";

export type LocationType = "school" | "internship";
export type Ownership = "public" | "private";
export type Size = "small" | "medium" | "large";
export type Source = "verified" | "public" | "demo";
export type WorkType = "Toàn thời gian" | "Bán thời gian" | "Linh hoạt";
export type Stipend = "Có phụ cấp" | "Thỏa thuận";

export interface DocumentRef {
  kind: "program" | "syllabus" | "plan" | "jd";
  title: string;
}

export type RoleKey =
  | "giao-vien-ky-nang-song"
  | "giao-vien"
  | "giao-vien-steam"
  | "giao-vu"
  | "tro-giang"
  | "chuyen-vien-dao-tao"
  | "tu-van-tam-ly"
  | "hanh-chinh"
  | "marketing"
  | "nhan-su"
  | "tu-van-tuyen-sinh";

export interface Position {
  title: string;
  roles: RoleKey[];
  workType: WorkType;
  stipend: Stipend;
  stipendNote?: string;
  schedule?: string;
  slots?: number;
}

export interface Location {
  id: string;
  type: LocationType;
  name: string;
  short?: string;
  unit?: string;
  ownership: Ownership;
  fields: string[];
  address: string;
  ward: string;
  area: string;
  lat: number;
  lng: number;
  website: string | null;
  phone: string | null;
  email: string | null;
  size: Size;
  source: Source;
  description: string;
  documents: DocumentRef[];
  positions: Position[];
  partners?: string[];
}

export interface LocationsMeta {
  note: string;
  source: Record<Source, string>;
  fields: string[];
  workTypes: WorkType[];
  stipends: Stipend[];
  sizes: Record<Size, string>;
  areas: string[];
  updated: string;
}

const data = raw as unknown as { meta: LocationsMeta; locations: Location[] };

export const meta = data.meta;
export const locations = data.locations;
export const schools = locations.filter((l) => l.type === "school");
export const internshipSites = locations.filter((l) => l.type === "internship");
export const byId = new Map(locations.map((l) => [l.id, l]));

export const stats = {
  schools: schools.length,
  sites: internshipSites.length,
  positions: internshipSites.reduce((n, l) => n + l.positions.length, 0),
  slots: internshipSites.reduce(
    (n, l) => n + l.positions.reduce((m, p) => m + (p.slots ?? 1), 0),
    0,
  ),
  partnerships: internshipSites.reduce((n, l) => n + (l.partners?.length ?? 0), 0),
  areas: new Set(locations.map((l) => l.area)).size,
};

/** `{address}, Phường {ward}, TP.HCM` (spec A.4). Wards starting with "Xã" keep their prefix. */
export function fullAddress(l: Pick<Location, "address" | "ward">) {
  const ward = /^Xã /.test(l.ward) ? l.ward : `Phường ${l.ward}`;
  return `${l.address}, ${ward}, TP.HCM`;
}

const RURAL = new Set(["Bình Chánh", "Cần Giờ", "Củ Chi", "Hóc Môn", "Nhà Bè"]);

/** Old district name with its unit: "Quận Gò Vấp", "Huyện Nhà Bè", "TP. Thủ Đức" (spec A.4). */
export function areaLong(area: string) {
  if (area.startsWith("Quận ") || area.startsWith("TP. ")) return area;
  if (RURAL.has(area)) return `Huyện ${area}`;
  return `Quận ${area}`;
}

export const isSchool = (l: Location) => l.type === "school";
export const isSite = (l: Location) => l.type === "internship";
