from abc import ABC


class TrainDataset(ABC):
    def __init__(self, name, train_path: str, test_path: str):
        self.name = name
        self.train_path = train_path
        self.test_path = test_path


class PAN19TrainDataset(TrainDataset):
    def __init__(self):
        name = "PAN19"
        train_path = "../datasets/PAN19 - Celebrity Profiling/training"
        test_path = "../datasets/PAN19 - Celebrity Profiling/test"
        super().__init__(name, train_path, test_path)


class PAN14TrainDataset(TrainDataset):
    def __init__(self):
        name = "PAN14"
        train_path = "../datasets/PAN14 - Author Profiling/english/reviews"
        test_path = "../datasets/PAN14 - Author Profiling/english/blogs"
        super().__init__(name, train_path, test_path)


class PAN15TrainDataset(TrainDataset):
    def __init__(self):
        name = "PAN15"
        train_path = "../datasets/PAN15 - Author Profiling/training/english"
        test_path = "../datasets/PAN15 - Author Profiling/test/english"
        super().__init__(name, train_path, test_path)
