const fs = require("fs");

// CẤU HÌNH NĂM
const START_YEAR = 2026;
const END_YEAR = 2030;
const OUTPUT_FILE = "LichPhungVu_2026-2030_NodeJS.ics";

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

// 3. Hàm format ngày cho ICS (YYYYMMDD)
function formatDateICS(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

// 4. Tạo chuỗi sự kiện VEVENT
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

// 5. Danh sách các lễ cố định (Ngày, Tháng - 0 index)
const fixedHolidays = [
  { d: 1, m: 0, name: "ĐỨC MARIA - MẸ THIÊN CHÚA (Lễ Trọng)" },
  { d: 19, m: 2, name: "THÁNH GIUSE BẠN TRĂM NĂM ĐỨC MARIA (Lễ Trọng)" },
  { d: 25, m: 2, name: "LỄ TRUYỀN TIN (Lễ Trọng)" }, // Lưu ý: Có thể dời nếu trùng Tuần Thánh
  { d: 1, m: 4, name: "THÁNH GIUSE THỢ" },
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

  // 6. Lễ Thăng Thiên (Tại VN dời vào Chúa Nhật kế tiếp = Phục sinh + 42 ngày, gốc là +39)
  // Theo lịch VN thường dời vào Chúa Nhật VII Phục Sinh
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

  // 8. Lễ Mình Máu Thánh Chúa (Tại VN dời vào Chúa Nhật sau Lễ Chúa Ba Ngôi)
  // Chúa Ba Ngôi = Pent + 7, Mình Máu Thánh = Pent + 14
  const corpusChristi = addDays(pentecost, 14);
  icsContent.push(
    createEvent("LỄ MÌNH MÁU THÁNH CHÚA", corpusChristi, "Lễ Trọng.")
  );
}

icsContent.push("END:VCALENDAR");

// Ghi file
fs.writeFileSync(OUTPUT_FILE, icsContent.join("\r\n"), { encoding: "utf8" });
console.log(`Xong! File đã được tạo: ${OUTPUT_FILE}`);
