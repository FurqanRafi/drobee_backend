import mongoose from "mongoose";

const d_checkoutSchema = new mongoose.Schema(
  {
    user: {
        id:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
        username: String,
        email: String,
        phone: String,
        address: String,
        postalCode: String,
        city: String,
        country: String,

    },

    billingDetails: {
      email: String,
      firstname: String,
      lastname: String,
      country: String,
      address: String,
      city: String,
      state: String,
      postalCode: String,
      phone: String,
      shipping: String,
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
    shippingCost: { type: Number, default: 0 },
    paymentMethod: { type: String, default: "Cash on Delivery" },
  },
  { timestamps: true }
);

export default mongoose.model("D_checkout", d_checkoutSchema);
