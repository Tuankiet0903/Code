import React, { useState } from "react";
import ProductList from "./ProductList.jsx";
import { addToCart as apiAddToCart } from "../../services/api.js";
import toast from "react-hot-toast";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [activeQuery, setActiveQuery] = useState(""); // query thực sự đang được áp dụng

  const addToCart = async (product) => {
    setLoading(true);
    try {
      await apiAddToCart(product.id, 1, {
        name: product.name,
        price: product.price,
      });
      toast.success(`🛒 Added "${product.name}" to cart!`);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add product to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setActiveQuery(searchInput.trim());
  };

  const handleClear = (setPage) => {
    setSearchInput("");
    setActiveQuery("");
    setPage(1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="space-y-6 mt-10 pb-10">
      {/* Search bar */}
      <div className="flex items-center justify-center gap-3">
        <div className="w-full max-w-2xl">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search products by name or SKU..."
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Search
        </button>

        <button
          onClick={handleClear}
          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Clear
        </button>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mx-40 my-10">
        <div className="lg:col-span-3">
          <ProductList
            onAddToCart={addToCart}
            disabled={loading}
            searchQuery={activeQuery}
          />
        </div>
      </div>
    </div>
  );
}
