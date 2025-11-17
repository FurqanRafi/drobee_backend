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

router.get("/checkout", authMiddleware, getAllCheckout); // 👈 Pehle
router.get("/checkout/user/:userId", authMiddleware, getCheckoutByUser);
router.put("/checkout/:id/status", authMiddleware, updateCheckoutStatus);
router.post("/checkout", authMiddleware, createCheckout);
router.get("/checkout/:id", authMiddleware, getCheckout); // 👈 Baad mein
router.put("/checkout/:id", authMiddleware, updateCheckout);
router.delete("/checkout/:id", authMiddleware, deleteCheckout);

export default router;
