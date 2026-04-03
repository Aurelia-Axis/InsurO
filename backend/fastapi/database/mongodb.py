"""
MongoDB connection — falls back to in-memory dict store if MongoDB is not running.
This means the app works fully without any database installation.
"""

import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
MONGO_DB  = os.getenv("MONGO_DB", "insureo")

# In-memory fallback store
_memory_store = {
    "route_snapshots":   [],
    "disruption_events": [],
    "claim_audit_logs":  [],
}

_mongo_available = False
_db = None


def _try_connect():
    global _mongo_available, _db
    try:
        from motor.motor_asyncio import AsyncIOMotorClient
        client = AsyncIOMotorClient(MONGO_URL, serverSelectionTimeoutMS=2000)
        _db = client[MONGO_DB]
        _mongo_available = True
    except Exception:
        _mongo_available = False


_try_connect()


class InMemoryCollection:
    """Minimal async-compatible in-memory collection."""

    def __init__(self, name):
        self.name = name

    async def insert_one(self, doc):
        _memory_store[self.name].append(doc)

    async def find_one(self, query, sort=None):
        items = _memory_store[self.name]
        for item in reversed(items):
            if all(item.get(k) == v for k, v in query.items()):
                return item
        return None

    def find(self, query=None, sort=None):
        return InMemoryCursor(self.name, query or {})


class InMemoryCursor:
    def __init__(self, name, query):
        self.name  = name
        self.query = query
        self._limit = 100

    def sort(self, *args):
        return self

    def limit(self, n):
        self._limit = n
        return self

    async def to_list(self, length=None):
        items = _memory_store[self.name]
        result = [i for i in items if all(i.get(k) == v for k, v in self.query.items())]
        return result[: length or self._limit]


def _get_collection(name):
    if _mongo_available and _db is not None:
        return _db[name]
    return InMemoryCollection(name)


def route_snapshots():
    return _get_collection("route_snapshots")

def disruption_events():
    return _get_collection("disruption_events")

def claim_audit_logs():
    return _get_collection("claim_audit_logs")
