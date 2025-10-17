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

// Controlled logger: set environment variable SHOW_STRIPE_LOGS=true to enable these logs
const shouldLog = process.env.SHOW_STRIPE_LOGS === 'true';
const log = (...args) => { if (shouldLog) console.log(...args); };
const warn = (...args) => { if (shouldLog) console.warn(...args); };

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
  log('Received Stripe webhook event:', event.type);
  } catch (err) {
  console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { residentId, wasteRequestId } = session.metadata || {};
  log('checkout.session.completed metadata:', session.metadata);

    // Try to resolve residentId from WasteRequest if metadata doesn't include it
    let resolvedResidentId = residentId;
    if (!resolvedResidentId && wasteRequestId) {
      try {
        const wr = await WasteRequest.findById(wasteRequestId).lean();
        if (wr && wr.resident) resolvedResidentId = wr.resident.toString();
      } catch (err) {
        console.error('Failed to resolve residentId from WasteRequest in webhook:', err);
      }
    }

    try {
      // Mark payment in DB
      const amountTotal = session.amount_total ? session.amount_total / 100 : 0;
      const newPayment = new Payment({
        resident: resolvedResidentId || residentId || null,
        amount: amountTotal,
        wasteRequests: wasteRequestId ? [wasteRequestId] : [],
        status: "completed",
      });
      await newPayment.save();
  log('Saved new Payment:', newPayment._id);

      // Update request status if we have a wasteRequestId
      if (wasteRequestId) {
        await WasteRequest.updateMany(
          { _id: { $in: [wasteRequestId] } },
          { $set: { status: "payment complete" } }
        );
  log('Updated WasteRequest status to payment complete for:', wasteRequestId);
      } else {
  warn('Webhook: no wasteRequestId in metadata; cannot update request status automatically.');
      }
    } catch (err) {
  console.error("DB update after webhook failed:", err);
      // Acknowledge to Stripe regardless; consider alerting/queueing for retry
    }
  }
  // Also handle payment_intent.succeeded events to cover different webhook flows
  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;
    console.log('payment_intent.succeeded received for:', pi.id);
    // Try to find any sessions associated with this payment intent
    try {
      const stripe = getStripe();
      const sessions = await stripe.checkout.sessions.list({ payment_intent: pi.id, limit: 1 });
      if (sessions && sessions.data && sessions.data.length > 0) {
        const session = sessions.data[0];
        const { residentId, wasteRequestId } = session.metadata || {};

        // Resolve residentId if needed
        let resolvedResidentId = residentId;
        if (!resolvedResidentId && wasteRequestId) {
          try {
            const wr = await WasteRequest.findById(wasteRequestId).lean();
            if (wr && wr.resident) resolvedResidentId = wr.resident.toString();
          } catch (err) {
            console.error('Failed to resolve residentId from WasteRequest in payment_intent handler:', err);
          }
        }

        const amountTotal = pi.amount_received ? pi.amount_received / 100 : 0;
        const newPayment = new Payment({
          resident: resolvedResidentId || residentId || null,
          amount: amountTotal,
          wasteRequests: wasteRequestId ? [wasteRequestId] : [],
          status: 'completed',
        });
        await newPayment.save();
        if (wasteRequestId) {
          await WasteRequest.updateMany({ _id: { $in: [wasteRequestId] } }, { $set: { status: 'payment complete' } });
          console.log('Updated WasteRequest status to payment complete for (via payment_intent):', wasteRequestId);
        }
      } else {
        console.warn('No checkout.session found for payment_intent', pi.id);
      }
    } catch (err) {
      console.error('Error handling payment_intent.succeeded:', err);
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
  log('Confirm checkout session retrieved:', session.id, 'metadata:', session.metadata);
    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }
    // Ensure we can still update DB even if metadata lacks residentId
    const amountTotal = session.amount_total ? session.amount_total / 100 : 0;
    const wasteRequestId = session.metadata?.wasteRequestId;
    let resolvedResidentId = session.metadata?.residentId;
    if (!resolvedResidentId && wasteRequestId) {
      try {
        const wr = await WasteRequest.findById(wasteRequestId).lean();
        if (wr && wr.resident) resolvedResidentId = wr.resident.toString();
      } catch (err) {
        console.error('Failed to resolve residentId from WasteRequest in confirm:', err);
      }
    }

    if (wasteRequestId) {
      await new Payment({
        resident: resolvedResidentId || null,
        amount: amountTotal,
        wasteRequests: [wasteRequestId],
        status: "completed",
      }).save();
  log('Payment saved via confirm for wasteRequestId:', wasteRequestId);

      await WasteRequest.updateMany(
        { _id: { $in: [wasteRequestId] } },
        { $set: { status: "payment complete" } }
      );
  log('WasteRequest updated to payment complete for:', wasteRequestId);
    } else {
  warn('Confirm: no wasteRequestId in session metadata; unable to link payment to request');
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

// Manual approve endpoint for admin/collector to mark a waste request as paid
exports.approvePayment = async (req, res) => {
  const { wasteRequestId, approverId } = req.body;
  if (!wasteRequestId) {
    return res.status(400).json({ message: 'Missing wasteRequestId' });
  }
  try {
    // Create a Payment record (amount optional here - we can leave as 0 or pull from request)
    const wr = await WasteRequest.findById(wasteRequestId).lean();
    if (!wr) return res.status(404).json({ message: 'WasteRequest not found' });

    const amount = wr.amount || 0; // if you store amount on request
    const newPayment = new Payment({
      resident: wr.resident || null,
      amount,
      wasteRequests: [wasteRequestId],
      status: 'completed',
    });
    await newPayment.save();

    await WasteRequest.updateMany(
      { _id: { $in: [wasteRequestId] } },
      { $set: { status: 'payment complete' } }
    );

  log(`Approved payment for wasteRequest ${wasteRequestId} by ${approverId || 'system'}`);
    return res.status(200).json({ message: 'WasteRequest marked as paid', paymentId: newPayment._id });
  } catch (err) {
  console.error('approvePayment error:', err);
    return res.status(500).json({ message: 'Failed to approve payment' });
  }
};
