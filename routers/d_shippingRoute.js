import express from "express";
import {
  createShipping,
  deleteShipping,
  getShipping,
  updateShipping,
} from "../controller/d_shippingController.js";

const router = express.Router();

router.post("/shipping", createShipping);
router.get("/shipping", getShipping);
router.put("/shipping/:id", updateShipping);
router.delete("/shipping/:id", deleteShipping);

export default router;
