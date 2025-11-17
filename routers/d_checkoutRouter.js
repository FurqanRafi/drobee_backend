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

router.post("/checkout", authMiddleware, createCheckout);
router.get("/checkout", authMiddleware, getCheckout);
router.put("/checkout/:id", authMiddleware, updateCheckout);
router.delete("/checkout/:id", authMiddleware, deleteCheckout);
router.get("/checkout", authMiddleware, getAllCheckout);
router.put("/checkout/:id/status", authMiddleware, updateCheckoutStatus);
router.get("/checkout/user/:userId", authMiddleware, getCheckoutByUser);

export default router;
