from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

# Ожидается что DATABASE_URL будет вида:
# postgresql://user:pass@host:5432/dbname
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:pass@localhost:5432/calc")

# create_engine без future чтобы работать со старой накаткой sqlalchemy
engine = create_engine(DATABASE_URL, future=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
