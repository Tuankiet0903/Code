import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router";
import "./index.css";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <BrowserRouter>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        success: {
          style: {
            background: "#4ade80", // xanh lá Tailwind
            color: "#fff",
          },
        },
        error: {
          style: {
            background: "#ef4444", // đỏ Tailwind
            color: "#fff",
          },
        },
      }}
    />
  </BrowserRouter>
  // {/* </React.StrictMode> */}
);
