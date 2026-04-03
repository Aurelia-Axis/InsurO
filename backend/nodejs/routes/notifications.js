/**
 * Notifications Route
 * ===================
 * POST /api/notifications/disruption  — Push a disruption alert to workers in a city
 * POST /api/notifications/claim       — Push claim status update to a specific worker
 */

const express = require("express");
const router  = express.Router();


router.post("/disruption", (req, res) => {
  const { city, disruptionType, severity, message } = req.body;
  const { io } = require("../server");

  // Broadcast to admin dashboard
  io.to("admin").emit("disruption_alert", {
    city, disruptionType, severity, message,
    timestamp: new Date().toISOString(),
  });

  res.json({ sent: true, city, disruptionType });
});


router.post("/claim", (req, res) => {
  const { workerId, claimId, status, payoutAmount } = req.body;
  const { io } = require("../server");

  io.to(`worker:${workerId}`).emit("claim_status", {
    claimId, status, payoutAmount,
    timestamp: new Date().toISOString(),
  });

  res.json({ sent: true, workerId, claimId });
});

module.exports = router;
