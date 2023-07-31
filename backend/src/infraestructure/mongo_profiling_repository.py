import logging
import os
import pymongo
from uuid import UUID
from domain.entities.profiling import Profiling
from domain.repositories.profiling_repository import ProfilingRepository

logger = logging.getLogger("server_logger")


class MongoProfilingRepository(ProfilingRepository):
    def __init__(self):
        DB_HOST = os.environ.get("DB_HOST", "localhost")
        mongo_url = f"mongodb://{DB_HOST}:27017"

        client = pymongo.MongoClient(mongo_url, uuidRepresentation="standard")

        database = client["ai-profiler"]
        self.collection = database["profilings"]

    def get_profiling(self, profiling_id: UUID):
        profiling = self.collection.find_one({"_id": profiling_id})
        return self.__from_mongo_model(profiling)

    def create_profiling(self, profiling: Profiling):
        self.collection.insert_one(self.__to_mongo_model(profiling))

    def update_profiling(self, profiling: Profiling):
        profiling = self.collection.update_one(
            {"_id": profiling.id},
            {"$set": self.__to_mongo_model(profiling)},
        )

    def delete_profiling(self, profiling_id: UUID):
        self.collection.delete_one({"_id": profiling_id})

    def __to_mongo_model(self, profiling: Profiling):
        return {
            "_id": profiling.id,
            "status": profiling.status,
            "algorithm": profiling.algorithm,
            "train_dataset": profiling.train_dataset,
            "time": profiling.time,
            "output": profiling.output,
        }

    def __from_mongo_model(self, mongo_profiling: dict):
        return Profiling(
            id=mongo_profiling.get("_id"),
            status=mongo_profiling.get("status"),
            algorithm=mongo_profiling.get("algorithm"),
            train_dataset=mongo_profiling.get("train_dataset"),
            time=mongo_profiling.get("time"),
            output=mongo_profiling.get("output"),
        )
