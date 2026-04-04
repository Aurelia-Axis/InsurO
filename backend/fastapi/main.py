"""
InsureO FastAPI Backend — Port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from routers import workers, claims, disruptions, payouts


async def seed_db():
    """Seed a demo disruption event so claims can be approved on first run."""
    try:
        from database.mongodb import disruption_events
        from datetime import datetime, timezone
        col = disruption_events()
        existing = await col.find_one({"type": "traffic", "confirmed": True})
        if not existing:
            await col.insert_one({
                "_id": "seed-traffic-001",
                "type": "traffic",
                "city": "Bhubaneswar",
                "confirmed": True,
                "severity": "high",
                "detail": "Heavy congestion on NH-16 corridor",
                "created_at": datetime.now(timezone.utc).isoformat(),
            })
            print("[INFO] Seeded demo disruption event")
    except Exception as e:
        print(f"[WARNING] Could not seed disruption: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    from database.postgres import init_db
    await init_db()
    await seed_db()
    print("[INFO] Database ready")
    yield


app = FastAPI(
    title="InsureO API",
    description="Parametric insurance for gig delivery workers",
    version="1.0.0",
    lifespan=lifespan,
    redirect_slashes=False,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins including deployed frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(workers.router,     prefix="/api/workers",     tags=["Workers"])
app.include_router(claims.router,      prefix="/api/claims",      tags=["Claims"])
app.include_router(disruptions.router, prefix="/api/disruptions", tags=["Disruptions"])
app.include_router(payouts.router,     prefix="/api/payouts",     tags=["Payouts"])


@app.get("/health")
async def health():
    return {"status": "ok", "service": "InsureO FastAPI"}
