// src/components/Product/Nav.jsx
import React from "react";

export default function Nav({ token, user, onLogout, onNavigate }) {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        {/* Logo + menu */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => onNavigate("home")}
            className="text-2xl font-bold text-indigo-600 cursor-pointer"
          >
            SmartShop
          </div>

          {token && (
            <>
              <button
                onClick={() => onNavigate("home")}
                className="text-sm text-gray-700 hover:text-indigo-600 transition"
              >
                Home
              </button>
              <button
                onClick={() => onNavigate("cart")}
                className="text-sm text-gray-700 hover:text-indigo-600 transition"
              >
                Cart
              </button>
            </>
          )}
        </div>

        {/* User / Auth */}
        <div className="flex items-center gap-4">
          {token && (
            <>
              {user?.role === "ADMIN" && (
                <span
                  className="text-sm text-red-500 font-semibold cursor-pointer"
                  onClick={() => onNavigate("admin")}
                >
                  {user.role}
                </span>
              )}
              {user && (
                <span className="text-sm text-gray-600">
                  👤 {user.name || user.email}
                </span>
              )}
              <button
                onClick={onLogout}
                className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
