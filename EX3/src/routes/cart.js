import express from "express";
import { PrismaClient } from "@prisma/client";
import redis from "../services/redisClient.js";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         userId:
 *           type: integer
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *     CartItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         cartId:
 *           type: integer
 *         productId:
 *           type: integer
 *         quantity:
 *           type: integer
 *         product:
 *           $ref: '#/components/schemas/Product'
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
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         userId:
 *           type: integer
 *         total:
 *           type: number
 *         status:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *     OrderItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         orderId:
 *           type: integer
 *         productId:
 *           type: integer
 *         quantity:
 *           type: integer
 *         price:
 *           type: number
 *     AddToCartRequest:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: integer
 *         quantity:
 *           type: integer
 *           minimum: 1
 *     UpdateCartRequest:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: integer
 *         quantity:
 *           type: integer
 *           minimum: 0
 *     CheckoutRequest:
 *       type: object
 *       required:
 *         - items
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 */

/**
 * Lấy giỏ hàng của user
 * @swagger
 * /api/v1/cart:
 *   get:
 *     summary: Get user's cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's cart data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/", async (req, res) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    res.json(cart || { items: [] });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Thêm sản phẩm vào giỏ
 * @swagger
 * /api/v1/cart/add:
 *   post:
 *     summary: Add product to cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddToCartRequest'
 *     responses:
 *       200:
 *         description: Updated cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Validation error (e.g., insufficient stock)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
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
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/add", async (req, res) => {
  const { productId, quantity } = req.body;

  // Kiểm tra sản phẩm còn hàng không
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  if (product.stock < quantity) {
    return res.status(400).json({ error: "Not enough stock available" });
  }

  let cart = await prisma.cart.upsert({
    where: { userId: req.user.id },
    update: {},
    create: { userId: req.user.id },
  });

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  if (existing) {
    const newQty = existing.quantity + quantity;

    if (product.stock < newQty) {
      return res
        .status(400)
        .json({ error: "Cannot add more than available stock" });
    }

    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: newQty },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity },
    });
  }

  const updated = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: { items: { include: { product: true } } },
  });

  res.json(updated);
});

/**
 * Cập nhật số lượng sản phẩm
 * @swagger
 * /api/v1/cart/update:
 *   put:
 *     summary: Update product quantity in cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCartRequest'
 *     responses:
 *       200:
 *         description: Update successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Cart not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.put("/update", async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await prisma.cart.findUnique({
    where: { userId: req.user.id },
  });

  if (!cart) return res.status(404).json({ error: "Cart not found" });

  await prisma.cartItem.updateMany({
    where: { cartId: cart.id, productId },
    data: { quantity },
  });

  res.json({ message: "Updated" });
});

/**
 * Xóa sản phẩm khỏi giỏ
 * @swagger
 * /api/v1/cart/remove/{productId}:
 *   delete:
 *     summary: Remove product from cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID to remove
 *     responses:
 *       200:
 *         description: Removal successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Cart not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.delete("/remove/:productId", async (req, res) => {
  const productId = parseInt(req.params.productId);
  const cart = await prisma.cart.findUnique({
    where: { userId: req.user.id },
  });

  if (!cart) return res.status(404).json({ error: "Cart not found" });

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id, productId },
  });

  res.json({ message: "Removed" });
});

/**
 * Checkout
 * @swagger
 * /api/v1/cart/checkout:
 *   post:
 *     summary: Checkout cart and create order
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckoutRequest'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Validation error (e.g., empty cart, insufficient stock)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/checkout", async (req, res) => {
  const userId = req.user.id;
  const items = req.body.items;

  if (!items?.length) return res.status(400).json({ error: "Cart is empty" });

  try {
    const order = await prisma.$transaction(async (tx) => {
      let total = 0;
      const productMap = new Map();

      // 1️⃣ Check stock and lock rows
      for (const { productId, quantity } of items) {
        const [prod] =
          await tx.$queryRaw`SELECT id, stock, price FROM "Product" WHERE id = ${productId} FOR UPDATE`;
        if (!prod) throw new Error(`Product ${productId} not found`);
        if (prod.stock < quantity)
          throw new Error(`Insufficient stock for ${productId}`);
        total += Number(prod.price) * quantity;
        productMap.set(productId, prod);
      }

      // 2️⃣ Create order
      const createdOrder = await tx.order.create({
        data: { userId, total, status: "PAID" },
      });

      // 3️⃣ Update stock + create order items + logs
      for (const { productId, quantity } of items) {
        const prod = productMap.get(productId);

        await tx.product.update({
          where: { id: productId },
          data: { stock: { decrement: quantity }, version: { increment: 1 } },
        });

        await tx.orderItem.create({
          data: {
            orderId: createdOrder.id,
            productId,
            quantity,
            price: prod.price,
          },
        });

        await tx.inventoryLog.create({
          data: {
            productId,
            changeQty: -quantity,
            type: "SALE",
            reference: String(createdOrder.id),
          },
        });

        await redis.del(`product:${productId}`);
      }

      // 4️⃣ Optionally: clear user's cart
      await tx.cartItem.deleteMany({ where: { cart: { userId } } });

      return tx.order.findUnique({
        where: { id: createdOrder.id },
        include: { items: true },
      });
    });

    res.status(201).json({ message: "Order created", order });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || "Checkout failed" });
  }
});

export default router;
