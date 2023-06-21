import json
import os
import time
from uuid import UUID
from application.dataset import Dataset
from domain.algorithms.martinc_celebrity.profiler import MartincCelebrity
from domain.algorithms.profiling_algorithm import ProfilingAlgorithm
from threading import Thread


class ProfilingService:
    SAVE_PATH = "/tmp"

    def autoprofile(self, dataset: Dataset, algorithm: ProfilingAlgorithm, uuid: UUID):
        start = time.time()
        output = algorithm.autoprofile(dataset)
        end = time.time()

        result = {
            "algorithm": algorithm.NAME,
            "time": int((end - start) * 1000),
            "output": output,
        }

        with open(f"{self.SAVE_PATH}/{uuid}.ndjson", "w") as f:
            f.write(json.dumps(result))

    def get_profiling(self, profiling_id: str):
        if os.path.exists(f"{self.SAVE_PATH}/{profiling_id}.ndjson"):
            with open(f"{self.SAVE_PATH}/{profiling_id}.ndjson", "r") as f:
                content = json.load(f)
                os.remove(f"{self.SAVE_PATH}/{profiling_id}.ndjson")
            return {"status": "SUCCESS", "profiling": content}
        else:
            return {"status": "PENDING"}

    def train(self):
        martinc_celebrity = MartincCelebrity()
        thread = Thread(target=martinc_celebrity.train)
        thread.start()
        return "Training started"
