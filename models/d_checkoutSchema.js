import mongoose from "mongoose";

const d_checkoutSchema = new mongoose.Schema(
  {
    user: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      email: { type: String, required: true },
      firstname: { type: String, required: true },
      lastname: { type: String, required: true },
      country: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      phone: { type: String, required: true },
      shipping: { type: String, required: true },
    },

    products: [
      {
        productName: { type: String, required: true },
        image: { type: String, required: true },
        description: String,
        colour: String,
        size: String,
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],

    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    totalAmount: Number,
    discount: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 }, // ✅ Add shipping cost field
    paymentMethod: { type: String, default: "Cash on Delivery" },
  },
  { timestamps: true }
);

export default mongoose.model("D_checkout", d_checkoutSchema);
