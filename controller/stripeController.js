import Stripe from "stripe";
import dotenv from "dotenv";
import D_checkout from "../models/d_checkout.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRETE_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, orderId, products, shipping, billingDetails, user } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const line_items = products.map((product) => {
      let productName = product.productName;
      if (product.colour || product.size) {
        const details = [];
        if (product.colour) details.push(`Color: ${product.colour}`);
        if (product.size) details.push(`Size: ${product.size}`);
        productName = `${product.productName} (${details.join(", ")})`;
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: productName,
            images: [product.image],
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: product.quantity,
      };
    });

    if (shipping && shipping.cost > 0) {
      line_items.push({
        price_data: {
          currency: "usd",
          product_data: { name: `🚚 ${shipping.method}` },
          unit_amount: Math.round(shipping.cost * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      metadata: {
        orderId: orderId || "N/A",
        user: JSON.stringify(user || {}),
        billingDetails: JSON.stringify(billingDetails || {}),
        products: JSON.stringify(products),
        shippingCost: shipping?.cost || 0,
      },
      invoice_creation: { enabled: true },
    });

    res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("❌ Stripe Error:", error);
    res.status(500).json({ message: error.message });
  }
};
