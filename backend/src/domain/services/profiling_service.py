from application.dataset import Dataset
from domain.algorithms.martinc_celebrity.profiler import MartincCelebrity

class ProfilingService:
    def autoprofile(self, dataset: Dataset):
        martinc_celebrity = MartincCelebrity()
        output = martinc_celebrity.autoprofile(dataset)
        return {"output": output}

    def train(self):
        from threading import Thread

        martinc_celebrity = MartincCelebrity()
        thread = Thread(target=martinc_celebrity.train)
        thread.start()
        return {}
