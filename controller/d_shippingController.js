import D_Shipping from "../models/d_shippingSchema.js";

export const createShipping = async (req, res) => {
  try {
    const { name, description, price, isActive } = req.body;

    if (!name || !description || !price) {
      return res
        .status(400)
        .json({ error: "All fields are required (name, description, price)" });
    }

    const shipping = await D_Shipping.create({
      name,
      description,
      price,
      isActive: isActive ?? true,
    });

    res
      .status(201)
      .json({
        message: "Shipping method created successfully",
        data: shipping,
      });
  } catch (error) {
    res.status(500).json({ error: "Failed to create shipping method" });
  }
};

export const getShipping = async (req, res) => {
  try {
    const shipping = await D_Shipping.find();
    res.status(200).json(shipping);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch shipping methods" });
  }
};

export const updateShipping = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await D_Shipping.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated)
      return res.status(404).json({ error: "Shipping method not found" });

    res
      .status(200)
      .json({ message: "Shipping method updated successfully", data: updated });
  } catch (error) {
    res.status(500).json({ error: "Failed to update shipping method" });
  }
};

export const deleteShipping = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await D_Shipping.findByIdAndDelete(id);

    if (!deleted)
      return res.status(404).json({ error: "Shipping method not found" });

    res
      .status(200)
      .json({ message: "Shipping method deleted successfully", data: deleted });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete shipping method" });
  }
};
