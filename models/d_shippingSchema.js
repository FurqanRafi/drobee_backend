import mongoose from "mongoose";

const shippingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

export default mongoose.model("D_Shipping", shippingSchema);
