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
router.get("/checkout/user/:userId", getCheckoutByUser);

router.post("/checkout", createCheckout);
router.put("/checkout/:id", updateCheckout);
router.put("/checkout/:id/status", updateCheckoutStatus);
router.delete("/checkout/:id", deleteCheckout);

export default router;
