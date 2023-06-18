from application.dataset import Dataset


class ProfilingAlgorithm:
    def autoprofile(self, dataset: Dataset):
        raise NotImplementedError

    def train(self):
        raise NotImplementedError
