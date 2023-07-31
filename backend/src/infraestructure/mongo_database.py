import os
import pymongo

DB_HOST = os.environ.get("DB_HOST", "localhost")
MONGO_URL = f"mongodb://{DB_HOST}:27017"

client = pymongo.MongoClient(MONGO_URL, uuidRepresentation='standard')

database = client["ai-profiler"]

profilings_collection = database["profilings"]