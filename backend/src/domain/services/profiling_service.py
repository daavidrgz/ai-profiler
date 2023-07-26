import json
import os
import time
from uuid import UUID
from application.dataset import PredictDataset
from domain.algorithms.martinc.martinc_algorithm import MartincAlgorithm
from domain.algorithms.grivas.grivas_algorithm import GrivasAlgorithm
from domain.algorithms.profiling_algorithm import ProfilingAlgorithm
from threading import Thread

from domain.entities.train_dataset import TrainDataset


class ProfilingService:
    SAVE_PATH = "/tmp"
    ALL_ALGORITHMS = [MartincAlgorithm(), GrivasAlgorithm()]

    def predict(
        self,
        dataset: PredictDataset,
        algorithm: ProfilingAlgorithm,
        train_dataset: TrainDataset,
        profiling_id: UUID,
    ):
        if train_dataset is None:
            train_dataset = algorithm.default_train_dataset
        start = time.time()
        output = algorithm.predict(dataset, train_dataset)
        end = time.time()

        result = {
            "algorithm": algorithm.name,
            "time": int((end - start) * 1000),
            "output": output,
        }

        with open(f"{self.SAVE_PATH}/{profiling_id}.ndjson", "w") as f:
            f.write(json.dumps(result))

    def get_profiling(self, profiling_id: UUID):
        if os.path.exists(f"{self.SAVE_PATH}/{profiling_id}.ndjson"):
            with open(f"{self.SAVE_PATH}/{profiling_id}.ndjson", "r") as f:
                try:
                    content = json.load(f)
                    os.remove(f"{self.SAVE_PATH}/{profiling_id}.ndjson")
                except:
                    return {"status": "PENDING"}
            return {"status": "SUCCESS", "profiling": content}
        else:
            return {"status": "PENDING"}

    def train(self, algorithm: ProfilingAlgorithm, train_dataset: TrainDataset):
        if algorithm:
            if train_dataset is None:
                train_dataset = algorithm.default_train_dataset
            thread = Thread(target=algorithm.train, args=(train_dataset,))
            thread.start()
            return "Training started for " + algorithm.name
        else:
            for algorithm in self.ALL_ALGORITHMS:
                default_train_dataset = algorithm.default_train_dataset
                thread = Thread(target=algorithm.train, args=(default_train_dataset,))
                thread.start()
            return "Training started for all algorithms"

    def get_performance(
        self, algorithm: ProfilingAlgorithm, train_dataset: TrainDataset
    ):
        if algorithm:
            if train_dataset is None:
                train_dataset = algorithm.default_train_dataset
            return algorithm.get_performance(train_dataset)
        else:
            return [
                algorithm.get_performance(algorithm.default_train_dataset)
                for algorithm in self.ALL_ALGORITHMS
            ]

    def get_algorithm_names(self):
        return [algorithm.name for algorithm in self.ALL_ALGORITHMS]
