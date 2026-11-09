/**
 * Dịch vụ (spec 3.4, D1 to D5 and W3), visual-first edit (founder directive, spec 0).
 * Each package shows: audience chip, title, a visual of what you get, promo chip, CTA.
 * The full sentences live in `more` and open behind "Xem chi tiết".
 */

export const services = {
  metaTitle: "Dịch vụ",
  metaDescription:
    "Tra cứu bản đồ cộng đồng miễn phí. Khi cần đi sâu hơn, Co-Map có gói tư vấn riêng cho sinh viên, doanh nghiệp và nhà trường.",

  intro: {
    h1Before: "Đồng hành trọn một ",
    h1Highlight: "mùa thực tập",
    h1After: ".",
    /** The support line, shown as two chips (icon carries "tra cứu", sr text the rest). */
    free: "Bản đồ miễn phí",
    freeSr: "Tra cứu bản đồ cộng đồng: ",
    offer: "Tháng đầu giảm 50%",
    offerSr: " phí dịch vụ",
    tabsLabel: "Các nhóm dịch vụ",
    tabs: [
      { id: "sinh-vien", label: "Sinh viên" },
      { id: "doanh-nghiep", label: "Doanh nghiệp" },
      { id: "nha-truong", label: "Nhà trường" },
    ],
  },

  /** Button label (3 words max, spec 0). The header keeps its own wording. */
  cta: "Nhận tư vấn",
  more: "Xem chi tiết",
  promo: "Giảm 50%",
  promoSr: " phí dịch vụ tháng đầu",

  student: {
    id: "sinh-vien",
    chip: "Sinh viên",
    title: "Gói tư vấn chuyên sâu",
    stepsLabel: "Bạn nhận được",
    steps: [
      { icon: "chat", label: "Tư vấn 1-1" },
      { icon: "book", label: "Chuẩn đầu ra" },
      { icon: "pin", label: "Cơ sở gần bạn" },
      { icon: "doc", label: "Bản định hướng" },
    ],
    more: {
      body: "Phân tích chi tiết học phần thực tập của bạn, định hướng lĩnh vực trong ngành Giáo dục và gợi ý những cơ sở thực tập phù hợp với năng lực.",
      getTitle: "Bạn nhận được",
      get: [
        "Một buổi tư vấn 1-1 trong 60 phút, trực tiếp hoặc trực tuyến.",
        "Cùng đọc đề cương thực tập và những chuẩn đầu ra bạn cần đạt.",
        "Danh sách cơ sở phù hợp trên bản đồ, kèm khoảng cách từ nơi bạn ở.",
        "Bản tóm tắt định hướng bằng văn bản sau buổi tư vấn.",
      ],
      forTitle: "Dành cho",
      for: "Sinh viên năm hai đến năm tư các ngành Giáo dục học, Quản lý giáo dục, Công nghệ giáo dục, Sư phạm, Tâm lý học giáo dục và Giáo dục đặc biệt.",
    },
    image: {
      src: "/images/bai-xe.jpg",
      alt: "Bãi giữ xe máy của sinh viên dưới hàng cây trong khuôn viên trường",
    },
  },

  business: {
    id: "doanh-nghiep",
    chip: "Doanh nghiệp",
    packages: [
      {
        key: "tim-thuc-tap-sinh",
        title: "Gói tìm thực tập sinh",
        fullTitle: "Gói tìm kiếm thực tập sinh phù hợp",
        text: "Hỗ trợ lọc và tìm thực tập sinh theo đúng yêu cầu: chuyên ngành, vị trí, lịch làm việc và khu vực.",
        list: [
          "Chuẩn hóa mô tả công việc theo chuẩn đầu ra của các trường.",
          "Ghim cơ sở của bạn lên bản đồ cộng đồng.",
          "Danh sách sinh viên phù hợp, ưu tiên người ở gần.",
        ],
      },
      {
        key: "mo-khoa-cv",
        title: "Gói mở khóa CV",
        fullTitle: "Gói mở khóa CV bảo chứng",
        text: "Cấp quyền xem chi tiết các hồ sơ ứng viên đã qua kiểm định chất lượng của Co-Map.",
        list: [
          "Hồ sơ được thẩm định qua 5 bước trước khi mở khóa.",
          "Phân loại rõ Nhóm A, B, C cho từng vị trí.",
          "Thông tin liên hệ chỉ hiển thị sau khi doanh nghiệp đăng ký gói.",
        ],
      },
    ],
    /** Package A visual: filters narrow the map to the students nearby. */
    match: {
      filters: ["Ngành", "Vị trí", "Lịch", "Khu vực"],
      ring: "5 km",
      label:
        "Minh họa cách lọc: chọn chuyên ngành, vị trí, lịch làm việc và khu vực; chỉ còn những sinh viên phù hợp trong bán kính 5 km quanh cơ sở của bạn.",
    },
  },

  /** W3: how a CV gets vouched for, now the package B card. */
  vetting: {
    title: "Một CV được bảo chứng như thế nào",
    sub: "Người thẩm định của Co-Map đọc hồ sơ theo đúng cách nhà tuyển dụng giáo dục đọc, và ghi lại kết quả ở từng bước.",
    steps: [
      {
        title: "Điều kiện tiên quyết",
        /** The card row shows `short`; `title` opens with the explanation. */
        short: "Điều kiện",
        text: "Kiểm tra bằng cấp và chứng chỉ bắt buộc theo vị trí, như chứng chỉ tiếng Anh với vị trí trợ giảng ngoại ngữ.",
      },
      {
        title: "Nền tảng",
        text: "Xem đơn vị đào tạo, kinh nghiệm đứng lớp thực tế và các hoạt động bổ trợ như ngoại khóa, nghiên cứu, dự án cộng đồng.",
      },
      {
        title: "Sự phù hợp",
        text: "Đọc mục tiêu nghề nghiệp để thấy sự cam kết với nghề, phương pháp giảng dạy và kỹ năng mềm: kiên nhẫn, quản lý lớp học, làm việc với phụ huynh.",
      },
      {
        title: "Kiểm chứng",
        text: "Làm rõ khoảng trống thời gian, tần suất đổi công việc và đối chiếu chứng chỉ với đơn vị cấp.",
      },
      {
        title: "Phân loại",
        text: "Nhóm A mời phỏng vấn hoặc dạy thử, Nhóm B lưu hồ sơ dự phòng, Nhóm C chưa phù hợp với vị trí.",
      },
    ],
    card: {
      chip: "Mẫu",
      chipSr: ", hồ sơ minh họa, không phải ứng viên thật",
      title: "GDH-0427",
      line: "Ứng viên GDH-0427, Giáo dục học, năm 3",
      redacted: ["Họ và tên", "Số điện thoại", "Email"],
      redactedNote: "đã ẩn, mở khóa khi doanh nghiệp đăng ký gói",
      rowDone: "Đạt",
      stamp: "Nhóm A",
      reviewer: "Người thẩm định: Chuyên viên Co-Map",
    },
  },

  school: {
    id: "nha-truong",
    chip: "Nhà trường",
    title: "Gói phối hợp giáo dục",
    more: {
      title: "Gói thiết kế kế hoạch phối hợp giáo dục",
      body: "Tổ chức ký kết đối tác, vận hành các chuyến kiến tập tại cơ sở và đánh giá chương trình giáo dục, trong một kế hoạch thống nhất cho cả học kỳ.",
      timelineLabel: "Lộ trình mẫu, điều chỉnh theo lịch của từng trường",
    },
    image: {
      src: "/images/hanh-lang.jpg",
      alt: "Hành lang trường học buổi chiều với cửa lớp màu xanh và nền gạch đỏ",
    },
    timelineLabel: "Lộ trình mẫu",
    weeks: "13 tuần",
    totalWeeks: 13,
    timeline: [
      { from: 1, to: 2, label: "Khảo sát", when: "Tuần 1-2", text: "Khảo sát chuẩn đầu ra học phần thực tập và nhu cầu của khoa." },
      { from: 3, to: 3, label: "Ghép nối", when: "Tuần 3", text: "Ghép nối với cơ sở thực tập phù hợp trên bản đồ." },
      { from: 4, to: 4, label: "Ký kết", when: "Tuần 4", text: "Tổ chức lễ ký kết hợp tác giữa nhà trường và cơ sở." },
      { from: 5, to: 12, label: "Kiến tập", when: "Tuần 5-12", text: "Vận hành kiến tập, thực tập, tham quan và ngày hội việc làm." },
      { from: 13, to: 13, label: "Đánh giá", when: "Tuần 13", text: "Đánh giá chương trình và báo cáo kết quả cho khoa." },
    ],
  },

  closing: {
    line: "Chưa chắc gói nào phù hợp?",
    sub: "Báo giá theo nhu cầu.",
  },
};
