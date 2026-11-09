/**
 * Bản tin (spec 3.5): 6 articles, categories and page strings.
 * Founder directive (spec 0): each article is about a one minute read, built
 * from a lead line, three short sections of bullets, one key number and one
 * takeaway. Other code (home S7) only uses the exported helpers below.
 */
export type NewsCategory = "cam-nang" | "nha-truong" | "doanh-nghiep" | "chinh-sach" | "hoat-dong";

export const categoryLabel: Record<NewsCategory, string> = {
  "cam-nang": "Cẩm nang",
  "nha-truong": "Nhà trường",
  "doanh-nghiep": "Doanh nghiệp",
  "chinh-sach": "Chính sách",
  "hoat-dong": "Hoạt động",
};

/** Chip order on /ban-tin. */
export const categoryOrder: NewsCategory[] = ["cam-nang", "nha-truong", "doanh-nghiep", "chinh-sach", "hoat-dong"];

export const isNewsCategory = (v: unknown): v is NewsCategory =>
  typeof v === "string" && (categoryOrder as string[]).includes(v);

/** Map motif drawn as the cover when an article has no photo. */
export type CoverMotif = "pins" | "route" | "wards" | "ring" | "hub";

export interface Article {
  slug: string;
  title: string;
  category: NewsCategory;
  /** ISO date, yyyy-mm-dd */
  date: string;
  /** Meta description and share text only; never shown in listings. */
  excerpt: string;
  /** Only Article 1 has a photo (spec 6.10). The caption lives here, not on the page. */
  image?: { src: string; alt: string; caption?: string };
  cover: CoverMotif;
  /** The one key number of the article, taken from its own facts. */
  stat: { value: string; label: string };
  /**
   * Small markdown. First line is the lead. Then `## ` headings, `- ` bullets,
   * `~ ` and `+ ` for a "Thay vì / Nên viết" pair, and one `> ` takeaway.
   */
  body: string;
}

export const newsCopy = {
  title: "Bản tin",
  metaDescription:
    "Cẩm nang thực tập, câu chuyện phối hợp giữa nhà trường và cơ sở giáo dục, và cập nhật từ Co-Map.",
  all: "Tất cả",
  chipsLabel: "Lọc theo chuyên mục",
  readTime: (n: number) => `${n} phút đọc`,
  empty: "Chưa có bài trong mục này.",
  seeAll: "Xem tất cả",
  back: "Về Bản tin",
  breadcrumbLabel: "Đường dẫn",
  author: "Ban biên tập Co-Map",
  copyLink: "Chép liên kết",
  related: "Đọc tiếp",
  instead: "Thay vì",
  better: "Nên viết",
  takeaway: "Điều cần nhớ",
};

export const articles: Article[] = [
  {
    slug: "nha-tuyen-dung-giao-duc-doc-cv-nhu-the-nao",
    title: "Nhà tuyển dụng đọc CV ra sao",
    category: "cam-nang",
    date: "2026-11-05",
    excerpt:
      "Từ vòng lọc điều kiện đến lúc xếp nhóm A, B, C: năm bước mà một hồ sơ ứng tuyển ngành Giáo dục thường đi qua, và bạn nên chuẩn bị gì cho từng bước.",
    image: {
      src: "/images/ban-lam-viec.jpg",
      alt: "Bàn làm việc với tập hồ sơ, bút dạ quang và kính đọc sách",
      caption: "Ảnh minh họa.",
    },
    cover: "route",
    stat: { value: "5", label: "bước đọc một hồ sơ" },
    body: `Một tin tuyển trợ giảng tiếng Anh có thể nhận vài chục hồ sơ trong một tuần, và phần lớn được đọc theo cùng một trình tự.

## Lọc điều kiện
- Phần mềm quản lý ứng viên lọc theo từ khóa trong tin tuyển dụng.
- Bằng cấp và chứng chỉ như IELTS, TESOL, CELTA được kiểm tra đầu tiên: ghi tên đầy đủ, đúng như trong tin.

## Lướt nền tảng, đọc sự phù hợp
- Vài chục giây đầu: nơi đào tạo, kinh nghiệm đứng lớp, hoạt động bổ trợ.
- Sau đó: triết lý dạy học, quản lý lớp học, làm việc với phụ huynh.
- Một ví dụ cụ thể có giá trị hơn ba tính từ.

## Kiểm chứng rồi xếp nhóm
- Khoảng trống dài hay chứng chỉ không tra cứu được khiến người đọc dừng lại, nên giải thích ngắn ngay trong CV.
- Nhóm A được mời phỏng vấn hoặc dạy thử, nhóm B lưu dự phòng, nhóm C chưa phù hợp.

> Gói CV bảo chứng của Co-Map đi qua đúng năm bước này trước khi hồ sơ đến tay doanh nghiệp.`,
  },
  {
    slug: "co-map-tham-gia-nguoi-nhan-van-khoi-nghiep",
    title: "Co-Map tại Người Nhân văn khởi nghiệp",
    category: "hoat-dong",
    date: "2026-11-02",
    excerpt: "Vì sao một nhóm sinh viên Giáo dục học chọn bắt đầu từ một tấm bản đồ, và bản trình diễn hôm nay làm được gì.",
    cover: "pins",
    stat: { value: "3", label: "vai trò, một bản đồ" },
    body: `Tại cuộc thi Người Nhân văn khởi nghiệp của Trường ĐH KHXH&NV, ĐHQG-HCM, Co-Map bắt đầu từ một câu hỏi quen thuộc: đi thực tập ở đâu để học đúng điều đề cương yêu cầu?

## Vì sao là bản đồ
Thực tập là chuyện của địa điểm: một nơi đúng chuyên môn nhưng quá xa nơi ở sẽ khó gắn bó trọn học kỳ. Vì vậy mọi thông tin được đặt lên bản đồ, kèm khoảng cách thật.

## Bản trình diễn làm được gì
- Lọc theo chuyên ngành, vị trí, tính chất công việc, khu vực và quy mô.
- Thẻ thông tin cho từng trường và từng cơ sở.
- Ba cửa sổ đăng ký tư vấn: sinh viên, doanh nghiệp, nhà trường.

## Dữ liệu thật và minh họa
- Thông tin các trường là thông tin công khai.
- Trung tâm HiPO là dữ liệu thật do nhóm trực tiếp thu thập.
- Các cơ sở còn lại là đơn vị giả định, có nhãn Minh họa trên từng thẻ.

> Trong giai đoạn thử nghiệm, Co-Map mời các cơ sở giáo dục tại TP.HCM và các khoa ngành Giáo dục cùng tham gia.`,
  },
  {
    slug: "de-cuong-thuc-tap-5-dieu-nen-doc-ky",
    title: "5 điều cần đọc trong đề cương",
    category: "cam-nang",
    date: "2026-10-27",
    excerpt: "Đề cương học phần không chỉ để nộp cho đủ hồ sơ. Đó là tấm bản đồ cho cả kỳ thực tập của bạn.",
    cover: "route",
    stat: { value: "5", label: "điều cần đọc kỹ" },
    body: `Đọc đề cương thực tập từ sớm, bạn sẽ biết nên chọn nơi nào và cần làm gì ở đó.

## Chuẩn đầu ra
Đánh dấu những năng lực cần môi trường đặc thù, như làm việc với phụ huynh hay tổ chức hoạt động trải nghiệm. Rồi chọn cơ sở có đúng những công việc đó.

## Lịch và cách đánh giá
- Số tuần, số buổi, khung giờ: so với lịch các học phần khác trước khi liên hệ cơ sở.
- Nhật ký, báo cáo, nhận xét của người hướng dẫn: biết mỗi phần bao nhiêu điểm để ghi chép từ ngày đầu.

## Người hướng dẫn và giấy tờ
- Hỏi cơ sở ngay buổi đầu: ai hướng dẫn, và người đó cần xác nhận những gì.
- Chuẩn bị đủ giấy giới thiệu, kế hoạch thực tập, phiếu đánh giá để được tiếp nhận nhanh hơn.

> Trên Co-Map, đặt thẻ của trường cạnh thẻ của cơ sở là cách nhanh nhất để thấy một nơi có phù hợp với bạn hay không.`,
  },
  {
    slug: "dia-chi-sau-sap-xep-phuong-xa",
    title: "Địa chỉ mới, khu vực cũ",
    category: "chinh-sach",
    date: "2026-10-20",
    excerpt:
      "Từ 01/7/2025, TP.HCM tổ chức chính quyền hai cấp và không còn quận, huyện. Đây là cách chúng tôi hiển thị địa chỉ để bạn không bị lạc.",
    cover: "wards",
    stat: { value: "22", label: "khu vực cũ trong bộ lọc" },
    body: `Từ ngày 01/7/2025, TP.HCM vận hành chính quyền hai cấp: thành phố và phường, xã, đặc khu. Cấp quận, huyện không còn.

## Hai dòng trên mỗi thẻ
- Địa chỉ theo tên phường mới, ví dụ: 10-12 Đinh Tiên Hoàng, Phường Sài Gòn.
- Ngay dưới là khu vực theo địa giới cũ, ví dụ: Quận 1 cũ.

## Vì sao giữ tên cũ
- Một phường mới có thể gồm nhiều phường cũ.
- Có phường mới trùng tên quận cũ, như Phường Bình Thạnh hay Phường Gò Vấp.
- Bộ lọc Khu vực dùng 16 quận, 5 huyện và TP. Thủ Đức, cách mà sinh viên và phụ huynh vẫn quen định vị.

## Phạm vi dữ liệu
Co-Map hiện thu thập dữ liệu trong phạm vi TP.HCM trước ngày 01/7/2025. Các khu vực hợp nhất từ Bình Dương và Bà Rịa-Vũng Tàu sẽ được bổ sung sau.

> Thấy địa chỉ chưa đúng? Bấm Báo sai trên thẻ, Co-Map kiểm tra trong 24 giờ làm việc.`,
  },
  {
    slug: "viet-mo-ta-cong-viec-thuc-tap",
    title: "Viết tin thực tập cho đúng người",
    category: "doanh-nghiep",
    date: "2026-10-13",
    excerpt:
      "Sinh viên ngành Giáo dục đọc tin thực tập bằng đề cương của mình. Một mô tả công việc tốt nói cùng ngôn ngữ đó.",
    cover: "ring",
    stat: { value: "1\u00a0trang", label: "kế hoạch tiếp nhận theo tuần" },
    body: `Sinh viên ngành Giáo dục đọc tin thực tập bằng đề cương của mình, nên tin của bạn cần cho thấy công việc giúp đạt chuẩn đầu ra nào.

## Nhiệm vụ bằng động từ cụ thể
~ Hỗ trợ lớp học.
+ Chuẩn bị học liệu, điểm danh, theo dõi tiến bộ của 12 học viên và gửi nhận xét cho phụ huynh mỗi tuần.

## Lịch và phụ cấp, ghi thẳng
- Tính chất và ca làm, ví dụ: Thứ Hai đến Thứ Sáu, 14:00-16:00.
- Mức phụ cấp, ví dụ: 150.000đ/buổi. Chưa xác định thì ghi Thỏa thuận.

## Người hướng dẫn và kế hoạch
- Vai trò người hướng dẫn, ví dụ quản lý học vụ hay giáo viên chủ nhiệm.
- Kế hoạch tiếp nhận hiển thị trong thẻ của cơ sở và chỉ chia sẻ cho nhà trường đã xác thực.

> Gói tìm kiếm thực tập sinh phù hợp cùng bạn chuẩn hóa mô tả công việc theo chuẩn đầu ra của các trường.`,
  },
  {
    slug: "nha-truong-bat-dau-phoi-hop-tu-dau",
    title: "Phối hợp thực tập: bắt đầu từ đâu",
    category: "nha-truong",
    date: "2026-10-06",
    excerpt: "Một kế hoạch phối hợp tốt bắt đầu từ chuẩn đầu ra, không bắt đầu từ danh sách đối tác.",
    cover: "hub",
    stat: { value: "13\u00a0tuần", label: "lộ trình phối hợp mẫu" },
    body: `Danh sách cơ sở quen của khoa rất quý, nhưng dễ khiến sinh viên được gửi đi theo thói quen thay vì theo mục tiêu của học phần.

## Bắt đầu từ chuẩn đầu ra
Liệt kê năng lực cần hình thành, rồi hỏi loại cơ sở nào tạo điều kiện cho năng lực đó. Trung tâm kỹ năng sống, trường mầm non và công ty học liệu số phục vụ những chuẩn đầu ra rất khác nhau.

## Hình thức theo năm học
- Năm nhất, năm hai: tham quan và kiến tập ngắn.
- Năm ba, năm tư: thực tập có người hướng dẫn và nhiệm vụ rõ ràng.
- Ngày hội việc làm: vài tuần trước kỳ thực tập.

## Ký kết và đánh giá
- Văn bản ký kết ghi rõ số sinh viên mỗi kỳ, người hướng dẫn và cách hai bên trao đổi đánh giá.
- Cuối kỳ, gộp nhận xét của cơ sở, báo cáo của sinh viên và kết quả học phần để quyết định tiếp tục, điều chỉnh hay tìm thêm đối tác.

> Gói thiết kế kế hoạch phối hợp của Co-Map đồng hành cùng khoa theo lộ trình mẫu 13 tuần, điều chỉnh theo lịch của từng trường.`,
  },
];

/** Newest first. */
export function sortedArticles(list: Article[] = articles): Article[] {
  return [...list].sort((a, b) => b.date.localeCompare(a.date));
}

export function latestArticles(n: number): Article[] {
  return sortedArticles().slice(0, n);
}

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export const articleHref = (slug: string) => `/ban-tin/${slug}`;

export const categoryHref = (c: NewsCategory) => `/ban-tin?muc=${c}`;

/** Related cards: same category first, then the newest others (spec 3.5). */
export function relatedArticles(a: Article, n = 2): Article[] {
  const rest = sortedArticles().filter((x) => x.slug !== a.slug);
  const same = rest.filter((x) => x.category === a.category);
  const other = rest.filter((x) => x.category !== a.category);
  return [...same, ...other].slice(0, n);
}

/** Body blocks. Consecutive bullets group into one list; `~`/`+` lines into one compare pair. */
export type Block =
  | { kind: "lead"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "compare"; instead: string; better: string }
  | { kind: "takeaway"; text: string };

export function parseBody(body: string): Block[] {
  const out: Block[] = [];
  const lines = body
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  lines.forEach((l, i) => {
    const last = out[out.length - 1];
    if (i === 0) out.push({ kind: "lead", text: l });
    else if (l.startsWith("## ")) out.push({ kind: "h2", text: l.slice(3) });
    else if (l.startsWith("- ")) {
      if (last?.kind === "ul") last.items.push(l.slice(2));
      else out.push({ kind: "ul", items: [l.slice(2)] });
    } else if (l.startsWith("~ ")) out.push({ kind: "compare", instead: l.slice(2), better: "" });
    else if (l.startsWith("+ ") && last?.kind === "compare") last.better = l.slice(2);
    else if (l.startsWith("> ")) out.push({ kind: "takeaway", text: l.slice(2) });
    else out.push({ kind: "p", text: l });
  });
  return out;
}

/** Visible body text without the markup, for word counts and reading time. */
export function bodyText(a: Article) {
  return [a.stat.value, a.stat.label, a.body.replace(/^(## |- |~ |\+ |> )/gm, "")].join(" ");
}

/** Reading time from the body itself: ceil(words / 200), at least one minute. */
export function articleMinutes(a: Article) {
  return Math.max(1, Math.ceil(bodyText(a).trim().split(/\s+/).length / 200));
}
