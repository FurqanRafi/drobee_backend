import mongoose from "mongoose";

// ✅ Color Subschema
const colorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hex: { type: String, match: /^#([A-Fa-f0-9]{6})$/ }, // Optional HEX validation
});

// ✅ Size Subschema
const sizeSchema = new mongoose.Schema({
  label: { type: String, required: true },
  price: { type: Number, required: true },
});

// ✅ Image Subschema
const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  colour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Color", // You can rename this if your color collection has a different model name
  },
});

// ✅ Main Product Schema
const d_ProductSchema = new mongoose.Schema(
  {
    heading: { type: String, required: true },
    style: { type: String },
    price: { type: Number, required: true },
    desc: { type: String },
    maindesc: { type: String },

    // ✅ Category Reference
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "D_Category",
      required: true,
    },

    // ✅ Product Variants (if you keep multiple color/image combinations)
    variants: [
      {
        colour: String, // For compatibility with existing data
        images: [String], // multiple image URLs allowed
      },
    ],

    // ✅ Images Array (like new model)
    images: [imageSchema],

    // ✅ Colors Array
    colors: [colorSchema],

    // ✅ Sizes Array (each size has label + price)
    sizes: [sizeSchema],

    // ✅ Flags
    popular: { type: Boolean, default: false },
    latest: { type: Boolean, default: false },
    sale: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ✅ Export Model
export default mongoose.model("D_Product", d_ProductSchema);
