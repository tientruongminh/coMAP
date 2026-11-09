import json, hashlib
import os
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "locations.json")

def jitter(key, lat, lng, amt=0.0006):
    h = hashlib.sha1(key.encode()).digest()
    return round(lat + (h[0]/255 - 0.5) * 2 * amt, 6), round(lng + (h[1]/255 - 0.5) * 2 * amt, 6)

def P(title, workType, stipend, note=None, schedule=None, slots=None):
    d = {"title": title, "workType": workType, "stipend": stipend}
    if note: d["stipendNote"] = note
    if schedule: d["schedule"] = schedule
    if slots: d["slots"] = slots
    return d

def D(kind, title): return {"kind": kind, "title": title}

schools = [
 dict(id="ussh-giaoduc", name="Trường Đại học Khoa học Xã hội và Nhân văn, ĐHQG-HCM", short="ĐH KHXH&NV", unit="Ngành Giáo dục học, Khoa Giáo dục",
      ownership="public", fields=["Giáo dục học","Quản lý giáo dục","Tâm lý học giáo dục"],
      address="10-12 Đinh Tiên Hoàng", ward="Sài Gòn", area="Quận 1", lat=10.786023, lng=106.703053,
      website="https://hcmussh.edu.vn/giaoduc", phone=None, email=None, size="large", source="verified",
      description="Đơn vị đào tạo cử nhân Giáo dục học và Quản lý giáo dục; tổ chức Thực tập 2 và Thực tập 3 tại các cơ sở giáo dục trên địa bàn thành phố.",
      documents=[D("program","Chương trình đào tạo cử nhân Giáo dục học áp dụng cho khóa 2021 và 2022"),
                 D("program","Chương trình đào tạo cử nhân Giáo dục học áp dụng cho khóa 2023 và 2024"),
                 D("syllabus","Đề cương học phần Thực tập 2 ngành Giáo dục học năm học 2025-2026"),
                 D("syllabus","Đề cương học phần Thực tập 3 ngành Giáo dục học năm học 2025-2026")]),
 dict(id="hcmue", name="Trường Đại học Sư phạm Thành phố Hồ Chí Minh", short="ĐH Sư phạm TP.HCM", unit="Khoa Khoa học Giáo dục · Khoa Giáo dục Đặc biệt · Khoa Tâm lý học",
      ownership="public", fields=["Sư phạm","Giáo dục học","Quản lý giáo dục","Tâm lý học giáo dục","Giáo dục đặc biệt"],
      address="280 An Dương Vương", ward="Chợ Quán", area="Quận 5", lat=10.761946, lng=106.681797,
      website="https://hcmue.edu.vn", size="large", source="public",
      description="Trường sư phạm trọng điểm phía Nam, đào tạo giáo viên các cấp và cử nhân khoa học giáo dục.",
      documents=[D("program","Chương trình đào tạo ngành Giáo dục học (minh họa)"),
                 D("program","Chương trình đào tạo ngành Giáo dục Đặc biệt (minh họa)"),
                 D("syllabus","Đề cương Thực tập sư phạm 2 (minh họa)")]),
 dict(id="sgu", name="Trường Đại học Sài Gòn", short="ĐH Sài Gòn", unit="Khoa Giáo dục · Khoa Sư phạm Khoa học Tự nhiên",
      ownership="public", fields=["Sư phạm","Quản lý giáo dục"],
      address="273 An Dương Vương", ward="Chợ Quán", area="Quận 5", lat=10.759703, lng=106.681759,
      website="https://sgu.edu.vn", size="large", source="public",
      description="Trường đại học công lập trực thuộc UBND TP.HCM, đào tạo giáo viên mầm non, tiểu học, THCS và quản lý giáo dục.",
      documents=[D("program","Chương trình đào tạo ngành Quản lý giáo dục (minh họa)"),
                 D("syllabus","Đề cương Thực tập sư phạm cuối khóa (minh họa)")]),
 dict(id="hcmute", name="Trường Đại học Công nghệ Kỹ thuật TP.HCM", short="ĐH Công nghệ Kỹ thuật", unit="Viện Sư phạm Kỹ thuật",
      ownership="public", fields=["Sư phạm","Công nghệ giáo dục"],
      address="1 Võ Văn Ngân", ward="Thủ Đức", area="TP. Thủ Đức", lat=10.852791, lng=106.772558,
      website="https://hcmute.edu.vn", size="large", source="public",
      description="Tiền thân là Trường ĐH Sư phạm Kỹ thuật TP.HCM; đào tạo giáo viên kỹ thuật, nghề nghiệp và ứng dụng công nghệ trong dạy học.",
      documents=[D("program","Chương trình đào tạo Sư phạm kỹ thuật (minh họa)"),
                 D("syllabus","Đề cương Thực tập giảng dạy (minh họa)")]),
 dict(id="upes", name="Trường Đại học Sư phạm Thể dục Thể thao TP.HCM", short="ĐH Sư phạm TDTT", unit="Khoa Giáo dục Thể chất",
      ownership="public", fields=["Sư phạm"],
      address="639 Nguyễn Trãi", ward="Chợ Lớn", area="Quận 5", lat=10.752889, lng=106.663808,
      website="https://upes.edu.vn", size="medium", source="public",
      description="Đào tạo giáo viên giáo dục thể chất và huấn luyện viên thể thao trường học.",
      documents=[D("program","Chương trình đào tạo ngành Giáo dục Thể chất (minh họa)"),
                 D("syllabus","Đề cương Thực tập sư phạm (minh họa)")]),
 dict(id="nce", name="Trường Cao đẳng Sư phạm Trung ương TP.HCM", short="CĐ Sư phạm Trung ương", unit="Khoa Giáo dục Mầm non",
      ownership="public", fields=["Sư phạm","Giáo dục đặc biệt"],
      address="182 Nguyễn Chí Thanh", ward="Vườn Lài", area="Quận 10", lat=10.76076, lng=106.670567,
      website="https://ncehcm.edu.vn", size="medium", source="public",
      description="Trường cao đẳng sư phạm tập trung đào tạo giáo viên mầm non và giáo dục hòa nhập.",
      documents=[D("program","Chương trình đào tạo Giáo dục Mầm non (minh họa)"),
                 D("syllabus","Đề cương Kiến tập và Thực tập (minh họa)")]),
 dict(id="vlu", name="Trường Đại học Văn Lang", short="ĐH Văn Lang", unit="Khoa Tâm lý học",
      ownership="private", fields=["Tâm lý học giáo dục"],
      address="69/68 Đặng Thùy Trâm", ward="Bình Lợi Trung", area="Bình Thạnh", lat=10.828479, lng=106.703031,
      website="https://vlu.edu.vn", size="large", source="public",
      description="Đại học tư thục đào tạo ngành Tâm lý học với định hướng tham vấn và tâm lý học đường.",
      documents=[D("program","Chương trình đào tạo ngành Tâm lý học (minh họa)"),
                 D("syllabus","Đề cương Thực tập nghề nghiệp (minh họa)")]),
 dict(id="hutech", name="Trường Đại học Công nghệ TP.HCM (HUTECH)", short="HUTECH", unit="Viện Khoa học Xã hội & Nhân văn",
      ownership="private", fields=["Tâm lý học giáo dục"],
      address="475A Điện Biên Phủ", ward="Thạnh Mỹ Tây", area="Bình Thạnh", lat=10.801249, lng=106.71481,
      website="https://hutech.edu.vn", size="large", source="public",
      description="Đào tạo ngành Tâm lý học theo hướng ứng dụng: tham vấn, tâm lý học đường, tâm lý tổ chức.",
      documents=[D("program","Chương trình đào tạo ngành Tâm lý học (minh họa)"),
                 D("syllabus","Đề cương Thực tập tốt nghiệp (minh họa)")]),
 dict(id="nttu", name="Trường Đại học Nguyễn Tất Thành", short="ĐH Nguyễn Tất Thành", unit="Khoa Giáo dục Mầm non",
      ownership="private", fields=["Sư phạm"],
      address="300A Nguyễn Tất Thành", ward="Xóm Chiếu", area="Quận 4", lat=10.761868, lng=106.709345,
      website="https://ntt.edu.vn", size="large", source="public",
      description="Đại học tư thục có đào tạo giáo viên mầm non theo định hướng thực hành.",
      documents=[D("program","Chương trình đào tạo Giáo dục Mầm non (minh họa)"),
                 D("syllabus","Đề cương Thực tập sư phạm (minh họa)")]),
 dict(id="hiu", name="Trường Đại học Quốc tế Hồng Bàng", short="ĐH Quốc tế Hồng Bàng", unit="Khoa Giáo dục",
      ownership="private", fields=["Sư phạm","Giáo dục học"],
      address="215 Điện Biên Phủ", ward="Gia Định", area="Bình Thạnh", lat=10.800576, lng=106.70601,
      website="https://hiu.vn", size="large", source="public",
      description="Đại học tư thục có khối ngành giáo dục, đào tạo giáo viên mầm non và tiểu học.",
      documents=[D("program","Chương trình đào tạo khối ngành Giáo dục (minh họa)"),
                 D("syllabus","Đề cương Kiến tập sư phạm (minh họa)")]),
]

# Internship sites: HiPO is real (from the founders' mockup); the rest are fictional demo entries.
S = [
 # id, name, short, ownership, fields, address, ward, area, lat, lng, size, desc, positions, partners, real
 dict(id="hipo", name="Trung tâm Giáo dục Đào tạo Kỹ năng HiPO", short="HiPO", ownership="private",
      fields=["Giáo dục học","Sư phạm"], address="38B/14 Cây Keo", ward="Tam Bình", area="TP. Thủ Đức",
      lat=10.856646, lng=106.738032, size="small", source="verified",
      phone="0767 778 002", email="hipo.edu.vn@gmail.com", website="https://www.hipo.edu.vn",
      description="Trung tâm giáo dục kỹ năng sống, bơi lội và tiếng Anh cho trẻ; đối tác thực tập của sinh viên ngành Giáo dục học.",
      positions=[P("Giáo viên dạy Kỹ năng sống","Bán thời gian","Có phụ cấp"),
                 P("Giáo viên dạy Bơi lội","Bán thời gian","Có phụ cấp"),
                 P("Giáo viên Tiếng Anh","Bán thời gian","Có phụ cấp")],
      documents=[D("plan","Kế hoạch Thực tập 2 năm 2025, ngành Giáo dục học"),
                 D("plan","Kế hoạch Thực tập 3 năm 2025, ngành Giáo dục học"),
                 D("jd","Mô tả công việc: Giáo viên dạy Bơi lội"),
                 D("jd","Mô tả công việc: Giáo viên Tiếng Anh"),
                 D("jd","Mô tả công việc: Giáo viên dạy Kỹ năng sống")],
      partners=["ussh-giaoduc"]),
 dict(id="haidang-ielts", name="Anh ngữ Hải Đăng IELTS", ownership="private", fields=["Sư phạm","Giáo dục học"],
      address="54 Nguyễn Gia Trí", ward="Thạnh Mỹ Tây", area="Bình Thạnh", lat=10.805088, lng=106.715923, size="small",
      description="Trung tâm luyện thi IELTS quy mô nhỏ, lớp tối đa 12 học viên, chú trọng kỹ năng Speaking.",
      positions=[P("Trợ giảng IELTS Speaking","Linh hoạt","Có phụ cấp","150.000-260.000đ/buổi","Tối thiểu 25 giờ/tuần, ca tối", 4),
                 P("Tư vấn tuyển sinh","Toàn thời gian","Thỏa thuận", None, "8 giờ/ngày, nghỉ 6 ngày/tháng", 1)],
      partners=["hutech","hiu"]),
 dict(id="la-me-school", name="Trường Tiểu học và THCS Tư thục Lá Me", ownership="private",
      fields=["Tâm lý học giáo dục","Quản lý giáo dục","Sư phạm"], address="612 Võ Nguyên Giáp", ward="Tăng Nhơn Phú",
      area="TP. Thủ Đức", lat=10.84574, lng=106.77179, size="medium",
      description="Trường liên cấp hai cấp học, có phòng tham vấn học đường và chương trình kỹ năng xã hội và cảm xúc.",
      positions=[P("Thực tập sinh Tham vấn tâm lý học đường","Toàn thời gian","Có phụ cấp","2.000.000đ/tháng", "Thứ Hai đến Thứ Sáu, giờ hành chính", 2),
                 P("Trợ giảng lớp tiểu học","Bán thời gian","Có phụ cấp", None, "Buổi sáng", 3),
                 P("Thực tập sinh Giáo vụ","Toàn thời gian","Thỏa thuận", None, None, 1)],
      partners=["vlu","hcmute","ussh-giaoduc"]),
 dict(id="buoc-nho", name="Trung tâm Can thiệp sớm & Giáo dục hòa nhập Bước Nhỏ", ownership="private",
      fields=["Giáo dục đặc biệt","Tâm lý học giáo dục"], address="27 Huỳnh Văn Bánh", ward="Phú Nhuận", area="Phú Nhuận",
      lat=10.791648, lng=106.669738, size="small",
      description="Can thiệp sớm cá nhân cho trẻ có nhu cầu giáo dục đặc biệt; hỗ trợ phụ huynh và giáo viên trường hòa nhập.",
      positions=[P("Giáo viên can thiệp cá nhân (thực tập)","Toàn thời gian","Có phụ cấp","1.500.000đ/tháng", None, 2),
                 P("Trợ giảng lớp hòa nhập","Bán thời gian","Có phụ cấp", None, "Ca chiều", 2)],
      partners=["hcmue","nce"]),
 dict(id="to-mo-steam", name="Xưởng STEAM Tò Mò", ownership="private", fields=["Công nghệ giáo dục","Sư phạm"],
      address="41 Võ Văn Tần", ward="Xuân Hòa", area="Quận 3", lat=10.780859, lng=106.694603, size="small",
      description="Lớp học dự án STEAM cho học sinh 6-12 tuổi: lắp ráp, cơ khí đơn giản, lập trình khối.",
      positions=[P("Trợ giảng STEAM","Bán thời gian","Có phụ cấp", None, "Thứ Hai đến Thứ Sáu, 14:00-16:00", 3),
                 P("Giáo viên STEM (thực tập)","Bán thời gian","Có phụ cấp", None, "Cuối tuần", 1)],
      partners=["hcmute","sgu"]),
 dict(id="vo-mo", name="Công ty Cổ phần Công nghệ Giáo dục Vở Mở", ownership="private", fields=["Công nghệ giáo dục","Giáo dục học"],
      address="Tầng 6, 72 Lê Thánh Tôn", ward="Sài Gòn", area="Quận 1", lat=10.776587, lng=106.700918, size="medium",
      description="Nền tảng học liệu số cho giáo viên THCS; đội ngũ thiết kế bài giảng và đánh giá năng lực trực tuyến.",
      positions=[P("Thực tập sinh Thiết kế học liệu số","Toàn thời gian","Có phụ cấp","3.000.000đ/tháng", None, 2),
                 P("Thực tập sinh Marketing nội dung giáo dục","Bán thời gian","Có phụ cấp", None, None, 1)],
      partners=["ussh-giaoduc","hcmute"]),
 dict(id="hoa-gao", name="Trung tâm Ngoại ngữ Hoa Gạo", ownership="private", fields=["Sư phạm","Quản lý giáo dục"],
      address="318 Phan Văn Trị", ward="Gò Vấp", area="Gò Vấp", lat=10.835474, lng=106.664701, size="medium",
      description="Tiếng Anh thiếu nhi với giáo viên bản ngữ; 4 cơ sở tại khu vực Gò Vấp.",
      positions=[P("Trợ giảng cho giáo viên nước ngoài","Bán thời gian","Có phụ cấp", None, "Ca tối và cuối tuần", 4),
                 P("Thực tập sinh Giáo vụ","Toàn thời gian","Thỏa thuận", None, None, 1)],
      partners=["sgu","hiu"]),
 dict(id="hat-dau-nho", name="Trường Mầm non Tư thục Hạt Đậu Nhỏ", ownership="private", fields=["Sư phạm","Giáo dục học"],
      address="215 Nguyễn Thị Thập", ward="Tân Mỹ", area="Quận 7", lat=10.737302, lng=106.724071, size="small",
      description="Trường mầm non theo hướng tiếp cận trải nghiệm, lớp tối đa 18 trẻ.",
      positions=[P("Giáo viên mầm non (thực tập)","Toàn thời gian","Có phụ cấp","1.500.000đ/tháng", None, 3),
                 P("Trợ giảng lớp song ngữ","Bán thời gian","Thỏa thuận", None, None, 2)],
      partners=["nttu","nce","sgu"]),
 dict(id="lang-nghe", name="Trung tâm Tham vấn Tâm lý Học đường Lắng Nghe", ownership="private", fields=["Tâm lý học giáo dục"],
      address="96 Thành Thái", ward="Diên Hồng", area="Quận 10", lat=10.768431, lng=106.666415, size="small",
      description="Tham vấn tâm lý cho học sinh, phụ huynh; triển khai chương trình sức khỏe tinh thần tại trường học.",
      positions=[P("Thực tập sinh Tham vấn tâm lý","Bán thời gian","Có phụ cấp", None, "3 buổi/tuần", 2),
                 P("Hành chính: điều phối lịch tham vấn","Toàn thời gian","Thỏa thuận", None, None, 1)],
      partners=["vlu","hutech","hcmue"]),
 dict(id="tham-hiem-nhi", name="Học viện Kỹ năng Nhà Thám Hiểm Nhí", ownership="private", fields=["Giáo dục học"],
      address="480 Hoàng Văn Thụ", ward="Tân Sơn Nhất", area="Tân Bình", lat=10.794588, lng=106.655047, size="medium",
      description="Khóa kỹ năng sống và trại hè trải nghiệm cho học sinh tiểu học và THCS.",
      positions=[P("Giáo viên dạy Kỹ năng sống","Bán thời gian","Có phụ cấp", None, "Cuối tuần", 4),
                 P("Chuyên viên đào tạo (thực tập)","Toàn thời gian","Có phụ cấp", None, None, 1)],
      partners=["ussh-giaoduc"]),
 dict(id="que-tinh", name="Hệ thống Toán Tư duy Que Tính", ownership="private", fields=["Sư phạm"],
      address="155 Lũy Bán Bích", ward="Tân Phú", area="Tân Phú", lat=10.789338, lng=106.637241, size="large",
      description="Hệ thống 12 cơ sở dạy toán tư duy cho trẻ 4-11 tuổi.",
      positions=[P("Giáo viên Toán tư duy (thực tập)","Bán thời gian","Có phụ cấp", None, "Ca chiều và tối", 5),
                 P("Tư vấn tuyển sinh","Toàn thời gian","Thỏa thuận", None, None, 2)],
      partners=["sgu","hcmue"]),
 dict(id="nhip-cau-nghe", name="Công ty TNHH Đào tạo Nhịp Cầu Nghề", ownership="private", fields=["Quản lý giáo dục","Giáo dục học"],
      address="Tầng 9, 88 Nam Kỳ Khởi Nghĩa", ward="Bến Thành", area="Quận 1", lat=10.772299, lng=106.700686, size="medium",
      description="Thiết kế và vận hành chương trình đào tạo nội bộ cho doanh nghiệp bán lẻ và dịch vụ.",
      positions=[P("Thực tập sinh Chuyên viên đào tạo","Toàn thời gian","Có phụ cấp","3.500.000đ/tháng", None, 2),
                 P("Thực tập sinh Nhân sự và Đào tạo","Toàn thời gian","Có phụ cấp", None, None, 1)],
      partners=["ussh-giaoduc"]),
 dict(id="chim-se", name="Thư viện Cộng đồng Chim Sẻ Đọc Sách", ownership="private", fields=["Giáo dục học"],
      address="12 Phan Đăng Lưu", ward="Bình Thạnh", area="Bình Thạnh", lat=10.802765, lng=106.695815, size="small",
      description="Không gian đọc miễn phí cho thiếu nhi; câu lạc bộ đọc hiểu và kể chuyện cuối tuần.",
      positions=[P("Điều phối chương trình đọc","Linh hoạt","Thỏa thuận", None, "Cuối tuần", 2),
                 P("Trợ giảng lớp đọc hiểu","Linh hoạt","Thỏa thuận", None, None, 3)],
      partners=["ussh-giaoduc","hiu"]),
 dict(id="bac-thang", name="Trung tâm Hướng nghiệp & Luyện thi Bậc Thang", ownership="private", fields=["Tâm lý học giáo dục","Giáo dục học"],
      address="210 Kha Vạn Cân", ward="Thủ Đức", area="TP. Thủ Đức", lat=10.840798, lng=106.744391, size="small",
      description="Tư vấn chọn ngành, trắc nghiệm hướng nghiệp và luyện thi THPT cho học sinh khu vực Thủ Đức.",
      positions=[P("Tư vấn hướng nghiệp (thực tập)","Bán thời gian","Có phụ cấp", None, None, 2),
                 P("Trợ giảng Toán THPT","Bán thời gian","Có phụ cấp", None, "Ca tối", 2)],
      partners=["hcmute","vlu"]),
 dict(id="loc-vung", name="Trường Song ngữ Liên cấp Lộc Vừng", ownership="private", fields=["Sư phạm","Quản lý giáo dục"],
      address="31 Nguyễn Văn Hưởng", ward="An Khánh", area="TP. Thủ Đức", lat=10.813073, lng=106.732991, size="large",
      description="Trường song ngữ từ mầm non đến THCS, chương trình tích hợp tiếng Việt và tiếng Anh.",
      positions=[P("Trợ giảng song ngữ","Toàn thời gian","Có phụ cấp","4.000.000đ/tháng", None, 4),
                 P("Thực tập sinh Giáo vụ","Toàn thời gian","Có phụ cấp", None, None, 1),
                 P("Thực tập sinh Marketing tuyển sinh","Toàn thời gian","Có phụ cấp", None, None, 1)],
      partners=["hcmue","ussh-giaoduc","hiu"]),
 dict(id="bang-xanh", name="Công ty Học liệu số Bảng Xanh", ownership="private", fields=["Công nghệ giáo dục"],
      address="Tầng 3, 364 Cộng Hòa", ward="Tân Bình", area="Tân Bình", lat=10.804752, lng=106.637228, size="medium",
      description="Sản xuất khóa học e-learning cho doanh nghiệp và trường học; studio quay giảng riêng.",
      positions=[P("Thực tập sinh Thiết kế bài giảng e-learning","Toàn thời gian","Có phụ cấp", None, None, 2),
                 P("Kiểm định nội dung học liệu","Linh hoạt","Thỏa thuận", None, "Làm từ xa", 2)],
      partners=["hcmute"]),
 dict(id="rai-ca", name="Trung tâm Thể chất & Bơi lội Rái Cá Nhỏ", ownership="private", fields=["Sư phạm"],
      address="Đường Tên Lửa", ward="Bình Tân", area="Bình Tân", lat=10.75672, lng=106.590115, size="small",
      description="Dạy bơi an toàn và vận động thể chất cho trẻ 4-12 tuổi.",
      positions=[P("Trợ giảng Bơi lội","Bán thời gian","Có phụ cấp", None, "Sáng sớm và chiều tối", 3),
                 P("Hành chính: chăm sóc phụ huynh","Bán thời gian","Thỏa thuận", None, None, 1)],
      partners=["upes"]),
 dict(id="ban-tay-noi", name="Trung tâm Ngôn ngữ Ký hiệu & Hòa nhập Bàn Tay Nói", ownership="private", fields=["Giáo dục đặc biệt"],
      address="590 Trần Hưng Đạo", ward="Chợ Quán", area="Quận 5", lat=10.755853, lng=106.683314, size="small",
      description="Lớp ngôn ngữ ký hiệu và hỗ trợ học tập cho học sinh khiếm thính học hòa nhập.",
      positions=[P("Trợ giảng lớp hòa nhập","Bán thời gian","Có phụ cấp", None, None, 2),
                 P("Điều phối dự án cộng đồng","Linh hoạt","Thỏa thuận", None, None, 1)],
      partners=["hcmue","nce"]),
 dict(id="rach-chiec", name="Trường Tiểu học Thực nghiệm Rạch Chiếc", ownership="public", fields=["Sư phạm","Quản lý giáo dục"],
      address="Đường Đỗ Xuân Hợp", ward="Phước Long", area="TP. Thủ Đức", lat=10.796424, lng=106.780535, size="medium",
      description="Trường tiểu học công lập thí điểm mô hình lớp học dự án; tiếp nhận giáo sinh kiến tập và thực tập.",
      positions=[P("Giáo sinh thực tập sư phạm","Toàn thời gian","Thỏa thuận", None, "Theo kế hoạch thực tập của trường", 6),
                 P("Hỗ trợ thư viện và thiết bị dạy học","Bán thời gian","Thỏa thuận", None, None, 1)],
      partners=["sgu","hcmute"]),
 dict(id="hoa-su", name="Trường Mầm non Hoa Sứ", ownership="public", fields=["Sư phạm"],
      address="Đường Lý Chính Thắng", ward="Nhiêu Lộc", area="Quận 3", lat=10.780759, lng=106.682603, size="small",
      description="Trường mầm non công lập, tiếp nhận sinh viên kiến tập và thực tập ngành Giáo dục Mầm non.",
      positions=[P("Giáo viên mầm non (thực tập)","Toàn thời gian","Thỏa thuận", None, None, 4),
                 P("Hành chính: văn thư","Bán thời gian","Thỏa thuận", None, None, 1)],
      partners=["nce","sgu"]),
 dict(id="cay-gao", name="Trường Liên cấp Tư thục Cây Gạo", ownership="private", fields=["Sư phạm","Quản lý giáo dục"],
      address="533 Kinh Dương Vương", ward="An Lạc", area="Bình Tân", lat=10.737039, lng=106.615632, size="large",
      description="Trường liên cấp tiểu học, THCS và THPT với hơn 1.500 học sinh.",
      positions=[P("Giáo viên bộ môn (thực tập)","Toàn thời gian","Có phụ cấp", None, None, 5),
                 P("Thực tập sinh Giáo vụ","Toàn thời gian","Có phụ cấp", None, None, 2)],
      partners=["hcmue","sgu","upes"]),
 dict(id="thap-den", name="Quỹ Giáo dục Thắp Đèn", ownership="private", fields=["Quản lý giáo dục","Giáo dục học"],
      address="35 Nguyễn Đình Chiểu", ward="Sài Gòn", area="Quận 1", lat=10.787208, lng=106.699106, size="small",
      description="Tổ chức phi lợi nhuận cấp học bổng và mở lớp học cộng đồng cho học sinh khó khăn.",
      positions=[P("Điều phối chương trình học bổng","Linh hoạt","Có phụ cấp", None, None, 1),
                 P("Thực tập sinh Truyền thông","Bán thời gian","Thỏa thuận", None, None, 1)],
      partners=["ussh-giaoduc"]),
 dict(id="muoi-gio", name="Trung tâm Nghệ thuật Thiếu nhi Hoa Mười Giờ", ownership="private", fields=["Sư phạm"],
      address="410 Quang Trung", ward="Gò Vấp", area="Gò Vấp", lat=10.83222, lng=106.669143, size="small",
      description="Lớp vẽ, âm nhạc và kịch cho thiếu nhi; triển lãm học viên mỗi quý.",
      positions=[P("Trợ giảng Mỹ thuật","Bán thời gian","Có phụ cấp", None, "Cuối tuần", 2),
                 P("Tư vấn tuyển sinh","Bán thời gian","Thỏa thuận", None, None, 1)],
      partners=["sgu"]),
 dict(id="doi-thong", name="Trung tâm Giáo dục Kỹ năng Đồi Thông", ownership="private", fields=["Giáo dục học","Công nghệ giáo dục"],
      address="Đường Lê Văn Việt", ward="Tăng Nhơn Phú", area="TP. Thủ Đức", lat=10.847463, lng=106.795736, size="medium",
      description="Kỹ năng sống, STEAM và câu lạc bộ khoa học cho học sinh khu Công nghệ cao.",
      positions=[P("Giáo viên dạy Kỹ năng sống","Bán thời gian","Có phụ cấp", None, None, 3),
                 P("Trợ giảng STEAM","Bán thời gian","Có phụ cấp", None, "Thứ Hai đến Thứ Sáu, 14:00-16:00", 2)],
      partners=["hcmute","ussh-giaoduc"]),
 dict(id="o-cua", name="Trung tâm Học tập Ô Cửa", ownership="private", fields=["Sư phạm"],
      address="Đường Phạm Thế Hiển", ward="Bình Đông", area="Quận 8", lat=10.709122, lng=106.623267, size="small",
      description="Lớp học thêm Toán và Văn THCS theo nhóm nhỏ, kèm học sinh mất gốc.",
      positions=[P("Trợ giảng Toán và Ngữ văn THCS","Bán thời gian","Có phụ cấp", None, "Ca tối", 3),
                 P("Thực tập sinh Giáo vụ","Bán thời gian","Thỏa thuận", None, None, 1)],
      partners=["sgu","hcmue"]),
 dict(id="banh-rang", name="Học viện Robotics Bánh Răng", ownership="private", fields=["Công nghệ giáo dục","Sư phạm"],
      address="Đường Hoàng Diệu", ward="Vĩnh Hội", area="Quận 4", lat=10.758657, lng=106.697902, size="small",
      description="Lập trình robot và chuẩn bị thi đấu robotics cho học sinh THCS.",
      positions=[P("Trợ giảng Robotics","Bán thời gian","Có phụ cấp", None, None, 2),
                 P("Giáo viên STEM (thực tập)","Bán thời gian","Có phụ cấp", None, None, 1)],
      partners=["hcmute","nttu"]),
]

def slug_mail(i): return f"tuyendung@{i}.example"

out = []
for s in schools:
    out.append({**{"type":"school","phone":None,"email":None}, **s})
for i, s in enumerate(S):
    s = dict(s)
    real = s.get("source") == "verified"
    if not real:
        s["source"] = "demo"
        s["lat"], s["lng"] = jitter(s["id"], s["lat"], s["lng"])
        s.setdefault("phone", f"028 0{(310 + i*37) % 1000:03d} {(1200 + i*113) % 10000:04d}")
        s.setdefault("email", slug_mail(s["id"]))
        s.setdefault("website", None)
        s.setdefault("documents", [D("plan", "Kế hoạch tiếp nhận thực tập sinh năm 2026")] +
                                  [D("jd", f"Mô tả công việc: {p['title']}") for p in s["positions"]])
    s["type"] = "internship"
    s["fields"] = s["fields"]
    out.append(s)

FIELDS = ["Giáo dục học","Quản lý giáo dục","Công nghệ giáo dục","Sư phạm","Tâm lý học giáo dục","Giáo dục đặc biệt"]
for o in out:
    assert all(f in FIELDS for f in o["fields"]), o["id"]
    assert 10.68 < o["lat"] < 10.90 and 106.55 < o["lng"] < 106.82, o["id"]
    for p in o.get("positions", []):
        assert p["workType"] in ("Toàn thời gian","Bán thời gian","Linh hoạt") and p["stipend"] in ("Có phụ cấp","Thỏa thuận")
    o.setdefault("positions", [])

# Founders' 11 job roles (spec Appendix A.2). A position may carry several.
ROLE_EXACT = {
  "giao-vien-ky-nang-song": ["Giáo viên dạy Kỹ năng sống"],
  "giao-vien": ["Giáo viên mầm non (thực tập)","Giáo viên dạy Bơi lội","Giáo viên Tiếng Anh","Giáo viên can thiệp cá nhân (thực tập)","Giáo viên Toán tư duy (thực tập)","Giáo sinh thực tập sư phạm","Giáo viên bộ môn (thực tập)"],
  "giao-vien-steam": ["Giáo viên STEM (thực tập)","Trợ giảng STEAM","Trợ giảng Robotics"],
  "giao-vu": ["Thực tập sinh Giáo vụ","Hỗ trợ thư viện và thiết bị dạy học"],
  "chuyen-vien-dao-tao": ["Chuyên viên đào tạo (thực tập)","Thực tập sinh Chuyên viên đào tạo","Thực tập sinh Nhân sự và Đào tạo","Thực tập sinh Thiết kế học liệu số","Thực tập sinh Thiết kế bài giảng e-learning","Kiểm định nội dung học liệu","Điều phối chương trình đọc"],
  "tu-van-tam-ly": ["Thực tập sinh Tham vấn tâm lý học đường","Thực tập sinh Tham vấn tâm lý","Tư vấn hướng nghiệp (thực tập)"],
  "hanh-chinh": ["Hành chính: điều phối lịch tham vấn","Hành chính: chăm sóc phụ huynh","Hành chính: văn thư","Điều phối dự án cộng đồng","Điều phối chương trình học bổng"],
  "marketing": ["Thực tập sinh Marketing nội dung giáo dục","Thực tập sinh Marketing tuyển sinh","Thực tập sinh Truyền thông"],
  "nhan-su": ["Thực tập sinh Nhân sự và Đào tạo"],
  "tu-van-tuyen-sinh": ["Tư vấn tuyển sinh","Thực tập sinh Marketing tuyển sinh"],
}
ROLE_ORDER = ["giao-vien-ky-nang-song","giao-vien","giao-vien-steam","giao-vu","tro-giang","chuyen-vien-dao-tao","tu-van-tam-ly","hanh-chinh","marketing","nhan-su","tu-van-tuyen-sinh"]
def roles_for(title):
    r = {k for k, v in ROLE_EXACT.items() if title in v}
    if title.startswith("Trợ giảng"): r.add("tro-giang")
    assert r, f"position without role: {title}"
    return [k for k in ROLE_ORDER if k in r]
for o in out:
    for p in o["positions"]:
        p["roles"] = roles_for(p["title"])

doc = {
  "meta": {
    "note": "Dữ liệu minh họa cho bản demo Co-Map. Trường học: thông tin công khai (tên, địa chỉ, website). Cơ sở thực tập: trừ Trung tâm HiPO (dữ liệu thật từ hồ sơ Co-Map), tất cả là đơn vị giả định. Số điện thoại/email giả định không có thật.",
    "source": {"verified": "Dữ liệu thật do đội ngũ Co-Map thu thập", "public": "Thông tin công khai của trường; tài liệu đính kèm là minh họa", "demo": "Đơn vị giả định phục vụ trình diễn"},
    "fields": FIELDS,
    "workTypes": ["Toàn thời gian","Bán thời gian","Linh hoạt"],
    "stipends": ["Có phụ cấp","Thỏa thuận"],
    "sizes": {"small":"Nhỏ (dưới 50 nhân sự)","medium":"Vừa (50 đến 200 nhân sự)","large":"Lớn (trên 200 nhân sự)"},
    "areas": ["Quận 1","Quận 3","Quận 4","Quận 5","Quận 6","Quận 7","Quận 8","Quận 10","Quận 11","Quận 12","Bình Thạnh","Bình Tân","Gò Vấp","Phú Nhuận","Tân Bình","Tân Phú","TP. Thủ Đức","Bình Chánh","Cần Giờ","Củ Chi","Hóc Môn","Nhà Bè"],
    "updated": "2026-11-09"
  },
  "locations": out
}
json.dump(doc, open(OUT, "w"), ensure_ascii=False, indent=2)
print(len(out), "locations:", sum(o["type"]=="school" for o in out), "schools,", sum(o["type"]=="internship" for o in out), "internship sites")
pos = [p["title"] for o in out for p in o["positions"]]
print(len(pos), "positions")
