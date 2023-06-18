from application.dataset import Dataset
from domain.algorithms.martinc_celebrity.profiler import MartincCelebrity
from domain.algorithms.profiling_algorithm import ProfilingAlgorithm


class ProfilingService:
    def autoprofile(self, dataset: Dataset, algorithm: ProfilingAlgorithm):
        output = algorithm.autoprofile(dataset)
        return output

    def train(self):
        from threading import Thread

        martinc_celebrity = MartincCelebrity()
        thread = Thread(target=martinc_celebrity.train)
        thread.start()
        return "Training started"
