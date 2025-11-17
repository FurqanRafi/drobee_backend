import d_checkout from "../models/d_checkoutSchema.js";

export const createCheckout = async (req, res) => {
  try {
    const loggedUser = req.user; // user from token

    if (!loggedUser) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { billingDetails, products, totalAmount } = req.body;

    if (!billingDetails || !products || !totalAmount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const checkout = await d_checkout.create({
      user: {
        id: {
          username: loggedUser.username,
          email: loggedUser.email,
          phone: loggedUser.phone,
          address: loggedUser.address,
          postalCode: loggedUser.postalCode,
          city: loggedUser.city,
          country: loggedUser.country,
        },
      },

      billingDetails,
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
    const { email } = req.params;

    // Only allow the logged-in user to see their orders
    if (req.user.email !== email) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const orders = await d_checkout
      .find({ "user.id.email": email })
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
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
    const checkout = await d_checkout.find();
    res.status(200).json(checkout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
