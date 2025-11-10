import d_categorySchema from "../models/d_categorySchema.js";

export const addCategory = async (req, res) => {
  try {
    const data = req.body;
    const category = new d_categorySchema(data);
    await category.save();
    res.status(200).json({ message: "Category added successfully", category });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await d_categorySchema.find();
    res.status(200).json({ categories });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await d_categorySchema.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ category });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await d_categorySchema.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    Object.assign(category, req.body);
    await category.save();
    res.status(200).json({ message: "Category updated successfully", category });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await d_categorySchema.findByIdAndDelete(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ message: "Category deleted successfully", category });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


