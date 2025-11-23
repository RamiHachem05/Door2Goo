import mongoose from "mongoose";

const driverLocationSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    coords: {
      lat: Number,
      lng: Number
    },
    online: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("DriverLocation", driverLocationSchema);
