from application.dataset import Dataset


class ProfilingAlgorithm:
    def predict(self, dataset: Dataset):
        raise NotImplementedError

    def train(self):
        raise NotImplementedError
