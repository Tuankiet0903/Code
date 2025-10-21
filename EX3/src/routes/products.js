// src/routes/products.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import cache from "../middleware/cache.js";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         sku:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         stock:
 *           type: integer
 *         categoryId:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *     ProductListResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 */

/**
 * GET /api/products?search=&category=&page=&limit=
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Get products with optional filtering and pagination
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for product name (case-insensitive)
 *       - in: query
 *         name: category
 *         schema:
 *           type: integer
 *         description: Category ID to filter products
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of products per page
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get(
  "/",
  cache((req) => {
    const { search = "", category = "", page = 1, limit = 20 } = req.query;
    return `products:${search}:${category}:${page}:${limit}`;
  }, 30),
  async (req, res) => {
    const { search, category, page = 1, limit = 20 } = req.query;
    const where = {};
    if (search) where.name = { contains: search, mode: "insensitive" };
    if (category) where.categoryId = Number(category);

    const products = await prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: products });
  }
);

/**
 * GET product by id
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get(
  "/:id",
  cache((req) => `product:${req.params.id}`, 60),
  async (req, res) => {
    const id = Number(req.params.id);
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  }
);

export default router;
