import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRETE_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, orderId, products, shipping } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Create line items from products
    const line_items = products.map((product) => {
      // Product name mein color aur size add karo
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
            name: productName, // ✅ Name mein hi color/size add kar diya
            images: [product.image],
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: product.quantity, // ✅ Ye quantity Stripe show karega
      };
    });

    // ✅ Shipping line item
    if (shipping && shipping.cost > 0) {
      line_items.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: `🚚 ${shipping.method}`, // Simple name
          },
          unit_amount: Math.round(shipping.cost * 100),
        },
        quantity: 1,
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      metadata: {
        orderId: orderId || "N/A",
      },
      invoice_creation: {
        enabled: true,
      },
    });

    res.status(200).json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("❌ Stripe Error:", error);
    res.status(500).json({ message: error.message });
  }
};
