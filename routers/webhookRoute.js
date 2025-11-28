import express from "express";
import { stripeWebhook } from "../controller/stripeWebhookController.js";

const router = express.Router();
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);
export default router;
