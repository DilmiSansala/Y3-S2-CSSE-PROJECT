const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/paymentController");

// Create a Stripe Checkout session
router.post("/create-checkout-session", paymentController.createCheckoutSession);
router.get("/confirm", paymentController.confirmCheckoutSession);

// Legacy direct process (non-Stripe) - keep if needed by frontend
router.post("/process", paymentController.processPayment);
// Manual approve endpoint
router.post('/approve', paymentController.approvePayment);

module.exports = router;


