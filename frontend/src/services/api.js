import axios from "axios";

// Uses env variable when deployed, falls back to localhost in dev
const isLocal  = window.location.hostname === "localhost";
const RENDER   = "https://insureo.onrender.com";
const PROXY    = `https://corsproxy.io/?${encodeURIComponent(RENDER)}`;
const BASE     = isLocal ? "http://localhost:8000" : PROXY;
const CORE_URL = `${BASE}/api/`;
const RT_URL   = isLocal ? "http://localhost:3001/api/" : `${BASE}/api/`;

const core = axios.create({ baseURL: CORE_URL, timeout: 30000 });
const rt   = axios.create({ baseURL: RT_URL,   timeout: 30000 });

// --- Workers ---
export const registerWorker  = (payload) => core.post("/workers/", payload).then(r => r.data);
export const getWorker       = (id)       => core.get(`/workers/${id}`).then(r => r.data);
export const listWorkers     = ()         => core.get("/workers").then(r => r.data);
export const updateBaseline  = (id, amt)  => core.patch(`/workers/${id}/baseline?baseline_earnings=${amt}`).then(r => r.data);

// --- Claims ---
export const submitClaim     = (payload)  => core.post("/claims/submit/", payload).then(r => r.data);
export const getWorkerClaims = (id)       => core.get(`/claims/worker/${id}`).then(r => r.data);
export const listClaims      = (status)   => core.get("/claims", { params: { status } }).then(r => r.data);

// --- Disruptions ---
export const getActiveDisruptions = (city) => core.get("/disruptions/active", { params: { city } }).then(r => r.data);
export const reportTraffic        = (data) => core.post("/disruptions/traffic",    data).then(r => r.data);
export const reportWeather        = (data) => core.post("/disruptions/weather",    data).then(r => r.data);
export const reportAlgorithm      = (data) => core.post("/disruptions/algorithm",  data).then(r => r.data);
export const reportRestaurant     = (data) => core.post("/disruptions/restaurant", data).then(r => r.data);

// --- Payouts ---
export const triggerPayout    = (id)  => core.post(`/payouts/${id}/trigger`).then(r => r.data);
export const getQueuedPayouts = ()    => core.get("/payouts/queued").then(r => r.data);

// --- Notifications (Node.js) ---
export const notifyDisruption = (data) => rt.post("/notifications/disruption", data).then(r => r.data);
export const notifyClaim      = (data) => rt.post("/notifications/claim",      data).then(r => r.data);
