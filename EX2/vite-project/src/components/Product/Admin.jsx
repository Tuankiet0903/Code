import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../services/api.js";

export default function AdminPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [catName, setCatName] = useState("");
  const [productForm, setProductForm] = useState({
    sku: "",
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
  });

  const [restock, setRestock] = useState({
    id: "",
    name: "",
    qty: "",
    search: "",
    showList: false,
    stock: "",
  });

  const [priceForm, setPriceForm] = useState({
    id: "",
    name: "",
    oldPrice: "",
    newPrice: "",
    search: "",
    showList: false,
  });

  // -------------------------
  // FETCH INITIAL DATA
  // -------------------------
  const fetchData = async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        api.getAllCategories(),
        api.getAllProducts(),
      ]);
      setCategories(catRes);
      setProducts(prodRes);
    } catch (err) {
      toast.error(err.response?.data?.error || "Error fetching data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // -------------------------
  // CATEGORY
  // -------------------------
  const handleCreateCategory = async () => {
    if (!catName) return toast.error("Enter category name");
    try {
      const res = await api.createCategory(catName);
      toast.success("Category created!");
      setCatName("");
      setCategories((prev) => [...prev, res]);
    } catch (err) {
      toast.error(err.response?.data?.error || "Error creating category");
    }
  };

  // -------------------------
  // PRODUCT
  // -------------------------
  const handleCreateProduct = async () => {
    const { sku, name, price, stock, categoryId } = productForm;

    if (!sku || !name || !price || !stock || !categoryId)
      return toast.error("Please fill all required fields");

    const newProduct = {
      ...productForm,
      price: Number(price),
      stock: Number(stock),
    };

    try {
      const res = await api.createProduct(newProduct);
      toast.success("Product created!");
      setProducts((prev) => [...prev, res]);

      // ✅ Reset form
      setProductForm({
        sku: "",
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.error || "Error creating product");
    }
  };

  // -------------------------
  // RESTOCK PRODUCT
  // -------------------------
  const handleSelectRestockProduct = (p) => {
    setRestock({
      ...restock,
      id: p.id,
      name: p.name,
      search: p.name, // ✅ hiển thị tên vào ô input
      showList: false, // ✅ ẩn danh sách
      stock: p.stock,
    });
  };

  const handleRestock = async () => {
    if (!restock.id || !restock.qty)
      return toast.error("Select product and quantity");
    try {
      const res = await api.restockProduct(restock.id, restock.qty);
      toast.success("Stock updated!");

      setProducts((prev) =>
        prev.map((p) =>
          p.id === Number(restock.id)
            ? {
                ...p,
                stock: res.stock ?? p.stock + Number(restock.qty),
              }
            : p
        )
      );

      setRestock({
        id: "",
        name: "",
        qty: "",
        search: "",
        showList: false,
      });
    } catch (err) {
      toast.error(err.response?.data?.error || "Error restocking");
    }
  };

  // -------------------------
  // UPDATE PRICE
  // -------------------------
  const handleSelectPriceProduct = (p) => {
    setPriceForm({
      ...priceForm,
      id: p.id,
      name: p.name,
      oldPrice: p.price,
      search: p.name, // ✅ hiển thị tên vào ô input
      showList: false, // ✅ ẩn danh sách
    });
  };

  const handleUpdatePrice = async () => {
    const { id, oldPrice, newPrice } = priceForm;
    if (!id || !newPrice) return toast.error("Select product and enter price");
    if (Number(newPrice) === Number(oldPrice))
      return toast.error("New price must be different from old price");

    try {
      await api.adjustPrice(id, newPrice);
      toast.success("Price updated!");

      setProducts((prev) =>
        prev.map((p) =>
          p.id === Number(id) ? { ...p, price: Number(newPrice) } : p
        )
      );

      setPriceForm({
        id: "",
        name: "",
        oldPrice: "",
        newPrice: "",
        search: "",
        showList: false,
      });
    } catch (err) {
      toast.error(err.response?.data?.error || "Error updating price");
    }
  };

  // -------------------------
  // RENDER
  // -------------------------
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>

      {/* CATEGORY */}
      <div className="bg-white shadow rounded-lg p-5 mb-8">
        <h2 className="text-lg font-medium mb-3">Create Category</h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Category name"
            className="border rounded px-3 py-2 flex-1"
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
          />
          <button
            onClick={handleCreateCategory}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>

      {/* CREATE PRODUCT */}
      <div className="bg-white shadow rounded-lg p-5 mb-8">
        <h2 className="text-lg font-medium mb-3">Create Product</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {["sku", "name", "description", "price", "stock"].map((key) => (
            <input
              key={key}
              type="text"
              placeholder={key}
              className="border rounded px-3 py-2"
              value={productForm[key]}
              onChange={(e) =>
                setProductForm({ ...productForm, [key]: e.target.value })
              }
            />
          ))}

          <select
            className="border rounded px-3 py-2"
            value={productForm.categoryId}
            onChange={(e) =>
              setProductForm({ ...productForm, categoryId: e.target.value })
            }
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleCreateProduct}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create Product
        </button>
      </div>

      {/* RESTOCK PRODUCT */}
      <div className="bg-white shadow rounded-lg p-5 mb-8 relative">
        <h2 className="text-lg font-medium mb-3">Restock Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          <div className="relative md:col-span-1">
            <input
              type="text"
              placeholder="Search product..."
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={restock.search}
              onFocus={() => setRestock({ ...restock, showList: true })}
              onChange={(e) => {
                const value = e.target.value;
                setRestock((prev) => ({
                  ...prev,
                  search: value,
                  // Nếu xoá hết input → reset luôn product đã chọn
                  ...(value.trim() === ""
                    ? { id: "", name: "", stock: "", qty: "" }
                    : {}),
                }));
              }}
            />

            {restock.showList && restock.search && (
              <ul className="absolute left-0 top-full mt-0.5 w-full bg-white border border-gray-200 rounded-md shadow-md z-20 max-h-60 overflow-y-auto">
                {products
                  .filter((p) =>
                    p.name.toLowerCase().includes(restock.search.toLowerCase())
                  )
                  .slice(0, 20)
                  .map((p) => (
                    <li
                      key={p.id}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition"
                      onClick={() => handleSelectRestockProduct(p)}
                    >
                      <span className="font-medium text-gray-800">
                        {p.name}
                      </span>
                      <span className="text-gray-500 text-sm ml-2">
                        #{p.id}
                      </span>
                    </li>
                  ))}
              </ul>
            )}
          </div>
          <input
            type="number"
            placeholder="Old stock"
            className="border rounded px-3 py-2"
            value={restock.stock}
            disabled
          />

          <input
            type="number"
            placeholder="Quantity"
            className="border rounded px-3 py-2"
            value={restock.qty}
            onChange={(e) => setRestock({ ...restock, qty: e.target.value })}
          />
        </div>

        <button
          onClick={handleRestock}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Restock
        </button>
      </div>

      {/* UPDATE PRICE */}
      <div className="bg-white shadow rounded-lg p-5 relative">
        <h2 className="text-lg font-medium mb-3">Update Product Price</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          <div className="relative md:col-span-1">
            <input
              type="text"
              placeholder="Search product..."
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={priceForm.search}
              onFocus={() => setPriceForm({ ...priceForm, showList: true })}
              onChange={(e) => {
                const value = e.target.value;
                setPriceForm((prev) => ({
                  ...prev,
                  search: value,
                  // Nếu xoá hết input → reset luôn product đã chọn
                  ...(value.trim() === ""
                    ? { id: "", name: "", oldPrice: "", newPrice: "" }
                    : {}),
                }));
              }}
            />

            {priceForm.showList && priceForm.search && (
              <ul className="absolute left-0 top-full mt-0.5 w-full bg-white border border-gray-200 rounded-md shadow-md z-20 max-h-60 overflow-y-auto">
                {products
                  .filter((p) =>
                    p.name
                      .toLowerCase()
                      .includes(priceForm.search.toLowerCase())
                  )
                  .slice(0, 20)
                  .map((p) => (
                    <li
                      key={p.id}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition"
                      onClick={() => handleSelectPriceProduct(p)}
                    >
                      <span className="font-medium text-gray-800">
                        {p.name}
                      </span>
                      <span className="text-gray-500 text-sm ml-2">
                        #{p.id}
                      </span>
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <input
            type="number"
            placeholder="Old price"
            className="border rounded px-3 py-2"
            value={priceForm.oldPrice}
            disabled
          />
          <input
            type="number"
            placeholder="New price"
            className="border rounded px-3 py-2"
            value={priceForm.newPrice}
            onChange={(e) =>
              setPriceForm({ ...priceForm, newPrice: e.target.value })
            }
          />
        </div>

        <button
          onClick={handleUpdatePrice}
          className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
        >
          Update Price
        </button>
      </div>
    </div>
  );
}
