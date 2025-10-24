import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/user.js";
import cartRoutes from "./routes/cart.js";
import setupSwagger from "./swagger.js";

import { isLoggedIn } from "./middleware/auth.js";
import morganLogger from "./utils/morganLogger.js";
import logger from "./utils/logger.js";

const app = express();
app.use(bodyParser.json());
app.use(morganLogger);
setupSwagger(app);

app.use(
  cors({
    origin: ["http://localhost:5173"], // địa chỉ frontend (vite)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.get("/", (req, res) => res.send("SmartShop API running"));

app.use("/api/v1/auth", authRoutes);

app.use(isLoggedIn);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/cart", cartRoutes);

export default app;
