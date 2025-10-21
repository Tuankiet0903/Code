// src/App.jsx
import React, { useState, useEffect } from "react";
import Home from "../components/Product/Home.jsx";
import Login from "../components/Product/Login.jsx";
import Nav from "../components/Product/Nav.jsx";
import { getProfile } from "../services/api.js";
import Cart from "../components/Product/Cart.jsx";
import Admin from "../components/Product/Admin.jsx";

export default function ProductPage() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home"); // home | cart

  // Khi token thay đổi → fetch thông tin người dùng
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        localStorage.removeItem("token");
        setUser(null);
        return;
      }
      localStorage.setItem("token", token);
      try {
        const data = await getProfile(token);
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setUser(null);
        localStorage.removeItem("token");
        setToken(null);
      }
    };
    loadUser();
  }, [token]);

  // Hàm đăng xuất
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Nav
        token={token}
        user={user}
        onLogout={handleLogout}
        onNavigate={setPage}
      />

      <main>
        {!token ? (
          <div className="flex justify-center items-center min-h-[calc(100vh-20rem)]">
            <Login onLogin={(t) => setToken(t)} />
          </div>
        ) : (
          <>
            {page === "home" && <Home token={token} user={user} />}
            {page === "cart" && <Cart />}
            {page === "admin" && <Admin />}
          </>
        )}
      </main>
    </div>
  );
}
