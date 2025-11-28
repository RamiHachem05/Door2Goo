import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },   // ✅ DETAILS TEXT
    price: { type: Number, required: true },
    image: { type: String },                          // ✅ IMAGE LINK
    category: { type: String },
    rating: { type: Number, default: 4 },             // ✅ STAR RATING
    inStock: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
