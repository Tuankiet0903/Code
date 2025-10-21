import express from "express";
import { PrismaClient } from "@prisma/client";
import auth from "../middleware/auth.js";
import redis from "../services/redisClient.js";
import Joi from "joi";

const prisma = new PrismaClient();
const router = express.Router();

// All routes protected and admin-only
router.use(auth({ admin: true }));

/**
 * Validation Schemas
 */
const categorySchema = Joi.object({
  name: Joi.string().min(1).required(),
});

const productSchema = Joi.object({
  sku: Joi.string().min(1).required(),
  name: Joi.string().min(1).required(),
  description: Joi.string().allow(""),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).required(),
  categoryId: Joi.number().integer().required(),
});

const restockSchema = Joi.object({
  stock: Joi.number().integer().positive().required(),
  reference: Joi.string().allow(""),
});

const priceSchema = Joi.object({
  price: Joi.number().positive().required(),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *     CategoryInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
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
 *         version:
 *           type: integer
 *     ProductSummary:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         stock:
 *           type: integer
 *         categoryId:
 *           type: integer
 *     ProductInput:
 *       type: object
 *       required:
 *         - sku
 *         - name
 *         - price
 *         - stock
 *         - categoryId
 *       properties:
 *         sku:
 *           type: string
 *           minLength: 1
 *         name:
 *           type: string
 *           minLength: 1
 *         description:
 *           type: string
 *         price:
 *           type: number
 *           minimum: 0
 *         stock:
 *           type: integer
 *           minimum: 0
 *         categoryId:
 *           type: integer
 *     RestockInput:
 *       type: object
 *       required:
 *         - stock
 *       properties:
 *         stock:
 *           type: integer
 *           minimum: 1
 *         reference:
 *           type: string
 *     PriceInput:
 *       type: object
 *       required:
 *         - price
 *       properties:
 *         price:
 *           type: number
 *           minimum: 0
 */

/**
 * GET /categories
 * @swagger
 * /api/v1/admin/categories:
 *   get:
 *     summary: Get all categories
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
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
router.get("/categories", async (req, res) => {
  try {
    const cacheKey = "categories:all";
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const categories = await prisma.category.findMany({
      orderBy: { id: "asc" },
    });

    await redis.set(cacheKey, JSON.stringify(categories), "EX", 60); // 1 min cache
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

/**
 * GET /products
 * @swagger
 * /api/v1/admin/products:
 *   get:
 *     summary: Get all products
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductSummary'
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
router.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const cacheKey = `products:all:${page}:${limit}`;
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const products = await prisma.product.findMany({
      skip: (page - 1) * limit,
      take: Number(limit),
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        categoryId: true,
      },
      orderBy: { id: "asc" },
    });

    await redis.set(cacheKey, JSON.stringify(products), "EX", 60); // 1 min cache
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

/**
 * POST /categories
 * @swagger
 * /api/v1/admin/categories:
 *   post:
 *     summary: Create a category
 *     tags:
 *       - Categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       201:
 *         description: Created category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Validation error
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
router.post("/categories", async (req, res) => {
  try {
    const { error, value } = categorySchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const category = await prisma.category.create({ data: value });
    await redis.del("categories:all"); // invalidate cache
    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create category" });
  }
});

/**
 * POST /products
 * @swagger
 * /api/v1/admin/products:
 *   post:
 *     summary: Create a product
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product:
 *                 $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Created product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
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
router.post("/products", async (req, res) => {
  try {
    const { product } = req.body;
    const { error, value } = productSchema.validate(product);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const created = await prisma.product.create({ data: value });
    await redis.flushall(); // simple approach, can optimize
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

/**
 * POST /products/:id/restock
 * @swagger
 * /api/v1/admin/products/{id}/restock:
 *   post:
 *     summary: Restock a product
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RestockInput'
 *     responses:
 *       200:
 *         description: Updated product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
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
router.post("/products/:id/restock", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { error, value } = restockSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.product.update({
        where: { id },
        data: { stock: { increment: value.stock }, version: { increment: 1 } },
      });
      await tx.inventoryLog.create({
        data: {
          productId: id,
          type: "RESTOCK",
          changeQty: value.stock,
          reference: value.reference || null,
        },
      });
      return updated;
    });

    await redis.del(`product:${id}`);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to restock product" });
  }
});

/**
 * POST /products/:id/price
 * @swagger
 * /api/v1/admin/products/{id}/price:
 *   post:
 *     summary: Adjust product price
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PriceInput'
 *     responses:
 *       200:
 *         description: Updated product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
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
router.post("/products/:id/price", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { error, value } = priceSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.product.update({
        where: { id },
        data: { price: value.price, version: { increment: 1 } },
      });

      await tx.inventoryLog.create({
        data: {
          productId: id,
          type: "ADJUSTMENT",
          changeQty: 0,
          reference: "Adjust price",
        },
      });

      return updated;
    });

    await redis.del(`product:${id}`);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to adjust product price" });
  }
});

export default router;
