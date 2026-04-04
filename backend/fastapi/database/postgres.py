"""
Database — uses SQLite for local dev (no installation needed).
Switch DATABASE_URL to PostgreSQL for production.
"""

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
import os

# SQLite — works with zero installation, file stored locally
DATABASE_URL = os.getenv("POSTGRES_URL", "sqlite+aiosqlite:////tmp/insureo.db")

engine = create_async_engine(DATABASE_URL, echo=False, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_db():
    async with SessionLocal() as session:
        yield session
