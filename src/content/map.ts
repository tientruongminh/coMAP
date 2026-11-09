/**
 * Copy for the map page and the hero map (spec 3.3, 4.1 to 4.12).
 * Functions build the strings that carry computed numbers.
 */
import { formatNumber } from "@/lib/format";

const NBSP = "\u00a0";

export const mapPage = {
  title: "Bản đồ cộng đồng",
  description:
    "Tra cứu trường đào tạo và cơ sở thực tập ngành Giáo dục tại TP.HCM, lọc theo chuyên ngành, vị trí, khu vực và khoảng cách.",
  sub: (schools: number, sites: number) =>
    `${formatNumber(schools)} trường đào tạo và ${formatNumber(sites)} cơ sở thực tập ngành Giáo dục tại TP.HCM`,
  searchLabel: "Tìm kiếm trên bản đồ",
  searchPlaceholder: "Trường, cơ sở, ngành hoặc địa chỉ",
  clearSearch: "Xóa tìm kiếm",
  quickSchools: (n: number) => `Trường đào tạo (${formatNumber(n)})`,
  quickSites: (n: number) => `Cơ sở thực tập (${formatNumber(n)})`,
  filterButton: (k: number) => (k > 0 ? `Bộ lọc (${k})` : "Bộ lọc"),
  filterButtonLabel: "Mở bộ lọc",
  results: (n: number) => `${formatNumber(n)} kết quả`,
  groupSites: (n: number) => `Cơ sở thực tập (${formatNumber(n)})`,
  groupSchools: (n: number) => `Trường đào tạo (${formatNumber(n)})`,
  legendNote: "Cơ sở thực tập là minh họa, trừ Trung tâm HiPO.",
  clearAll: "Xóa tất cả",
  removeFilter: (label: string) => `Bỏ lọc ${label}`,
  nearChip: (label: string) => `Gần: ${label}`,
  clearAnchor: "Bỏ điểm xuất phát",
  nearMe: "Dùng vị trí của tôi",
  locating: "Đang xác định vị trí…",
  yourPosition: "Vị trí của bạn",
  pickedPoint: "Điểm đã chọn",
  straightLine: "Khoảng cách đường chim bay",
  rowMeta: (ward: string, area: string) => `${ward}, ${area} cũ`,
  sheetLabel: "Danh sách kết quả",
  sheetExpand: "Mở rộng danh sách",
  listLabel: "Kết quả trên bản đồ",
  mapRegionLabel: "Bản đồ tương tác",
};

export const searchGroups = {
  places: "Địa điểm",
  fields: "Chuyên ngành",
  areas: "Khu vực",
  addresses: "Địa chỉ",
  addressFailed: "Chưa tìm được địa chỉ lúc này. Bạn có thể chọn khu vực trong bộ lọc.",
  addressLoading: "Đang tìm địa chỉ…",
};

export const filterCopy = {
  title: "Bộ lọc",
  close: "Đóng bộ lọc",
  clear: "Xóa bộ lọc",
  show: (n: number) => `Xem ${formatNumber(n)} kết quả`,
  siteOnly: "Áp dụng cho cơ sở thực tập",
  areaSearchLabel: "Tìm khu vực",
  areaNoMatch: "Không có khu vực nào khớp.",
  groups: {
    loai: "Loại hình tổ chức",
    "so-huu": "Loại hình sở hữu",
    nganh: "Chuyên ngành",
    "vi-tri": "Vị trí công việc",
    "tinh-chat": "Tính chất công việc",
    "khu-vuc": "Khu vực (địa giới cũ)",
    "phu-cap": "Phụ cấp",
    "quy-mo": "Quy mô",
  },
};

export const detailCopy = {
  back: "Danh sách",
  backLabel: "Quay lại danh sách",
  verifiedStamp: "ĐÃ XÁC MINH",
  /** Type, ownership and size are the pin and chips; contact rows show an icon, these labels stay for screen readers. */
  rows: {
    fields: "Chuyên ngành",
    siteFields: "Chuyên ngành phù hợp",
    area: "Khu vực",
    address: "Địa chỉ",
    phone: "Điện thoại",
    email: "Email",
    website: "Website",
  },
  areaValue: (areaLong: string) => `${areaLong} cũ`,
  positions: (n: number) => `Vị trí thực tập (${formatNumber(n)})`,
  slots: (n: number) => `${formatNumber(n)}${NBSP}chỗ`,
  matchingPosition: "Khớp bộ lọc",
  documents: "Tài liệu",
  docDialogBody: "Bản đầy đủ chỉ dành cho nhà trường và cơ sở đã xác thực.",
  docConsult: "Đăng ký tư vấn",
  docClose: "Đóng",
  partnerSites: (n: number) => `Cơ sở thực tập đối tác (${formatNumber(n)})`,
  partnerSchools: (n: number) => `Trường đối tác (${formatNumber(n)})`,
  includesDemo: "Gồm dữ liệu minh họa",
  maybeFit: "Có thể phù hợp",
  sameField: "Trường cùng chuyên ngành",
  noPartners: "Chưa có đối tác trên bản đồ.",
  consult: "Đăng ký tư vấn",
  directions: "Chỉ đường",
  copyLink: "Chép liên kết",
  report: "Báo sai",
  reportLabel: "Báo sai thông tin này",
  /** Meta line: an Info icon stands for `Nguồn`, a clock for `Cập nhật`; both words stay for screen readers. */
  sourceLabel: "Nguồn: ",
  updatedLabel: "Cập nhật ",
  openWebsite: (domain: string) => `${domain}, mở trong thẻ mới`,
};

export const mapStates = {
  loading: "Đang tải bản đồ…",
  noResultsTitle: "Không có điểm nào khớp với bộ lọc",
  noResultsBody: "Thử bỏ bớt một vài lựa chọn hoặc mở rộng khu vực.",
  removeLast: (label: string) => `Bỏ lọc: ${label}`,
  noSearchTitle: (q: string) => `Không tìm thấy “${q}”`,
  noSearchBody: "Kiểm tra chính tả hoặc thử từ ngắn hơn, ví dụ “Sư phạm”.",
  emptyAreaTitle: "Khu vực này chưa có dữ liệu",
  emptyAreaBody: "Bạn biết một cơ sở giáo dục ở đây? Giới thiệu cho Co-Map để đưa lên bản đồ.",
  emptyAreaCta: "Giới thiệu cơ sở",
  errorTitle: "Không tải được bản đồ",
  errorBody: "Kiểm tra kết nối mạng rồi thử lại. Danh sách bên cạnh vẫn dùng được.",
  retry: "Thử lại",
  noWebglTitle: "Trình duyệt chưa hỗ trợ bản đồ tương tác",
  noWebglBody: "Bạn vẫn có thể xem và lọc danh sách đầy đủ.",
};

export const pinCopy = {
  aria: (name: string, typeLabel: string, ward: string) => `${name}, ${typeLabel}, ${ward}`,
  cluster: (n: number, s: number, k: number) =>
    `${formatNumber(n)} điểm: ${formatNumber(s)} trường, ${formatNumber(k)} cơ sở. Nhấn để phóng to.`,
};

export const heroCopy = {
  legendSchool: "Trường đào tạo",
  legendSite: "Cơ sở thực tập",
  rolesLabel: "Xem bản đồ theo vai trò",
  roles: { student: "Sinh viên", school: "Nhà trường", business: "Doanh nghiệp" },
  studentCaption: (n: number, anchorIsUser: boolean, anchorLabel: string) =>
    `${formatNumber(n)} cơ sở thực tập trong bán kính 5${NBSP}km quanh ${anchorIsUser ? "vị trí của bạn" : anchorLabel}`,
  schoolCaption: (short: string, p: number) => `${short}: ${formatNumber(p)} cơ sở thực tập đối tác`,
  businessCaption: (short: string, p: number, m: number) =>
    p > 0
      ? `${short}: ${formatNumber(p)} trường đối tác, ${formatNumber(m)} trường cùng chuyên ngành`
      : `${short}: ${formatNumber(m)} trường cùng chuyên ngành`,
  seeOnMap: "Xem trên bản đồ",
  seeDetail: "Xem chi tiết",
  closePopover: "Đóng",
  nearestLabel: "Gần nhất",
  fromAnchor: (d: string) => `Cách điểm xuất phát ${d}`,
};

/** MapLibre UI strings (spec 4.1). */
export const mapLocale: Record<string, string> = {
  "NavigationControl.ZoomIn": "Phóng to",
  "NavigationControl.ZoomOut": "Thu nhỏ",
  "NavigationControl.ResetBearing": "Đặt lại hướng bắc",
  "AttributionControl.ToggleAttribution": "Hiện hoặc ẩn nguồn bản đồ",
  "AttributionControl.MapFeedback": "Góp ý về bản đồ",
  "CooperativeGesturesHandler.WindowsHelpText": "Giữ Ctrl và cuộn chuột để phóng to bản đồ",
  "CooperativeGesturesHandler.MacHelpText": "Giữ ⌘ và cuộn chuột để phóng to bản đồ",
  "CooperativeGesturesHandler.MobileHelpText": "Dùng hai ngón tay để di chuyển bản đồ",
  "ScaleControl.Meters": "m",
  "ScaleControl.Kilometers": "km",
  "Map.Title": "Bản đồ",
  "Marker.Title": "Điểm trên bản đồ",
  "Popup.Close": "Đóng",
};
