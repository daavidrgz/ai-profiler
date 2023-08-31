import time
from threading import Thread
from uuid import UUID, uuid4

from domain.algorithms.grivas.grivas_algorithm import GrivasAlgorithm
from domain.algorithms.martinc.martinc_algorithm import MartincAlgorithm
from domain.entities.predict_dataset import PredictDataset
from domain.entities.profiling import Profiling
from domain.entities.profiling_algorithm import ProfilingAlgorithm
from domain.entities.train_dataset import TrainDataset
from infraestructure.mongo_profiling_repository import MongoProfilingRepository


class ProfilingService:
    ALL_ALGORITHMS = [MartincAlgorithm(), GrivasAlgorithm()]
    profiling_repository = MongoProfilingRepository()

    def predict(
        self,
        predict_dataset: PredictDataset,
        algorithm: ProfilingAlgorithm,
        train_dataset: TrainDataset,
    ):
        if train_dataset is None:
            train_dataset = algorithm.default_train_dataset

        profiling_id = uuid4()
        self.profiling_repository.create_profiling(
            Profiling(
                id=profiling_id,
                status="PENDING",
                algorithm=algorithm.name,
                train_dataset=train_dataset.name,
            )
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
        start = time.time()
        output = algorithm.predict(predict_dataset, train_dataset)
        end = time.time()

        total_time = int((end - start) * 1000)

        self.profiling_repository.update_profiling(
            Profiling(
                id=profiling_id,
                status="SUCCESS",
                algorithm=algorithm.name,
                train_dataset=train_dataset.name,
                time=total_time,
                output=output,
            ),
        )

    def get_profiling(self, profiling_id: UUID):
        profiling = self.profiling_repository.get_profiling(profiling_id)
        return profiling

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
