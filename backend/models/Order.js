// backend/models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 }
      }
    ],

    totalPrice: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "accepted", "preparing", "on_the_way", "delivered"],
      default: "pending"
    },

    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    address: String,
    paymentMethod: { type: String, default: "cash" },

    // ✅ NEW – optional, safe, used only by tracking UI
    eta: { type: Date, default: null },          // estimated arrival time
    addressFrom: { type: String, default: "" }   // pickup / store location
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
