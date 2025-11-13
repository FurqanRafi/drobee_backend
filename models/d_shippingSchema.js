import mongoose from "mongoose";

const d_shippingSchema = new mongoose.Schema(
  {
    // e.g. "Standard Delivery", "Express Delivery", "Cash on Delivery"
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // e.g. "3–5 days", "1–2 days", "Pay when received"
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // e.g. 200, 500, 250
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // optional: to check if this shipping method is active or not
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

export default mongoose.model("D_Shipping", d_shippingSchema);
