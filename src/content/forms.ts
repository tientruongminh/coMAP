/**
 * Consultation forms copy (spec 5.1 to 5.5, 3.6). Every visible string of the
 * consult dialog and the Liên hệ form lives here; `src/lib/lead-schema.ts`
 * reads the labels and error messages so client and server say the same thing.
 */

const NBSP = "\u00a0";

export type LeadType = "sinh-vien" | "doanh-nghiep" | "nha-truong" | "lien-he";
export type ConsultFormType = Exclude<LeadType, "lien-he">;

export const formsUi = {
  /** Shown under the form title; the `*` itself is aria-hidden on each label. */
  legend: "* Bắt buộc",
  close: "Đóng",
  back: "Chọn lại",
  dialogLabel: "Đăng ký tư vấn",
  submitting: "Đang gửi…",
  responseLine: `Phản hồi trong 24${NBSP}giờ làm việc.`,
  interest: (name: string) => `Quan tâm: ${name}`,
  document: (title: string) => `Tài liệu: ${title}`,
  consent: "Tôi đồng ý để Co-Map liên hệ tư vấn theo thông tin trên.",
  honeypot: "Website",
  selectPlaceholder: "Chọn một mục",
  counter: (n: string, max: string) => `${n}/${max}`,
  banners: {
    rate: "Bạn vừa gửi nhiều yêu cầu liên tiếp. Vui lòng thử lại sau ít phút.",
    network: "Chưa gửi được yêu cầu. Vui lòng kiểm tra kết nối và thử lại.",
  },
  success: {
    stamp: "Đã nhận",
    title: "Đã nhận yêu cầu của bạn",
    contactTitle: "Đã nhận lời nhắn của bạn",
    /** Rendered as `Mã yêu cầu: {code}. Co-Map sẽ gọi lại số {phone} trong vòng 24 giờ làm việc.` */
    body: {
      code: "Mã yêu cầu: ",
      call: ". Co-Map sẽ gọi lại số ",
      tail: ` trong vòng 24${NBSP}giờ làm việc.`,
    },
    codeLabel: "Mã yêu cầu",
    close: "Đóng",
    openMap: "Mở bản đồ",
    another: "Gửi lời nhắn khác",
  },
};

/** Role picker: icon cards; `desc` is read by screen readers only (aria-describedby). */
export const picker = {
  title: "Bạn đăng ký với tư cách nào?",
  options: [
    { kind: "sinh-vien", label: "Sinh viên", desc: "Tư vấn chuyên sâu về học phần và nơi thực tập" },
    { kind: "doanh-nghiep", label: "Doanh nghiệp", desc: "Doanh nghiệp, trung tâm: tìm thực tập sinh và mở khóa CV bảo chứng" },
    { kind: "nha-truong", label: "Nhà trường", desc: "Nhà trường, khoa đào tạo: kế hoạch phối hợp giáo dục" },
  ] as const satisfies readonly { kind: ConsultFormType; label: string; desc: string }[],
};

/** Field labels, keyed by the JSON field names stored in leads.jsonl (spec 5.6). */
export const fieldLabels = {
  hoTen: "Họ và tên",
  truong: "Trường đang theo học",
  tenTruong: "Tên trường",
  chuyenNganh: "Chuyên ngành",
  tenNganh: "Tên ngành",
  soDienThoai: "Số điện thoại",
  tenDoanhNghiep: "Tên doanh nghiệp hoặc tổ chức",
  nguoiLienHe: "Họ và tên người liên hệ",
  goi: "Gói dịch vụ quan tâm",
  tenCoSo: "Tên cơ sở giáo dục",
  chucVu: "Chức vụ, đơn vị công tác",
  noiDung: "Nội dung cần tư vấn",
  email: "Email",
  chuDe: "Chủ đề",
  diem: "Địa điểm liên quan",
  loiNhan: "Nội dung",
  dongY: "Đồng ý liên hệ",
} as const;

export type FieldKey = keyof typeof fieldLabels;

export const fieldHelp: Partial<Record<FieldKey, string>> = {
  chucVu: "Ví dụ: Giảng viên, Khoa Giáo dục.",
  tenCoSo: "Chọn gợi ý hoặc tự nhập.",
};

export const otherOption = {
  truong: { value: "khac", label: "Trường khác" },
  chuyenNganh: { value: "khac", label: "Ngành khác" },
};

export const packageOptions = [
  { value: "tim-thuc-tap-sinh", label: "Tìm thực tập sinh phù hợp" },
  { value: "mo-khoa-cv", label: "Mở khóa CV bảo chứng" },
] as const;

export const schoolTopicOptions = [
  { value: "ky-ket", label: "Lễ ký kết hợp tác với doanh nghiệp" },
  { value: "chuong-trinh", label: "Chương trình tham quan, kiến tập, ngày hội việc làm" },
] as const;

export const contactTopicOptions = [
  { value: "dua-len-ban-do", label: "Đưa đơn vị lên bản đồ" },
  { value: "bao-sai", label: "Báo thông tin chưa đúng" },
  { value: "hop-tac", label: "Hợp tác" },
  { value: "khac", label: "Khác" },
] as const;

/** Validation copy (spec 5.1 to 5.4, word for word). */
export const errorCopy = {
  required: (label: string) => `Vui lòng nhập ${label.toLocaleLowerCase("vi")}.`,
  min: (label: string, n: number) => `${label} cần ít nhất ${n} ký tự.`,
  max: (label: string, n: string) => `${label} tối đa ${n} ký tự.`,
  phoneEmpty: "Vui lòng nhập số điện thoại.",
  phoneInvalid: "Số điện thoại chưa đúng. Ví dụ: 0912 345 678.",
  email: "Email chưa đúng định dạng.",
  consent: "Vui lòng xác nhận để Co-Map có thể liên hệ.",
  select: {
    truong: "Vui lòng chọn trường đang theo học.",
    chuyenNganh: "Vui lòng chọn chuyên ngành.",
    chuDe: "Vui lòng chọn chủ đề.",
  } as Partial<Record<FieldKey, string>>,
  checks: {
    goi: "Vui lòng chọn ít nhất một gói.",
    noiDung: "Vui lòng chọn ít nhất một nội dung.",
  } as Partial<Record<FieldKey, string>>,
  message: {
    required: "Vui lòng nhập nội dung.",
    min: "Nội dung cần ít nhất 10 ký tự.",
    max: "Nội dung tối đa 1.000 ký tự.",
  },
};

/** Per-form header copy (spec 5.2 to 5.4 and the Liên hệ card). No intro: the success panel states the 24h callback. */
export const formHeads: Record<LeadType, { title: string; submit: string }> = {
  "sinh-vien": { title: "Tư vấn cho sinh viên", submit: "Gửi đăng ký" },
  "doanh-nghiep": { title: "Tư vấn cho doanh nghiệp", submit: "Gửi đăng ký" },
  "nha-truong": { title: "Tư vấn cho nhà trường", submit: "Gửi đăng ký" },
  "lien-he": { title: "Gửi lời nhắn", submit: "Gửi lời nhắn" },
};

/** Liên hệ page (spec 3.6). */
export const contactPage = {
  metaTitle: "Liên hệ",
  metaDescription:
    "Liên hệ Co-Map để đưa đơn vị lên bản đồ thực tập ngành Giáo dục TP.HCM, báo thông tin chưa đúng hoặc bàn chuyện hợp tác.",
  title: "Liên hệ với Co-Map",
  /** Read by screen readers ahead of the three-step row, which says the same in icons. */
  commitment: `Cam kết phản hồi 100% yêu cầu trong vòng 24${NBSP}giờ làm việc.`,
  /** Route stops. `stop` puts a number in the stop instead of an icon. */
  steps: [
    { key: "send", stop: null, label: "Bạn gửi" },
    { key: "read", stop: "24", label: "giờ làm việc" },
    { key: "call", stop: null, label: "Co-Map gọi lại" },
  ] as const,
  info: {
    email: "Email",
    phone: "Điện thoại",
    area: "Khu vực hoạt động",
    areaValue: "TP.HCM",
    consult: "Đăng ký tư vấn gói dịch vụ",
    consultLink: "Gói tư vấn",
  },
  removePlace: "Bỏ chọn",
  removePlaceLabel: (name: string) => `Bỏ chọn ${name}`,
  /** Same words as the footer link that points here. */
  faqTitle: "Hỏi đáp",
};
