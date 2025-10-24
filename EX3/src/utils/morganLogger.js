import morgan from "morgan";
import logger from "./logger.js";

// Custom readable format — không màu, chỉ text rõ ràng
const readableFormat = (tokens, req, res) => {
  const status = res.statusCode;
  const responseTime = tokens["response-time"](req, res);
  const remoteAddr = tokens["remote-addr"](req, res);
  const method = tokens.method(req, res);
  const url = tokens.url(req, res);

  return `[${tokens.date(
    req,
    res,
    "iso"
  )}] ${method} ${url} | Status: ${status} | Time: ${responseTime} ms | IP: ${remoteAddr}`;
};

// Ghi log qua Winston
const morganLogger = morgan(readableFormat, {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
});

export default morganLogger;
