import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy_utils import database_exists, create_database

DB_HOST = os.environ.get("DB_HOST", "localhost")
SQLALCHEMY_DATABASE_URL = f"postgresql://postgres:postgres@{DB_HOST}:5432/profiling_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

if not database_exists(engine.url):
    create_database(engine.url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
