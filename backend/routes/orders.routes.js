import express from "express";
import Order from "../models/Order.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Helper for ETA
function computeEta(minutes = 40) {
  const d = new Date();
  d.setMinutes(d.getMinutes() + minutes);
  return d;
}

// ✅ GET /api/orders/pool (For Drivers: Find unassigned orders)
router.get("/pool", requireAuth, requireRole("driver"), async (req, res) => {
  try {
    // ✅ FIX: Added "pending" so drivers see fresh orders immediately
    const orders = await Order.find({
      status: { $in: ["pending", "accepted", "preparing"] }, 
      driverId: null, // Not yet assigned
    })
      .populate("userId", "name phone")
      .populate("items.productId")
      .sort({ createdAt: 1 }); // Oldest first

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET /api/orders/driver-active (For Drivers: My current list)
router.get("/driver-active", requireAuth, requireRole("driver"), async (req, res) => {
  try {
    const orders = await Order.find({
      driverId: req.user._id,
      status: { $ne: "delivered" }, // Not finished yet
    })
      .populate("userId", "name phone")
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET /api/orders/driver/all (For Drivers: Full history for Profile page)
router.get("/driver/all", requireAuth, requireRole("driver"), async (req, res) => {
  try {
    const orders = await Order.find({ driverId: req.user._id })
      .populate("userId", "name phone")
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders (Customer: My history)
router.get("/", requireAuth, async (req, res) => {
  const orders = await Order.find({ userId: req.user._id })
    .populate("items.productId")
    .populate("driverId", "name phone vehicle") // ✅ Populate driver info for tracking
    .sort({ createdAt: -1 });

  res.json(orders);
});

// GET /api/orders/all (Admin)
router.get("/all", requireAuth, requireRole("admin"), async (req, res) => {
  const orders = await Order.find()
    .populate("userId")
    .populate("items.productId")
    .populate("driverId")
    .sort({ createdAt: -1 });

  res.json(orders);
});

// ✅ PATCH /api/orders/:id/status (Update Status & Assign Driver)
router.patch(
  "/:id/status",
  requireAuth,
  requireRole("admin", "driver"),
  async (req, res) => {
    const { status } = req.body;

    try {
      const order = await Order.findById(req.params.id)
        .populate("items.productId")
        .populate("driverId");

      if (!order) return res.status(404).json({ message: "Order not found" });

      // 1. Update Status
      if (status) {
        order.status = status;

        // Auto-set ETA based on status
        if (status === "on_the_way") order.eta = computeEta(20);
        if (status === "delivered") order.eta = new Date(); // Arrived
      }

      // 2. Assign Driver (If driver claims it)
      if (req.user.role === "driver") {
        // If claiming a pending order
        if (!order.driverId) {
          order.driverId = req.user._id;
          
          // ✅ Automatic status update when claiming
          if (!status) {
            order.status = "on_the_way";
            order.eta = computeEta(25);
          }
        } else if (order.driverId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({message: "Order already assigned to another driver"});
        }
      }

      await order.save();
      
      // Return fully populated order
      const updated = await Order.findById(order._id)
        .populate("userId", "name phone")
        .populate("driverId")
        .populate("items.productId");

      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;