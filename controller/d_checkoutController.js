import d_checkout from "../models/d_checkoutSchema.js";

export const createCheckout = async (req, res) => {
  try {
    const { user, products, totalAmount, shippingCost, shippingMethod, discount, paymentMethod } = req.body;

    if (!user || !products || !totalAmount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ message: "Products must be a non-empty array" });
    }

    for (const product of products) {
      if (
        !product.productName ||
        !product.image ||
        !product.price ||
        !product.quantity
      ) {
        return res.status(400).json({
          message: "Each product must have name, image, price, and quantity",
        });
      }
    }

    const checkout = await d_checkout.create({ 
      user, 
      products, 
      totalAmount,
      shippingCost: shippingCost || 0,
      shippingMethod: shippingMethod || user.shipping || "Standard Shipping",
      discount: discount || 0,
      paymentMethod: paymentMethod || "Cash on Delivery"
    });
    
    res.status(201).json(checkout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCheckout = async (req, res) => {
  try {
    const checkout = await d_checkout.findById(req.params.id);
    if (!checkout)
      return res.status(404).json({ message: "Checkout not found" });
    res.status(200).json(checkout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCheckout = async (req, res) => {
  try {
    const checkout = await d_checkout.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!checkout)
      return res.status(404).json({ message: "Checkout not found" });
    res.status(200).json(checkout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCheckout = async (req, res) => {
  try {
    const checkout = await d_checkout.findByIdAndDelete(req.params.id);
    if (!checkout)
      return res.status(404).json({ message: "Checkout not found" });
    res
      .status(200)
      .json({ message: "Checkout deleted successfully", checkout });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCheckoutStatus = async (req, res) => {
  try {
    const checkout = await d_checkout.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!checkout)
      return res.status(404).json({ message: "Checkout not found" });
    res.status(200).json(checkout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCheckout = async (req, res) => {
  try {
    const checkout = await d_checkout.find().sort({ createdAt: -1 });
    res.status(200).json(checkout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};