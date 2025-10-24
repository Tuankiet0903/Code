import dotenv from "dotenv";
import logger from "./utils/logger.js";
import app from "./app.js";

dotenv.config();

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  logger.info(`🚀 Server started on port ${port}`);
});

server.on("error", (err) => {
  logger.error(`Server error: ${err.message}`);
});

process.on("SIGINT", () => {
  logger.info("🛑 Server shutting down...");
  server.close(() => {
    logger.info("✅ Server closed gracefully");
    process.exit(0);
  });
});

// Bắt lỗi Promise chưa được xử lý
process.on("unhandledRejection", (reason, promise) => {
  logger.error(`Unhandled Rejection: ${reason}`);
});

// Bắt lỗi chưa được bắt trong toàn app
process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  logger.error(err.stack);
  // Nếu cần restart app sau crash:
  process.exit(1);
});
