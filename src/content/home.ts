/**
 * Home page copy (spec 3.1, S1 to S8; founder directive, spec 0).
 * One idea per screen: short visible labels, the long sentences live in
 * `detail` / `sr` fields that are only shown on hover, focus or tap, or read
 * by screen readers. Numbers are never written here: they are computed from
 * data/locations.json at render time.
 */

const NBSP = " ";
/** "Co-Map" with a word joiner after the hyphen so the name never breaks across lines. */
const BRAND = "Co-⁠Map";

export const hero = {
  titleLine1: "Bản đồ thực tập",
  /** The period sits inside the highlighted line so it never wraps alone. */
  titleLine2: "ngành Giáo dục.",
  sub: "Đúng chuẩn đầu ra, đúng khoảng cách.",
  /** Read by screen readers after the sub: the sentence the map plate shows. */
  subSr: `${BRAND} đặt nhà trường, cơ sở thực tập và sinh viên TP.HCM lên cùng một bản đồ, rồi ghép nối theo chuẩn đầu ra và khoảng cách thực tế.`,
  primary: { label: "Mở bản đồ", href: "/ban-do" },
  secondary: { label: "Đăng ký tư vấn" },
  plateLabel: `Bản đồ ${BRAND} thu nhỏ`,
};

/** Overlay strings of the live hero map (src/components/map/HeroMap.tsx). */
export const heroMap = {
  rolesLabel: "Xem bản đồ theo vai trò",
  roles: { student: "Sinh viên", school: "Nhà trường", business: "Doanh nghiệp" },
  legendSchool: "Trường",
  legendSite: "Cơ sở",
  legendSchoolSr: " đào tạo",
  legendSiteSr: " thực tập",
  /** Student view: big number + this label, then " quanh <anchor>" for screen readers. */
  inRing: `cơ sở trong 5${NBSP}km`,
  aroundSr: (label: string) => ` quanh ${label}`,
  yourPosition: "vị trí của bạn",
  /** School and business views: big number + label + a sample of the map line. */
  partners: "đối tác",
  solidSr: ", nối bằng nét liền",
  sameField: "cùng ngành",
  dashedSr: ", nối bằng nét đứt",
  rulerSr: "Gần nhất:",
  seeOnMap: "Xem trên bản đồ",
  nearMe: "Dùng vị trí của tôi",
  locating: "Đang tìm vị trí",
};

export const dataStrip = {
  title: `${BRAND} hôm nay, tính từ dữ liệu bản đồ`,
  items: [
    { key: "schools", label: "Trường", sr: "trường đào tạo" },
    { key: "sites", label: "Cơ sở", sr: "cơ sở thực tập" },
    { key: "slots", label: "Chỗ trống", sr: "chỗ thực tập đang mở" },
    { key: "areas", label: "Khu vực", sr: "khu vực có dữ liệu" },
  ] as const,
  demo: "Cơ sở minh họa, trừ Trung tâm HiPO.",
  demoSr: "Dữ liệu các cơ sở thực tập là minh họa, trừ Trung tâm HiPO đã xác minh.",
  updatedSr: "Cập nhật",
};

export const howItWorks = {
  titleBefore: "Ba tấm bản đồ, ",
  /** The period sits inside the highlight so it is not a stray word on its own. */
  titleMark: "gộp làm một.",
  /** The problem the headline answers, for screen readers. */
  titleSr: `Sinh viên hỏi chỗ thực tập qua hội nhóm và người quen. Nhà trường giữ danh sách đối tác trong những tệp riêng lẻ. Cơ sở giáo dục cần người nhưng không biết chương trình nào đào tạo đúng việc mình cần. ${BRAND} gộp ba tấm bản đồ đó làm một.`,
  stageLabel: "Minh họa ba bước trên bản đồ",
  filterChip: "Giáo dục học",
  /** Read with the seal on the route's end; the seal itself is an icon. */
  verifiedSr: "Trung tâm HiPO, cơ sở đã xác minh",
  /**
   * Each stop is one verb that names what the map does at that moment (pins
   * drop, the chip filters, the route draws); the step's full name is read by
   * screen readers and its sentence shows on hover, focus or tap.
   */
  stops: [
    {
      verb: "Ghim",
      title: "Số hóa dữ liệu",
      detail: "Chương trình, đề cương và mô tả công việc được ghim lên bản đồ.",
    },
    {
      verb: "Lọc",
      title: "Lọc chuẩn đầu ra",
      detail: "Lọc theo chuyên ngành, vị trí, khu vực, kèm khoảng cách thực tế.",
    },
    {
      verb: "Nối",
      title: "Thiết kế phối hợp",
      detail: "Ký kết, kiến tập, thực tập và đánh giá theo từng học kỳ.",
    },
  ],
};

export type OutcomeId = 1 | 2 | 3 | 4 | 5;
export type TaskId = "a" | "b" | "c" | "d" | "e";

export const matching = {
  chip: "Minh họa",
  titleBefore: "Chuẩn đầu ra ",
  titleMark: "gặp",
  titleAfter: " mô tả công việc",
  titleSr: `Mỗi học phần thực tập có chuẩn đầu ra riêng. ${BRAND} đặt đề cương của nhà trường cạnh mô tả công việc của cơ sở, rồi chỉ ra nhiệm vụ nào giúp sinh viên đạt chuẩn đầu ra nào.`,
  smallPrint: "Nội dung rút gọn để minh họa cách đối chiếu, không trích nguyên văn đề cương.",
  /** Column heads: the visible short name, preceded by `titleSr` for screen readers. */
  left: {
    short: "ĐH KHXH&NV",
    titleSr: "Đề cương Thực tập 2, ngành Giáo dục học, Trường",
    itemPrefix: "CĐR",
  },
  right: {
    short: "HiPO",
    titleSr: "Mô tả công việc Giáo viên dạy Kỹ năng sống, Trung tâm",
    href: "/ban-do?chon=hipo",
    linkSr: "Xem Trung tâm HiPO trên bản đồ",
  },
  outcomes: [
    { id: 1, label: "Tâm lý", text: "Vận dụng tâm lý học lứa tuổi khi tổ chức hoạt động cho học sinh." },
    { id: 2, label: "Soạn bài", text: "Thiết kế kế hoạch bài dạy và hoạt động trải nghiệm." },
    { id: 3, label: "Đánh giá", text: "Quan sát, ghi chép và đánh giá tiến bộ của người học." },
    { id: 4, label: "Phối hợp", text: "Phối hợp với phụ huynh và đồng nghiệp trong công tác giáo dục." },
    { id: 5, label: "Đạo đức", text: "Tuân thủ đạo đức nghề nghiệp và quy định của cơ sở." },
  ] as { id: OutcomeId; label: string; text: string }[],
  tasks: [
    { id: "a", label: "Đứng lớp", text: "Soạn giáo án và đứng lớp Kỹ năng sống cho học sinh tiểu học." },
    { id: "b", label: "Nhận xét", text: "Theo dõi và nhận xét tiến bộ của học viên sau mỗi buổi." },
    { id: "c", label: "Phụ huynh", text: "Trao đổi với phụ huynh về tình hình học tập của trẻ." },
    { id: "d", label: "Ngày hội", text: "Hỗ trợ tổ chức ngày hội trải nghiệm cuối khóa." },
    { id: "e", label: "Nội quy", text: "Thực hiện nội quy an toàn của trung tâm trong mọi buổi học." },
  ] as { id: TaskId; label: string; text: string }[],
  /** Draw order of the connector lines. */
  links: [
    [1, "a"],
    [2, "a"],
    [3, "b"],
    [4, "c"],
    [2, "d"],
    [5, "e"],
  ] as [OutcomeId, TaskId][],
  /** Read after an item's detail: which items on the other side it links to. */
  matchesSr: "Đáp ứng bởi:",
  servesSr: "Phục vụ:",
  /** Visible as a seal: "5/5". */
  coverage: (n: number, total: number) => `${n}/${total}`,
  coverageSr: "Cả 5 chuẩn đầu ra đều có nhiệm vụ tương ứng.",
  outcomesSr: "Chuẩn đầu ra trong đề cương",
  tasksSr: "Nhiệm vụ trong mô tả công việc",
};

export type Audience = "Nhà trường" | "Sinh viên" | "Doanh nghiệp";

export const services = {
  title: "Một bản đồ, ba cách đồng hành",
  titleSr: "Tra cứu bản đồ miễn phí. Khi cần đi sâu hơn, mỗi bên có một gói tư vấn riêng.",
  linkLabel: "Xem chi tiết gói",
  cells: {
    a: {
      audience: "Nhà trường" as Audience,
      title: "Kế hoạch phối hợp",
      full: "Gói thiết kế kế hoạch phối hợp giáo dục",
      sr: "Ký kết đối tác, kiến tập tại cơ sở và đánh giá chương trình trong một kế hoạch cho cả học kỳ.",
      ticks: ["Khảo sát", "Ghép nối", "Ký kết", "Kiến tập", "Đánh giá"],
      ticksSr: "Năm bước của kế hoạch",
      href: "/dich-vu#nha-truong",
    },
    b: {
      audience: "Sinh viên" as Audience,
      title: "Tư vấn 1-1",
      full: "Gói tư vấn chuyên sâu",
      sr: "Một buổi tư vấn 1-1 về học phần thực tập, định hướng lĩnh vực và những nơi phù hợp với năng lực của bạn, trong bán kính 5 km quanh nơi bạn ở.",
      href: "/dich-vu#sinh-vien",
      ring: `5${NBSP}km`,
    },
    c: {
      audience: "Doanh nghiệp" as Audience,
      /** Mini radar: students in the ring are near and in the right field. */
      nearSr: "Sinh viên đúng chuyên ngành, ở gần cơ sở",
      title: "Tìm thực tập sinh",
      full: "Gói tìm kiếm thực tập sinh phù hợp",
      sr: "Mô tả nhu cầu một lần, nhận danh sách sinh viên đúng chuyên ngành và ở gần cơ sở.",
      href: "/dich-vu#doanh-nghiep",
    },
    d: {
      audience: "Doanh nghiệp" as Audience,
      stepsSr: "5 bước thẩm định đã hoàn tất",
      title: "CV bảo chứng",
      full: "Gói mở khóa CV bảo chứng",
      sr: `Xem chi tiết hồ sơ đã qua 5 bước thẩm định của ${BRAND}.`,
      href: "/dich-vu#doanh-nghiep",
    },
  },
  offer: "Giảm 50% tháng đầu",
  offerSr: "Ưu đãi tháng đầu: giảm 50% phí mọi gói dịch vụ.",
};

export const schoolsSection = {
  title: (n: string) => `${n} trường trên bản đồ`,
  note: "Dữ liệu công khai, không phải đối tác.",
  noteSr: `Thông tin công khai về chương trình đào tạo ngành Giáo dục, không phải danh sách đối tác của ${BRAND}.`,
  pinsLabel: "Các trường đào tạo, theo vị trí trên bản đồ",
  fieldCount: (n: number) => `${n}${NBSP}chuyên ngành`,
  openLabel: (name: string) => `Xem ${name} trên bản đồ`,
};

export const newsSection = {
  title: "Bản tin",
  allLink: { label: "Xem tất cả", href: "/ban-tin", sr: " bài viết" },
  dateSr: "Ngày đăng",
};

export const roleBand = {
  titleBefore: "Bắt đầu từ ",
  titleMark: "vai trò của bạn",
  callback: `Gọi lại trong 24${NBSP}giờ`,
  callbackSr: `Để lại thông tin, ${BRAND} gọi lại trong 24${NBSP}giờ làm việc.`,
  rows: [
    { label: "Sinh viên", sr: "Tôi là sinh viên", form: "sinh-vien", icon: "student" },
    { label: "Nhà trường", sr: "Tôi đại diện nhà trường", form: "nha-truong", icon: "school" },
    { label: "Doanh nghiệp", sr: "Tôi đại diện doanh nghiệp", form: "doanh-nghiep", icon: "site" },
  ] as const,
};
