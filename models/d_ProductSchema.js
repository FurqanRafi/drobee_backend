import mongoose from "mongoose";

const d_proiductSchema = new mongoose.Schema({
  image: [String],
  heading: String, // unique: true hata diya
  style: String,
  price: String,
  desc: String,
  maindesc: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "D_Category",
    required: true,
  },
  popular: Boolean,
  latest: Boolean,
  colours: [String],
  sizes: [String],
});

export default mongoose.model("D_Product", d_proiductSchema);
