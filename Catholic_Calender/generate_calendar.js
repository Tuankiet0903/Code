const fs = require("fs");
const { Lunar } = require("lunar-javascript");

// CẤU HÌNH NĂM
const START_YEAR = 2026;
const END_YEAR = 2030;
const OUTPUT_FILE = "LichPhungVu_2026-2030.ics";

// --- CÁC HÀM TIỆN ÍCH ---

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
  const nov30 = new Date(year, 10, 30);
  const dayOfWeek = nov30.getDay();
  
  if (dayOfWeek === 0) return nov30;
  
  if (dayOfWeek < 4) {
    return addDays(nov30, -dayOfWeek);
  } else {
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
  const dtEnd = formatDateICS(addDays(dateObj, 1));

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

// --- TỪ ĐIỂN CAN CHI ---
const CAN_MAP = {
  "甲": "Giáp", "乙": "Ất", "丙": "Bính", "丁": "Đinh", "戊": "Mậu",
  "己": "Kỷ", "庚": "Canh", "辛": "Tân", "壬": "Nhâm", "癸": "Quý"
};
const CHI_MAP = {
  "子": "Tý", "丑": "Sửu", "寅": "Dần", "卯": "Mão", "辰": "Thìn", "巳": "Tỵ",
  "午": "Ngọ", "未": "Mùi", "申": "Thân", "酉": "Dậu", "戌": "Tuất", "亥": "Hợi"
};

// 6. Hàm lấy các ngày Tết Nguyên Đán
function getTetHolidays(year) {
  // Tìm ngày Mồng 1 Tết Âm Lịch cho năm Dương Lịch `year`
  // Bắt đầu tìm từ 20/1
  let date = new Date(year, 0, 20); 
  while (true) {
    const lunar = Lunar.fromDate(date);
    if (lunar.getMonth() === 1 && lunar.getDay() === 1) {
      // Đã tìm thấy mồng 1 Tết
      const m1 = new Date(date);
      const m2 = addDays(m1, 1);
      const m3 = addDays(m1, 2);
      
      const can = CAN_MAP[lunar.getYearGan()] || lunar.getYearGan();
      const chi = CHI_MAP[lunar.getYearZhi()] || lunar.getYearZhi();
      const zodiacYear = `${can} ${chi}`; // Ví dụ: Bính Ngọ
      
      return {
        events: [
          { date: m1, name: `MỒNG 1 TẾT ${zodiacYear}`, desc: "Cầu bình an cho năm mới." },
          { date: m2, name: `MỒNG 2 TẾT`, desc: "Kính nhớ Tổ Tiên, Ông Bà, Cha Mẹ." },
          { date: m3, name: `MỒNG 3 TẾT`, desc: "Thánh hóa công ăn việc làm." }
        ],
        dates: [m1, m2, m3] // Để check trùng
      };
    }
    date.setDate(date.getDate() + 1);
  }
}

// 7. Hàm so sánh 2 ngày (chỉ so ngày tháng năm)
function isSameDate(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}


// --- DỮ LIỆU CỐ ĐỊNH ---

const fixedHolidays = [
  { d: 1, m: 0, name: "ĐỨC MARIA, MẸ THIÊN CHÚA (Lễ Trọng)" },
  { d: 6, m: 0, name: "CHÚA HIỂN LINH (Thường dời vào CN)" },
  { d: 19, m: 2, name: "THÁNH GIUSE, BẠN TRĂM NĂM ĐỨC MARIA (Lễ Trọng)" },
  { d: 25, m: 2, name: "LỄ TRUYỀN TIN (Lễ Trọng)" },
  { d: 1, m: 4, name: "THÁNH GIUSE THỢ" },
  { d: 24, m: 5, name: "SINH NHẬT THÁNH GIOAN TẨY GIẢ (Lễ Trọng)" },
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
  // A. XỬ LÝ LỄ BÌNH THƯỜNG (CỐ ĐỊNH)
  fixedHolidays.forEach((h) => {
    const date = new Date(year, h.m, h.d);
    icsContent.push(createEvent(h.name, date, "Lễ cố định"));
  });

  // B. XỬ LÝ TẾT NGUYÊN ĐÁN
  const tetInfo = getTetHolidays(year);
  tetInfo.events.forEach(ev => {
    icsContent.push(createEvent(ev.name, ev.date, ev.desc));
  });

  // C. XỬ LÝ LỄ CHUYỂN DỊCH (Dựa trên Phục Sinh)
  const easterDate = getEasterDate(year);

  // 1. Lễ Tro
  let ashWed = addDays(easterDate, -46);
  
  // -- KIỂM TRA TRÙNG TẾT --
  // Nếu Lễ Tro trùng M1, M2 hoặc M3 Tết => Dời sang ngày ngay sau M3 (tức là M4)
  const isConflict = tetInfo.dates.some(tetDate => isSameDate(tetDate, ashWed));
  
  if (isConflict) {
    console.log(`>> Năm ${year}: Lễ Tro trùng Tết! Dời sang sau Mồng 3.`);
    // Ngày Mồng 3 là tetInfo.dates[2]
    ashWed = addDays(tetInfo.dates[2], 1);
  }

  icsContent.push(
    createEvent("LỄ TRO", ashWed, "Bắt đầu Mùa Chay. Giữ chay và kiêng thịt.")
  );

  // 2. Lễ Lá
  const palmSun = addDays(easterDate, -7);
  icsContent.push(
    createEvent("CHÚA NHẬT LỄ LÁ", palmSun, "Tưởng niệm cuộc thương khó của Chúa.")
  );

  // 3. Tuần Thánh
  const holyThu = addDays(easterDate, -3);
  icsContent.push(createEvent("THỨ NĂM TUẦN THÁNH", holyThu, "Thánh lễ Tiệc Ly."));

  const goodFri = addDays(easterDate, -2);
  icsContent.push(createEvent("THỨ SÁU TUẦN THÁNH", goodFri, "Tưởng niệm cuộc thương khó. Ăn chay kiêng thịt."));

  // 4. Phục Sinh
  icsContent.push(createEvent("ĐẠI LỄ PHỤC SINH", easterDate, "Mừng Chúa Sống Lại."));

  // 5. Thăng Thiên
  const ascension = addDays(easterDate, 42);
  icsContent.push(createEvent("LỄ CHÚA THĂNG THIÊN", ascension, "Chúa lên trời (Dời vào Chúa Nhật)."));

  // 6. Hiện Xuống
  const pentecost = addDays(easterDate, 49);
  icsContent.push(createEvent("CHÚA THÁNH THẦN HIỆN XUỐNG", pentecost, "Kết thúc Mùa Phục Sinh."));

  // 7. Chúa Ba Ngôi
  const trinity = addDays(easterDate, 56);
  icsContent.push(createEvent("LỄ CHÚA BA NGÔI", trinity, "Lễ Trọng."));

  // 8. Mình Máu Thánh
  const corpusChristi = addDays(easterDate, 63);
  icsContent.push(createEvent("LỄ MÌNH MÁU THÁNH CHÚA", corpusChristi, "Lễ Trọng (Dời vào Chúa Nhật)."));

  // 9. Thánh Tâm
  const sacredHeart = addDays(easterDate, 68);
  icsContent.push(createEvent("LỄ THÁNH TÂM CHÚA GIÊSU", sacredHeart, "Lễ Trọng."));

  // D. MÙA VỌNG & CUỐI NĂM
  const advent1 = getAdventSunday(year);
  icsContent.push(createEvent("CHÚA NHẬT I MÙA VỌNG", advent1, "Khởi đầu Năm Phụng Vụ mới."));

  const christKing = addDays(advent1, -7);
  icsContent.push(createEvent("LỄ CHÚA KITÔ VUA", christKing, "Kết thúc Năm Phụng Vụ."));
}

icsContent.push("END:VCALENDAR");

fs.writeFileSync(OUTPUT_FILE, icsContent.join("\r\n"), { encoding: "utf8" });
console.log(`Xong! File đã được tạo: ${OUTPUT_FILE}`);
