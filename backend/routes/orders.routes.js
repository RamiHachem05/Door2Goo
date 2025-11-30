// backend/routes/order.routes.js
import express from "express";
import Order from "../models/Order.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Small helper to compute ETA (30–45 min window for demo)
function computeEta(minutes = 40) {
  const d = new Date();
  d.setMinutes(d.getMinutes() + minutes);
  return d;
}

// GET /api/orders  (current user's orders)
router.get("/", requireAuth, async (req, res) => {
  const orders = await Order.find({ userId: req.user._id })
    .populate("items.productId")
    .populate("driverId")      // ✅ include driver details for tracking UI
    .sort({ createdAt: -1 });

  res.json(orders);
});

// GET /api/orders/all  (admin view all)
router.get("/all", requireAuth, requireRole("admin"), async (req, res) => {
  const orders = await Order.find()
    .populate("userId")
    .populate("items.productId")
    .populate("driverId")      // ✅ for dashboard / driver console
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

    const order = await Order.findById(req.params.id)
      .populate("items.productId")
      .populate("driverId");

    if (!order) return res.status(404).json({ message: "Order not found" });

    // ✅ Update status if provided
    if (status) {
      order.status = status;

      // ✅ Simple ETA logic – tweak as you like
      if (status === "accepted" && !order.eta) {
        order.eta = computeEta(40);   // 40 min from now
      } else if (status === "preparing") {
        order.eta = computeEta(30);   // 30 min
      } else if (status === "on_the_way") {
        order.eta = computeEta(15);   // 15 min
      } else if (status === "delivered") {
        order.eta = new Date();       // delivered at this time
      }
    }

    // ✅ Driver assignment logic
    if (driverId) {
      // Admin explicitly assigns a driver
      order.driverId = driverId;
    } else if (req.user.role === "driver" && !order.driverId) {
      // Driver updating status auto-claims the order
      order.driverId = req.user._id;
    }

    await order.save();

    res.json(order);
  }
);

export default router;
