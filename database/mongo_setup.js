/**
 * MongoDB Collection Setup for InsureO
 * Run with: mongosh < database/mongo_setup.js
 *       or: mongosh mongodb://localhost:27017/insureo database/mongo_setup.js
 */

use("insureo");

// ─── route_snapshots ──────────────────────────────────────────────────────────
// Frozen at dispatch time — immutable. Used to detect route deviation fraud.
db.createCollection("route_snapshots", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["worker_id", "order_id", "route_coords", "frozen_at"],
      properties: {
        worker_id:    { bsonType: "string" },
        order_id:     { bsonType: "string" },
        route_coords: { bsonType: "array" },   // [{lat, lng}]
        frozen_at:    { bsonType: "string" },  // ISO timestamp
        platform:     { bsonType: "string" },
      },
    },
  },
});
db.route_snapshots.createIndex({ worker_id: 1, frozen_at: -1 });
db.route_snapshots.createIndex({ order_id: 1 }, { unique: true });

// ─── disruption_events ────────────────────────────────────────────────────────
// Written by FastAPI disruption detector. Queried by claims router.
db.createCollection("disruption_events", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["type", "city", "confirmed", "severity", "created_at"],
      properties: {
        type:       { bsonType: "string", enum: ["traffic","weather","algorithm","restaurant"] },
        city:       { bsonType: "string" },
        confirmed:  { bsonType: "bool" },
        severity:   { bsonType: "string", enum: ["low","medium","high"] },
        detail:     { bsonType: "string" },
        created_at: { bsonType: "string" },
      },
    },
  },
});
db.disruption_events.createIndex({ type: 1, confirmed: 1, created_at: -1 });
db.disruption_events.createIndex({ city: 1, confirmed: 1 });

// ─── claim_audit_logs ─────────────────────────────────────────────────────────
// Full audit trail: eligibility, fraud score, final decision.
db.createCollection("claim_audit_logs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["claim_id", "worker_id", "status", "created_at"],
      properties: {
        claim_id:    { bsonType: "string" },
        worker_id:   { bsonType: "string" },
        eligibility: { bsonType: "object" },
        fraud_score: { bsonType: "double" },
        status:      { bsonType: "string" },
        created_at:  { bsonType: "string" },
      },
    },
  },
});
db.claim_audit_logs.createIndex({ claim_id: 1 }, { unique: true });
db.claim_audit_logs.createIndex({ worker_id: 1, created_at: -1 });

print("InsureO MongoDB collections created successfully.");
