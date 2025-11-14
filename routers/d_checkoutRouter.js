import express from "express";
import {
  createCheckout,
  deleteCheckout,
  getCheckout,
  updateCheckout,
  getAllCheckout,
  updateCheckoutStatus,
  getCheckoutByUserId, // 👈 NEW IMPORT
} from "../controller/d_checkoutController.js";

const router = express.Router();

router.post("/checkout", createCheckout);
router.get("/checkout/:id", getCheckout);
router.put("/checkout/:id", updateCheckout);
router.delete("/checkout/:id", deleteCheckout);
router.get("/checkout", getAllCheckout);
router.get("/checkout/user/:userId", getCheckoutByUserId); // 👈 NEW ROUTE (user ID se orders fetch)

export default router;