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

    // ✅ Stores who is delivering this order
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    address: String,
    paymentMethod: { type: String, default: "cash" },

    // ✅ Tracking helpers
    eta: { type: Date, default: null },
    addressFrom: { type: String, default: "Door2Go Hub" }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);