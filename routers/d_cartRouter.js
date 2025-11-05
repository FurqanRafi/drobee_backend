import express from "express";
import D_User from "../models/d_userSchema.js";
import { authMiddleware } from "../middleware/authmiddleware.js";

const router = express.Router();

// ✅ Get user cart
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await D_User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ cart: user.cart || [] });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cart", error });
  }
});

// ✅ Save or merge cart
router.put("/save", authMiddleware, async (req, res) => {
  try {
    const user = await D_User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newCart = req.body.cart || [];

    // Merge guest + existing cart
    const mergedCart = mergeCarts(user.cart, newCart);
    user.cart = mergedCart;
    await user.save();

    res.json({ message: "Cart saved successfully", cart: mergedCart });
  } catch (error) {
    res.status(500).json({ message: "Failed to save cart", error });
  }
});

// Helper function for merging guest + user carts
function mergeCarts(existingCart, newCart) {
  const merged = [...existingCart];
  for (const item of newCart) {
    const existing = merged.find(
      (i) => i.id === item.id && i.size === item.size && i.color === item.color
    );
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      merged.push(item);
    }
  }
  return merged;
}

export default router;
