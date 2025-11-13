import express from "express";
import {
  createCheckout,
  deleteCheckout,
  getCheckout,
  updateCheckout,
  getAllCheckout,
  updateCheckoutStatus,
} from "../controller/d_checkoutController.js";

const router = express.Router();

router.post("/checkout", createCheckout);
router.get("/checkout/:id", getCheckout);
router.put("/checkout/:id", updateCheckout);
router.delete("/checkout/:id", deleteCheckout);
router.get("/checkout", getAllCheckout);
router.put("/checkout/:id", updateCheckoutStatus);

export default router;
