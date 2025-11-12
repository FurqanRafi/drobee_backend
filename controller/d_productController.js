import d_ProductSchema from "../models/d_ProductSchema.js";

// ✅ Add Product
export const addProduct = async (req, res) => {
  try {
    const data = req.body;

    // 🧩 Validate category
    if (!data.category) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    // 🧩 Optional: Validate at least one image
    if (
      !data.images ||
      !Array.isArray(data.images) ||
      data.images.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }

    // 🧩 Optional: Validate sizes if provided
    if (data.sizes && !Array.isArray(data.sizes)) {
      return res.status(400).json({ message: "Sizes must be an array" });
    }

    // 🧩 Optional: Validate colors if provided
    if (data.colors && !Array.isArray(data.colors)) {
      return res.status(400).json({ message: "Colors must be an array" });
    }

    // ✅ Create product
    const product = new d_ProductSchema(data);
    await product.save();

    // ✅ Populate category after save
    const populatedProduct = await product.populate("category");

    res.status(201).json({
      message: "Product added successfully",
      product: populatedProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Products (populate category + color reference)
export const getAllProducts = async (req, res) => {
  try {
    const products = await d_ProductSchema
      .find()
      .populate("category")
      .populate("images.colour"); // populate color reference for images if any

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await d_ProductSchema
      .findById(req.params.id)
      .populate("category")
      .populate("images.colour");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Product
export const updateProduct = async (req, res) => {
  try {
    const data = req.body;

    const updatedProduct = await d_ProductSchema
      .findByIdAndUpdate(req.params.id, data, { new: true })
      .populate("category")
      .populate("images.colour");

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await d_ProductSchema.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: error.message });
  }
};
