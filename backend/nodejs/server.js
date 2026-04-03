/**
 * InsureO Node.js Server — Port 3001
 *
 * Responsibilities:
 *   1. Real-time WebSocket updates to the React dashboard (via Socket.IO)
 *   2. Razorpay webhook listener for payment confirmations
 *   3. Forwards disruption alerts to connected workers in real time
 */

require("dotenv").config();
const express    = require("express");
const http       = require("http");
const { Server } = require("socket.io");
const cors       = require("cors");

const paymentsRouter      = require("./routes/payments");
const notificationsRouter = require("./routes/notifications");
const wsHandler           = require("./websocket/handler");

const app    = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",   // React dev server
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// --- Routes ---
app.use("/api/payments",      paymentsRouter);
app.use("/api/notifications",  notificationsRouter);

app.get("/health", (_req, res) => res.json({ status: "ok", service: "InsureO Node.js" }));

// --- WebSocket ---
wsHandler(io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`InsureO Node.js server running on http://localhost:${PORT}`);
});

module.exports = { app, io };
