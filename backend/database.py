from sqlalchemy.ext.asyncio import create_async_engine , async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
import os

DATABASE_URL = os.getenv("DB_URL")

try:
    print("Connecting to database...")

    engine = create_async_engine(DATABASE_URL , echo=True )
    SessionLocal = async_sessionmaker(autocommit=False, autoflush=False , bind=engine)

    print("Connected to database")

except Exception as e:
    print(e)



class Base(DeclarativeBase):
    pass


async def get_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    db = SessionLocal()
    try:
        yield db
    finally:
        await db.close()

