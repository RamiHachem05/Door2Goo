// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/error.js";

import authRoutes from "./routes/auth.routes.js";
import productsRoutes from "./routes/products.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import checkoutRoutes from "./routes/checkout.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import driverRoutes from "./routes/driver.routes.js";

dotenv.config();

const app = express();

// --- middleware ---
app.use(cors());
app.use(express.json());

// --- connect to MongoDB ---
connectDB();

// --- test route ---
app.get("/", (req, res) => {
  res.send("Door2Go API is running");
});

// --- API routes ---
app.use("/api/auth", authRoutes);          // ⬅️ THIS WAS MISSING
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/driver", driverRoutes);

// --- error handlers ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;     // use 5000 for backend
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
