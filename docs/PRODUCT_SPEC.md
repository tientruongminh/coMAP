# Co-Map: Product Spec v1.0

Owner: Product Owner. Date: 09/11/2026. Status: final for the demo build.

This file is the single source of truth for the Co-Map website. Where it conflicts with the founders' document (`drive/Hồ sơ.txt`), this spec wins. The founders' content is kept, only sharpened. Every Vietnamese string in a quote block, table or code block is final copy: paste it verbatim.

Priority tags: **P0** must ship for the demo, **P1** should ship, **P2** only if time allows.

Global copy rules (apply to every user-facing string, including data):
- No em dash or en dash anywhere in visible text. Ranges use an unspaced hyphen (`10-12`, `2021-2022`, `14:00-16:00`). Separators become a colon or a comma.
- Brand name is always `Co-Map` (capital C, capital M, hyphen). Never "CoMAP" or "Comap".
- City: `TP.HCM` in UI copy. University: `Trường ĐH KHXH&NV, ĐHQG-HCM` (full name only in footer and About).
- Numbers: Vietnamese format. `2,4 km`, `150.000đ/buổi`, `4.800`. Dates `dd/mm/yyyy`. Times `14:00`.
- Sentence case for all headings, buttons and nav. Never uppercase UI text, except the two stamps (Section 6.9).
- All copy lives in `src/content/*.ts` (map in Appendix B), never inline in components.

---

## 0. Text budget (founder directive, 2026-11-09, overrides any longer copy below)

The founder: "ít chữ nhất có thể trong 1 khung hình nhưng vẫn đảm bảo nội dung truyền đạt, tối đa hóa việc truyền đạt bằng hình ảnh, hiệu ứng". Where this section conflicts with copy or layout later in this spec, this section wins.

- **Per frame:** at most 40 visible words in a 1440x900 viewport and 30 in a 390x844 viewport, not counting the header and footer. Measured with the `words.js` probe, which counts visible DOM text and skips `.sr-only` and `aria-hidden` text.
- **Per section:**
  - One headline of at most 8 words.
  - At most one support line of at most 14 words.
  - Labels on visuals: at most 3 words. Buttons: at most 3 words.
  - No body paragraphs on marketing pages.
- **Show, don't tell:** every idea that loses its sentence is carried by a visual instead, never simply dropped.
  - The visuals use the atlas vocabulary:
    - School and site pins.
    - Route lines.
    - 5 km rings.
    - Clusters.
    - The verified stamp.
    - Live numbers computed from the data.
    - The four photos.
  - Animation must demonstrate the idea:
    - Pins dropping means digitising.
    - Chips narrowing the pins means filtering.
    - A route drawing between a school and a site means matching.
  - Depth moves into progressive disclosure (hover or focus reveal, accordions, "Xem chi tiết"). Filler sentences may be deleted outright.
- **Every page is in scope** (founder follow-up, 2026-11-09: "rút gọn nội dung ở mọi trang luôn"), including the cases below that keep a looser budget:
  - Article bodies on `/ban-tin/[slug]`: about a 1-minute read (150 to 220 words). One lead sentence, three short sections of at most 2 sentences or 3 bullets, one takeaway line. One key-number callout and the article image carry the rest.
  - `/ban-do` result items: the name and at most one meta line. Detail card: no row repeats a chip. Contact rows show an icon, and the text label is `.sr-only`.
  - Form labels and error messages stay complete (accessibility).
  - The demo-data disclosure stays, in one short line.
- **Effects:** `motion/react` (`whileInView`, `layout`, stagger), CSS transitions and SVG path drawing.
  - Reduced motion renders the final state.
  - No scroll listeners and no scroll-jacking. Nothing animates text the visitor is trying to read.

## 1. Positioning and first impression

### 1.1 Positioning (internal)
For Education-field internships in TP.HCM, Co-Map is the community map that puts universities, internship sites and students on one shared, vetted map. It matches them by learning outcomes (chuẩn đầu ra) and by real distance. Job boards start from the CV and Facebook groups are unvetted. Co-Map starts from the syllabus and the place.

- Tagline: **Bản đồ thực tập ngành Giáo dục**
- `<title>` pattern: `{Tên trang} | Co-Map`. Home: `Co-Map | Bản đồ thực tập ngành Giáo dục TP.HCM`
- Meta description: `Co-Map kết nối nhà trường, cơ sở thực tập và sinh viên ngành Giáo dục tại TP.HCM trên một bản đồ cộng đồng, ghép nối theo chuẩn đầu ra và khoảng cách thực tế.`

### 1.2 Concept: "Tập bản đồ" (the school atlas)
The site looks like a printed atlas and a well-used textbook. It is not a SaaS landing page. Three materials:
- **Paper**: a cool off-white page and a light, brand-tinted map.
- **Indigo ink**: text, lines and internship-site pins.
- **Lime highlighter**: the founders' green. It marks key words in headlines, school pins and campus grounds on the map.

Exactly three graphic motifs are allowed. Nothing else decorates the site.
1. **Highlighter**: a lime marker stroke behind 1 to 3 key words of a headline. It sweeps in once on reveal.
2. **Route line**: a 2px ink line with stops, used for sequences such as how-it-works, the timeline and the CV steps.
3. **Stamp**: a rubber-stamp mark for states that a human has approved: `ĐÃ XÁC MINH` on verified data, `NHÓM A` on the sample CV, `ĐÃ NHẬN` on form success.

The map itself is the hero image. The site uses no illustrations, no 3D and no abstract blobs.

### 1.3 The 10-second story (home, desktop, first visit)
| Time | What the visitor sees | What they understand |
|---|---|---|
| 0 to 1 s | Paper page. H1 "Bản đồ thực tập ngành Giáo dục." The highlighter sweeps under "ngành Giáo dục". The map plate on the right shows the paper skeleton with the TP.HCM outline. | This is about internships in Education. |
| 1 to 3 s | Map tiles fade in. Campus grounds are tinted lime. Pins drop from north to south in 40 ms steps: lime squircles for schools, indigo circles for sites. | Real places in this city. |
| 3 to 6 s | The camera eases to the "Sinh viên" view. A 5 km ring appears around Hồ Con Rùa. The caption reads "12 cơ sở thực tập trong bán kính 5 km quanh Hồ Con Rùa" and the 3 nearest are listed with distances. | It is useful to me, today. |
| 6 to 13 s | Auto-switch to "Nhà trường". Trường ĐH KHXH&NV is selected and 9 arcs draw to its partner sites. | It connects the three sides. |

The numbers are computed from `data/locations.json`, never hard-coded.

### 1.4 Wow moments
- **W1, P0: the live matching hero map** (Section 3.1 S1 and Section 4.12). A real, interactive map plate with a role switch: Sinh viên, Nhà trường, Doanh nghiệp. Each role re-frames the same data: a distance ring, partner arcs, field-matched arcs.
- **W2, P0: "Chuẩn đầu ra gặp mô tả công việc"** (Section 3.1 S4). Syllabus learning outcomes sit on the left and HiPO's job tasks on the right. Ink lines draw between matching items as the section scrolls into view. This is the product's core logic, shown rather than described.
- **W3, P1: CV bảo chứng stamping** (Section 3.4). A sticky sample CV gets a stamp at each of the 5 vetting steps as the visitor scrolls, ending with `NHÓM A`.
- **Quiet wows, P0**:
  - Campus grounds tinted lime on the map.
  - Typing `su pham` finds "Sư phạm".
  - Typing an address re-sorts every site by distance from it.
  - The browser Back button closes a detail card.
  - Every card states where its data came from and when it was last updated.

### 1.5 Anti-AI rules (hard bans)
- No purple or blue gradients, glows, mesh backgrounds, glassmorphism or `backdrop-blur` on content. A solid header with no blur is fine.
- No emoji anywhere. All icons are Phosphor (Section 6.6).
- The hero is not a centered headline over three feature cards. No row of three equal cards anywhere.
- No stock or AI imagery of people, laptops, robots, brains, glowing networks or handshakes. Photos follow Section 6.10 exactly.
- No fake testimonials, fake partner logos, fake press or "trusted by" rows.
- No fake-precise metrics. Every number is either computed from data or labeled as a target.
- No marquee, parallax, scroll hijacking, infinite pulses, typing effects or cursor followers.
- No "Bước 1 / Bước 2" labels on how-it-works. The route line carries the order.
- No placeholder used as a label. The only documented exception is the map search field (Section 4.5).
- Use only the fonts in Section 6.2. Inter, Roboto, Arial, Open Sans, Helvetica and Nunito are banned.

---

## 2. Information architecture

### 2.1 Routes
| Route | Page | Notes |
|---|---|---|
| `/` | Trang chủ | Hero map (client, lazy). |
| `/ve-chung-toi` | Về chúng tôi | Static. |
| `/ban-do` | Bản đồ cộng đồng | Full-height app. No footer. URL state (Section 4.10). |
| `/dich-vu` | Dịch vụ | Anchors `#sinh-vien`, `#doanh-nghiep`, `#nha-truong`. |
| `/ban-tin` | Bản tin | `?muc=<slug>` filters by category. |
| `/ban-tin/[slug]` | Bài viết | Static generation for 6 articles. |
| `/lien-he` | Liên hệ | `?chu-de=<key>&diem=<locationId>` pre-fills the form. |
| `POST /api/lead` | API | Appends to `data/submissions/leads.jsonl` (Section 5.6). |
| `GET /api/geocode?q=` | API | Proxy to Photon, bounded to TP.HCM (Section 4.6). |
| not found | 404 | Section 3.7. |

The consult dialog is global. `?form=sinh-vien|doanh-nghiep|nha-truong` opens it on any route, and `?form=chon` opens the role picker. Closing the dialog removes the param with `router.replace`.

### 2.2 Header (all pages)
- Height 72px desktop, 60px mobile. Full width, content within the container.
- Left: logo lockup (Section 6.7), linking to `/`.
- Center-right links, in the founders' order: `Về chúng tôi` · `Bản đồ cộng đồng` · `Dịch vụ` · `Bản tin` · `Liên hệ`. The middle dots here are spacing in this spec, not UI.
- Right: primary button `Đăng ký tư vấn`, which opens `?form=chon`.
- Links are 15px Be Vietnam Pro 500, color ink. The active link gets a 3px lime highlighter underline offset 6px and `aria-current="page"`. Hover shows the underline at 50% opacity.
- At the top of the page the header is transparent on paper. Once a sentinel 8px below the top leaves view (IntersectionObserver, never a scroll listener), the header turns `--paper` at 96% opacity with a 1px `--line` bottom border. No blur.
- Everything fits on one line at 1024px. Below 1024px, links collapse into a menu button (Phosphor `List`, label `Mở menu`).
- Mobile menu: full-screen paper sheet. The links stack in Archivo 32/40 and stagger in by 40ms each with fade-up. `Đăng ký tư vấn` is pinned at the bottom with the contact line under it. The icon morphs from two lines to an X. Esc and the X close the menu. Focus is trapped inside.
- `/ban-do` keeps the same header, as the founders specified.

### 2.3 Footer (all pages except `/ban-do`)
Background `--indigo-700`, text white. Four columns on desktop, stacked on mobile.
1. Logo lockup, reversed: white wordmark, lime square, white circle, lime arc. Then:
   > Bản đồ cộng đồng và dữ liệu thực tập ngành Giáo dục tại TP.HCM.

   > Dự án khởi nghiệp của sinh viên ngành Giáo dục học, Trường ĐH KHXH&NV, ĐHQG-HCM.
2. `Khám phá`: Bản đồ cộng đồng, Dịch vụ, Bản tin.
3. `Co-Map`: Về chúng tôi, Liên hệ, Câu hỏi thường gặp (`/lien-he#cau-hoi`).
4. `Liên hệ`: email and phone from `src/content/site.ts`. Each row renders only when its value is not null. Then `Phản hồi trong 24 giờ làm việc.`

Bottom row, 13px, white at 72%:
> © 2026 Co-Map. Dữ liệu cơ sở thực tập trên bản đồ là minh họa trong giai đoạn thử nghiệm, trừ Trung tâm HiPO. Bản đồ: © OpenFreeMap, © OpenStreetMap.

Add `Ranh giới: geoBoundaries (CC BY 4.0)` only if the P2 coverage mask ships.

### 2.4 Home page concept
The home page is a guided tour of one map, in 8 sections:
1. Hero with the live map (W1).
2. Data strip.
3. Problem and how it works (route line).
4. Learning outcomes matching (W2).
5. Services bento.
6. Schools on the map.
7. Latest from Bản tin.
8. Role band ("Bắt đầu từ vai trò của bạn").

Each section is spec'd with copy in Section 3.1.

---

## 3. Page-by-page spec and final copy

Layout grid: container max 1280px, 12 columns, gutters 24px (desktop) and 16px (mobile). Section vertical padding is `py-24` desktop and `py-16` mobile, unless noted. Eyebrows: at most one per three consecutive sections; the ones allowed are named below.

### 3.1 Trang chủ (`/`)

**S1. Hero (P0, W1)**
- Layout ≥1024px: `min-h-[calc(100dvh-72px)]`, 12-col grid.
  - Copy block: cols 1 to 5, vertically centered.
  - Map plate: cols 6 to 12, bleeding to the right viewport edge with no right margin. Height `clamp(560px, 78dvh, 720px)`.
- Layout <1024px: copy first, then the plate full width minus a 12px inset, height 440px.
- Text elements (3):
  - H1, 2 lines. The highlighter covers "ngành Giáo dục".
    > Bản đồ thực tập
    > ngành Giáo dục.
  - Sub, Body L, max 46ch:
    > Co-Map đặt nhà trường, cơ sở thực tập và sinh viên TP.HCM lên cùng một bản đồ, rồi ghép nối theo chuẩn đầu ra và khoảng cách thực tế.
  - Buttons: primary `Mở bản đồ` (to `/ban-do`, with a trailing arrow in a nested circle), secondary outline `Đăng ký tư vấn` (to `?form=chon`).
- Map plate: a double bezel (Section 6.4) holding a MapLibre map. Overlays inside the plate:
  - Top left, legend chip: lime squircle `Trường đào tạo`, indigo circle `Cơ sở thực tập`.
  - Top right, segmented control with `aria-label="Xem bản đồ theo vai trò"`: `Sinh viên` | `Nhà trường` | `Doanh nghiệp`.
  - Bottom left, caption card (Section 4.12 strings). On desktop in the Sinh viên view, the 3 nearest sites are listed under the caption.
  - Bottom right, scale bar and attribution.
  - In the Sinh viên view only, a pill button `Dùng vị trí của tôi` (Phosphor `Crosshair`) sits under the caption.
- Full behavior: Section 4.12.

**S2. Data strip (P0)**
One ruled row of 4 numbers, left-aligned. Hairline dividers sit between them, not cards. Numbers are Archivo 48 tabular, labels Body.
| Number (computed) | Label |
|---|---|
| `stats.schools` | `trường đào tạo` |
| `stats.sites` | `cơ sở thực tập` |
| `stats.slots` | `chỗ thực tập đang mở` |
| `stats.areas` | `khu vực có dữ liệu` |

Caption, 14px muted:
> Số liệu tính trực tiếp từ bản đồ, cập nhật {meta.updated dd/mm/yyyy}. Cơ sở thực tập trong bản trình diễn là dữ liệu minh họa, trừ Trung tâm HiPO.

**S3. Problem and how it works (P0)**
- Split layout: H2 and body in cols 1 to 6, empty space on the right on desktop. The route line below spans all 12 columns.
  - H2, highlighter on "một tấm bản đồ khác":
    > Ba bên cùng tìm nhau, nhưng mỗi bên cầm một tấm bản đồ khác.
  - Body:
    > Sinh viên hỏi chỗ thực tập qua hội nhóm và người quen. Nhà trường giữ danh sách đối tác trong những tệp riêng lẻ. Cơ sở giáo dục cần người nhưng không biết chương trình nào đào tạo đúng việc mình cần. Co-Map gộp ba tấm bản đồ đó làm một.
- Route line, desktop: a horizontal 2px ink line with 3 stops placed at roughly 8%, 46% and 84% of the width. Stop 2 sits 48px lower than stops 1 and 3, with the line bending through it. Stop markers are a lime squircle, a white circle with an ink ring, and an indigo circle. Each stop has an H3 and body text below it, max 32ch. The line draws left to right on reveal over 900ms.
- Mobile: a vertical line on the left with the stops stacked.
| Stop | H3 | Body |
|---|---|---|
| 1 | `Số hóa dữ liệu` | `Chương trình đào tạo, đề cương thực tập và mô tả công việc được thu thập, kiểm tra và ghim lên bản đồ theo địa chỉ mới.` |
| 2 | `Lọc theo chuẩn đầu ra` | `Bộ lọc theo chuyên ngành, vị trí, tính chất công việc và khu vực cho mỗi bên thấy ngay nơi phù hợp, kèm khoảng cách thực tế.` |
| 3 | `Thiết kế phối hợp` | `Đội ngũ Co-Map cùng nhà trường và cơ sở lên kế hoạch ký kết, kiến tập, thực tập và đánh giá cho từng học kỳ.` |

**S4. Learning outcomes matching (P0, W2)**
- Eyebrow, the only one in S1 to S6: `Ví dụ minh họa`
- H2, highlighter on "gặp":
  > Chuẩn đầu ra gặp mô tả công việc
- Body, max 60ch:
  > Mỗi học phần thực tập có chuẩn đầu ra riêng. Co-Map đặt đề cương của nhà trường cạnh mô tả công việc của cơ sở, rồi chỉ ra nhiệm vụ nào giúp sinh viên đạt chuẩn đầu ra nào.
- Visual: a double-bezel plate. Its inner core is a 3-column grid: left list (5fr), an SVG connector lane (2fr), right list (5fr).
  - Left header: `Đề cương Thực tập 2, ngành Giáo dục học`, with the small line `Trường ĐH KHXH&NV`.
  - Right header: `Mô tả công việc: Giáo viên dạy Kỹ năng sống`, with the small line `Trung tâm HiPO`.
  - Left items are numbered `CĐR 1` to `CĐR 5`. Right items carry a Phosphor `Briefcase` glyph.

  | Left (CĐR) | Right (nhiệm vụ) | Links |
  |---|---|---|
  | CĐR 1 `Vận dụng tâm lý học lứa tuổi khi tổ chức hoạt động cho học sinh.` | a `Soạn giáo án và đứng lớp Kỹ năng sống cho học sinh tiểu học.` | 1-a, 2-a |
  | CĐR 2 `Thiết kế kế hoạch bài dạy và hoạt động trải nghiệm.` | b `Theo dõi và nhận xét tiến bộ của học viên sau mỗi buổi.` | 3-b |
  | CĐR 3 `Quan sát, ghi chép và đánh giá tiến bộ của người học.` | c `Trao đổi với phụ huynh về tình hình học tập của trẻ.` | 4-c |
  | CĐR 4 `Phối hợp với phụ huynh và đồng nghiệp trong công tác giáo dục.` | d `Hỗ trợ tổ chức ngày hội trải nghiệm cuối khóa.` | 2-d |
  | CĐR 5 `Tuân thủ đạo đức nghề nghiệp và quy định của cơ sở.` | e `Thực hiện nội quy an toàn của trung tâm trong mọi buổi học.` | 5-e |
- Motion:
  - On entering view (`amount: 0.4`, once), the lines draw in sequence, 120ms apart, 600ms each. Each line is an SVG cubic path, 1.5px ink at 55% opacity. As a line arrives, the matching items get a lime left bar.
  - Hover or focus on any item highlights its lines (2px, 100% ink) and its partner items, and dims the others to 40%.
  - Reduced motion: lines are shown fully, with no draw.
- Mobile: no connector lane. Each right item shows chips listing its linked CĐR numbers (e.g. `CĐR 1` `CĐR 2`) with lime dots. The items stagger in.
- Footer line inside the plate:
  > Cả 5 chuẩn đầu ra đều có nhiệm vụ tương ứng.

  Plus a text link `Xem Trung tâm HiPO trên bản đồ`, which goes to `/ban-do?chon=hipo`.
- Small print under the plate:
  > Nội dung rút gọn để minh họa cách đối chiếu, không trích nguyên văn đề cương.

**S5. Services bento (P0)**
- H2: `Một bản đồ, ba cách đồng hành`
- Sub: `Tra cứu bản đồ miễn phí. Khi cần đi sâu hơn, mỗi bên có một gói tư vấn riêng.`
- Grid ≥1024px: 12 columns, 2 rows, gap 16px. Cells are 20px radius `--surface` with shadow-1. Mobile: one column in the order A, B, C, D.

| Cell | Span | Audience chip | Title (H3) | Text | Link |
|---|---|---|---|---|---|
| A | col 1-7, row 1 | `Nhà trường` | `Gói thiết kế kế hoạch phối hợp giáo dục` | `Ký kết đối tác, kiến tập tại cơ sở và đánh giá chương trình trong một kế hoạch cho cả học kỳ.` A mini route line with 5 ticks is labeled `Khảo sát` `Ghép nối` `Ký kết` `Kiến tập` `Đánh giá`. | `/dich-vu#nha-truong` |
| B | col 8-12, rows 1-2 | `Sinh viên` | `Gói tư vấn chuyên sâu` | `Một buổi tư vấn 1-1 về học phần thực tập, định hướng lĩnh vực và những nơi phù hợp với năng lực của bạn.` The cell background is `--indigo-700` with white text. A static, non-interactive map crop with a lime ring and 3 pins fills its bottom half (CSS/SVG, no MapLibre). | `/dich-vu#sinh-vien` |
| C | col 1-4, row 2 | `Doanh nghiệp` | `Gói tìm kiếm thực tập sinh phù hợp` | `Mô tả nhu cầu một lần, nhận danh sách sinh viên đúng chuyên ngành và ở gần cơ sở.` | `/dich-vu#doanh-nghiep` |
| D | col 5-7, row 2 | `Doanh nghiệp` | `Gói mở khóa CV bảo chứng` | `Xem chi tiết hồ sơ đã qua 5 bước thẩm định của Co-Map.` | `/dich-vu#doanh-nghiep` |

- Every cell's link label is `Xem chi tiết gói`, with Phosphor `ArrowRight`. The whole cell is clickable.
- Band under the grid, one line, lime-tinted `--indigo-50` background, pill:
  > Ưu đãi tháng đầu: giảm 50% phí mọi gói dịch vụ.

**S6. Schools on the map (P0)**
- H2: `Các trường đào tạo đã có trên bản đồ`
- Sub: `Thông tin công khai về chương trình đào tạo ngành Giáo dục, không phải danh sách đối tác của Co-Map.`
- A ruled grid: 5 columns desktop, 2 mobile, `divide` lines, no cards. Each item has:
  - A 44px lime squircle monogram, ink text from `taxonomy.schoolMono`.
  - The `short` name in 16px 600.
  - Field count in 14px muted, e.g. `3 chuyên ngành`.
- Each item links to `/ban-do?chon={id}`. No marquee and no school logos.

**S7. Latest from Bản tin (P0)**
- H2 `Bản tin`, with the right-aligned link `Xem tất cả bài viết`.
- The 3 newest articles as editorial rows, not cards:
  - Category label, 13px lime-700 600.
  - Date, 13px muted.
  - Title, H3, which turns into a link with a highlighter underline on hover.
  - Excerpt, 1 line, desktop only.
- The rows are separated by 1px `--line`.

**S8. Role band (P0)**
- Full-bleed `--indigo-700` band, `py-24`.
- H2, white, with the lime highlighter on "vai trò của bạn" and ink text under the highlight:
  > Bắt đầu từ vai trò của bạn
- Sub, white at 80%: `Để lại thông tin, Co-Map gọi lại trong 24 giờ làm việc.`
- Three full-width rows, stacked even on desktop. Each row is 72px tall with a 1px white/20 top border. The label is Archivo 28 white. A 44px lime circle with an ink `ArrowRight` sits at the end. Hover moves the arrow 4px right. Each row opens its form.
  - `Tôi là sinh viên` opens `?form=sinh-vien`
  - `Tôi đại diện nhà trường` opens `?form=nha-truong`
  - `Tôi đại diện doanh nghiệp, trung tâm` opens `?form=doanh-nghiep`

### 3.2 Về chúng tôi (`/ve-chung-toi`)

**A1. Intro (P0)**
- Left-aligned, cols 1 to 8.
  - H1, highlighter on "lớp học thật":
    > Thu hẹp khoảng cách từ giảng đường đến lớp học thật.
  - Body L:
    > Co-Map là dự án khởi nghiệp của sinh viên ngành Giáo dục học, Trường ĐH KHXH&NV, ĐHQG-HCM. Chúng tôi bắt đầu từ chính câu hỏi của mình mỗi mùa thực tập: đi đâu để học đúng điều chương trình yêu cầu?
- Below, a full-container image `lop-hoc.jpg`: 16:9, 20px radius, caption `Ảnh minh họa.` in 13px muted.

**A2. Tầm nhìn (P0)**
- Section label H2: `Tầm nhìn`
- Statement in Archivo 32/42, max 28ch per line, highlighter on "thu hẹp khoảng cách":
  > Trở thành hệ sinh thái bản đồ cộng đồng và dữ liệu thực tập hàng đầu của lĩnh vực Giáo dục, góp phần thu hẹp khoảng cách giữa chất lượng đào tạo hàn lâm của các trường đại học và nhu cầu thực tiễn của thị trường lao động.

**A3. Sứ mệnh (P0)**
- H2 `Sứ mệnh`. A definition list with 4 rows. On desktop the label is in col 1-3 (Archivo 20) and the text in col 4-10. 1px dividers.

| Label | Text |
|---|---|
| `Với xã hội` | `Huy động và kết nối nguồn lực sẵn có của cộng đồng, nhà trường và doanh nghiệp, từ cơ sở vật chất, tri thức đến con người, để thúc đẩy xã hội hóa giáo dục và xây dựng một mạng lưới gắn kết, bền vững.` |
| `Với nhà trường` | `Hỗ trợ quản lý chương trình đào tạo và chuẩn đầu ra của học phần thực tập, đồng thời mở rộng mạng lưới cơ sở thực tập uy tín cho sinh viên.` |
| `Với doanh nghiệp` | `Cung cấp nguồn thực tập sinh đã được thẩm định chuyên môn, giúp tiết kiệm chi phí tuyển dụng và thời gian đào tạo lại.` |
| `Với sinh viên` | `Vạch rõ lộ trình từ học phần đến thực tập, giúp tiếp cận những cơ hội uy tín và phù hợp với năng lực.` |

**A4. Giá trị cốt lõi (P0)**
- H2 `Giá trị cốt lõi`. Two blocks, asymmetric: 7 columns and 5 columns. Each has a large number (`01`, `02`, Archivo 64, lime-700).

| Title | Text |
|---|---|
| `Phối hợp trong giáo dục` | `Bản đồ trực tuyến cho thấy toàn bộ mạng lưới đối tác theo khu vực, để mỗi bên tìm được nguồn lực phù hợp nhanh hơn. Mỗi kết nối hướng tới sự tương thích giữa thế mạnh của cơ sở đào tạo, năng lực thực tế của sinh viên và yêu cầu của nơi tuyển dụng.` |
| `Tính chính xác` | `Chương trình đào tạo, chuẩn đầu ra và mô tả công việc được cập nhật liên tục và kiểm duyệt trước khi lên bản đồ. Mỗi điểm ghi rõ nguồn dữ liệu và ngày cập nhật.` |

**A5. Vì sao là bản đồ cộng đồng (P0)**
- H2: `Vì sao là bản đồ cộng đồng`
- Body:
  > Bản đồ cộng đồng là một phương pháp quen thuộc trong khoa học xã hội: chính những người trong cuộc cùng ghi lại nguồn lực của nơi mình sống và làm việc. Co-Map áp dụng phương pháp đó cho thực tập ngành Giáo dục. Nhà trường, cơ sở thực tập và sinh viên cùng bổ sung dữ liệu; đội ngũ Co-Map kiểm tra trước khi công bố.
- Below that, a block `Cách chúng tôi ghi nguồn dữ liệu`: three rows, each with its chip (Section 4.8) and a sentence.
  - `Đã xác minh`: `Co-Map đã làm việc trực tiếp với đơn vị và kiểm tra thông tin.`
  - `Thông tin công khai`: `Lấy từ website và văn bản công bố của trường. Tài liệu đính kèm là minh họa.`
  - `Minh họa`: `Đơn vị giả định, dùng để trình diễn tính năng trong giai đoạn thử nghiệm.`

**A6. Mục tiêu năm đầu tiên (P0)**
- H2: `Mục tiêu năm đầu tiên`. Two numbers in Archivo 56.
  - `4.800` with the label `sinh viên tham gia hệ sinh thái học tập và thực tập`
  - `30+` with the label `doanh nghiệp vừa và nhỏ kết nối được đợt thực tập`
- Caption: `Đây là mục tiêu, chưa phải kết quả đã đạt.`

**A7. Đội ngũ (P0)**
- H2: `Đội ngũ`
- Rendered from `src/content/team.ts`. Each entry: `{name, role, line, photo?: string}`. With no photo, show an 80px indigo-50 circle with ink initials. The grid handles 1 to 5 people.
- Initial content, the only person known:
  - Name `Phạm Thị Hà Chi`
  - Role `Trưởng nhóm`
  - Line `Sinh viên ngành Giáo dục học, Trường ĐH KHXH&NV, ĐHQG-HCM`
- Never invent members. No student ID numbers. No AI-generated faces.

**A8. Closing (P0)**
- One line `Cùng vẽ tiếp tấm bản đồ này.` plus the buttons `Mở bản đồ` (primary) and `Đăng ký tư vấn` (secondary).

### 3.3 Bản đồ cộng đồng (`/ban-do`)
The full interaction spec is in Section 4. Page copy:

- `<h1>` in the panel, 20px Archivo: `Bản đồ cộng đồng`
- Sub, 14px muted: `{stats.schools} trường đào tạo và {stats.sites} cơ sở thực tập ngành Giáo dục tại TP.HCM`
- Search: visually hidden label `Tìm kiếm trên bản đồ`. Placeholder hint `Trường, cơ sở, ngành hoặc địa chỉ` (short enough to show in full in the 360px panel).
- Quick toggles: `Trường đào tạo ({n})` and `Cơ sở thực tập ({n})`.
- Filter button: `Bộ lọc`, or `Bộ lọc ({k})` when k groups are active.
- Live result count, in an `aria-live="polite"` region: `{n} kết quả`
- List group headings: `Cơ sở thực tập ({n})` first, then `Trường đào tạo ({m})`.
- Legend note at the bottom of the panel, 13px muted:
  > Dữ liệu cơ sở thực tập là minh họa trong giai đoạn thử nghiệm, trừ Trung tâm HiPO.

States, with exact copy, are in Section 4.11.

### 3.4 Dịch vụ (`/dich-vu`)

**D1. Intro (P0)**
- H1, highlighter on "mùa thực tập":
  > Đồng hành cùng từng bên trong một mùa thực tập.
- Sub:
  > Tra cứu bản đồ cộng đồng miễn phí. Khi cần đi sâu hơn, Co-Map có gói tư vấn riêng cho sinh viên, doanh nghiệp và nhà trường.
- A sticky in-page tab bar under the header. Pill tabs `Sinh viên` `Doanh nghiệp` `Nhà trường` anchor to the sections. The active tab is tracked with an IntersectionObserver.
- Trial banner, an indigo-50 pill with Phosphor `Tag`:
  > Tháng đầu sử dụng: giảm 50% phí dịch vụ. Báo giá theo nhu cầu của từng đơn vị.

**D2. Sinh viên (`#sinh-vien`, P0)**
- Split layout: text in cols 1-6, image `bai-xe.jpg` in cols 7-12 (16:9, 20px radius, caption `Ảnh minh họa.`).
- Audience chip `Sinh viên`, H2 `Gói tư vấn chuyên sâu`.
- Body:
  > Phân tích chi tiết học phần thực tập của bạn, định hướng lĩnh vực trong ngành Giáo dục và gợi ý những cơ sở thực tập phù hợp với năng lực.
- `Bạn nhận được`, a list with Phosphor `Check`:
  - `Một buổi tư vấn 1-1 trong 60 phút, trực tiếp hoặc trực tuyến.`
  - `Cùng đọc đề cương thực tập và những chuẩn đầu ra bạn cần đạt.`
  - `Danh sách cơ sở phù hợp trên bản đồ, kèm khoảng cách từ nơi bạn ở.`
  - `Bản tóm tắt định hướng bằng văn bản sau buổi tư vấn.`
- `Dành cho`:
  > Sinh viên năm hai đến năm tư các ngành Giáo dục học, Quản lý giáo dục, Công nghệ giáo dục, Sư phạm, Tâm lý học giáo dục và Giáo dục đặc biệt.
- Button `Đăng ký tư vấn`, which opens `?form=sinh-vien`.

**D3. Doanh nghiệp (`#doanh-nghiep`, P0 for packages, P1 for W3)**
- Audience chip `Doanh nghiệp`, H2 `Tìm đúng thực tập sinh, đọc đúng hồ sơ`.
- Two package blocks side by side: 7 columns and 5 columns, with different heights allowed. Both use `--surface` with 20px radius.
  - Block 1: H3 `Gói tìm kiếm thực tập sinh phù hợp`.
    - Text: `Hỗ trợ lọc và tìm thực tập sinh theo đúng yêu cầu: chuyên ngành, vị trí, lịch làm việc và khu vực.`
    - List:
      - `Chuẩn hóa mô tả công việc theo chuẩn đầu ra của các trường.`
      - `Ghim cơ sở của bạn lên bản đồ cộng đồng.`
      - `Danh sách sinh viên phù hợp, ưu tiên người ở gần.`
  - Block 2: H3 `Gói mở khóa CV bảo chứng`.
    - Text: `Cấp quyền xem chi tiết các hồ sơ ứng viên đã qua kiểm định chất lượng của Co-Map.`
    - List:
      - `Hồ sơ được thẩm định qua 5 bước trước khi mở khóa.`
      - `Phân loại rõ Nhóm A, B, C cho từng vị trí.`
      - `Thông tin liên hệ chỉ hiển thị sau khi doanh nghiệp đăng ký gói.`
- One button below both blocks: `Đăng ký tư vấn`, which opens `?form=doanh-nghiep`.

**W3. CV bảo chứng sticky scroll (P1)**
- H3, large (Archivo 32): `Một CV được bảo chứng như thế nào`
- Sub: `Người thẩm định của Co-Map đọc hồ sơ theo đúng cách nhà tuyển dụng giáo dục đọc, và ghi lại kết quả ở từng bước.`
- Desktop: a sticky card on the left (cols 1-5, `top: 120px`) and 5 step blocks on the right (cols 7-12, each ~60vh tall).
  - A vertical route line links the steps.
  - When a step block crosses the center of the viewport (IntersectionObserver, `rootMargin: "-45% 0px -45% 0px"`), its matching row on the card gets a lime check stamp (scale 1.15 to 1, 240ms).
  - Step 5 adds the `NHÓM A` stamp: indigo, rotated -6deg, uppercase, 2px border, scale-in 1.2 to 1 over 320ms.
- Steps (title, text):
  1. `Lọc điều kiện tiên quyết`: `Kiểm tra bằng cấp và chứng chỉ bắt buộc theo vị trí, như chứng chỉ tiếng Anh với vị trí trợ giảng ngoại ngữ.`
  2. `Đánh giá nền tảng`: `Xem đơn vị đào tạo, kinh nghiệm đứng lớp thực tế và các hoạt động bổ trợ như ngoại khóa, nghiên cứu, dự án cộng đồng.`
  3. `Phân tích sự phù hợp`: `Đọc mục tiêu nghề nghiệp để thấy sự cam kết với nghề, phương pháp giảng dạy và kỹ năng mềm: kiên nhẫn, quản lý lớp học, làm việc với phụ huynh.`
  4. `Kiểm chứng độ tin cậy`: `Làm rõ khoảng trống thời gian, tần suất đổi công việc và đối chiếu chứng chỉ với đơn vị cấp.`
  5. `Phân loại`: `Nhóm A mời phỏng vấn hoặc dạy thử, Nhóm B lưu hồ sơ dự phòng, Nhóm C chưa phù hợp với vị trí.`
- Sample card (the stamp rows mirror the steps):
  - Top chip `Hồ sơ mẫu`. Title `Ứng viên GDH-0427`. Line `Giáo dục học, năm 3`.
  - Redacted rows: ink-tinted rounded bars, no real text in the DOM, each with Phosphor `LockSimple`. They are labeled `Họ và tên`, `Số điện thoại`, `Email`.
  - Stamp rows: `Điều kiện tiên quyết` / `Nền tảng` / `Sự phù hợp` / `Kiểm chứng` / `Phân loại`.
  - Footer: `Người thẩm định: Chuyên viên Co-Map` and `Mở khóa khi doanh nghiệp đăng ký gói`.
- Mobile: no sticky. The 5 steps sit on the route line, followed by the card, which appears fully stamped when it enters view.
- Reduced motion: the card is shown fully stamped and the steps are static.

**D4. Nhà trường (`#nha-truong`, P0)**
- Split layout, reversed: image `hanh-lang.jpg` in cols 1-5 (4:3 crop via `object-fit: cover`, 20px radius, caption `Ảnh minh họa.`), text in cols 7-12.
- Audience chip `Nhà trường`, H2 `Gói thiết kế kế hoạch phối hợp giáo dục`.
- Body:
  > Tổ chức ký kết đối tác, vận hành các chuyến kiến tập tại cơ sở và đánh giá chương trình giáo dục, trong một kế hoạch thống nhất cho cả học kỳ.
- Timeline, full width below: a horizontal route line with 5 stops (vertical on mobile). Label `Lộ trình mẫu, điều chỉnh theo lịch của từng trường`.
  | Stop | Text |
  |---|---|
  | `Tuần 1-2` | `Khảo sát chuẩn đầu ra học phần thực tập và nhu cầu của khoa.` |
  | `Tuần 3` | `Ghép nối với cơ sở thực tập phù hợp trên bản đồ.` |
  | `Tuần 4` | `Tổ chức lễ ký kết hợp tác giữa nhà trường và cơ sở.` |
  | `Tuần 5-12` | `Vận hành kiến tập, thực tập, tham quan và ngày hội việc làm.` |
  | `Tuần 13` | `Đánh giá chương trình và báo cáo kết quả cho khoa.` |
- Button `Đăng ký tư vấn`, which opens `?form=nha-truong`.

**D5. Closing (P0)**
- Line `Chưa chắc gói nào phù hợp? Hãy bắt đầu bằng một cuộc gọi.` plus the button `Đăng ký tư vấn`, which opens `?form=chon`.

### 3.5 Bản tin (`/ban-tin`, `/ban-tin/[slug]`)

**Index (P0)**
- H1 `Bản tin`
- Sub: `Cẩm nang thực tập, câu chuyện phối hợp giữa nhà trường và cơ sở giáo dục, và cập nhật từ Co-Map.`
- Category chips, single select, synced to `?muc=`: `Tất cả` · `Cẩm nang thực tập` (`cam-nang`) · `Nhà trường` (`nha-truong`) · `Doanh nghiệp` (`doanh-nghiep`) · `Chính sách` (`chinh-sach`) · `Hoạt động Co-Map` (`hoat-dong`).
- Lead article (newest in the current filter): image left (cols 1-7) if it has one, text right (cols 8-12). Shows category, date, H2 title, excerpt and `Đọc bài viết`. An article without an image becomes a text-only lead with a large title.
- The rest: editorial rows (same pattern as Home S7) showing category, date, title, excerpt and the read time `{n} phút đọc`.
- Empty category:
  > Chưa có bài viết trong chuyên mục này.

  Plus the link `Xem tất cả bài viết`.

**Article page (P0)**
- Breadcrumb: `Bản tin` / `{Chuyên mục}`.
- H1 title, then the meta line `{dd/mm/yyyy} · {n} phút đọc · Ban biên tập Co-Map`. The middle dot is allowed here.
- Body: max 68ch, Body L. H2s in Archivo 24.
- Footer:
  - `Sao chép liên kết` (toast `Đã sao chép liên kết`).
  - `Bài viết liên quan`: 2 rows, same category first, then newest.
- Read time is `ceil(words / 200)`.
- Articles live in `src/content/news.ts` as `{slug, title, category, date, excerpt, image?, body}`. The body is a small markdown string: only `##` headings and paragraphs.

**The 6 articles (final copy)**

---
**Article 1**
- slug: `nha-tuyen-dung-giao-duc-doc-cv-nhu-the-nao`
- category: Cẩm nang thực tập
- date: 05/11/2026
- image: `/images/ban-lam-viec.jpg`, alt `Bàn làm việc với tập hồ sơ, bút dạ quang và kính đọc sách`
- Title: **Nhà tuyển dụng giáo dục đọc CV của bạn như thế nào**
- Excerpt: Từ vòng lọc điều kiện đến lúc xếp nhóm A, B, C: năm bước mà một hồ sơ ứng tuyển ngành Giáo dục thường đi qua, và bạn nên chuẩn bị gì cho từng bước.

Một tin tuyển trợ giảng tiếng Anh có thể nhận vài chục hồ sơ chỉ trong một tuần. Phần lớn sẽ được đọc theo một trình tự khá giống nhau. Hiểu trình tự đó giúp bạn viết CV đúng chỗ người đọc tìm.

## Bước 1: Lọc điều kiện tiên quyết
Nhiều cơ sở dùng phần mềm quản lý ứng viên để lọc theo từ khóa trong mô tả công việc. Bằng cấp bắt buộc và chứng chỉ như IELTS, TESOL hay CELTA với vị trí tiếng Anh được kiểm tra đầu tiên. Hãy ghi tên chứng chỉ đầy đủ, đúng như trong tin tuyển dụng.

## Bước 2: Đánh giá nền tảng
Khi hồ sơ đến tay người đọc, họ thường chỉ lướt trong vài chục giây. Ba thứ được nhìn trước: đơn vị đào tạo, kinh nghiệm đứng lớp thực tế (dạy ai, trong bao lâu) và hoạt động bổ trợ như ngoại khóa, nghiên cứu, dự án cộng đồng.

## Bước 3: Phân tích sự phù hợp
Khác nhiều ngành khác, giáo dục coi trọng triết lý dạy học. Mục tiêu nghề nghiệp và thư ứng tuyển là nơi người đọc tìm sự cam kết lâu dài, phương pháp giảng dạy và kỹ năng mềm: kiên nhẫn, quản lý lớp học, làm việc với phụ huynh. Một ví dụ cụ thể có giá trị hơn ba tính từ.

## Bước 4: Kiểm chứng
Khoảng trống thời gian dài, việc đổi chỗ làm liên tục hay chứng chỉ không tra cứu được đều khiến người đọc dừng lại. Nếu có khoảng nghỉ, hãy giải thích ngắn gọn ngay trong CV.

## Bước 5: Phân loại
Cuối cùng, hồ sơ được xếp vào ba nhóm. Nhóm A được mời phỏng vấn hoặc dạy thử, Nhóm B được lưu dự phòng, Nhóm C chưa phù hợp với vị trí.

Gói CV bảo chứng của Co-Map đi qua đúng năm bước này trước khi hồ sơ đến tay doanh nghiệp, để cả hai bên tiết kiệm thời gian.

---
**Article 2**
- slug: `co-map-tham-gia-nguoi-nhan-van-khoi-nghiep`
- category: Hoạt động Co-Map
- date: 02/11/2026
- no image
- Title: **Co-Map tham gia Người Nhân văn khởi nghiệp**
- Excerpt: Vì sao một nhóm sinh viên Giáo dục học chọn bắt đầu từ một tấm bản đồ, và bản trình diễn hôm nay làm được gì.

Co-Map ra đời từ một câu hỏi rất quen của sinh viên Giáo dục học mỗi mùa thực tập: đi đâu để học đúng điều đề cương yêu cầu? Câu trả lời thường nằm rải rác trong hội nhóm, tin nhắn và danh sách đối tác của từng khoa.

## Vì sao là bản đồ
Thực tập là chuyện của địa điểm. Một cơ sở phù hợp về chuyên môn nhưng cách nơi ở 20 km sẽ khó gắn bó trọn học kỳ. Vì vậy chúng tôi đặt mọi thông tin lên bản đồ: trường đào tạo màu xanh lá, cơ sở thực tập màu xanh dương, khoảng cách hiển thị bằng con số thật.

## Bản trình diễn làm được gì
Bản trình diễn tại cuộc thi Người Nhân văn khởi nghiệp của Trường ĐH KHXH&NV, ĐHQG-HCM gồm bản đồ với bộ lọc theo chuyên ngành, vị trí, tính chất công việc, khu vực và quy mô; thẻ thông tin của từng trường và cơ sở; cùng ba cửa sổ đăng ký tư vấn cho sinh viên, doanh nghiệp và nhà trường.

## Dữ liệu thật và dữ liệu minh họa
Thông tin các trường là thông tin công khai. Trung tâm HiPO là dữ liệu thật do nhóm trực tiếp thu thập. Các cơ sở thực tập còn lại là đơn vị giả định và được gắn nhãn Minh họa trên từng thẻ. Chúng tôi chọn ghi rõ như vậy vì tính chính xác là một trong hai giá trị cốt lõi của Co-Map.

## Bước tiếp theo
Trong giai đoạn thử nghiệm, Co-Map mời các cơ sở giáo dục tại TP.HCM đưa đơn vị của mình lên bản đồ, và mời các khoa đào tạo ngành Giáo dục cùng thử thiết kế một kế hoạch phối hợp cho học kỳ tới.

---
**Article 3**
- slug: `de-cuong-thuc-tap-5-dieu-nen-doc-ky`
- category: Cẩm nang thực tập
- date: 27/10/2026
- no image
- Title: **Đề cương thực tập: 5 điều nên đọc kỹ trước tuần đầu tiên**
- Excerpt: Đề cương học phần không chỉ để nộp cho đủ hồ sơ. Đó là tấm bản đồ cho cả kỳ thực tập của bạn.

Nhiều sinh viên chỉ mở đề cương thực tập khi sắp nộp báo cáo. Đọc sớm, đề cương sẽ cho bạn biết nên chọn nơi nào và cần làm gì ở đó.

## 1. Chuẩn đầu ra của học phần
Đây là danh sách năng lực bạn phải chứng minh khi kết thúc. Hãy đánh dấu những chuẩn đầu ra cần môi trường đặc thù, ví dụ làm việc với phụ huynh hay tổ chức hoạt động trải nghiệm, để chọn cơ sở có đúng những công việc đó.

## 2. Thời lượng và lịch
Số tuần, số buổi mỗi tuần và khung giờ quyết định bạn có thể nhận vị trí bán thời gian hay toàn thời gian. So lịch này với lịch học các học phần khác trước khi liên hệ cơ sở.

## 3. Hình thức đánh giá
Nhật ký thực tập, báo cáo, nhận xét của người hướng dẫn tại cơ sở: mỗi phần chiếm bao nhiêu điểm? Biết trước để ghi chép từ ngày đầu, thay vì cố nhớ lại vào cuối kỳ.

## 4. Vai trò của người hướng dẫn
Đề cương thường quy định cơ sở cần cử người hướng dẫn và người đó cần xác nhận những gì. Hãy hỏi cơ sở điều này ngay trong buổi trao đổi đầu tiên.

## 5. Hồ sơ và giấy tờ
Giấy giới thiệu, kế hoạch thực tập, phiếu đánh giá: chuẩn bị đủ từ đầu giúp cơ sở tiếp nhận bạn nhanh hơn.

Trên bản đồ Co-Map, thẻ của mỗi trường liệt kê đề cương thực tập theo năm học, còn thẻ của cơ sở cho biết vị trí, lịch làm việc và chế độ phụ cấp. Đặt hai thẻ cạnh nhau là cách nhanh nhất để thấy một nơi có phù hợp với bạn hay không.

---
**Article 4**
- slug: `dia-chi-sau-sap-xep-phuong-xa`
- category: Chính sách
- date: 20/10/2026
- no image
- Title: **Địa chỉ sau sắp xếp phường, xã: Co-Map ghi địa chỉ như thế nào**
- Excerpt: Từ 01/7/2025, TP.HCM tổ chức chính quyền hai cấp và không còn quận, huyện. Đây là cách chúng tôi hiển thị địa chỉ để bạn không bị lạc.

Từ ngày 01/7/2025, TP.HCM vận hành mô hình chính quyền địa phương hai cấp: thành phố và phường, xã, đặc khu. Cấp quận, huyện không còn, nhiều phường được hợp nhất và mang tên mới. Cùng thời điểm, TP.HCM hợp nhất với Bình Dương và Bà Rịa-Vũng Tàu.

## Địa chỉ trên thẻ dùng tên phường mới
Mỗi điểm trên bản đồ ghi địa chỉ theo tên phường mới, ví dụ: 10-12 Đinh Tiên Hoàng, Phường Sài Gòn. Đây là cách ghi trên giấy tờ hiện hành.

## Khu vực cũ để dễ hình dung
Ngay dưới địa chỉ, thẻ ghi thêm khu vực theo địa giới cũ, ví dụ: Quận 1 cũ. Phần lớn sinh viên và phụ huynh vẫn quen định vị theo quận, nên bộ lọc Khu vực dùng 22 đơn vị cũ gồm 16 quận, 5 huyện và TP. Thủ Đức.

## Vì sao không chỉ dùng tên mới
Một phường mới có thể gồm nhiều phường cũ, và có phường mới mang tên trùng với quận cũ, như Phường Bình Thạnh hay Phường Gò Vấp. Ghi cả hai giúp tránh nhầm lẫn khi bạn tìm đường đến cơ sở thực tập.

## Phạm vi dữ liệu hiện tại
Trong giai đoạn thử nghiệm, Co-Map thu thập dữ liệu trong phạm vi TP.HCM trước ngày 01/7/2025. Các khu vực mới hợp nhất sẽ được bổ sung ở giai đoạn sau.

Nếu bạn thấy một địa chỉ chưa đúng, hãy dùng nút Báo thông tin chưa đúng trên thẻ. Đội ngũ Co-Map sẽ kiểm tra trong vòng 24 giờ làm việc.

---
**Article 5**
- slug: `viet-mo-ta-cong-viec-thuc-tap`
- category: Doanh nghiệp
- date: 13/10/2026
- no image
- Title: **Viết mô tả công việc thực tập để đúng sinh viên tìm đến bạn**
- Excerpt: Sinh viên ngành Giáo dục đọc tin thực tập bằng đề cương của mình. Một mô tả công việc tốt nói cùng ngôn ngữ đó.

Tin tuyển thực tập sinh thường chỉ có vài dòng: vị trí, thời gian, liên hệ. Với sinh viên ngành Giáo dục, như vậy chưa đủ để quyết định, vì các em cần biết công việc có giúp đạt chuẩn đầu ra của học phần hay không.

## Mô tả nhiệm vụ bằng động từ cụ thể
Thay vì “hỗ trợ lớp học”, hãy viết “chuẩn bị học liệu, điểm danh, theo dõi tiến bộ của 12 học viên và gửi nhận xét cho phụ huynh mỗi tuần”. Nhà trường và sinh viên sẽ đối chiếu được ngay với đề cương.

## Ghi rõ lịch và tính chất công việc
Toàn thời gian, bán thời gian hay linh hoạt? Ca nào trong tuần? Ví dụ: Thứ Hai đến Thứ Sáu, 14:00-16:00. Lịch cụ thể giúp sinh viên tự cân nhắc trước khi liên hệ.

## Nói thẳng về phụ cấp
Có phụ cấp thì ghi mức, ví dụ 150.000đ mỗi buổi. Chưa xác định thì ghi Thỏa thuận. Sự rõ ràng này làm tin của bạn đáng tin hơn.

## Cho biết ai hướng dẫn
Học phần thực tập yêu cầu người hướng dẫn tại cơ sở nhận xét và xác nhận. Ghi rõ vai trò người hướng dẫn, ví dụ quản lý học vụ hay giáo viên chủ nhiệm, giúp nhà trường yên tâm gửi sinh viên.

## Đính kèm kế hoạch tiếp nhận
Một trang kế hoạch theo tuần là đủ. Trên Co-Map, tài liệu này hiển thị trong thẻ của cơ sở và được chia sẻ cho nhà trường đã xác thực.

Gói tìm kiếm thực tập sinh phù hợp bao gồm việc cùng bạn chuẩn hóa mô tả công việc theo chuẩn đầu ra của các trường.

---
**Article 6**
- slug: `nha-truong-bat-dau-phoi-hop-tu-dau`
- category: Nhà trường
- date: 06/10/2026
- no image
- Title: **Kiến tập, thực tập, ngày hội việc làm: nhà trường nên bắt đầu phối hợp từ đâu**
- Excerpt: Một kế hoạch phối hợp tốt bắt đầu từ chuẩn đầu ra, không bắt đầu từ danh sách đối tác.

Các khoa đào tạo ngành Giáo dục thường có sẵn một danh sách cơ sở quen. Danh sách đó quý, nhưng dễ dẫn đến việc gửi sinh viên theo thói quen thay vì theo mục tiêu của học phần.

## Bắt đầu từ chuẩn đầu ra
Liệt kê những năng lực mà kiến tập và thực tập cần hình thành, rồi hỏi: loại cơ sở nào tạo điều kiện cho năng lực đó? Một trung tâm kỹ năng sống, một trường mầm non và một công ty học liệu số sẽ phục vụ những chuẩn đầu ra rất khác nhau.

## Chọn hình thức phù hợp với từng năm học
Năm nhất, năm hai có thể bắt đầu bằng tham quan và kiến tập ngắn. Năm ba, năm tư cần thực tập có người hướng dẫn và nhiệm vụ rõ ràng. Ngày hội việc làm hiệu quả nhất khi diễn ra trước kỳ thực tập vài tuần.

## Ký kết để cam kết hai chiều
Lễ ký kết hợp tác không chỉ là nghi thức. Văn bản ký kết nên ghi rõ số sinh viên tiếp nhận mỗi kỳ, người hướng dẫn và cách hai bên trao đổi đánh giá.

## Đánh giá để kỳ sau tốt hơn
Cuối học kỳ, hãy tập hợp nhận xét của cơ sở, báo cáo của sinh viên và kết quả học phần. Đó là dữ liệu để quyết định tiếp tục, điều chỉnh hay tìm thêm đối tác.

Gói thiết kế kế hoạch phối hợp giáo dục của Co-Map đồng hành cùng khoa qua cả bốn việc trên, theo lộ trình mẫu 13 tuần có thể điều chỉnh theo lịch của từng trường.

---

### 3.6 Liên hệ (`/lien-he`)
- Layout desktop: info in cols 1-5 and the form card in cols 7-12. Stacked on mobile, form first.
- H1: `Liên hệ với Co-Map`
- Sub:
  > Đưa đơn vị của bạn lên bản đồ, báo một thông tin chưa đúng hay bàn chuyện hợp tác: chúng tôi đều đọc và trả lời.
- Commitment, with a stamp-style 2px indigo pill border and Phosphor `SealCheck`:
  > Cam kết phản hồi 100% yêu cầu trong vòng 24 giờ làm việc.
- Info rows, rendered from `site.ts`, hidden when null:
  - `Email` (mailto)
  - `Điện thoại` (tel)
  - `Khu vực hoạt động`: `TP.HCM`
  - `Đăng ký tư vấn gói dịch vụ` as a text link to `?form=chon`
- Form card, title `Gửi lời nhắn`. Fields are in Section 5.4.
- FAQ, `id="cau-hoi"`, H2 `Câu hỏi thường gặp`. Use native `<details>`; all items start closed; Phosphor `Plus` rotates 45deg when open.
  1. `Co-Map có thu phí khi tra cứu bản đồ không?` → `Không. Mọi người đều tra cứu bản đồ, xem thẻ thông tin và chỉ đường miễn phí. Phí chỉ áp dụng cho các gói tư vấn chuyên sâu.`
  2. `Làm sao để đưa cơ sở của tôi lên bản đồ?` → `Chọn chủ đề Đưa đơn vị lên bản đồ trong biểu mẫu trên. Co-Map sẽ liên hệ để thu thập thông tin, kiểm tra địa chỉ và mô tả công việc trước khi ghim lên bản đồ.`
  3. `Thông tin trên bản đồ lấy từ đâu?` → `Mỗi thẻ ghi rõ nguồn: Đã xác minh (Co-Map làm việc trực tiếp với đơn vị), Thông tin công khai (từ website và văn bản của trường) hoặc Minh họa (đơn vị giả định trong bản trình diễn).`
  4. `Vì sao địa chỉ ghi phường mới nhưng bộ lọc dùng quận cũ?` → `Địa chỉ theo tên phường mới để đúng giấy tờ hiện hành. Bộ lọc Khu vực dùng quận, huyện cũ vì đó là cách hầu hết mọi người vẫn định vị trong thành phố.`
  5. `CV bảo chứng là gì?` → `Là hồ sơ ứng viên đã được người thẩm định của Co-Map đọc và kiểm chứng qua 5 bước, từ điều kiện tiên quyết đến phân loại Nhóm A, B, C. Doanh nghiệp đăng ký gói để xem chi tiết hồ sơ.`
  6. `Thông tin tôi gửi qua biểu mẫu được dùng thế nào?` → `Chỉ để Co-Map liên hệ tư vấn theo yêu cầu của bạn. Chúng tôi không chia sẻ thông tin này cho bên thứ ba khi chưa có sự đồng ý của bạn.`

### 3.7 404 (P0)
- Centered is allowed here.
- A route line ends in a dashed-outline pin (no fill).
- H1 `Không tìm thấy trang này`
- Body `Có thể đường dẫn đã thay đổi. Bạn thử quay lại bản đồ nhé.`
- Buttons `Mở bản đồ` (primary) and `Về trang chủ` (text).

---

## 4. Map experience

### 4.1 Stack and style (P0)
- `maplibre-gl` v5. Load it only on `/` and `/ban-do` via `next/dynamic` with `ssr: false`. While it loads, show a paper skeleton: an inline SVG outline of TP.HCM at 1px `--line` with `Đang tải bản đồ…` in 14px muted.
- Style: a vendored JSON at `public/map/co-map-style.json`, generated once from `https://tiles.openfreemap.org/styles/positron` by the script `tools/build-map-style.mjs`. The script applies the palette in 4.2, sets every label `text-field` to `["coalesce", ["get","name:vi"], ["get","name"]]`, and keeps the remote OpenFreeMap sources and glyphs (Noto Sans, which covers Vietnamese). Commit the output. The runtime does no style mutation except our own added layers.
- Camera limits: `maxBounds [[106.36, 10.36], [107.03, 11.16]]` (TP.HCM before 07/2025), `minZoom 10`, `maxZoom 18`. Pitch is locked at 0. `dragRotate: false`, `touchPitch: false`, and `touchZoomRotate.disableRotation()`.
- Controls on `/ban-do`:
  - `NavigationControl` with `showCompass: false`, desktop only, bottom right.
  - `ScaleControl` with `unit: "metric"`, bottom left of the map area.
  - `AttributionControl` with `compact: true` (always visible).
- Vietnamese locale:
  - `NavigationControl.ZoomIn`: `Phóng to`
  - `NavigationControl.ZoomOut`: `Thu nhỏ`
  - `AttributionControl.ToggleAttribution`: `Hiện hoặc ẩn nguồn bản đồ`
  - `CooperativeGesturesHandler.WindowsHelpText`: `Giữ Ctrl và cuộn chuột để phóng to bản đồ`
  - `CooperativeGesturesHandler.MacHelpText`: `Giữ ⌘ và cuộn chuột để phóng to bản đồ`
  - `CooperativeGesturesHandler.MobileHelpText`: `Dùng hai ngón tay để di chuyển bản đồ`

### 4.2 Map palette (P0)
| Layer(s) | Paint |
|---|---|
| `background` | `#EFEFF4` |
| `landuse_residential` | `#ECECF2` |
| `park`, `landcover_wood` | `#E2ECCB` |
| `water` | `#D9DBEF` |
| `waterway` | `#C9CCE8` |
| `building` (z≥14) | fill `#E4E4EC`, outline `#D9D9E3` |
| `highway_path`, `highway_minor` | `#FFFFFF` |
| `highway_major_casing`, `highway_motorway_casing` | `#D6D6E2` |
| `highway_major_inner`, `highway_motorway_inner`, `*_subtle` | `#FFFFFF` |
| `boundary_*` | `#9C9CC0`, dashed `[2,2]`, width 1 |
| road and place labels | text `#4A4A6E`, halo `#F5F5F8` width 1.5 |
| water labels | text `#5B5E94`, halo `#D9DBEF` |
| hidden (`visibility: none`) | `highway-shield-*`, `road_shield_us`, `airport`, `aeroway-*`, all `railway*`, `tunnel_railway*`, `label_country_*`, `label_state` |

Custom layer `co-map-campus`: a fill from source `openmaptiles`, source-layer `landuse`, with filter `["in", ["get","class"], ["literal", ["school","university","college","kindergarten","library"]]]`. Fill `#A6CE39` at opacity 0.28, plus an outline line `#8DB52B` at opacity 0.6, width 1, from z≥13. Insert it below the first label layer. This is the "the map highlights where education happens" detail.

**P2 coverage mask:** the old TP.HCM ADM1 polygon from geoBoundaries (gbOpen, VNM ADM1, CC BY 4.0), simplified with mapshaper to ≤60KB at `public/geo/hcm-cu.geojson`. Paint the inverse (world minus HCMC) as paper `#F5F5F8` at opacity 0.88, with a 1px `#3330A8` boundary line at opacity 0.5, dashed `[3,2]`. If the file is missing, skip it silently.

### 4.3 Pins and clusters (P0)
Pins are HTML markers: 36 points, so this is cheap and fully styleable. Each marker is a `<button>` with an `aria-label`.

| Type | Shape | Size | Fill | Glyph | Ring |
|---|---|---|---|---|---|
| Trường đào tạo (`school`) | Squircle, radius 10px | 34px | `#A6CE39` | Phosphor `GraduationCap` fill, 18px, `#1A1946` | 2px `#FFFFFF`, shadow-1 |
| Cơ sở thực tập (`internship`) | Circle | 32px | `#3330A8` | Phosphor `ChalkboardTeacher` fill, 17px, `#FFFFFF` | 2px `#FFFFFF`, shadow-1 |

Shape and color both encode type, so the map works for color-blind users. Lime is green and indigo is "xanh dương", which matches the founders' requirement.

- `aria-label` pattern: `{name}, {Trường đào tạo|Cơ sở thực tập}, {ward}`
- States (transform and opacity only, 160ms):
  - Hover/focus: scale 1.12, with a tooltip above the pin. The tooltip is a white pill, 13px 600, ink text, `short ?? name` truncated to 28 characters.
  - Selected: scale 1.25, plus a static halo (an 8px ring in the type color at 25% opacity). No pulse.
  - Dimmed while another point is selected: opacity 0.35, except related points.
  - Related to the selection: opacity 1.
  - Filtered out: removed from the map.
- Clusters:
  - A GeoJSON source with `cluster: true`, `clusterRadius: 48`, `clusterMaxZoom: 14`, and `clusterProperties` `{schools: ["+", ["case", ["==", ["get","type"], "school"], 1, 0]], sites: ["+", ["case", ["==", ["get","type"], "internship"], 1, 0]]}`.
  - Cluster markers are HTML: a 40/48/56px circle depending on count (<5, <15, ≥15). The ring is an SVG donut, 4px wide, split lime (schools) and indigo (sites). The center is `--surface` with the count in ink, 14px 700, tabular.
  - Clicking a cluster runs `getClusterExpansionZoom` and eases there over 600ms.
  - `aria-label`: `{n} điểm: {s} trường, {k} cơ sở. Nhấn để phóng to.`

### 4.4 Panel layout (P0)
- **Desktop ≥1024px**
  - The map fills `100dvh - 72px`. A left panel 400px wide floats on it: 16px from the left, top and bottom edges, `--surface`, 20px radius, shadow-2. The panel scrolls inside.
  - Stacked from the top:
    - Header (h1 + sub).
    - Search.
    - A row with the quick toggles and the `Bộ lọc` button.
    - Active filter chips, plus the `Xóa tất cả` text button.
    - The `Gần: {label}` chip, if a distance anchor is set.
    - Result count.
    - Grouped list.
    - The legend note.
  - Map padding: `{left: 432, top: 24, right: 24, bottom: 24}`, used for every `fitBounds` and `flyTo`.
- **Mobile <1024px**
  - The map is full screen under the header.
  - A floating search bar sits at the top (12px inset) with a filter icon button (badge = active group count).
  - The bottom sheet has three snap points: peek 132px (handle, `{n} kết quả`, quick toggles), half `50dvh`, full `92dvh`. It is built with Motion `drag="y"` and snaps with a spring.
  - A near-me floating button (`Crosshair`, 48px) sits 16px above the sheet, bottom right.
  - Selecting a point opens its detail in the sheet at half height.
- **Result row**, 72px min height:
  - The type glyph in a mini pin, 24px.
  - Name, 15px 600, 2 lines max.
  - Meta line, 13px muted: `{ward}, {areaLong} cũ`. When an anchor is set, add `· {distance}` right-aligned, tabular.
  - For sites, up to 2 role chips. For schools, up to 2 field chips.
  - Hovering a row triggers the pin's hover state. Clicking selects the point.
  - Within each group, rows are sorted by distance when an anchor is set, otherwise by name with `localeCompare(…, "vi")`.

### 4.5 Search (P0)
- Normalization for both query and index: `toLowerCase()`, then NFD, strip `\p{M}`, `đ` → `d`, and collapse whitespace.
- Indexed text: `name`, `short`, `unit`, `fields`, position titles, `ward`, `area`, `address`.
- Matching: every query token must appear in the item's text.
- Ranking:
  1. Name or short starts with the query.
  2. A word in the name starts with a token.
  3. Match in fields or positions.
  4. Match in address, ward or area.
- Typeahead appears after 1 character. It is a listbox under the field, with up to 4 groups in this order:
  - `Địa điểm` (locations, max 5, with the type glyph). Selecting one selects the point.
  - `Chuyên ngành` (matching field labels). Selecting one adds the `nganh` filter.
  - `Khu vực` (matching old areas). Selecting one adds the `khu-vuc` filter.
  - `Địa chỉ` (Photon results, max 3, shown only when the query has ≥3 characters). Selecting one sets the distance anchor (4.6).
- Keyboard: ↑/↓ moves, Enter picks the highlighted option or, with none highlighted, applies `q` as a text filter on the list. Esc closes.
- The field has an `X` clear button labeled `Xóa tìm kiếm`.
- Documented exception: the search field uses an icon and placeholder with a visually hidden `<label>`, because a visible label above a map search bar is redundant. This is the only input with a placeholder.

### 4.6 Distance anchor and near-me (P0)
The anchor is a point that distances are measured from. It is shown on the map as a 16px ink dot with a 3px white ring and a 13px label pill: `Vị trí của bạn` or the address label.
- **Near me:**
  - Use `navigator.geolocation.getCurrentPosition` with `{enableHighAccuracy: false, timeout: 8000, maximumAge: 300000}`.
  - Never request location on page load. Only request it when the user presses `Dùng vị trí của tôi` (hero, mobile floating button, desktop panel link under search).
  - While waiting, the button shows `Đang xác định vị trí…`.
  - Success inside `maxBounds`: set the anchor, `fitBounds` over the anchor plus the 5 nearest results, and sort the list by distance.
  - Success outside bounds: set the anchor to Hồ Con Rùa `[106.6958, 10.7826]` and show the toast `Bạn đang ở ngoài TP.HCM. Đang hiển thị quanh trung tâm thành phố.`
  - Denied, unavailable or timed out: the same fallback with the toast `Không lấy được vị trí. Đang hiển thị quanh trung tâm TP.HCM.`
- **Address anchor:**
  - `GET /api/geocode?q=` proxies `https://photon.komoot.io/api/?q={q}&limit=5&lat=10.7826&lon=106.6958&bbox=106.36,10.36,107.03,11.16`.
  - Timeout 5s, in-memory cache of 200 entries.
  - The route returns `[{label, lat, lng}]`. The label is built from `name`, `street`, `district` and `city`, joined with `, `.
  - Debounce 350ms. Results outside bounds are dropped.
  - If it fails, the `Địa chỉ` group shows one disabled row: `Chưa tìm được địa chỉ lúc này. Bạn có thể chọn khu vực trong bộ lọc.`
- **Distance:**
  - Haversine.
  - Under 1 km, show meters rounded to 10 (`850 m`).
  - Otherwise show km with one decimal, Vietnamese comma (`2,4 km`), via `Intl.NumberFormat("vi-VN", {maximumFractionDigits: 1})`.
  - Label it straight-line distance in the tooltip only: `Khoảng cách đường chim bay`.
- **Clearing:** the `Gần: {label}` chip has an `X` labeled `Bỏ điểm xuất phát`.

### 4.7 Filters (P0)
The 8 groups, in this order. All are multi-select toggle chips: OR within a group, AND across groups. Changes apply instantly, with no Apply button.

| # | Label | Options (label → slug) | URL key | Applies to |
|---|---|---|---|---|
| 1 | `Loại hình tổ chức` | `Trường đào tạo` → `truong`, `Cơ sở thực tập` → `co-so` | `loai` | both |
| 2 | `Loại hình sở hữu` | `Công lập` → `cong-lap`, `Ngoài công lập` → `ngoai-cong-lap` | `so-huu` | both |
| 3 | `Chuyên ngành` | `Giáo dục học` → `giao-duc-hoc`, `Quản lý giáo dục` → `quan-ly-giao-duc`, `Công nghệ giáo dục` → `cong-nghe-giao-duc`, `Sư phạm` → `su-pham`, `Tâm lý học giáo dục` → `tam-ly-hoc-giao-duc`, `Giáo dục đặc biệt` → `giao-duc-dac-biet` | `nganh` | both |
| 4 | `Vị trí công việc` | the 11 roles in Appendix A.2 | `vi-tri` | sites |
| 5 | `Tính chất công việc` | `Toàn thời gian` → `toan-thoi-gian`, `Bán thời gian` → `ban-thoi-gian`, `Linh hoạt` → `linh-hoat` | `tinh-chat` | sites |
| 6 | `Khu vực (địa giới cũ)` | the 22 `meta.areas` → slug (`quan-1`, `binh-thanh`, `tp-thu-duc`, …) | `khu-vuc` | both |
| 7 | `Phụ cấp` | `Có phụ cấp` → `co-phu-cap`, `Thỏa thuận` → `thoa-thuan` | `phu-cap` | sites |
| 8 | `Quy mô` | `Nhỏ (dưới 50 nhân sự)` → `nho`, `Vừa (50 đến 200 nhân sự)` → `vua`, `Lớn (trên 200 nhân sự)` → `lon` | `quy-mo` | sites |

Rules:
- Groups 4, 5 and 7 are position-level. A site matches only if at least one of its positions satisfies all active position-level groups at once. In the detail card, positions that match are marked with a lime left bar.
- Groups 4, 5, 7 and 8 are site-only. When any of them is active, schools are not filtered by them and still show. Each of these groups carries the note `Áp dụng cho cơ sở thực tập` in 12px muted under its label.
- Every option shows its live count, i.e. the count if this option were toggled given the other active filters. Options with count 0 are disabled (40% opacity, `aria-disabled`) unless they are already selected.
- Khu vực shows all 22 areas so coverage is honest. It has its own small search input (`Tìm khu vực`, with a visible label) and a 2-column checklist.
- The quick toggles in the panel mirror group 1.
- Filter surface:
  - Desktop: a 420ms slide-over that covers the list area inside the panel, with the title `Bộ lọc` and a close `X`.
  - Mobile: a full-screen sheet.
  - Both have a sticky footer with `Xóa bộ lọc` (text) and a primary button `Xem {n} kết quả` that closes the surface.
- Active chip format: `{Option label}` with an `X` labeled `Bỏ lọc {option label}`.

### 4.8 Detail card (P0)
On desktop it replaces the list inside the panel, with a top link `← Danh sách` (Phosphor `CaretLeft`; the arrow in this spec is the icon). On mobile it opens in the sheet. The map `flyTo`s the point at zoom `max(current, 14)` over 1200ms, then draws relations (4.9).

**Header:**
- A 48px type pin.
- Name, H2, 20/26.
- Unit line, `unit` (schools), 14px muted.
- Chips:
  - Source: `Đã xác minh` (indigo-50 with Phosphor `SealCheck`, plus the small stamp `ĐÃ XÁC MINH` next to the name), `Thông tin công khai` (paper with a `Globe` icon), or `Minh họa` (paper, dashed border, `Info` icon).
  - Ownership chip.
  - For sites, a size chip.

**Rows** (label/value, mockup order, label 13px muted above the value 15px):
- School: `Loại hình tổ chức`: `Trường đào tạo` · `Loại hình sở hữu` · `Chuyên ngành` (chips) · `Khu vực`: `{areaLong} cũ` · `Địa chỉ`: `{address}, Phường {ward}, TP.HCM` · `Website`: the domain without the protocol, opened in a new tab with Phosphor `ArrowUpRight`.
- Site: `Loại hình tổ chức`: `Cơ sở thực tập` · `Loại hình sở hữu` · `Chuyên ngành phù hợp` · `Quy mô`: `meta.sizes[size]` · `Khu vực` · `Địa chỉ` · `Điện thoại` · `Email` · `Website`.
  - For `source: demo`, phone and email render as plain text, not `tel:`/`mailto:` links.
  - Null rows are omitted.

**Description:** `description`, 15/24.

**`Vị trí thực tập ({n})`** (sites). Each position is a row:
- Title, 15px 600.
- Chips: workType (Phosphor `Clock`), stipend (Phosphor `Coins`, plus `stipendNote` if present, e.g. `Có phụ cấp · 150.000đ/buổi`).
- `schedule`, if present.
- `{slots} chỗ`, if present.

**`Tài liệu`**, grouped by kind. Group headings by kind:
- `program`: `Chương trình đào tạo`
- `syllabus`: `Đề cương thực tập`
- `plan`: `Kế hoạch thực tập`
- `jd`: `Mô tả công việc`

Each document row has Phosphor `FilePdf`, the title and `CaretRight`. Clicking opens the document dialog:
- Title.
- Line `{kind label} · {owner short ?? name}`.
- Body: `Bản đầy đủ chỉ được chia sẻ cho nhà trường và cơ sở thực tập đã xác thực trên Co-Map.`
- Buttons: `Đăng ký tư vấn` (opens `?form=chon` with context `{tai-lieu: title, diem: id}`) and `Đóng`.

**Relations:**
- School: `Cơ sở thực tập đối tác ({n})` lists sites whose `partners` include this id. Each row shows its distance from the school. If any of them is demo, add the note `Gồm dữ liệu minh họa`. Below it, `Có thể phù hợp` lists up to 5 nearest non-partner sites with a shared field.
- Site: `Trường đối tác ({n})` comes from `partners`. Below it, `Trường cùng chuyên ngành` lists up to 5 nearest non-partner schools with a shared field.
- Clicking a relation row selects that point.

**Primary action** (sites only): `Đăng ký tư vấn`. It opens `?form=sinh-vien` with context `{diem: id}`. The form shows the line `Quan tâm: {name}`.

**Action row** (icon + text buttons):
- `Chỉ đường` opens `https://www.google.com/maps/dir/?api=1&destination={lat},{lng}` in a new tab.
- `Sao chép liên kết` copies the current URL. Toast `Đã sao chép liên kết`, or `Không sao chép được. Hãy sao chép từ thanh địa chỉ.` on failure.
- `Báo thông tin chưa đúng` links to `/lien-he?chu-de=bao-sai&diem={id}`.

**Meta line**, 12px muted: `Nguồn: {meta.source[source]}. Cập nhật {meta.updated dd/mm/yyyy}.`

Closing: Esc, `← Danh sách`, the browser Back button, or clicking empty map. Focus returns to the list row or pin that opened the card.

### 4.9 Relations on the map (P0)
On selection, draw lines from the selected point to every related point:
- **Partner lines:** solid, width 2.5, `line-gradient` from lime `#A6CE39` at the school end to indigo `#3330A8` at the site end. The source needs `lineMetrics: true`.
- **Field-match lines:** the same 5 points as the card's `Có thể phù hợp` / `Trường cùng chuyên ngành` lists. Dashed `[2,2]`, width 1.5, `#55557A` at opacity 0.6.
- **Geometry:** a quadratic Bézier between the two points with the control point offset perpendicular by 18% of the length to the left, sampled to 32 points.
- **Draw animation** (solid lines): over 700ms, animate a `["step", ["line-progress"], …]` gradient that reveals from the selected end. Dashed lines fade in over 300ms after the solids finish.
- After the lines draw, `fitBounds` over the selection and its related points if any of them are out of view (padding as in 4.4, `maxZoom 15`).
- Clearing the selection removes the lines with a 200ms fade.

### 4.10 URL state (P0)
- Keys:
  - Filter keys from 4.7, values comma-separated slugs.
  - `q`: search text.
  - `chon`: location id.
  - `gan`: anchor as `lat,lng`, 5 decimals.
  - `z`: zoom, 2 decimals.
  - `c`: center as `lng,lat`, 5 decimals.
- Example: `/ban-do?loai=co-so&nganh=su-pham&khu-vuc=quan-3,quan-10&chon=hoa-su`
- Filters, `q`, `gan`, `z` and `c` use `history.replaceState`. Camera updates are debounced 300ms after `moveend`.
- `chon` uses `pushState`, so Back closes the card and Forward reopens it.
- On load the URL is the only state source. Unknown values are ignored, and an unknown `chon` shows the toast `Không tìm thấy điểm này trên bản đồ.`
- When `chon` is present on load, it wins over `z`/`c` and the map flies to the point.

### 4.11 States (P0)
| State | Where | Copy | Action |
|---|---|---|---|
| Map loading | map area | `Đang tải bản đồ…` on the outline skeleton | none |
| List loading | panel | 6 static skeleton rows (no shimmer) | none |
| No results (filters) | panel list | Title `Không có điểm nào khớp với bộ lọc`. Body `Thử bỏ bớt một vài lựa chọn hoặc mở rộng khu vực.` | `Xóa bộ lọc`, plus chips `Bỏ lọc: {last added option}` |
| No results (search) | panel list | Title `Không tìm thấy “{q}”`. Body `Kiểm tra chính tả hoặc thử từ ngắn hơn, ví dụ “Sư phạm”.` | `Xóa tìm kiếm` |
| Area with no data | panel list, when the only cause is a 0-count area | Title `Khu vực này chưa có dữ liệu`. Body `Bạn biết một cơ sở giáo dục ở đây? Giới thiệu cho Co-Map để đưa lên bản đồ.` | `Giới thiệu cơ sở`, linking to `/lien-he?chu-de=dua-len-ban-do` |
| Tile or style error | map area | Title `Không tải được bản đồ`. Body `Kiểm tra kết nối mạng rồi thử lại. Danh sách bên cạnh vẫn dùng được.` | `Thử lại` (re-mount) |
| No WebGL | map area | Title `Trình duyệt chưa hỗ trợ bản đồ tương tác`. Body `Bạn vẫn có thể xem và lọc danh sách đầy đủ.` | The list works normally |
| Geolocation | toast | strings in 4.6 | none |
| Copied | toast | `Đã sao chép liên kết` | none |

The empty-state icon is Phosphor `MapTrifold`, 40px, in muted ink, with no illustration. Toasts sit bottom center, `--ink` background with white text, 14px, last 3.2s, and use `role="status"`.

### 4.12 Hero map behavior (W1, P0)
- Same style and pins as `/ban-do`, with `cooperativeGestures: true` and no NavigationControl. Clusters are disabled in the hero (36 pins are fine at these zooms).
- **Intro:**
  - `fitBounds` over all locations, padding 48, `maxZoom 11.6`, with no animation.
  - Once the style loads, pins appear in latitude order, north to south. Each one fades in and drops 8px over 300ms, 40ms apart.
- **Role views:**

| Role | Camera | Overlays | Caption (computed) |
|---|---|---|---|
| `Sinh viên` (default) | `easeTo` center = anchor (Hồ Con Rùa `[106.6958, 10.7826]`, or the user's position), zoom 12.3, 2200ms | A 5 km circle: fill `#A6CE39` at 0.10, 1.5px `#4F6B0E` dashed line. The anchor dot. Sites inside the ring at full opacity, everything else at 0.35. | `{n} cơ sở thực tập trong bán kính 5 km quanh Hồ Con Rùa` (or `quanh vị trí của bạn`). On desktop, the 3 nearest are listed: `{short ?? name}` with the distance right-aligned. |
| `Nhà trường` | `fitBounds` over `ussh-giaoduc` and its partner sites, padding 56, `maxZoom 13`, 2200ms | `ussh-giaoduc` selected. Partner lines drawn (4.9 style). | `{short}: {p} cơ sở thực tập đối tác`, e.g. `ĐH KHXH&NV: 9 cơ sở thực tập đối tác` |
| `Doanh nghiệp` | `fitBounds` over `hipo` and its related schools, same padding and zoom | `hipo` selected. Partner line(s) solid, field-match schools dashed (all field matches, up to 8). | `{short}: {p} trường đối tác, {m} trường cùng chuyên ngành`. Omit the first part when p = 0. |

- Each caption ends with the link `Xem trên bản đồ`:
  - Sinh viên: `/ban-do?gan={anchor}`
  - Nhà trường and Doanh nghiệp: `/ban-do?chon={id}`
- **Auto-cycle:**
  - Sequence: Sinh viên, Nhà trường, Doanh nghiệp, then back to Sinh viên, where it stops. It runs once, no loop.
  - Each role dwells 7s after its camera move ends.
  - The active segment shows a 2px lime progress bar (scaleX 0 to 1, linear over 7s; this is the only linear easing in the system).
  - It pauses while the hero is out of view (IntersectionObserver) or the tab is hidden.
  - It stops for good on any user interaction: segment click, pin click, map drag, or keyboard focus inside the plate.
- **Pin click in the hero:** opens a compact popover over the plate with the name, type chip, distance from the anchor, and `Xem chi tiết` (links to `/ban-do?chon={id}`).
- **Reduced motion:** `jumpTo` instead of eases, no pin drop, no auto-cycle, lines drawn fully. The Sinh viên view is shown.
- **Mobile:** same behavior. The caption shows only the first line, and the nearest-3 list is hidden.

---

## 5. Services and consultation forms

### 5.1 Consult dialog (P0)
- Desktop: a modal 560px wide with 20px radius, a scrim of `--ink` at 40% (no blur), and a 420ms entrance (fade plus 16px rise).
- Mobile: a full-height sheet sliding up.
- Focus is trapped. Esc closes. The `X` is labeled `Đóng`.
- **Role picker** (`?form=chon`):
  - Title `Bạn đăng ký với tư cách nào?`
  - Three large option rows (radio semantics):
    - `Sinh viên`: `Tư vấn chuyên sâu về học phần và nơi thực tập`
    - `Doanh nghiệp, trung tâm`: `Tìm thực tập sinh và mở khóa CV bảo chứng`
    - `Nhà trường, khoa đào tạo`: `Thiết kế kế hoạch phối hợp giáo dục`
  - Choosing one swaps in its form, with a `← Chọn lại` link at the top.
- Validation timing:
  - Validate each field on blur. After a field shows an error, re-validate it on change.
  - On submit, validate everything and focus the first invalid field.
  - Errors appear under the field, 13px `--danger`, with a Phosphor `WarningCircle` icon, linked via `aria-describedby`. The field border turns 1.5px `--danger`.
- Labels sit above inputs, 14px 600. Required fields carry a `*` with `aria-hidden` and the input is marked `aria-required`. The legend line at the top of every form reads `Các mục có dấu * là bắt buộc.`
- Every form also has:
  - A honeypot field named `website`: visually hidden, `tabindex=-1`, `autocomplete=off`.
  - The required consent checkbox `Tôi đồng ý để Co-Map liên hệ tư vấn theo thông tin trên.`, with the error `Vui lòng xác nhận để Co-Map có thể liên hệ.`
  - A hidden `context` object (location id, document, package preselect) and `sourcePage`.

Shared field rules:
- **Phone:** strip spaces, dots and hyphens, then match `^(0|\+84)(3|5|7|8|9)\d{8}$`. Store it normalized to `0xxxxxxxxx`.
  - Empty: `Vui lòng nhập số điện thoại.`
  - Invalid: `Số điện thoại chưa đúng. Ví dụ: 0912 345 678.`
  - Help text: `Co-Map chỉ dùng số này để gọi lại cho bạn.`
- **Text required, empty:** `Vui lòng nhập {tên trường dữ liệu viết thường}.`, e.g. `Vui lòng nhập họ và tên.`
- **Text bounds:** at least 2 characters (`{Nhãn} cần ít nhất 2 ký tự.`), at most 120 characters (`{Nhãn} tối đa 120 ký tự.`).

### 5.2 Form: Sinh viên (`?form=sinh-vien`)
- Title `Đăng ký tư vấn cho sinh viên`
- Intro `Gói tư vấn chuyên sâu. Co-Map gọi lại trong 24 giờ làm việc để hẹn lịch.`
- With context, also show `Quan tâm: {location name}`.

| Field | Type | Required | Notes |
|---|---|---|---|
| `Họ và tên` | text, `autocomplete=name` | yes | |
| `Trường đang theo học` | combobox: the 10 schools (`name`) plus a final option `Trường khác` | yes | Choosing `Trường khác` reveals the text field `Tên trường` (required). Empty error: `Vui lòng chọn trường đang theo học.` |
| `Chuyên ngành` | select: the 6 fields plus `Ngành khác` | yes | `Ngành khác` reveals the text field `Tên ngành` (required). Empty error: `Vui lòng chọn chuyên ngành.` |
| `Số điện thoại` | tel, `inputmode=tel`, `autocomplete=tel` | yes | |
| consent | checkbox | yes | |

- Submit `Gửi đăng ký`.

### 5.3 Form: Doanh nghiệp (`?form=doanh-nghiep`)
- Title `Đăng ký tư vấn cho doanh nghiệp`
- Intro `Co-Map gọi lại trong 24 giờ làm việc để tìm hiểu nhu cầu và báo giá.`

| Field | Type | Required | Notes |
|---|---|---|---|
| `Tên doanh nghiệp hoặc tổ chức` | text, `autocomplete=organization` | yes | |
| `Họ và tên người liên hệ` | text | yes | |
| `Số điện thoại` | tel | yes | |
| `Gói dịch vụ quan tâm` | checkbox group, at least 1: `Gói tìm kiếm thực tập sinh phù hợp` (`tim-thuc-tap-sinh`), `Gói mở khóa CV bảo chứng` (`mo-khoa-cv`) | yes | Error `Vui lòng chọn ít nhất một gói.` Preselected from `context.goi` when opened from a package block. |
| consent | checkbox | yes | |

- Submit `Gửi đăng ký`.

### 5.4 Form: Nhà trường (`?form=nha-truong`)
- Title `Đăng ký tư vấn cho nhà trường`
- Intro `Co-Map gọi lại trong 24 giờ làm việc để trao đổi kế hoạch phối hợp cho học kỳ.`

| Field | Type | Required | Notes |
|---|---|---|---|
| `Tên cơ sở giáo dục` | text with suggestions from the 10 school names (free text allowed) | yes | |
| `Họ và tên người liên hệ` | text | yes | |
| `Chức vụ, đơn vị công tác` | text | yes | Help text `Ví dụ: Giảng viên, Khoa Giáo dục.` |
| `Số điện thoại` | tel | yes | |
| `Nội dung cần tư vấn` | checkbox group, at least 1: `Tổ chức lễ ký kết hợp tác chiến lược giữa nhà trường và doanh nghiệp` (`ky-ket`), `Thiết kế, vận hành và đánh giá chương trình giáo dục (tham quan, kiến tập, ngày hội việc làm...)` (`chuong-trinh`) | yes | Error `Vui lòng chọn ít nhất một nội dung.` |
| consent | checkbox | yes | |

- Submit `Gửi đăng ký`.

**Liên hệ page form** (inline card, not the dialog), title `Gửi lời nhắn`:

| Field | Type | Required | Notes |
|---|---|---|---|
| `Họ và tên` | text | yes | |
| `Số điện thoại` | tel | yes | |
| `Email` | email | no | Invalid error `Email chưa đúng định dạng.` |
| `Chủ đề` | select: `Đưa đơn vị lên bản đồ` (`dua-len-ban-do`), `Báo thông tin chưa đúng` (`bao-sai`), `Hợp tác` (`hop-tac`), `Khác` (`khac`) | yes | Preset from `?chu-de=`. Error `Vui lòng chọn chủ đề.` |
| `Địa điểm liên quan` | read-only chip with `X Bỏ chọn` | no | Shown only when `?diem=` is a known id. Displays the location `name`. |
| `Nội dung` | textarea, 5 rows | yes | 10 to 1000 characters. Errors `Vui lòng nhập nội dung.` / `Nội dung cần ít nhất 10 ký tự.` A live counter `{n}/1000` is shown. |
| consent | checkbox | yes | |

- Submit `Gửi lời nhắn`.

### 5.5 Submit states (P0, all forms)
- **Submitting:**
  - The button is disabled and shows `Đang gửi…` with a 16px inline spinner. This is the one allowed spinner because it is inside a button.
  - Inputs become read-only.
- **Success:** the form body is replaced. A centered success panel shows:
  - The `ĐÃ NHẬN` stamp: indigo 2px border, rotated -6deg, scale 1.2 to 1 over 320ms.
  - Title: `Đã nhận yêu cầu của bạn`
  - Body: `Mã yêu cầu: {code}. Co-Map sẽ gọi lại số {masked phone} trong vòng 24 giờ làm việc.` The masked phone keeps the first 2 and last 3 digits, e.g. `09•• ••• 678`.
  - Buttons: `Đóng`, and `Mở bản đồ` when not already on `/ban-do`.
  - On the Liên hệ page, the panel replaces the card with the same copy, except the title is `Đã nhận lời nhắn của bạn`. Below it is the link `Gửi lời nhắn khác`.
- **Validation error from the server (400):** map the errors onto the fields, same as client-side.
- **Rate limited (429):** banner at the top of the form: `Bạn vừa gửi nhiều yêu cầu liên tiếp. Vui lòng thử lại sau ít phút.`
- **Network or server error:** the same banner position, `Chưa gửi được yêu cầu. Vui lòng kiểm tra kết nối và thử lại.` Inputs keep their values and the button returns to its normal state.
- Drafts persist in React state while the dialog is closed during the same page session. There is no storage.

### 5.6 Where submissions go (P0)
- **Request:** `POST /api/lead` with the Node.js runtime and a JSON body:
  `{type: "sinh-vien"|"doanh-nghiep"|"nha-truong"|"lien-he", fields: {...}, context?: {...}, sourcePage: string, website: string}`.
- **Server:**
  - Re-runs the same validation (shared module `src/lib/lead-schema.ts`).
  - If the honeypot `website` is non-empty, responds `200 {ok: true, code}` and writes nothing.
  - Rate limit, in memory only: 5 requests per IP per 10 minutes, which returns `429`. The IP is never written to disk.
  - Code format `CM-{yyMM}-{nnnn}`, where `nnnn` is the count of existing lines for that `yyMM` plus 1, zero-padded. Example: `CM-2611-0042`.
  - Appends one line to `data/submissions/leads.jsonl` (create the directory with `recursive: true`). This path is already gitignored as personal data.
    `{"id":"CM-2611-0042","type":"sinh-vien","fields":{"hoTen":"…","truong":"hcmue","chuyenNganh":"su-pham","soDienThoai":"0912345678","dongY":true},"context":{"diem":"hoa-su"},"sourcePage":"/ban-do","createdAt":"2026-11-09T08:15:00.000Z"}`
  - Never logs field values to the console.
- **Response:** `200 {ok: true, code}`, or `400 {ok: false, errors: {fieldKey: message}}`, or `429 {ok: false}`, or `500 {ok: false}`.
- **Who reads it:** the founders open `leads.jsonl` directly. Building an admin UI is out of scope.

---

## 6. Design system

### 6.1 Color tokens (P0)
Light theme only. Set `color-scheme: light` and add no dark mode.
```css
@theme {
  --color-paper:      #F5F5F8; /* page background */
  --color-surface:    #FCFCFD; /* cards, panels, dialogs */
  --color-ink:        #1A1946; /* primary text, 15.2:1 on paper */
  --color-ink-muted:  #55557A; /* secondary text, 6.5:1 on paper */
  --color-line:       #DCDCE6; /* hairlines, input borders */
  --color-indigo-50:  #ECECF8;
  --color-indigo-600: #3330A8; /* brand, site pins, links, 9.1:1 on paper */
  --color-indigo-700: #28258A; /* primary button bg, footer, dark bands */
  --color-lime-400:   #A6CE39; /* brand, school pins, highlighter (fills only, never text on light) */
  --color-lime-700:   #4F6B0E; /* lime used as text on light, 5.6:1 */
  --color-danger:     #C23B32; /* errors, 4.9:1 */
  --highlighter:      rgba(166, 206, 57, 0.55);
}
```
- Primary button: `indigo-700` background, white text, 12.2:1.
- Lime-on-dark (footer, S8): lime-400 on indigo-700 is 6.7:1.
- Ink on lime (pins, highlighter) is 9.1:1.
- No gradients anywhere, except the map partner lines.

### 6.2 Typography (P0)
Fonts load via `next/font/google` with `subsets: ["latin", "latin-ext", "vietnamese"]` and `display: "swap"`.
- **Display: Archivo** (variable, axes `wdth`, `wght`). Headings use `font-variation-settings: "wdth" 112`, weight 700 (H1 750), tracking `-0.02em`.
- **Text: Be Vietnam Pro**, weights 400, 500, 600.
- **Numbers:** `font-variant-numeric: tabular-nums` on stats, counts, distances and dates.
- **Diacritics check (acceptance):** render `Bản đồ thực tập ngành Giáo dục, Quận Gò Vấp, Trường ĐH KHXH&NV, Tôi đại diện doanh nghiệp` in every heading size. Stacked marks (ậ, ữ, ẫ, ộ) must not clip or collide. If Archivo's Vietnamese subset fails this, fall back to Be Vietnam Pro 700 for display, without asking.

| Token | Desktop (size/line-height) | Mobile | Font |
|---|---|---|---|
| Display (hero H1) | 64/72 | 36/42 | Archivo 750 |
| H1 (pages) | 48/56 | 32/38 | Archivo 700 |
| H2 | 40/48 | 28/34 | Archivo 700 |
| H3 | 24/30 | 20/26 | Archivo 700 |
| Body L | 18/30 | 17/28 | Be Vietnam Pro 400 |
| Body | 16/26 | 16/26 | Be Vietnam Pro 400 |
| Small | 14/20 | 14/20 | Be Vietnam Pro 400/500 |
| Label | 13/18 | 13/18 | Be Vietnam Pro 600 |

- Line-height is never below 1.12 for any Vietnamese text. Never set `overflow: hidden` on a heading line box.
- Measure: body max 68ch, sub-heads max 46ch.
- **Highlighter:**
  - `mark.hl` gets `background: linear-gradient(transparent 58%, var(--highlighter) 58%, var(--highlighter) 92%, transparent 92%)` with `box-decoration-break: clone`. This is the one permitted gradient, used as a band, not as a color blend.
  - Reveal: a lime `::before` with `transform: scaleX(0→1)`, `transform-origin: left`, 700ms, once.
  - On dark backgrounds the band is lime-400 at full opacity and the highlighted text is ink.

### 6.3 Spacing, radius and shape (P0)
- 4px base scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- Shape rule, documented and enforced everywhere:
  - Interactive controls are full pill: buttons, chips, tabs, toggles, the search field and toasts. This echoes the founders' pill logo.
  - Containers (cards, panels, dialogs, sheets, images) use 20px radius.
  - Form inputs and selects use 12px radius.
  - The double-bezel plates (only the hero map and the W2 matching visual) use a 28px outer and a 22px inner radius.
  - Pins: squircle (10px) for schools and a circle for sites.
- Buttons:
  - Height 48px (40px compact in panels), padding-x 24px.
  - Primary: `indigo-700` background, white text.
  - Secondary: transparent, 1.5px `ink` border, ink text.
  - Text button: ink with an underline on hover.
  - The primary CTA with an arrow nests it in a 32px circle (white at 15% on primary). On hover the circle moves `translateX(3px)`.
  - Press: `scale(0.98)`.
  - Focus: a 3px `--indigo-600` outline at offset 2px on every interactive element.
- Labels stay on one line at every width ≥360px. No label is longer than 4 words, except the role-band rows.

### 6.4 Elevation (P0)
- shadow-1: `0 1px 2px rgba(27,26,75,.06), 0 2px 8px rgba(27,26,75,.06)` for cards, pins and chips on the map.
- shadow-2: `0 12px 32px -8px rgba(27,26,75,.18)` for the map panel, dialogs, popovers and toasts.
- Double bezel: the outer shell is `#E9E9F1` with a `1px rgba(26,25,70,.06)` ring and 6px padding at 28px radius. The inner core is 22px radius with `inset 0 1px 0 rgba(255,255,255,.6)`.

### 6.5 Layout (P0)
- Container 1280px max. Gutters 24px from 768px up, 16px below.
- Breakpoints: 640, 768, 1024, 1280.
- Heroes use `min-h-[100dvh]`-based values. Never `h-screen`.
- No horizontal page scroll at 360px.

### 6.6 Icons (P0)
- `@phosphor-icons/react` only. UI icons use weight `regular` at 20px (16px inline in text). Pins use weight `fill`.
- Mapping: `GraduationCap` (school), `ChalkboardTeacher` (site), `MagnifyingGlass`, `Faders` (filters), `X`, `Crosshair` (near me), `NavigationArrow` (directions), `LinkSimple` (copy link), `Flag` (report), `FilePdf`, `ArrowRight`, `ArrowUpRight`, `CaretLeft`, `CaretRight`, `CaretDown`, `Check`, `SealCheck` (verified, commitment), `Globe` (public), `Info` (demo), `WarningCircle` (errors), `Phone`, `EnvelopeSimple`, `Clock`, `Coins`, `Briefcase`, `LockSimple`, `MapTrifold` (empty), `Tag` (offer), `Plus` (FAQ), `List` (menu).
- Do not hand-draw icons. The logo is the only custom SVG.

### 6.7 Logo (P0)
The mark is the map legend itself: a school (lime squircle) and an internship site (indigo circle) joined by a route.
```svg
<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M12 21 Q12 11 21 11" fill="none" stroke="#1A1946" stroke-width="2.5" stroke-linecap="round"/>
  <rect x="3" y="21" width="18" height="16" rx="6" fill="#A6CE39"/>
  <circle cx="29" cy="11" r="8" fill="#3330A8"/>
  <circle cx="29" cy="11" r="2.75" fill="#FFFFFF"/>
</svg>
```
- **Wordmark:** `Co-Map` in Archivo, `wdth` 112, weight 750, tracking `-0.02em`. "Co" and "Map" are ink `#1A1946`; the hyphen is indigo `#3330A8`. It is rendered as live text next to the SVG mark, not as an SVG `<text>`.
- **Lockup:** mark 32px, gap 10px, wordmark 22px. The whole lockup links to `/` with `aria-label="Co-Map, về trang chủ"`.
- **Reversed** (footer): the arc is lime `#A6CE39`, the circle is white with an indigo `#28258A` dot, the square stays lime, and the wordmark is white.
- **Favicon / app icon:** the mark centered on a 64×64 `#F5F5F8` rounded square (radius 14). Export `src/app/icon.svg` and a 180px `apple-icon.png`.
- **Clear space:** at least the height of the circle (16 units) on every side. Never stretch, recolor or outline it, and never put it on a photo.

### 6.8 Motion (P0)
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` everywhere. Springs only for the bottom sheet (`stiffness 420, damping 40`).
- Durations: 160ms (press, hover), 240ms (popover, tooltip, chip toggle), 420ms (panels, sheets, dialog), 700ms (section reveal, highlighter, line draws), 1200 to 2200ms (map camera).
- Section reveal: fade plus `translateY(16px → 0)`, once, via Motion `whileInView` with `viewport={{once: true, amount: 0.3}}`. List stagger is 40ms.
- Animate only `transform` and `opacity`. Documented exceptions: SVG `pathLength` (stroke draw) for route lines and W2 connectors, and the map line-gradient progress.
- Banned: infinite loops (except the button spinner while submitting), parallax, scroll listeners, marquee, blur-in.
- `prefers-reduced-motion: reduce`: no reveals (content is visible immediately), map `jumpTo`, no auto-cycle, highlighter and stamps shown in their final state.

### 6.9 Stamps (P0)
- Uppercase is allowed only here. Be Vietnam Pro 700, 12px, tracking 0.08em.
- 2px border in the stamp color, radius 6px, padding 4px × 8px, rotated -6deg.
- Three stamps exist, and only three:
  - `ĐÃ XÁC MINH`, indigo. Shown beside the name on `source: verified` detail cards.
  - `NHÓM A`, indigo. Shown on the W3 sample card.
  - `ĐÃ NHẬN`, indigo. Shown on form success.

### 6.10 Imagery (P0)
Exactly four photos. They have been generated, checked and placed in `public/images/` (1280×720 JPG). Serve them with `next/image` (`sizes` set, `placeholder="empty"`, below the fold, lazy).
- No other photos, no stock and no illustrations.
- Each photo has the caption `Ảnh minh họa.`, except the article cover, whose caption lives in the article metadata.
- If the founders later need an image, use `tools/grok-image.sh` with the same prompt skeleton: documentary, 35mm, muted, no people, no text, no logos.

| File | Used in | Crop | Alt |
|---|---|---|---|
| `lop-hoc.jpg` | About A1 | 16:9 | `Một lớp học trống buổi sáng với bàn ghế gỗ, bảng xanh và cửa chớp màu xanh lá` |
| `bai-xe.jpg` | Dịch vụ D2 | 16:9 | `Bãi giữ xe máy của sinh viên dưới hàng cây trong khuôn viên trường` |
| `hanh-lang.jpg` | Dịch vụ D4 | 4:3 (cover) | `Hành lang trường học buổi chiều với cửa lớp màu xanh và nền gạch đỏ` |
| `ban-lam-viec.jpg` | Article 1 cover and Bản tin lead | 16:9 | `Bàn làm việc với tập hồ sơ, bút dạ quang và kính đọc sách` |

Exact prompts (grok-imagine-image, via `tools/grok-image.sh "<prompt>" <out> 1 16:9`):
1. **lop-hoc:** `Documentary photograph of an empty Vietnamese public school classroom in Ho Chi Minh City, early morning. Rows of simple wooden two-seat desks and benches, a dark green chalkboard on the front wall that is wiped clean with no writing, two ceiling fans, pale yellow painted walls, tall windows with green wooden louvered shutters half open, soft natural sunlight casting long window shadows across the tiled floor. No people, no text, no signs, no posters, no logos. Shot on 35mm film, eye level from the back corner of the room, muted natural colors, slight film grain, realistic, not stylized, not illustration.`
2. **hanh-lang:** `Documentary photograph of an empty open-air corridor of a Vietnamese secondary school in Ho Chi Minh City in late afternoon. Long corridor with pale yellow walls, a row of classroom doors painted dark green, green wooden louvered windows, terracotta tiled floor, a white balustrade on the left with tropical trees beyond. Warm low sunlight casting stripes of shadow across the floor. No people, no text, no signs, no logos. Shot on 35mm film, one-point perspective at eye level, muted natural colors, slight film grain, realistic, not stylized.`
3. **bai-xe:** `Documentary photograph of a student motorbike parking area at a Vietnamese university campus in Ho Chi Minh City, early morning. Long tidy rows of parked scooters and motorbikes under a corrugated metal roof, a few helmets resting on the seats, large tamarind trees outside, soft hazy sunlight. No people, no readable text, no license plates visible, no logos, no signs. Shot on 35mm film at eye level, shallow depth of field, muted natural colors, slight film grain, realistic, not stylized.`
4. **ban-lam-viec:** `Overhead documentary photograph of a plain wooden desk seen from directly above. On the desk: a closed pale grey cardboard document folder, a lime green highlighter pen with its cap on, two metal paper clips, a pair of reading glasses, and a white ceramic cup of iced tea with condensation. Soft window daylight from the left, gentle shadows, lots of empty desk space on the right side. No paper with writing, no text, no logos, no hands, no people. Shot on 35mm film, muted natural colors, slight film grain, realistic, not stylized.`

---

## 7. Credibility details (P0 unless noted)
1. **Honest data labels everywhere.**
   - A source chip on every card: `Đã xác minh` / `Thông tin công khai` / `Minh họa`.
   - The footer disclosure.
   - The panel legend note.
   - The S2 caption.
   - The S6 sub (`không phải danh sách đối tác`).
   - Partner lists note when they include demo data.
2. **No fabricated social proof.** No testimonials, partner logos, press mentions or user counts. Year-one numbers appear only under `Mục tiêu năm đầu tiên` with `Đây là mục tiêu, chưa phải kết quả đã đạt.`
3. **Addresses done right.** The new ward on the card, the old area under it, and the filter on old areas with the label `(địa giới cũ)`. Every pin's coordinates match the printed address (Appendix A.3).
4. **A date on everything.** Cards show `Cập nhật dd/mm/yyyy`, articles show their date, and S2 shows the data date.
5. **Real map conventions.** Scale bar, visible OSM/OpenFreeMap attribution, TP.HCM bounds and a legend.
6. **Vietnamese polish.** Correct diacritics, `vi-VN` number formats, `<html lang="vi">`, and no dashes. Use non-breaking spaces between a number and its unit (`2,4&nbsp;km`, `24&nbsp;giờ`) and inside `TP.HCM`-style tokens.
7. **A human in the loop.** CV vetting is done by `Người thẩm định của Co-Map`. The site never claims AI, ATS or automated scoring by Co-Map.
8. **A visible commitment.** `Cam kết phản hồi 100% yêu cầu trong vòng 24 giờ làm việc.` on Liên hệ, plus `24 giờ làm việc` in every form intro and success message.
9. **A real contact path.** Email and phone render only from real values in `site.ts`. Before the demo, the founders must provide the project email and phone (fields 6 and 7 of the application form are empty in `Hồ sơ.txt`).
10. **Privacy.** A consent checkbox on every form, minimal fields, no IP stored, submissions kept in a gitignored folder, and the FAQ answer on data use.
11. **Complete metadata.** Per-page titles and descriptions, `icon.svg`, `apple-icon.png`, and Open Graph tags. The OG image (P1) is a static 1200×630 PNG: paper background, lockup top left, the H1 two lines with the highlighter, built once with `next/og`.

---

## 8. Acceptance criteria

**Global**
1. Every route in 2.1 renders without console errors on the latest Chrome, Safari iOS 17+ and Firefox.
2. `grep -rP "[\x{2013}\x{2014}]" src/content data/locations.json` returns nothing. No en or em dash is visible on any page.
3. No emoji in the DOM. Every icon comes from `@phosphor-icons/react`, except the logo SVG.
4. All UI text is Vietnamese with correct diacritics. `<html lang="vi">`.
5. The diacritics check in 6.2 passes at every heading size, with no clipped marks.
6. Fonts are only Archivo and Be Vietnam Pro, loaded via `next/font` with the `vietnamese` subset.
7. Colors come only from the tokens in 6.1 and the map palette in 4.2. There are no gradients except the highlighter band and the map partner lines.
8. Radii follow the shape rule in 6.3. Spot-check: every button, chip and toast is pill-shaped; every card and dialog is 20px; every input is 12px.
9. No horizontal scroll at 360, 390, 768, 1024, 1280 and 1440px widths.
10. Keyboard only: every interactive element is reachable, has a visible focus ring, and works with Enter/Space. Esc closes dialogs, sheets, menus and the detail card.
11. Text contrast is ≥4.5:1 and UI boundaries ≥3:1, verified with the axe DevTools scan on `/`, `/ban-do` and `/dich-vu` (zero serious or critical issues).
12. With `prefers-reduced-motion: reduce`, nothing animates except the submit spinner, and all content is visible without scrolling triggers.
13. No `window.addEventListener("scroll")` exists in the codebase. Header, tabs and reveals use IntersectionObserver or Motion.
14. Lighthouse mobile on `/` (production build, local): Performance ≥85, Accessibility ≥95, Best Practices ≥95, SEO ≥95. LCP is the H1 and is <2.5s. CLS is <0.05. MapLibre is not in the initial JS bundle of any route other than `/` and `/ban-do`.
15. Lighthouse mobile on `/ve-chung-toi`, `/dich-vu` and `/ban-tin`: Performance ≥90.

**Header and footer**
16. At 1024px the nav (5 links plus CTA) fits on one line. Below 1024px the menu opens full-screen, staggers its links, traps focus and closes on Esc.
17. The active route shows the lime underline and `aria-current="page"`.
18. The header gains its solid background and hairline after scrolling, without a scroll listener.
19. The footer shows the demo-data disclosure and OpenFreeMap/OpenStreetMap attribution. Contact rows are hidden when their values are null.

**Home**
20. The hero shows H1, sub and two buttons, and the H1 is exactly 2 lines at 1280px and at 390px (with `Bản đồ thực tập` on line 1).
21. The highlighter sweeps under "ngành Giáo dục" once on load.
22. The hero map loads, pins drop north to south, and the view eases to Sinh viên with the 5 km ring and the caption `12 cơ sở thực tập trong bán kính 5 km quanh Hồ Con Rùa` (the number is computed: changing the data changes it).
23. The auto-cycle runs Sinh viên, Nhà trường, Doanh nghiệp, Sinh viên, then stops. It pauses off-screen and stops permanently on any interaction.
24. The Nhà trường view shows 9 partner lines from ĐH KHXH&NV that draw with the lime-to-indigo gradient. The caption reads `ĐH KHXH&NV: 9 cơ sở thực tập đối tác`.
25. The Doanh nghiệp view shows HiPO with 1 solid line and dashed lines to the other field-matched schools. The caption is computed accordingly.
26. `Dùng vị trí của tôi` asks for geolocation only on click. Denied and outside-HCMC cases fall back to Hồ Con Rùa with the exact toasts from 4.6.
27. In the hero on desktop, scrolling the page over the map does not zoom it (cooperative gestures message shown). On mobile, one finger scrolls the page.
28. S2 numbers equal `stats` from `src/lib/locations.ts`.
29. S3 has no "Bước" labels and no equal cards. The route line draws on reveal.
30. S4 (W2) draws 6 connector lines on reveal. Hovering or focusing an item highlights its links. On mobile, CĐR chips replace the lines. The `Ví dụ minh họa` eyebrow and the small print are present.
31. The S5 bento has 4 unequal cells per the grid table, each linking to the right `/dich-vu` anchor. The 50% offer band is present.
32. S6 lists all 10 schools, each linking to `/ban-do?chon={id}`, which opens that school's card.
33. S7 shows the 3 newest articles in date order.
34. Each S8 role row opens the matching form.

**Map page**
35. The map is limited to TP.HCM bounds and cannot pan outside them. Pitch and rotation are disabled.
36. Campus landuse polygons are lime-tinted at z≥13 (verify near ĐH Sư phạm TP.HCM, 280 An Dương Vương).
37. Shields, railways, airport and country/state labels are hidden. Labels use Vietnamese names.
38. Schools are lime squircles with a graduation cap, sites are indigo circles. Clusters show a lime/indigo split donut with the count, and clicking one zooms in.
39. Hovering a pin or a list row shows the tooltip and links the two states. Selecting scales the pin and dims unrelated pins to 35%.
40. Search `su pham` returns Sư phạm results. `thu duc` returns locations in TP. Thủ Đức. `hipo` selects HiPO from the typeahead.
41. The typeahead shows the groups Địa điểm / Chuyên ngành / Khu vực / Địa chỉ. Picking an address sets the anchor, shows `Gần: {label}`, and sorts each list group by distance with `x,x km`.
42. All 8 filter groups exist with the labels and options from 4.7. Counts update live. Zero-count options are disabled. Khu vực lists all 22 areas with search.
43. Picking `Vị trí công việc: Trợ giảng` plus `Phụ cấp: Thỏa thuận` returns only sites with one position matching both. Schools still show, with the note `Áp dụng cho cơ sở thực tập`.
44. Active chips can each be removed. `Xóa tất cả` and `Xóa bộ lọc` reset everything.
45. Every filter, the search, the anchor, the camera and the selection are reflected in the URL. Reloading restores the exact state. Back closes an open card.
46. A school card shows the mockup rows in order, documents grouped by kind, the partner sites with distances, `Có thể phù hợp`, the actions and the source/date line.
47. A site card shows the mockup rows, positions with type/stipend/schedule/slots, documents, partner schools, the `Đăng ký tư vấn` button with context, and the actions. Demo phones are not links.
48. Selecting a point draws its partner and field-match lines on the map, matching the card's lists.
49. `Chỉ đường` opens Google Maps directions to the point's coordinates. `Sao chép liên kết` copies a URL that reopens the same card. `Báo thông tin chưa đúng` opens Liên hệ with the subject and location prefilled.
50. Clicking a document opens the document dialog with the exact copy. Its button opens the consult dialog.
51. Every state in 4.11 is reachable and uses the exact copy (test the tile error by blocking `tiles.openfreemap.org`).
52. Mobile (390×844): the bottom sheet snaps to peek, half and full; the filter sheet is full screen with a sticky `Xem {n} kết quả`; the near-me button sits above the sheet; the detail card opens in the sheet at half height.
53. Pins and list rows are 44×44px or larger on touch devices.

**Dịch vụ, forms and API**
54. The three audience sections use different layouts (split, two blocks + W3, reversed split with timeline). The tab bar tracks the visible section.
55. W3 (P1): scrolling the 5 steps stamps the card row by row and ends with `NHÓM A`. The card contains no real personal data in the DOM.
56. `Đăng ký tư vấn` opens the correct form from every location in this spec. `?form=` deep links work on every route, and closing the dialog removes the param.
57. Each form has exactly the fields in 5.2 to 5.4, labels above inputs, `*` marks, and help text where specified.
58. Validation messages match 5.1 to 5.4 word for word. The phone accepts `0912 345 678`, `0912.345.678` and `+84912345678`, and rejects `0212345678` and `091234567`.
59. Checkbox groups require at least one option. `Trường khác` and `Ngành khác` reveal their required text fields.
60. A valid submit shows `Đang gửi…`, then the success panel with the `ĐÃ NHẬN` stamp, a code matching `CM-\d{4}-\d{4}` and the masked phone.
61. Each submission appends exactly one valid JSON line to `data/submissions/leads.jsonl` with `id, type, fields, context, sourcePage, createdAt`. `git status` never shows that file.
62. A filled honeypot returns success and writes nothing. The 6th submission from one client within 10 minutes returns the 429 banner. With the API stopped, the network-error banner appears and inputs are kept.
63. The Liên hệ form preselects `Báo thông tin chưa đúng` and shows the location chip when opened from a map card.

**About, Bản tin, 404**
64. Về chúng tôi shows Tầm nhìn, the 4 Sứ mệnh rows, 2 values, the community-mapping section with the 3 source definitions, the targets with the target disclaimer, and the team from `team.ts` (only Phạm Thị Hà Chi until the founders add more).
65. Bản tin lists 6 articles newest first. Category chips filter via `?muc=`. An empty category shows the empty state. Each article page shows its breadcrumb, meta line, body with H2s, copy-link and 2 related articles.
66. Article 1 shows `ban-lam-viec.jpg` as its cover. No other article has an image.
67. An unknown URL shows the 404 page with both buttons.

**Images**
68. Only the four images in 6.10 appear, each with its alt text and the `Ảnh minh họa.` caption where specified. None of them shows people or readable text.

---

## 9. Out of scope (v1 demo)
- User accounts, login, roles, and any "đơn vị đã xác thực" access control. Documents are never downloadable.
- Real CV upload, storage, unlocking or payment. The CV bảo chứng card is a static sample.
- An admin dashboard or CMS. Content lives in `src/content/*.ts` and submissions in `leads.jsonl`.
- Email, SMS or Zalo notifications on submit.
- Routing, travel time or public-transport directions. Distances are straight-line; directions hand off to Google Maps.
- Coverage of the areas merged on 01/07/2025 (former Bình Dương and Bà Rịa-Vũng Tàu).
- Dark mode, an English version, PWA/offline, analytics and cookie banners.
- Multi-campus modeling. Each location is one campus. Ngành Giáo dục học of Trường ĐH KHXH&NV is represented by its Đinh Tiên Hoàng location only.
- User-submitted map edits applied directly. All additions go through the Liên hệ form and the team.
- Pricing tables. Pricing is `Báo giá theo nhu cầu`.
- 3D buildings, terrain, satellite imagery, and any paid tile, geocoding or map API.

---

## Appendix A. Data changes needed in `data/locations.json`
The current dataset (36 locations, 55 positions, 115 slots, 50 partner links, 14 areas) is accepted. Composition stays as is. Required changes:

**A.1 Remove every en and em dash (required, P0).** This affects at least `ussh-giaoduc, hcmute, nce, hiu, hipo, haidang-ielts, la-me-school, buoc-nho, to-mo-steam, vo-mo` and `meta.sizes`.
- Ranges become an unspaced hyphen: `10–12 Đinh Tiên Hoàng` → `10-12 Đinh Tiên Hoàng`, `khóa 2021–2022` → `khóa 2021-2022`, `14:00–16:00` → `14:00-16:00`, `6–12 tuổi` → `6-12 tuổi`.
- Day ranges use words: `Thứ Hai – Thứ Sáu` → `Thứ Hai đến Thứ Sáu`.
- Title separators become a colon: `Mô tả công việc – Giáo viên dạy Bơi lội` → `Mô tả công việc: Giáo viên dạy Bơi lội`, `Kế hoạch Thực tập 2 năm 2025 – ngành Giáo dục học` → `Kế hoạch Thực tập 2 năm 2025, ngành Giáo dục học`, `Chương trình đào tạo cử nhân Giáo dục học – khóa 2021–2022` → `Chương trình đào tạo cử nhân Giáo dục học, khóa 2021-2022`.
- In names and positions, use `và` or a colon: `Trường Tiểu học – THCS Tư thục Lá Me` → `Trường Tiểu học và THCS Tư thục Lá Me`, `Hành chính – Điều phối lịch tham vấn` → `Hành chính: điều phối lịch tham vấn`, `Thực tập sinh Nhân sự – Đào tạo` → `Thực tập sinh Nhân sự và Đào tạo`, `Trợ giảng Toán – Ngữ văn THCS` → `Trợ giảng Toán và Ngữ văn THCS`, `Hỗ trợ thư viện – thiết bị dạy học` → `Hỗ trợ thư viện và thiết bị dạy học`.
- `meta.sizes.medium` → `Vừa (50 đến 200 nhân sự)`.

**A.2 Add `roles: RoleKey[]` to every position (required, P0).** This powers the `Vị trí công việc` filter (the founders' 11 roles). Add the type to `src/lib/locations.ts`.

| RoleKey | Label (filter) | Positions to tag |
|---|---|---|
| `giao-vien-ky-nang-song` | `Giáo viên dạy Kỹ năng sống` | Giáo viên dạy Kỹ năng sống |
| `giao-vien` | `Giáo viên` | Giáo viên mầm non (thực tập), Giáo viên dạy Bơi lội, Giáo viên Tiếng Anh, Giáo viên can thiệp cá nhân (thực tập), Giáo viên Toán tư duy (thực tập), Giáo sinh thực tập sư phạm, Giáo viên bộ môn (thực tập) |
| `giao-vien-steam` | `Giáo viên dạy STEAM/STEM` | Giáo viên STEM (thực tập), Trợ giảng STEAM, Trợ giảng Robotics |
| `giao-vu` | `Giáo vụ` | Thực tập sinh Giáo vụ, Hỗ trợ thư viện và thiết bị dạy học |
| `tro-giang` | `Trợ giảng` | every title starting with `Trợ giảng` (including STEAM and Robotics, which carry both roles) |
| `chuyen-vien-dao-tao` | `Chuyên viên đào tạo` | Chuyên viên đào tạo (thực tập), Thực tập sinh Chuyên viên đào tạo, Thực tập sinh Nhân sự và Đào tạo, Thực tập sinh Thiết kế học liệu số, Thực tập sinh Thiết kế bài giảng e-learning, Kiểm định nội dung học liệu, Điều phối chương trình đọc |
| `tu-van-tam-ly` | `Tư vấn tâm lý` | Thực tập sinh Tham vấn tâm lý học đường, Thực tập sinh Tham vấn tâm lý, Tư vấn hướng nghiệp (thực tập) |
| `hanh-chinh` | `Hành chính` | Hành chính: điều phối lịch tham vấn, Hành chính: chăm sóc phụ huynh, Hành chính: văn thư, Điều phối dự án cộng đồng, Điều phối chương trình học bổng |
| `marketing` | `Marketing` | Thực tập sinh Marketing nội dung giáo dục, Thực tập sinh Marketing tuyển sinh, Thực tập sinh Truyền thông |
| `nhan-su` | `Nhân sự` | Thực tập sinh Nhân sự và Đào tạo |
| `tu-van-tuyen-sinh` | `Tư vấn tuyển sinh` | Tư vấn tuyển sinh, Thực tập sinh Marketing tuyển sinh |

**A.3 Keep these invariants (check only, no change expected).**
- Every `lat,lng` matches its printed `address` and `ward`. `ussh-giaoduc` must stay at 10-12 Đinh Tiên Hoàng (10.7860, 106.7031), which resolves the old mockup's Q1-address/Thủ Đức-pin mismatch.
- `area` values are always one of `meta.areas`.
- `stipendNote` uses the format `150.000đ/buổi` or `3.000.000đ/tháng`.
- Demo phones keep the invalid `028 0xxx` prefix and demo emails stay `@*.example`.

**A.4 Loader tweaks in `src/lib/locations.ts` (required).**
- `fullAddress()` returns `{address}, Phường {ward}, TP.HCM`. Ward values that already start with `Xã` are left unprefixed.
- Add `areaLong(area)`: values starting with `Quận ` or `TP. ` are returned as-is; `Bình Chánh`, `Cần Giờ`, `Củ Chi`, `Hóc Môn` and `Nhà Bè` get the prefix `Huyện `; everything else gets the prefix `Quận `.

**A.5 Optional (P2).** Add 3 demo sites in Quận 12, Bình Chánh and Nhà Bè so the outer city is not empty. Use the same rules as the existing demo data.

## Appendix B. Content files
| File | Holds |
|---|---|
| `src/content/site.ts` | nav, footer, meta strings, `contact: {email: string \| null, phone: string \| null}` (null until the founders provide them), toasts |
| `src/content/home.ts` | S1 to S8 copy, W2 items and links |
| `src/content/about.ts` | A1 to A8 copy |
| `src/content/team.ts` | team entries |
| `src/content/services.ts` | D1 to D5 copy, W3 steps and sample card |
| `src/content/forms.ts` | role picker, 4 forms, all labels, help text, errors and states |
| `src/content/map.ts` | panel copy, filter group labels, state copy, MapLibre locale |
| `src/content/taxonomy.ts` | slug maps (fields, roles, work types, stipends, sizes, areas, ownership, types), `schoolMono` |
| `src/content/news.ts` | 6 articles, categories |
| `src/content/faq.ts` | 6 FAQ items |

`schoolMono`: `ussh-giaoduc: "NV"`, `hcmue: "SP"`, `sgu: "SG"`, `hcmute: "KT"`, `upes: "TT"`, `nce: "CĐ"`, `vlu: "VL"`, `hutech: "HU"`, `nttu: "NT"`, `hiu: "HB"`.
