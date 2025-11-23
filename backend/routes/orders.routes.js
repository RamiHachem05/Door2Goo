import express from "express";
import Order from "../models/Order.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// GET /api/orders  (current user's orders)
router.get("/", requireAuth, async (req, res) => {
  const orders = await Order.find({ userId: req.user._id })
    .populate("items.productId")
    .sort({ createdAt: -1 });

  res.json(orders);
});

// GET /api/orders/all  (admin view all)
router.get("/all", requireAuth, requireRole("admin"), async (req, res) => {
  const orders = await Order.find()
    .populate("userId")
    .populate("items.productId")
    .sort({ createdAt: -1 });

  res.json(orders);
});

// PATCH /api/orders/:id/status  (admin or driver can update)
router.patch(
  "/:id/status",
  requireAuth,
  requireRole("admin", "driver"),
  async (req, res) => {
    const { status, driverId } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (status) order.status = status;
    if (driverId) order.driverId = driverId;

    await order.save();
    res.json(order);
  }
);

export default router;
