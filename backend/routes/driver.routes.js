import express from "express";
import DriverLocation from "../models/DriverLocation.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// POST /api/driver/location
router.post(
  "/location",
  requireAuth,
  requireRole("driver"),
  async (req, res) => {
    const { lat, lng, online } = req.body;

    let doc = await DriverLocation.findOne({ driverId: req.user._id });
    if (!doc) {
      doc = await DriverLocation.create({
        driverId: req.user._id,
        coords: { lat, lng },
        online: online ?? true,
      });
    } else {
      doc.coords = { lat, lng };
      if (online !== undefined) doc.online = online;
      await doc.save();
    }

    res.json(doc);
  }
);

// GET /api/driver/location/:driverId
router.get(
  "/location/:driverId",
  requireAuth,
  requireRole("admin", "driver"),
  async (req, res) => {
  const doc = await DriverLocation.findOne({
    driverId: req.params.driverId,
  }).populate("driverId");

  if (!doc) return res.status(404).json({ message: "Location not found" });
  res.json(doc);
});

export default router;
