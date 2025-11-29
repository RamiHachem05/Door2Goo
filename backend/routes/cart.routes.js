import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// ✅ GET USER CART
router.get("/", requireAuth, requireRole("customer"), async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id })
    .populate("items.productId");

  res.json(cart || { userId: req.user._id, items: [] });
});

// ✅ ADD TO CART
router.post("/add", requireAuth, requireRole("customer"), async (req, res) => {
  const { productId } = req.body;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    cart = await Cart.create({ userId: req.user._id, items: [] });
  }

  const existing = cart.items.find(
    (i) => i.productId.toString() === productId
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.items.push({ productId, quantity: 1 });
  }

  await cart.save();
  res.json(cart);
});

router.post("/decrease", requireAuth, async (req, res) => {
  const { productId } = req.body;

  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const item = cart.items.find(i => i.productId.toString() === productId);

  if (!item) return res.status(404).json({ message: "Item not found" });

  item.quantity--;

  if (item.quantity <= 0) {
    cart.items = cart.items.filter(i => i.productId.toString() !== productId);
  }

  await cart.save();
  res.json(cart);
});

// ✅ REMOVE FROM CART
router.post("/remove", requireAuth, requireRole("customer"), async (req, res) => {
  const { productId } = req.body;

  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) return res.json({ userId: req.user._id, items: [] });

  cart.items = cart.items.filter(
    (i) => i.productId.toString() !== productId
  );

  await cart.save();
  res.json(cart);
});

export default router;
