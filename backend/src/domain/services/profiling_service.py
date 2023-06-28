import json
import os
import time
from uuid import UUID
from application.dataset import Dataset
from domain.algorithms.martinc.profiler import MartincAlgorithm
from domain.algorithms.grivas.profiler import GrivasAlgorithm
from domain.algorithms.profiling_algorithm import ProfilingAlgorithm
from threading import Thread


class ProfilingService:
    SAVE_PATH = "/tmp"
    ALL_ALGORITHMS = [MartincAlgorithm, GrivasAlgorithm]

    def predict(
        self, dataset: Dataset, algorithm: ProfilingAlgorithm, profiling_id: UUID
    ):
        start = time.time()
        output = algorithm.predict(dataset)
        end = time.time()

        result = {
            "algorithm": algorithm.NAME,
            "time": int((end - start) * 1000),
            "output": output,
        }

        with open(f"{self.SAVE_PATH}/{profiling_id}.ndjson", "w") as f:
            f.write(json.dumps(result))

    def get_profiling(self, profiling_id: UUID):
        if os.path.exists(f"{self.SAVE_PATH}/{profiling_id}.ndjson"):
            with open(f"{self.SAVE_PATH}/{profiling_id}.ndjson", "r") as f:
                content = json.load(f)
                os.remove(f"{self.SAVE_PATH}/{profiling_id}.ndjson")
            return {"status": "SUCCESS", "profiling": content}
        else:
            return {"status": "PENDING"}

    def train(self, algorithm: ProfilingAlgorithm):
        if algorithm:
            thread = Thread(target=algorithm.train)
            thread.start()
            return "Training started for " + algorithm.NAME
        else:
            for algorithm in self.ALL_ALGORITHMS:
                thread = Thread(target=algorithm.train)
                thread.start()
            return "Training started for all algorithms"

    def get_performance(self, algorithm: ProfilingAlgorithm):
        if algorithm:
            return algorithm.get_performance()
        else:
            return [algorithm.get_performance() for algorithm in self.ALL_ALGORITHMS]

    def get_algotihm_names(self):
        return [algorithm.NAME for algorithm in self.ALL_ALGORITHMS]
