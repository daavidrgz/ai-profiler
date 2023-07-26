from abc import ABC, abstractmethod
from application.dataset import PredictDataset
from domain.entities.train_dataset import TrainDataset


class ProfilingAlgorithm(ABC):
    def __init__(self, name, supported_train_datasets, default_train_dataset):
        self.name = name
        self.supported_train_datasets = supported_train_datasets
        self.default_train_dataset = default_train_dataset

    @abstractmethod
    def predict(self, dataset: PredictDataset, train_dataset: TrainDataset):
        raise NotImplementedError

    @abstractmethod
    def train(self, train_dataset: TrainDataset):
        raise NotImplementedError
    
    @abstractmethod
    def get_performance(self, train_dataset: TrainDataset):
        raise NotImplementedError
