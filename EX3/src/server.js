import dotenv from "dotenv";
import logger from "./utils/logger.js";
import app from "./app.js";

dotenv.config();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`SmartShop backend listening on port ${port}`);
});
