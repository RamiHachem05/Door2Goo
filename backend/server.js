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

// ✅ ✅ ✅ FINAL PRODUCTION-SAFE CORS (FIXES YOUR BUGS FOREVER)
app.use(
  cors({
    origin: true,        // ✅ Allows ALL correct frontends (Vercel + local + previews)
    credentials: true,  // ✅ Allows cookies/auth headers if needed
  })
);

app.use(express.json());

// ✅ MongoDB Connection
connectDB();

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.send("✅ Door2Go API is running correctly");
});

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/driver", driverRoutes);

// ✅ Error Handlers
app.use(notFound);
app.use(errorHandler);

// ✅ Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
