/**
 * Payments Route
 * ==============
 * POST /api/payments/webhook  — Razorpay webhook (payment settled)
 * POST /api/payments/create-order — create UPI mandate order for premium collection
 */

const express  = require("express");
const crypto   = require("crypto");
const axios    = require("axios");
const router   = express.Router();

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "";
const FASTAPI = process.env.FASTAPI_URL || "http://localhost:8000";


// Verify Razorpay webhook signature
function verifyWebhookSignature(body, signature) {
  const expected = crypto
    .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
    .update(JSON.stringify(body))
    .digest("hex");
  return expected === signature;
}


/**
 * Razorpay sends this webhook when a payout settles.
 * We update the claim status in FastAPI and notify the worker via WebSocket.
 */
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];

  if (!verifyWebhookSignature(req.body, signature)) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  const event = JSON.parse(req.body);

  if (event.event === "payout.processed") {
    const payoutId  = event.payload.payout.entity.id;
    const narration = event.payload.payout.entity.narration || "";
    // narration format: "InsureO claim {claim_id_prefix}"
    const claimPrefix = narration.replace("InsureO claim ", "").trim();

    try {
      // Notify FastAPI to mark claim as PAID
      await axios.post(`${FASTAPI}/api/payouts/confirm`, { payout_id: payoutId });

      // Emit WebSocket event to admin
      const { io } = require("../server");
      const { emitToAdmin } = require("../websocket/handler");
      emitToAdmin(io, "payout_confirmed", { payoutId, claimPrefix });
    } catch (err) {
      console.error("Webhook processing error:", err.message);
    }
  }

  res.json({ received: true });
});


/**
 * Create a Razorpay subscription order for weekly UPI recurring mandate.
 * Called when a worker signs up.
 */
router.post("/create-mandate", async (req, res) => {
  const { workerId, upiId, weeklyAmount } = req.body;

  // In production, use Razorpay Subscriptions API for recurring UPI mandates
  // For hackathon, return a mock order
  const mockOrder = {
    id:        `order_mock_${Date.now()}`,
    amount:    Math.round(weeklyAmount * 100),  // paise
    currency:  "INR",
    upi_id:    upiId,
    worker_id: workerId,
    status:    "created",
  };

  res.json(mockOrder);
});

module.exports = router;
