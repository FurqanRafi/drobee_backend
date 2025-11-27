import d_checkout from "../models/d_checkoutSchema.js";
import D_User from "../models/d_userSchema.js";

export const createCheckout = async (req, res) => {
  try {
    const {
      billingDetails,
      products,
      totalAmount,
      discount,
      shippingCost,
      paymentMethod,
      user,
    } = req.body;

    if (!billingDetails || !products || !totalAmount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ message: "Products must be a non-empty array" });
    }
    console.log(user)
    const checkout = await d_checkout.create({
      user,
      billingDetails,
      products,
      totalAmount,
      discount: discount || 0,
      shippingCost: shippingCost || 0,
      paymentMethod: paymentMethod || "Cash on Delivery",
    });
    if (user.id) {
      await D_User.findByIdAndUpdate(
        user.id,
        { $push: { orders: checkout.id } },
        { new: true }
      );
    }

    res.status(201).json(checkout);
  } catch (error) {
    console.log("❌ Error in createCheckout:", error);
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

export const getCheckoutByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // ✅ Fixed query to match schema
    const orders = await d_checkout
      .find({ "user.id": userId })
      .sort({ createdAt: -1 });

    console.log("✅ Found orders:", orders.length);

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error in getCheckoutByUser:", error);
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const pendingOrdersCount = await d_checkout.countDocuments({
      status: "pending",
    });
    const totalOrders = await d_checkout.countDocuments();

    const checkout = await d_checkout
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      limit,
      totalOrders,
      pendingOrdersCount,
      totalPages: Math.ceil(totalOrders / limit),
      count: checkout.length,
      orders: checkout,
    });
  } catch (error) {
    console.error("❌ Error fetching all checkouts:", error);
    res.status(500).json({ message: error.message });
  }
};
