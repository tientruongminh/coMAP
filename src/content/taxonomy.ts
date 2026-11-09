/**
 * Slug maps between data values and URL/filter keys (spec 4.7, Appendix B).
 * Data keeps the Vietnamese labels; URLs use these slugs.
 */
import type { LocationType, Ownership, RoleKey, Size, Source, Stipend, WorkType } from "@/lib/locations";
import { slugify } from "@/lib/format";

export const typeLabel: Record<LocationType, string> = {
  school: "Trường đào tạo",
  internship: "Cơ sở thực tập",
};
export const typeSlug: Record<LocationType, string> = { school: "truong", internship: "co-so" };

export const ownershipLabel: Record<Ownership, string> = {
  public: "Công lập",
  private: "Ngoài công lập",
};
export const ownershipSlug: Record<Ownership, string> = { public: "cong-lap", private: "ngoai-cong-lap" };

export const fieldSlug: Record<string, string> = {
  "Giáo dục học": "giao-duc-hoc",
  "Quản lý giáo dục": "quan-ly-giao-duc",
  "Công nghệ giáo dục": "cong-nghe-giao-duc",
  "Sư phạm": "su-pham",
  "Tâm lý học giáo dục": "tam-ly-hoc-giao-duc",
  "Giáo dục đặc biệt": "giao-duc-dac-biet",
};

export const roleLabel: Record<RoleKey, string> = {
  "giao-vien-ky-nang-song": "Giáo viên dạy Kỹ năng sống",
  "giao-vien": "Giáo viên",
  "giao-vien-steam": "Giáo viên dạy STEAM/STEM",
  "giao-vu": "Giáo vụ",
  "tro-giang": "Trợ giảng",
  "chuyen-vien-dao-tao": "Chuyên viên đào tạo",
  "tu-van-tam-ly": "Tư vấn tâm lý",
  "hanh-chinh": "Hành chính",
  marketing: "Marketing",
  "nhan-su": "Nhân sự",
  "tu-van-tuyen-sinh": "Tư vấn tuyển sinh",
};
export const roleKeys = Object.keys(roleLabel) as RoleKey[];

export const workTypeSlug: Record<WorkType, string> = {
  "Toàn thời gian": "toan-thoi-gian",
  "Bán thời gian": "ban-thoi-gian",
  "Linh hoạt": "linh-hoat",
};

export const stipendSlug: Record<Stipend, string> = {
  "Có phụ cấp": "co-phu-cap",
  "Thỏa thuận": "thoa-thuan",
};

export const sizeSlug: Record<Size, string> = { small: "nho", medium: "vua", large: "lon" };

export const sourceLabel: Record<Source, string> = {
  verified: "Đã xác minh",
  public: "Thông tin công khai",
  demo: "Minh họa",
};

/** "Quận 1" to "quan-1", "TP. Thủ Đức" to "tp-thu-duc". */
export const areaSlug = (area: string) => slugify(area);

/** Two-letter monogram for school tiles (spec Appendix B). */
export const schoolMono: Record<string, string> = {
  "ussh-giaoduc": "NV",
  hcmue: "SP",
  sgu: "SG",
  hcmute: "KT",
  upes: "TT",
  nce: "CĐ",
  vlu: "VL",
  hutech: "HU",
  nttu: "NT",
  hiu: "HB",
};

export const documentKindLabel = {
  program: "Chương trình đào tạo",
  syllabus: "Đề cương thực tập",
  plan: "Kế hoạch thực tập",
  jd: "Mô tả công việc",
} as const;
