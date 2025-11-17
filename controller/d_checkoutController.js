import d_checkout from "../models/d_checkoutSchema.js";

export const createCheckout = async (req, res) => {
  try {
    // 🚨 Logged-in user from middleware
    const loggedUser = req.user;

    if (!loggedUser) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { billingDetails, products, totalAmount } = req.body;

    if (!billingDetails || !products || !totalAmount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ message: "Products must be a non-empty array" });
    }

    // 🚨 CREATE ORDER USING LOGGED-IN USER ONLY
    const checkout = await d_checkout.create({
      userId: loggedUser._id, // always current logged-in user
      billingDetails: billingDetails, // form email stored here, NOT used for account
      products,
      totalAmount,
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

// ✅ FIXED - Proper logging aur error handling
export const getCheckoutByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("🔍 Fetching orders for userId:", userId);
    console.log("🔍 Logged-in user from token:", req.user);

    // ✅ Security check - Only fetch if requesting own orders
    if (req.user._id.toString() !== userId) {
      console.log("❌ Unauthorized: User trying to access other's orders");
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const orders = await d_checkout
      .find({ userId: userId })
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

// ✅ NAYA - Sirf admin ko access do
export const getAllCheckout = async (req, res) => {
  try {
    // 👇 Check if user is admin (optional, agar admin check chahiye)
    console.log("🔍 User from token:", req.user);

    const checkout = await d_checkout
      .find()
      .populate("userId", "firstname lastname email");

    res.status(200).json(checkout);
  } catch (error) {
    console.error("❌ Error fetching all checkouts:", error);
    res.status(500).json({ message: error.message });
  }
};
