import d_ProductSchema from "../models/d_ProductSchema.js";
import mongoose from "mongoose"; // ✅ ADD THIS IMPORT

export const addProduct = async (req, res) => {
  try {
    const data = req.body;
    if (!data.category) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    if (
      !data.images ||
      !Array.isArray(data.images) ||
      data.images.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }

    if (data.sizes && !Array.isArray(data.sizes)) {
      return res.status(400).json({ message: "Sizes must be an array" });
    }

    if (data.colors && !Array.isArray(data.colors)) {
      return res.status(400).json({ message: "Colors must be an array" });
    }

    const product = new d_ProductSchema(data);
    await product.save();

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

export const getAllProducts = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 8,
      search = "",
      category,
      color,
      size,
      minPrice,
      maxPrice,
      sort = "latest",
    } = req.query;

    page = Number(page);
    limit = Number(limit);

    const filters = {};

    if (search) {
      filters.heading = { $regex: search, $options: "i" };
    }

    if (category) {
      filters.category = new mongoose.Types.ObjectId(category);
    }

    if (color) {
      filters["colors.name"] = { $regex: color, $options: "i" };
    }

    if (size) {
      filters["sizes.label"] = size;
    }

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    let sortOption = {};

    switch (sort) {
      case "price_low":
        sortOption.price = 1;
        break;
      case "price_high":
        sortOption.price = -1;
        break;
      case "latest":
        sortOption.createdAt = -1;
        break;
      case "oldest":
        sortOption.createdAt = 1;
        break;
      default:
        sortOption.createdAt = -1;
    }

    const totalProducts = await d_ProductSchema.countDocuments(filters);

    const products = await d_ProductSchema
      .find(filters)
      .populate("category")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sortOption);

    res.status(200).json({
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await d_ProductSchema
      .findById(req.params.id)
      .populate("category");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const data = req.body;

    const updatedProduct = await d_ProductSchema
      .findByIdAndUpdate(req.params.id, data, { new: true })
      .populate("category");

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

export const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;

    // Current product
    const currentProduct = await d_ProductSchema
      .findById(id)
      .populate("category");
    if (!currentProduct)
      return res.status(404).json({ message: "Product not found" });

    // Related products by same category (exclude current product)
    const related = await d_ProductSchema
      .find({
        _id: { $ne: id },
        category: currentProduct.category._id,
      })
      .limit(8)
      .populate("category");

    res.status(200).json(related);
  } catch (error) {
    console.error("Error fetching related products:", error);
    res.status(500).json({ message: error.message });
  }
};