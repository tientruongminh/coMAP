/**
 * Về chúng tôi (spec 3.2, A1 to A8), visual-first edit (founder directive, spec 0):
 * one headline and at most one support line per screen. Every sentence that left
 * the screen is kept here, either as a disclosure (`more`) or as the accessible
 * description (`sr`) of the diagram that now carries it.
 */

export const about = {
  metaTitle: "Về chúng tôi",
  metaDescription:
    "Co-Map là dự án khởi nghiệp của sinh viên ngành Giáo dục học, Trường ĐH KHXH&NV, ĐHQG-HCM: bản đồ cộng đồng và dữ liệu thực tập ngành Giáo dục tại TP.HCM.",

  intro: {
    /** H1 split around the highlighted words. */
    h1Before: "Từ giảng đường đến ",
    h1Highlight: "lớp học thật",
    h1After: ".",
    sub: "Dự án khởi nghiệp của sinh viên Giáo dục học, Trường ĐH KHXH&NV, ĐHQG-HCM.",
    image: {
      src: "/images/lop-hoc.jpg",
      alt: "Một lớp học trống buổi sáng với bàn ghế gỗ, bảng xanh và cửa chớp màu xanh lá",
    },
    from: "Giảng đường",
    to: "Lớp học thật",
    routeLabel: "Một tuyến đường nối giảng đường với một lớp học thật, như trên bản đồ Co-Map.",
  },

  vision: {
    title: "Tầm nhìn",
    before: "Hệ sinh thái dữ liệu thực tập ",
    highlight: "hàng đầu",
    after: " ngành Giáo dục.",
    left: "Đào tạo hàn lâm",
    right: "Nhu cầu thực tiễn",
    sr: "Trở thành hệ sinh thái bản đồ cộng đồng và dữ liệu thực tập hàng đầu của lĩnh vực Giáo dục, góp phần thu hẹp khoảng cách giữa chất lượng đào tạo hàn lâm của các trường đại học và nhu cầu thực tiễn của thị trường lao động. Sơ đồ: các tuyến nối hai bên lại với nhau.",
  },

  mission: {
    title: "Sứ mệnh",
    line: "Kết nối nguồn lực cho cả bốn bên.",
    hubLabel: "Co-Map ở trung tâm, nối với bốn bên",
    rows: [
      {
        key: "xa-hoi",
        label: "Xã hội",
        gain: "Nguồn lực chung",
        text: "Huy động và kết nối nguồn lực sẵn có của cộng đồng, nhà trường và doanh nghiệp, từ cơ sở vật chất, tri thức đến con người, để thúc đẩy xã hội hóa giáo dục và xây dựng một mạng lưới gắn kết, bền vững.",
      },
      {
        key: "nha-truong",
        label: "Nhà trường",
        gain: "Chuẩn đầu ra",
        text: "Hỗ trợ quản lý chương trình đào tạo và chuẩn đầu ra của học phần thực tập, đồng thời mở rộng mạng lưới cơ sở thực tập uy tín cho sinh viên.",
      },
      {
        key: "doanh-nghiep",
        label: "Doanh nghiệp",
        gain: "CV bảo chứng",
        text: "Cung cấp nguồn thực tập sinh đã được thẩm định chuyên môn, giúp tiết kiệm chi phí tuyển dụng và thời gian đào tạo lại.",
      },
      {
        key: "sinh-vien",
        label: "Sinh viên",
        gain: "Lộ trình rõ",
        text: "Vạch rõ lộ trình từ học phần đến thực tập, giúp tiếp cận những cơ hội uy tín và phù hợp với năng lực.",
      },
    ],
  },

  values: {
    title: "Giá trị cốt lõi",
    more: "Xem chi tiết",
    fit: {
      title: "Phối hợp",
      nodes: { school: "Nhà trường", student: "Sinh viên", employer: "Nơi tuyển dụng" },
      matchLabel: "Tương thích",
      text: "Bản đồ trực tuyến cho thấy toàn bộ mạng lưới đối tác theo khu vực, để mỗi bên tìm được nguồn lực phù hợp nhanh hơn. Mỗi kết nối hướng tới sự tương thích giữa thế mạnh của cơ sở đào tạo, năng lực thực tế của sinh viên và yêu cầu của nơi tuyển dụng.",
    },
    accuracy: {
      title: "Chính xác",
      checks: ["Chương trình", "Chuẩn đầu ra", "Tin tuyển dụng"],
      checkedLabel: "đã kiểm duyệt",
      stamp: "Đã xác minh",
      updated: "Cập nhật",
      text: "Chương trình đào tạo, chuẩn đầu ra và mô tả công việc được cập nhật liên tục và kiểm duyệt trước khi lên bản đồ. Mỗi điểm ghi rõ nguồn dữ liệu và ngày cập nhật.",
    },
  },

  community: {
    title: "Vì sao là bản đồ cộng đồng?",
    sub: "Người trong cuộc cùng vẽ.",
    contributors: ["Nhà trường", "Cơ sở", "Sinh viên"],
    check: "Co-Map kiểm tra",
    publish: "Lên bản đồ",
    /** Accessible name of the flow diagram. */
    sr: "Sơ đồ: nhà trường, cơ sở thực tập và sinh viên gửi dữ liệu; Co-Map kiểm tra rồi mới đưa lên bản đồ.",
    /** The full answer, behind "Xem chi tiết". */
    detail:
      "Bản đồ cộng đồng là một phương pháp quen thuộc trong khoa học xã hội: chính những người trong cuộc cùng ghi lại nguồn lực của nơi mình sống và làm việc. Co-Map áp dụng phương pháp đó cho thực tập ngành Giáo dục. Nhà trường, cơ sở thực tập và sinh viên cùng bổ sung dữ liệu; đội ngũ Co-Map kiểm tra trước khi công bố.",
    sourcesTitle: "Nguồn dữ liệu",
    /** "{n} điểm" under the waffle; n is live from data/locations.json. */
    pointsUnit: "điểm",
    waffleLabel: "Mỗi ô là một điểm trên bản đồ, tô theo nguồn dữ liệu",
    more: "Xem chi tiết",
    sources: [
      { source: "verified", text: "Co-Map đã làm việc trực tiếp với đơn vị và kiểm tra thông tin." },
      { source: "public", text: "Lấy từ website và văn bản công bố của trường. Tài liệu đính kèm là minh họa." },
      { source: "demo", text: "Đơn vị giả định, dùng để trình diễn tính năng trong giai đoạn thử nghiệm." },
    ] as const,
  },

  targets: {
    title: "Mục tiêu năm đầu tiên",
    items: [
      {
        key: "sinh-vien",
        value: "4.800",
        label: "sinh viên",
        sr: "tham gia hệ sinh thái học tập và thực tập. Mỗi chấm là 100 sinh viên.",
        dots: 48,
        unit: "100",
      },
      {
        key: "doanh-nghiep",
        value: "30+",
        label: "doanh nghiệp",
        sr: "vừa và nhỏ kết nối được đợt thực tập. Mỗi chấm là một doanh nghiệp.",
        dots: 30,
        unit: "1",
      },
    ],
    caption: "Mục tiêu, chưa phải kết quả đã đạt.",
  },

  team: {
    title: "Đội ngũ",
  },

  closing: {
    line: "Cùng vẽ tiếp tấm bản đồ này.",
    primary: "Mở bản đồ",
    primaryHref: "/ban-do",
    secondary: "Nhận tư vấn",
  },
};
