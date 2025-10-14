// controllers/paymentController.js
const Payment = require("../models/Payment"); // Assuming Payment model is added
const WasteRequest = require("../models/WasteRequest");

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

    res
      .status(201)
      .json({
        message: "Payment processed and requests updated successfully.",
      });
  } catch (error) {
    console.error("Payment processing error:", error); // Logs detailed error
    res
      .status(500)
      .json({ message: "Payment processing failed", error: error.message }); // Send error details to frontend
  }
};
