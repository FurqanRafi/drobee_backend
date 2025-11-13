import D_Shipping from "../models/d_ShippingSchema.js";

export const createShipping = async (req, res) => {
  try {
    const shipping = await D_Shipping.create(req.body);
    res.status(201).json(shipping);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getShipping = async (req, res) => {
  try {
    const shipping = await D_Shipping.find();
    res.status(200).json(shipping);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateShipping = async (req, res) => {
  try {
    const shipping = await D_Shipping.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(shipping);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteShipping = async (req, res) => {
  try {
    const shipping = await D_Shipping.findByIdAndDelete(req.params.id);
    res.status(200).json(shipping);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
