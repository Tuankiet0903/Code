const fs = require("fs");

// CẤU HÌNH NĂM
const START_YEAR = 2026;
const END_YEAR = 2030;
const OUTPUT_FILE = "LichPhungVu_2026-2030.ics";

// 1. Hàm tính ngày Lễ Phục Sinh (Easter) - Thuật toán "Anonymous Date"
function getEasterDate(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);

  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  // Lưu ý: Tháng trong JS bắt đầu từ 0 (Tháng 1 là 0)
  return new Date(year, month - 1, day);
}

// 2. Hàm cộng trừ ngày
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// 3. Hàm tính Chúa Nhật I Mùa Vọng (Chúa Nhật gần 30/11 nhất)
function getAdventSunday(year) {
  // Lấy ngày 30/11 của năm
  const nov30 = new Date(year, 10, 30); // Tháng 11 là index 10
  const dayOfWeek = nov30.getDay(); // 0: CN, 1: T2, ...
  
  // Nếu là CN thì chính là nó
  if (dayOfWeek === 0) return nov30;
  
  // Nếu Thứ 2-4 (1-3) -> Lùi về CN trước
  if (dayOfWeek < 4) {
    return addDays(nov30, -dayOfWeek);
  } else {
    // Nếu Thứ 5-7 (4-6) -> Tiến tới CN sau
    return addDays(nov30, 7 - dayOfWeek);
  }
}

// 4. Hàm format ngày cho ICS (YYYYMMDD)
function formatDateICS(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

// 5. Tạo chuỗi sự kiện VEVENT
function createEvent(summary, dateObj, description = "") {
  const dtStart = formatDateICS(dateObj);
  const dtEnd = formatDateICS(addDays(dateObj, 1)); // Sự kiện cả ngày kết thúc vào hôm sau

  return [
    "BEGIN:VEVENT",
    `DTSTART;VALUE=DATE:${dtStart}`,
    `DTEND;VALUE=DATE:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "END:VEVENT",
  ].join("\r\n");
}

// 6. Danh sách các lễ cố định (Ngày, Tháng - 0 index)
const fixedHolidays = [
  { d: 1, m: 0, name: "ĐỨC MARIA, MẸ THIÊN CHÚA (Lễ Trọng)" },
  { d: 6, m: 0, name: "CHÚA HIỂN LINH (Thường dời vào CN)" }, // Lễ Hiển Linh
  { d: 19, m: 2, name: "THÁNH GIUSE, BẠN TRĂM NĂM ĐỨC MARIA (Lễ Trọng)" },
  { d: 25, m: 2, name: "LỄ TRUYỀN TIN (Lễ Trọng)" },
  { d: 1, m: 4, name: "THÁNH GIUSE THỢ" },
  { d: 24, m: 5, name: "SINH NHẬT THÁNH GIOAN TẨY GIẢ (Lễ Trọng)" }, // Mới thêm
  { d: 29, m: 5, name: "THÁNH PHÊRÔ VÀ PHAOLÔ TÔNG ĐỒ (Lễ Trọng)" },
  { d: 15, m: 7, name: "ĐỨC MẸ HỒN XÁC LÊN TRỜI (Lễ Trọng)" },
  { d: 1, m: 10, name: "LỄ CÁC THÁNH NAM NỮ (Lễ Trọng)" },
  { d: 2, m: 10, name: "LỄ CẦU CHO CÁC TÍN HỮU ĐÃ QUA ĐỜI" },
  { d: 24, m: 10, name: "CÁC THÁNH TỬ ĐẠO VIỆT NAM (Lễ Trọng)" },
  { d: 8, m: 11, name: "ĐỨC MẸ VÔ NHIỄM NGUYÊN TỘI (Lễ Trọng)" },
  { d: 25, m: 11, name: "CHÚA GIÁNG SINH (Lễ Trọng)" },
];

// --- CHƯƠNG TRÌNH CHÍNH ---

let icsContent = [
  "BEGIN:VCALENDAR",
  "VERSION:2.0",
  "PRODID:-//NodeJS//Lich Phung Vu Generator//VI",
  "X-WR-CALNAME:Lịch Công Giáo 2026-2030",
  "CALSCALE:GREGORIAN",
  "METHOD:PUBLISH",
  "X-WR-TIMEZONE:Asia/Ho_Chi_Minh",
];

console.log(`Đang tạo lịch từ năm ${START_YEAR} đến ${END_YEAR}...`);

for (let year = START_YEAR; year <= END_YEAR; year++) {
  // A. XỬ LÝ LỄ CỐ ĐỊNH
  fixedHolidays.forEach((h) => {
    const date = new Date(year, h.m, h.d);
    icsContent.push(createEvent(h.name, date, "Lễ cố định"));
  });

  // B. XỬ LÝ LỄ CHUYỂN DỊCH (Dựa trên Phục Sinh)
  const easterDate = getEasterDate(year);

  // 1. Lễ Tro (Phục sinh - 46 ngày)
  const ashWed = addDays(easterDate, -46);
  icsContent.push(
    createEvent("LỄ TRO", ashWed, "Bắt đầu Mùa Chay. Giữ chay và kiêng thịt.")
  );

  // 2. Lễ Lá (Phục sinh - 7 ngày)
  const palmSun = addDays(easterDate, -7);
  icsContent.push(
    createEvent(
      "CHÚA NHẬT LỄ LÁ",
      palmSun,
      "Tưởng niệm cuộc thương khó của Chúa."
    )
  );

  // 3. Thứ Năm Tuần Thánh
  const holyThu = addDays(easterDate, -3);
  icsContent.push(
    createEvent("THỨ NĂM TUẦN THÁNH", holyThu, "Thánh lễ Tiệc Ly.")
  );

  // 4. Thứ Sáu Tuần Thánh
  const goodFri = addDays(easterDate, -2);
  icsContent.push(
    createEvent(
      "THỨ SÁU TUẦN THÁNH",
      goodFri,
      "Tưởng niệm cuộc thương khó. Ăn chay kiêng thịt."
    )
  );

  // 5. Đại Lễ Phục Sinh
  icsContent.push(
    createEvent("ĐẠI LỄ PHỤC SINH", easterDate, "Mừng Chúa Sống Lại.")
  );

  // 6. Lễ Thăng Thiên (Dời vào CN kế tiếp = Phục sinh + 42 ngày)
  const ascension = addDays(easterDate, 42);
  icsContent.push(
    createEvent(
      "LỄ CHÚA THĂNG THIÊN",
      ascension,
      "Chúa lên trời (Dời vào Chúa Nhật)."
    )
  );

  // 7. Lễ Chúa Thánh Thần Hiện Xuống (Phục sinh + 49 ngày)
  const pentecost = addDays(easterDate, 49);
  icsContent.push(
    createEvent(
      "CHÚA THÁNH THẦN HIỆN XUỐNG",
      pentecost,
      "Kết thúc Mùa Phục Sinh."
    )
  );

  // 8. Lễ Chúa Ba Ngôi (Phục sinh + 56 ngày - CN sau Hiện Xuống)
  const trinity = addDays(easterDate, 56);
  icsContent.push(
    createEvent("LỄ CHÚA BA NGÔI", trinity, "Lễ Trọng.")
  );

  // 9. Lễ Mình Máu Thánh Chúa (Phục sinh + 63 ngày - Dời vào CN sau Ba Ngôi)
  const corpusChristi = addDays(easterDate, 63);
  icsContent.push(
    createEvent("LỄ MÌNH MÁU THÁNH CHÚA", corpusChristi, "Lễ Trọng (Dời vào Chúa Nhật).")
  );

  // 10. Lễ Thánh Tâm Chúa Giêsu (Phục sinh + 68 ngày - Thứ Sáu sau Mình Máu Thánh)
  const sacredHeart = addDays(easterDate, 68);
  icsContent.push(
    createEvent("LỄ THÁNH TÂM CHÚA GIÊSU", sacredHeart, "Lễ Trọng.")
  );

  // C. XỬ LÝ MÙA VỌNG & CUỐI NĂM
  // 1. Chúa Nhật I Mùa Vọng
  const advent1 = getAdventSunday(year);
  icsContent.push(
    createEvent("CHÚA NHẬT I MÙA VỌNG", advent1, "Khởi đầu Năm Phụng Vụ mới.")
  );

  // 2. Lễ Chúa Kitô Vua (CN trước CN I Mùa Vọng)
  const christKing = addDays(advent1, -7);
  icsContent.push(
    createEvent("LỄ CHÚA KITÔ VUA", christKing, "Kết thúc Năm Phụng Vụ.")
  );
}

icsContent.push("END:VCALENDAR");

// Ghi file
fs.writeFileSync(OUTPUT_FILE, icsContent.join("\r\n"), { encoding: "utf8" });
console.log(`Xong! File đã được tạo: ${OUTPUT_FILE}`);
