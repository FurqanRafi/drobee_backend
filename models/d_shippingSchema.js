import mongoose from "mongoose";

const d_shippingSchema = new mongoose.Schema(
  {

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },


    price: {
      type: Number,
      required: true,
      min: 0,
    },


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
