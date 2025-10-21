// src/middleware/auth.js
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Kiểm tra đã đăng nhập chưa (chỉ cần có token hợp lệ)
export const isLoggedIn = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// ✅ Middleware tổng hợp (cho phép check quyền admin)
export const authMiddleware =
  (opts = {}) =>
  async (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = header.split(" ")[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user) return res.status(401).json({ error: "User not found" });
      if (opts.admin && user.role !== "ADMIN") {
        return res.status(403).json({ error: "Admin only" });
      }

      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };

export default authMiddleware;
