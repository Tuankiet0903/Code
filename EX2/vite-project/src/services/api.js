// src/services/ProductApi.js
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// ✅ Thêm token vào tất cả request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Xử lý lỗi chung
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message = error.response.data?.message || error.response.statusText;
      throw new Error(`API Error (${error.response.status}): ${message}`);
    } else if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
);

function getToken() {
  return localStorage.getItem("token");
}

/* =======================
   🛒 CART API FUNCTIONS
   ======================= */

/**
 * getCart()
 * - Requires token
 * - GET /api/cart
 */
export async function getCart() {
  const token = getToken();
  if (!token) throw new Error("Login required to view cart.");

  const response = await apiClient.get("/cart");
  return response.data;
}

/**
 * addToCart(productId, quantity)
 * - Requires token
 * - POST /api/cart/add
 */
export async function addToCart(productId, quantity = 1) {
  const token = getToken();
  if (!token) throw new Error("Login required to add to cart.");

  const response = await apiClient.post("/cart/add", { productId, quantity });
  return response.data;
}

/**
 * removeFromCart(productId)
 * - Requires token
 * - DELETE /api/cart/remove/:productId
 */
export async function updateCartQuantity(productId, newQuantity) {
  const token = getToken();
  if (!token) throw new Error("Login required to update cart.");

  const response = await apiClient.put(`/cart/update/`, {
    productId: productId,
    quantity: newQuantity,
  });
  return response.data;
}

/**
 * removeFromCart(productId)
 * - Requires token
 * - DELETE /api/cart/remove/:productId
 */
export async function removeFromCart(productId) {
  const token = getToken();
  if (!token) throw new Error("Login required to remove items.");

  const response = await apiClient.delete(`/cart/remove/${productId}`);
  return response.data;
}

/**
 * checkout()
 * - Requires token
 * - POST /api/cart/checkout
 */
export async function checkout(cart) {
  const token = getToken();
  if (!token) throw new Error("Login required to checkout.");

  const response = await apiClient.post("/cart/checkout", { items: cart });
  return response.data;
}

/* =======================
   🧾 ORDERS & PRODUCTS
   ======================= */

/**
 * createOrder(items)
 * Optional manual order creation
 */
export async function createOrder(items) {
  const response = await apiClient.post("/orders", { items });
  return response.data;
}

/**
 * fetchProducts
 * Get paginated products with optional search/category filters
 */
export async function fetchProducts({
  page = 1,
  limit = 20,
  search = "",
  category,
} = {}) {
  const response = await apiClient.get("/products", {
    params: {
      page,
      limit,
      search: search || undefined,
      category: category || undefined,
    },
  });
  return response.data;
}

/* =======================
   🔐 AUTH FUNCTIONS
   ======================= */

/**
 * login(email, password)
 * Authenticate user and return token
 */
export async function login(email, password) {
  const response = await apiClient.post("/auth/login", { email, password });
  return response.data;
}

/**
 * getProfile(token)
 * Get current user profile by decoding token
 */
export async function getProfile(token) {
  const user = jwtDecode(token);
  const response = await apiClient.get(`/users/${user.userId}`);
  return response.data;
}

/* =======================
   🔐 ADMIN FUNCTIONS
   ======================= */

export async function getAllCategories() {
  const response = await apiClient.get("admin/categories");
  return response.data;
}

export async function getAllProducts() {
  const response = await apiClient.get("admin/products");
  return response.data;
}

export async function createCategory(name) {
  const response = await apiClient.post("admin/categories", { name });
  return response.data;
}

export async function createProduct(product) {
  const response = await apiClient.post("admin/products", { product });
  return response.data;
}

export async function restockProduct(productId, quantity) {
  const response = await apiClient.post(`admin/products/${productId}/restock`, {
    stock: quantity,
    reference: "RESTOCK",
  });
  return response.data;
}

export async function adjustPrice(productId, newPrice) {
  const response = await apiClient.post(`admin/products/${productId}/price`, {
    price: newPrice,
  });
  return response.data;
}

// Export default helpers
export default {
  getCart,
  addToCart,
  removeFromCart,
  checkout,
  createOrder,
  fetchProducts,
  login,
  getProfile,
  apiClient,
  getAllCategories,
  getAllProducts,
  createCategory,
  createProduct,
  restockProduct,
  adjustPrice,
};
