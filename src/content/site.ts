/** Site-wide copy: nav, footer, metadata, toasts (spec 1.1, 2.2, 2.3). */

export const site = {
  name: "Co-Map",
  tagline: "Bản đồ thực tập ngành Giáo dục",
  homeTitle: "Co-Map | Bản đồ thực tập ngành Giáo dục TP.HCM",
  titleTemplate: "%s | Co-Map",
  description:
    "Co-Map kết nối nhà trường, cơ sở thực tập và sinh viên ngành Giáo dục tại TP.HCM trên một bản đồ cộng đồng, ghép nối theo chuẩn đầu ra và khoảng cách thực tế.",
  logoLabel: "Co-Map, về trang chủ",
  shareImageAlt:
    "Co-Map: Bản đồ thực tập ngành Giáo dục TP.HCM, với các cơ sở thực tập trong bán kính 5\u00a0km quanh Hồ Con Rùa.",

  /**
   * Real contact values only. Both stay null until the founders provide them
   * (fields 6 and 7 of the application form are empty); null rows are hidden.
   */
  contact: {
    email: null as string | null,
    phone: null as string | null,
  },
  responseLine: "Phản hồi trong 24 giờ làm việc.",
};

export const nav = [
  { href: "/ve-chung-toi", label: "Về chúng tôi" },
  { href: "/ban-do", label: "Bản đồ cộng đồng" },
  { href: "/dich-vu", label: "Dịch vụ" },
  { href: "/ban-tin", label: "Bản tin" },
  { href: "/lien-he", label: "Liên hệ" },
] as const;

export const header = {
  cta: "Đăng ký tư vấn",
  ctaHref: "?form=chon",
  openMenu: "Mở menu",
  closeMenu: "Đóng menu",
  mainNavLabel: "Điều hướng chính",
  skipToContent: "Bỏ qua đến nội dung chính",
};

export const footer = {
  tagline: "Bản đồ thực tập ngành Giáo dục TP.HCM, do sinh viên ĐH KHXH&NV thực hiện.",
  navLabel: "Liên kết chân trang",
  links: [
    { href: "/ban-do", label: "Bản đồ cộng đồng" },
    { href: "/dich-vu", label: "Dịch vụ" },
    { href: "/ban-tin", label: "Bản tin" },
    { href: "/ve-chung-toi", label: "Về chúng tôi" },
    { href: "/lien-he", label: "Liên hệ" },
    { href: "/lien-he#cau-hoi", label: "Hỏi đáp" },
  ],
  copyright: "© 2026 Co-Map",
  /** Honest data disclosure (spec 2.3). */
  demoNote: "Cơ sở thực tập trên bản đồ là minh họa, trừ Trung tâm HiPO.",
  mapCredit: "Bản đồ: © OpenFreeMap, © OpenStreetMap",
};

export const toasts = {
  copied: "Đã sao chép liên kết",
  copyFailed: "Không sao chép được. Hãy sao chép từ thanh địa chỉ.",
  outsideCity: "Bạn đang ở ngoài TP.HCM. Đang hiển thị quanh trung tâm thành phố.",
  geoFailed: "Không lấy được vị trí. Đang hiển thị quanh trung tâm TP.HCM.",
  unknownPoint: "Không tìm thấy điểm này trên bản đồ.",
};

export const imageCaption = "Ảnh minh họa.";

/** Hồ Con Rùa, the default distance anchor (spec 4.6). [lng, lat] */
export const CITY_ANCHOR: [number, number] = [106.6958, 10.7826];
export const CITY_ANCHOR_LABEL = "Hồ Con Rùa";
