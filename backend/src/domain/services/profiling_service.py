import time
from uuid import UUID, uuid4
from domain.entities.dataset import PredictDataset
from domain.algorithms.martinc.martinc_algorithm import MartincAlgorithm
from domain.algorithms.grivas.grivas_algorithm import GrivasAlgorithm
from domain.algorithms.profiling_algorithm import ProfilingAlgorithm
from threading import Thread

from domain.entities.train_dataset import TrainDataset
from domain.entities.profiling import Profiling
from infraestructure.sqlite_profiling_repository import SqliteRepository


class ProfilingService:
    ALL_ALGORITHMS = [MartincAlgorithm(), GrivasAlgorithm()]
    profiling_repository = SqliteRepository()

    def predict(
        self,
        predict_dataset: PredictDataset,
        algorithm: ProfilingAlgorithm,
        train_dataset: TrainDataset,
    ):
        profiling_id = uuid4()

        self.profiling_repository.create_profiling(
            Profiling(id=profiling_id, status="PENDING")
        )

        thread = Thread(
            target=self.predict_async,
            args=(predict_dataset, algorithm, train_dataset, profiling_id),
        )
        thread.start()

        return {"id": profiling_id}

    def predict_async(
        self,
        predict_dataset: PredictDataset,
        algorithm: ProfilingAlgorithm,
        train_dataset: TrainDataset,
        profiling_id: UUID,
    ):
        if train_dataset is None:
            train_dataset = algorithm.default_train_dataset
        start = time.time()
        output = algorithm.predict(predict_dataset, train_dataset)
        end = time.time()

        result = {
            "algorithm": algorithm.name,
            "time": int((end - start) * 1000),
            "output": output,
        }

        self.profiling_repository.update_profiling(
            Profiling(id=profiling_id, status="SUCCESS", result=result)
        )

    def get_profiling(self, profiling_id: UUID):
        profiling = self.profiling_repository.get_profiling(profiling_id)

        if profiling is None:
            return None

        return {
            "id": profiling.id,
            "status": profiling.status,
            "profiling": profiling.result if profiling.result else None,
        }

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
