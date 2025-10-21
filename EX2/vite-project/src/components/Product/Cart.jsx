import { useEffect, useState } from "react";
import {
  checkout,
  getCart,
  removeFromCart,
  updateCartQuantity, // 🆕 API update số lượng
} from "../../services/api.js";
import toast from "react-hot-toast";

function mapCartItems(apiCart) {
  if (!apiCart || !Array.isArray(apiCart.items)) return [];
  return apiCart.items.map((item) => ({
    id: item.productId,
    name: item.product?.name || "Unknown Product",
    price: item.product?.price || 0,
    quantity: item.quantity || 1,
    image: item.product?.image || "https://placehold.co/60",
    code: item.product?.sku || "#000000",
    stock: item.product?.stock || 0,
  }));
}

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [alertMsg, setAlertMsg] = useState({});

  const showAlert = (id, message) => {
    setAlertMsg((prev) => ({ ...prev, [id]: message }));
    setTimeout(() => {
      setAlertMsg((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }, 3000);
  };

  const handleQuantityChange = async (item, newQuantity) => {
    // 🧩 Kiểm tra ràng buộc trước khi gọi API
    if (newQuantity < 1) {
      showAlert(item.id, "⚠️ Quantity cannot be less than 1");
      return;
    }
    if (item.stock && newQuantity > item.stock) {
      showAlert(item.id, "⚠️ Quantity exceeds available stock");
      return;
    }

    try {
      // 🛠️ Gọi API update số lượng
      await updateCartQuantity(item.id, newQuantity);

      // 🧮 Cập nhật local state sau khi thành công
      setCart((prevCart) =>
        prevCart.map((p) =>
          p.id === item.id ? { ...p, quantity: newQuantity } : p
        )
      );
    } catch (err) {
      console.error("Failed to update quantity:", err);
      showAlert(item.id, "⚠️ Failed to update quantity on server");
    }
  };

  const loadCart = async () => {
    try {
      const data = await getCart();
      setCart(mapCartItems(data));
    } catch (err) {
      console.error("Failed to load cart:", err);
    }
  };

  const handleRemove = async (productId) => {
    await removeFromCart(productId);
    loadCart();
  };

  const handleCheckout = async () => {
    try {
      const items = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      await checkout(items);
      toast.success("Checkout successful! 🎉");
      loadCart();
    } catch (err) {
      toast.error(err.message || "Checkout failed");
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  if (!cart.length)
    return (
      <div className="p-6 text-center text-gray-500">Your cart is empty 🛒</div>
    );

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = 25;
  const total = subtotal - discount;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 🛍️ Left Section — Cart Items */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold mb-2 text-center">Shopping Cart</h2>

        <div className="space-y-4 text-start">
          {cart.map((item) => (
            <div key={item.id} className="border-b pb-4 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md border"
                  />
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.code}</p>
                    <p className="text-sm text-gray-500">
                      STOCK : {item.stock}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <p>${item.price}</p>
                  <div className="flex items-center border rounded-md">
                    <button
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      onClick={() =>
                        handleQuantityChange(item, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <input
                      className="px-3 w-[40px] outline-hidden text-center"
                      type="text"
                      min="1"
                      max={item.stock || 9999}
                      value={item.quantity}
                      onChange={(e) => {
                        const newQty = parseInt(e.target.value, 10) || 1;
                        handleQuantityChange(item, newQty);
                      }}
                    />

                    <button
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      onClick={() =>
                        handleQuantityChange(item, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <p className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {alertMsg[item.id] && (
                <div className="text-red-500 text-md mt-1 flex items-center gap-1 pl-28">
                  {alertMsg[item.id]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 💳 Right Section — Summary */}
      <div className="border p-6 rounded-md space-y-4 h-fit">
        <h3 className="font-semibold text-lg">Discount / Promo Code</h3>
        <p className="text-sm text-gray-500">
          Don’t have any code yet?{" "}
          <a href="#" className="text-blue-600 underline">
            Go to our promotional program
          </a>
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Promo Code Here"
            className="border px-3 py-2 rounded-md w-full"
          />
          <button className="bg-black text-white px-4 rounded-md hover:bg-gray-800">
            Apply
          </button>
        </div>

        <div className="border-t pt-4 space-y-2 text-sm">
          <p>
            <span className="font-medium">Address:</span> Kyla Olsen Ap
            #1651-8679 Sodales Av. Tamuning PA 10855
          </p>
          <p>
            Discount: <span className="font-medium">${discount}.00</span>
          </p>
          <p className="text-lg font-semibold">Total: ${total.toFixed(2)}</p>
          <button
            onClick={handleCheckout}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md mt-4"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
