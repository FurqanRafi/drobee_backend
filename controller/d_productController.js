import d_ProductSchema from "../models/d_ProductSchema.js";

// ✅ Add product
export const addProduct = async (req, res) => {
  try {
    const data = req.body;

    // Ensure category is passed
    if (!data.category) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const product = new d_ProductSchema(data);
    await product.save();

    // Populate category after saving
    const populatedProduct = await product.populate("category");

    res.status(200).json({
      message: "Product added successfully",
      product: populatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all products (with category populated)
export const getAllProducts = async (req, res) => {
  try {
    const products = await d_ProductSchema.find().populate("category");
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await d_ProductSchema
      .findById(req.params.id)
      .populate("category");

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update product
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await d_ProductSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("category");

    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });

    res
      .status(200)
      .json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await d_ProductSchema.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
