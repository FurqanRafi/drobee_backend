import d_ProductSchema from "../models/d_ProductSchema.js";

// ✅ Add product
export const addProduct = async (req, res) => {
  try {
    const data = req.body;

    if (!data.category) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    // Optional: Validate variants
    if (
      !data.variants ||
      !Array.isArray(data.variants) ||
      data.variants.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "At least one variant is required" });
    }

    const product = new d_ProductSchema(data);
    await product.save();

    const populatedProduct = await product.populate("category");

    res.status(200).json({
      message: "Product added successfully",
      product: populatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// backend/controllers/productController.js
export const getProducts = async (req, res) => {
  try {
    const products = await d_ProductSchema.find().populate("category");

    const formatted = products.map((p) => ({
      id: p._id,
      heading: p.heading,
      style: p.style,
      price: Number(p.price),
      popular: p.popular,
      latest: p.latest,
      image: p.variants.map((v) => v.images),
      colors: p.variants.map((v) => ({
        name: v.colour,
        img: v.images,
      })),
      sizes: p.sizes,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error });
  }
};

// ✅ Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await d_ProductSchema
      .findById(req.params.id)
      .populate("category");

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update product
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await d_ProductSchema
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("category");

    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await d_ProductSchema.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
