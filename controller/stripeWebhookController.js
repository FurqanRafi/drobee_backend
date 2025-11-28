import Stripe from "stripe";
import dotenv from "dotenv";
import D_checkout from "../models/d_checkoutSchema.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRETE_KEY);

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const orderData = {
        user: JSON.parse(session.metadata.user || "{}"),
        billingDetails: JSON.parse(session.metadata.billingDetails || "{}"),
        products: JSON.parse(session.metadata.products || "[]"),
        totalAmount: session.amount_total / 100,
        shippingCost: parseFloat(session.metadata.shippingCost) || 0,
        discount: 0,
        paymentMethod: "Stripe",
        status: "pending",
        stripeSessionId: session.id,
      };

      const newOrder = await D_checkout.create(orderData);
      console.log("🟢 Stripe order saved:", newOrder._id);
    } catch (error) {
      console.error("❌ Error saving Stripe order:", error.message);
    }
  }

  res.json({ received: true });
};
