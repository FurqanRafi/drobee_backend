import mongoose from "mongoose";

const d_shippingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

export default mongoose.model("D_Shipping", d_shippingSchema);
