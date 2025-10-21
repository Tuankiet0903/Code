import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard.jsx";
import { fetchProducts } from "../../services/api.js";
import toast from "react-hot-toast";

export default function ProductList({ onAddToCart, disabled, searchQuery }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (searchQuery === "") {
      setPage(1);
    }
  }, [searchQuery]);

  // Gọi lại API mỗi khi searchQuery hoặc page thay đổi
  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchQuery]);

  async function loadProducts() {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (searchQuery) params.search = searchQuery;

      const res = await fetchProducts(params);
      setProducts(res.data || res);
    } catch (e) {
      console.error("Failed to fetch products:", e);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-48 bg-gray-100 animate-pulse rounded-xl"
              />
            ))
          : products.length > 0
          ? products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAdd={onAddToCart}
                disabled={disabled}
              />
            ))
          : !loading && (
              <div className="col-span-3 text-center text-gray-500 py-8">
                No products found
              </div>
            )}
      </div>

      <div className="flex items-center justify-between mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 bg-slate-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <div>Page {page}</div>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-slate-200 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
