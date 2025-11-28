import express from "express";
import Product from "../models/Product.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// GET /api/products
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.post(
  "/bulk-safe",
  requireAuth,
  requireRole("admin"),
  async (req, res) => {
    try {
      const products = req.body;

      let inserted = 0;

      for (const p of products) {
        const exists = await Product.findOne({ name: p.name });
        if (!exists) {
          await Product.create(p);
          inserted++;
        }
      }

      res.json({ message: `✅ ${inserted} missing products inserted safely` });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

router.post(
  "/bulk",
  requireAuth,
  requireRole("admin"),
  async (req, res) => {
    const products = await Product.insertMany(req.body);
    res.status(201).json(products);
  }
);

router.delete(
  "/",
  requireAuth,
  requireRole("admin"),
  async (req, res) => {
    try {
      await Product.deleteMany({});
      res.json({ message: "✅ All products deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// Admin-only: create product
router.post(
  "/",
  requireAuth,
  requireRole("admin"),
  async (req, res) => {
    try {
      const product = await Product.create(req.body);
      res.status(201).json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Admin-only: update
router.put(
  "/:id",
  requireAuth,
  requireRole("admin"),
  async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!product) return res.status(404).json({ message: "Product not found" });
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Admin-only: delete
router.delete(
  "/:id",
  requireAuth,
  requireRole("admin"),
  async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) return res.status(404).json({ message: "Product not found" });
      res.json({ message: "Deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;
