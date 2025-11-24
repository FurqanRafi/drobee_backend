import mongoose from "mongoose";

const colorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hex: { type: String, match: /^#([A-Fa-f0-9]{6})$/ },
});

const sizeSchema = new mongoose.Schema({
  label: { type: String, required: true },
  price: { type: Number, required: true },
});

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  colour: {
    type: String,
  },
});

const d_ProductSchema = new mongoose.Schema(
  {
    heading: { type: String, required: true },
    style: { type: String },
    price: { type: Number, required: true },
    desc: { type: String },
    maindesc: { type: String },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "D_Category",
      required: true,
    },

    variants: [
      {
        colour: String,
        images: [String],
      },
    ],

    images: [imageSchema],

    colors: [colorSchema],

    sizes: [sizeSchema],

    popular: { type: Boolean, default: false },
    latest: { type: Boolean, default: false },
    sale: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.D_Product ||
  mongoose.model("D_Product", d_ProductSchema);
