// backend/routes/auth.routes.js
import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken } from "../utils/tokens.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// ✅ PHONE VALIDATION UTIL
const isValidPhone = (phone) => {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
};

// ✅ SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role, phone, vehicle } = req.body;

    if (!isValidPhone(phone))
      return res.status(400).json({ message: "Invalid phone number" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      phone,
      vehicle: role === "driver" ? vehicle : undefined,
    });

    const token = signToken({ id: user._id, role: user.role });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        vehicle: user.vehicle,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken({ id: user._id, role: user.role });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        vehicle: user.vehicle,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET CURRENT USER
router.get("/me", requireAuth, (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    phone: req.user.phone,
    vehicle: req.user.vehicle,
  });
});

// ✅ UPDATE NAME
router.patch("/update-profile", requireAuth, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ message: "Invalid name" });
    }

    req.user.name = name.trim();
    await req.user.save();

    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        phone: req.user.phone,
        vehicle: req.user.vehicle,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ UPDATE PHONE
router.patch("/update-phone", requireAuth, async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || phone.length < 8) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    req.user.phone = phone;
    await req.user.save();

    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        phone: req.user.phone,
        vehicle: req.user.vehicle,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ UPDATE VEHICLE (DRIVER ONLY)
router.patch("/update-vehicle", requireAuth, async (req, res) => {
  try {
    const { vehicle } = req.body;

    // Basic validation
    if (!vehicle || vehicle.trim().length < 2) {
      return res.status(400).json({ message: "Invalid vehicle name" });
    }

    req.user.vehicle = vehicle.trim();
    await req.user.save();

    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        phone: req.user.phone,
        vehicle: req.user.vehicle,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ CHANGE PASSWORD
router.patch("/change-password", requireAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const match = await bcrypt.compare(oldPassword, req.user.password);
    if (!match) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    if (!newPassword || newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    req.user.password = hashed;
    await req.user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;