from io import StringIO
from uuid import UUID
from fastapi import APIRouter, HTTPException, UploadFile
from domain.algorithms.grivas.grivas_algorithm import GrivasAlgorithm
from domain.algorithms.martinc.martinc_algorithm import MartincAlgorithm
from domain.entities.predict_dataset import PredictDataset
from domain.services.profiling_service import ProfilingService
from domain.services.twitter_service import TwitterService
from domain.entities.file_type import FileType
from domain.entities.train_dataset import (
    PAN14TrainDataset,
    PAN15TrainDataset,
    PAN19TrainDataset,
)


class Controller:
    def __init__(self):
        self.profiling_service = ProfilingService()
        self.twitter_service = TwitterService()

        self.router = APIRouter()
        self.router.add_api_route("/predict", self.predict, methods=["POST"])
        self.router.add_api_route(
            "/predict/twitter", self.predict_twitter, methods=["POST"]
        )
        self.router.add_api_route(
            "/profilings/{profiling_id}", self.get_profiling, methods=["GET"]
        )
        self.router.add_api_route("/train", self.train, methods=["POST"])
        self.router.add_api_route("/performance", self.get_performance, methods=["POST"])

    def predict(
        self, file: UploadFile, algorithm: str = None, dataset: str = "default"
    ):
        extension = file.filename.split(".")[-1]
        try:
            file_type = FileType(extension)
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail="File type not supported. Supported file types are: "
                + ", ".join([file_type.value for file_type in FileType]),
            )

        filename = file.filename
        content = file.file.read().decode("utf-8")
        text_file = StringIO(content)

        try:
            predict_dataset = PredictDataset(
                filename=filename, file_type=file_type, file=text_file
            )
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

        algorithm = self.__get_algorithm(algorithm)
        train_dataset = self.__get_train_dataset(dataset)
        self.__check_compatibilty(algorithm, train_dataset)

        output = self.profiling_service.predict(
            predict_dataset, algorithm, train_dataset
        )

        return output

    def predict_twitter(
        self, user: str, algorithm: str = None, dataset: str = "default"
    ):
        try:
            file = self.twitter_service.get_tweets(user)
        except Exception as e:
            raise HTTPException(status_code=400, detail="Error while fetching tweets")

        try:
            predict_dataset = PredictDataset(
                filename=f"{user}_tweets", file_type=FileType.NDJSON, file=file
            )
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

        algorithm = self.__get_algorithm(algorithm)
        train_dataset = self.__get_train_dataset(dataset)
        self.__check_compatibilty(algorithm, train_dataset)

        output = self.profiling_service.predict(
            predict_dataset, algorithm, train_dataset
        )

        return output

    def get_profiling(self, profiling_id: str):
        try:
            uuid = UUID(profiling_id)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

        profiling = self.profiling_service.get_profiling(uuid)

        if profiling is None:
            raise HTTPException(
                status_code=404, detail=f"Profiling with id {profiling_id} not found"
            )

        return profiling

    def train(self, algorithm: str = "all", dataset: str = "default"):
        algorithm = self.__get_algorithm(algorithm)
        train_dataset = self.__get_train_dataset(dataset)
        self.__check_compatibilty(algorithm, train_dataset)
        return self.profiling_service.train(algorithm, train_dataset)

    def get_performance(self, algorithm: str = "all", dataset: str = "default"):
        algorithm = self.__get_algorithm(algorithm)
        train_dataset = self.__get_train_dataset(dataset)
        self.__check_compatibilty(algorithm, train_dataset)
        return self.profiling_service.get_performance(algorithm, train_dataset)

    def __check_compatibilty(self, algorithm, train_dataset):
        if algorithm is None:
            if train_dataset is not None:
                raise HTTPException(
                    status_code=400,
                    detail="You can't specify a dataset when using all algorithms",
                )
        elif train_dataset is not None:
            supported_dataset_names = [
                dataset.name for dataset in algorithm.supported_train_datasets
            ]
            if train_dataset.name not in supported_dataset_names:
                raise HTTPException(
                    status_code=400,
                    detail="Algorithm not compatible with specified dataset. Supported datasets for"
                    + algorithm.name
                    + "are: "
                    + ", ".join(supported_dataset_names),
                )

    def __get_algorithm(self, algorithm_str: str):
        if algorithm_str == "martinc":
            return MartincAlgorithm()
        elif algorithm_str == "grivas":
            return GrivasAlgorithm()
        elif algorithm_str == "all":
            return None
        else:
            algorithm_names = self.profiling_service.get_algorithm_names()
            raise HTTPException(
                status_code=400,
                detail="Algorithm not supported. Supported algorithms are: "
                + ", ".join(algorithm_names),
            )

    def __get_train_dataset(self, dataset_str: str):
        if dataset_str == "PAN19":
            return PAN19TrainDataset()
        elif dataset_str == "PAN14":
            return PAN14TrainDataset()
        elif dataset_str == "PAN15":
            return PAN15TrainDataset()
        elif dataset_str == "default":
            return None
        else:
            dataset_names = self.profiling_service.get_dataset_names()
            raise HTTPException(
                status_code=400,
                detail="Dataset not supported. Supported datasets are: "
                + ", ".join(dataset_names),
            )
