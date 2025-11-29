import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 2600,
        style: {
          background: "#020617",
          color: "#f9fafb",
          border: "1px solid rgba(148, 163, 184, 0.4)",
          fontSize: "0.9rem",
        },
        success: {
          iconTheme: {
            primary: "#22c55e",
            secondary: "#022c22",
          },
        },
        error: {
          iconTheme: {
            primary: "#f97373",
            secondary: "#450a0a",
          },
        },
      }}
    />
  </BrowserRouter>
);
