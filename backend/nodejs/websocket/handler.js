/**
 * WebSocket Handler (Socket.IO)
 * ==============================
 * Rooms:
 *   worker:{workerId}   — private channel for each delivery worker
 *   admin               — admin panel receives all events
 *
 * Events emitted to frontend:
 *   disruption_alert    — new confirmed disruption in worker's city
 *   efficiency_update   — current efficiency score refreshed
 *   claim_status        — claim approved / rejected / paid
 *   payout_confirmed    — Razorpay payout settled
 */

const axios = require("axios");
const FASTAPI = process.env.FASTAPI_URL || "http://localhost:8000";

// Poll FastAPI every 60s for active disruptions and broadcast to admin
function startDisruptionPoller(io) {
  setInterval(async () => {
    try {
      const { data } = await axios.get(`${FASTAPI}/api/disruptions/active`);
      if (data.length > 0) {
        io.to("admin").emit("disruption_alert", { disruptions: data });
      }
    } catch {
      // FastAPI might not be up yet — silent fail
    }
  }, 60_000);
}

module.exports = function wsHandler(io) {
  io.on("connection", (socket) => {
    console.log(`[WS] Client connected: ${socket.id}`);

    // Worker joins their private room
    socket.on("join_worker", ({ workerId }) => {
      socket.join(`worker:${workerId}`);
      console.log(`[WS] Worker ${workerId} joined their room`);
      socket.emit("joined", { room: `worker:${workerId}` });
    });

    // Admin panel joins admin room
    socket.on("join_admin", () => {
      socket.join("admin");
      console.log(`[WS] Admin joined`);
    });

    // Frontend requests efficiency refresh for a worker
    socket.on("request_efficiency", async ({ workerId, actualEarnings }) => {
      try {
        const { data: worker } = await axios.get(`${FASTAPI}/api/workers/${workerId}`);
        const expected = worker.baseline_earnings || 680;
        const efficiency = Math.min(Math.max(actualEarnings / expected, 0), 1);
        io.to(`worker:${workerId}`).emit("efficiency_update", {
          workerId,
          efficiency: efficiency.toFixed(3),
          actualEarnings,
          expectedEarnings: expected,
        });
      } catch {
        socket.emit("error", { message: "Could not fetch worker data" });
      }
    });

    socket.on("disconnect", () => {
      console.log(`[WS] Client disconnected: ${socket.id}`);
    });
  });

  startDisruptionPoller(io);
};

// Export helper so routes can emit events
module.exports.emitToWorker = (io, workerId, event, data) => {
  io.to(`worker:${workerId}`).emit(event, data);
};

module.exports.emitToAdmin = (io, event, data) => {
  io.to("admin").emit(event, data);
};
