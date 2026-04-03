/**
 * WebSocket service — connects to Node.js Socket.IO server on port 3001
 */

import { io } from "socket.io-client";

const NODE_URL = "http://localhost:3001";

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(NODE_URL, { autoConnect: false });
  }
  return socket;
}

export function connectAsWorker(workerId) {
  const s = getSocket();
  s.connect();
  s.emit("join_worker", { workerId });
  return s;
}

export function connectAsAdmin() {
  const s = getSocket();
  s.connect();
  s.emit("join_admin");
  return s;
}

export function disconnect() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
