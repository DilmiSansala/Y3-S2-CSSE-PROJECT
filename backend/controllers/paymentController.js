// controllers/paymentController.js
const Payment = require("../models/Payment");
const WasteRequest = require("../models/WasteRequest");
let stripeClient = null;
const getStripe = () => {
  if (!stripeClient) {
    const Stripe = require("stripe");
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeClient;
};

// Create Stripe Checkout Session for a single WasteRequest payment
exports.createCheckoutSession = async (req, res) => {
  const { residentId, wasteRequestId } = req.body;
  try {
    const wasteRequest = await WasteRequest.findById(wasteRequestId);
    if (!wasteRequest) {
      return res.status(404).json({ message: "Waste request not found" });
    }

    // Basic pricing map (should match frontend). Consider centralizing later.
    const pricePerType = {
      Glass: 15,
      Wood: 10,
      Hazardous: 60,
      Paper: 10,
      Metal: 20,
      Plastic: 30,
      Organic: 30,
      Electronics: 50,
    };

    const unitAmount = (pricePerType[wasteRequest.wasteType] || 0) * 100; // cents
    const quantity = wasteRequest.quantity || 1;
    const currency = process.env.STRIPE_CURRENCY || "usd";

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: `Waste collection - ${wasteRequest.wasteType}`,
            },
            unit_amount: unitAmount,
          },
          quantity,
        },
      ],
      metadata: {
        residentId,
        wasteRequestId,
      },
      success_url: `${process.env.CLIENT_URL}/payment?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment?status=cancelled`,
    });

    return res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe session error:", error);
    return res.status(500).json({ message: "Failed to create checkout session" });
  }
};

// Stripe webhook to finalize payment and update DB
exports.webhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      req.body, // body is a Buffer from bodyParser.raw
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { residentId, wasteRequestId } = session.metadata || {};

    try {
      // Mark payment in DB
      const amountTotal = session.amount_total ? session.amount_total / 100 : 0;
      const newPayment = new Payment({
        resident: residentId,
        amount: amountTotal,
        wasteRequests: [wasteRequestId],
        status: "completed",
      });
      await newPayment.save();

      // Update request status
      await WasteRequest.updateMany(
        { _id: { $in: [wasteRequestId] } },
        { $set: { status: "payment complete" } }
      );
    } catch (err) {
      console.error("DB update after webhook failed:", err);
      // Acknowledge to Stripe regardless; consider alerting/queueing for retry
    }
  }

  res.json({ received: true });
};

// Confirm checkout session without webhook
exports.confirmCheckoutSession = async (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId) {
    return res.status(400).json({ message: "Missing sessionId" });
  }
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["payment_intent"] });
    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const { residentId, wasteRequestId } = session.metadata || {};
    const amountTotal = session.amount_total ? session.amount_total / 100 : 0;

    if (residentId && wasteRequestId) {
      await new Payment({
        resident: residentId,
        amount: amountTotal,
        wasteRequests: [wasteRequestId],
        status: "completed",
      }).save();

      await WasteRequest.updateMany(
        { _id: { $in: [wasteRequestId] } },
        { $set: { status: "payment complete" } }
      );
    }

    return res.status(200).json({ message: "Payment confirmed", session });
  } catch (error) {
    console.error("Confirm session failed:", error);
    return res.status(500).json({ message: "Failed to confirm session" });
  }
};

// Keep legacy endpoint for compatibility (non-Stripe mock payments)
exports.processPayment = async (req, res) => {
  const { residentId, amount, wasteRequestIds } = req.body;
  try {
    const newPayment = new Payment({
      resident: residentId,
      amount,
      wasteRequests: wasteRequestIds,
      status: "completed",
    });
    await newPayment.save();
    await WasteRequest.updateMany(
      { _id: { $in: wasteRequestIds } },
      { $set: { status: "payment complete" } }
    );
    res.status(201).json({ message: "Payment processed and requests updated successfully." });
  } catch (error) {
    console.error("Payment processing error:", error);
    res.status(500).json({ message: "Payment processing failed", error: error.message });
  }
};
