import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/user.js";
import cartRoutes from "./routes/cart.js";
import setupSwagger from "./swagger.js";

import { createRequire } from "module";
import { isLoggedIn } from "./middleware/auth.js";
const require = createRequire(import.meta.url);
const openapi = require("./openapi.json");

const app = express();
app.use(bodyParser.json());
app.use(morgan("dev"));
setupSwagger(app);

app.use(
  cors({
    origin: ["http://localhost:5173"], // địa chỉ frontend (vite)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // cho phép gửi cookie nếu có
  })
);

app.use("/api/v1/auth", authRoutes);

app.use(isLoggedIn);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/cart", cartRoutes);

// serve swagger json file
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapi));

app.get("/", (req, res) => res.send("SmartShop API running"));

export default app;
