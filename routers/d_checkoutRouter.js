import express from "express";
import {
  createCheckout,
  deleteCheckout,
  getCheckout,
  getCheckoutByUser,
  updateCheckout,
  getAllCheckout,
  updateCheckoutStatus,
} from "../controller/d_checkoutController.js";
import { authMiddleware } from "../middleware/authmiddleware.js";

const router = express.Router();

// ✅ PUBLIC ROUTES - No token needed
router.get("/checkout", getAllCheckout);
router.get("/checkout/:id", getCheckout);
router.get("/checkout/user/:userId", authMiddleware, getCheckoutByUser); // 👈 Token add kiya

// ✅ PROTECTED ROUTES - Token needed
router.post("/checkout", authMiddleware, createCheckout);
router.put("/checkout/:id", authMiddleware, updateCheckout);
router.put("/checkout/:id/status", authMiddleware, updateCheckoutStatus);
router.delete("/checkout/:id", authMiddleware, deleteCheckout);

export default router;
