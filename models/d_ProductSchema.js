import mongoose from "mongoose";

// ✅ Color Subschema (embedded)
const colorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hex: { type: String, match: /^#([A-Fa-f0-9]{6})$/ }, // optional HEX validation
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
    type: String, // frontend se string ID ya name bhejna
    required: true,
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

    // ✅ Product Variants (optional)
    variants: [
      {
        colour: String, // string for compatibility
        images: [String], // multiple image URLs
      },
    ],

    // ✅ Images Array
    images: [imageSchema],

    // ✅ Colors Array (embedded)
    colors: [colorSchema],

    // ✅ Sizes Array
    sizes: [sizeSchema],

    // ✅ Flags
    popular: { type: Boolean, default: false },
    latest: { type: Boolean, default: false },
    sale: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ✅ Export Model
export default mongoose.models.D_Product ||
  mongoose.model("D_Product", d_ProductSchema);
