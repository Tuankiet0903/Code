import { createLogger, transports, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import fs from "fs";
import path from "path";

const logDir = path.join(process.cwd(), "logs");

// 🧱 Tạo thư mục logs nếu chưa tồn tại
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

// 🎯 Cấu hình 1 file log duy nhất mỗi ngày
const dailyRotateFile = new DailyRotateFile({
  filename: path.join(logDir, "server-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "30d",
});

// ⚙️ Format log dễ đọc
const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(
    ({ timestamp, level, message, stack }) =>
      `${timestamp} [${level.toUpperCase()}]: ${stack || message}`
  )
);

// 🚀 Tạo logger duy nhất
const logger = createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new transports.Console({ level: "debug" }),
    dailyRotateFile, // tất cả log chung 1 file
  ],
});

// 🧩 Bắt exception toàn cục (app crash)
logger.exceptions.handle(dailyRotateFile);

// 🧩 Bắt Promise bị reject mà không catch
process.on("unhandledRejection", (reason) => {
  logger.error(`Unhandled Promise Rejection: ${reason?.stack || reason}`);
});

export default logger;
