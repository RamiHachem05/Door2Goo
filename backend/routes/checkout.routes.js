import express from "express";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// POST /api/checkout  -> create order from cart
router.post("/", requireAuth, async (req, res) => {
  try {
    const { address, paymentMethod } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total from products to avoid client cheating
    let totalPrice = 0;
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;
      totalPrice += product.price * item.quantity;
    }

    const order = await Order.create({
      userId: req.user._id,
      items: cart.items,
      totalPrice,
      address,
      paymentMethod: paymentMethod || "cash",
    });

    // Clear cart after checkout
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
