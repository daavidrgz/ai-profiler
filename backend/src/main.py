from io import StringIO
from threading import Thread
from uuid import uuid4, UUID
from fastapi import FastAPI, HTTPException, UploadFile
from domain.services.profiling_service import ProfilingService
from application.file_type import FileType
from application.dataset import PredictDataset
from logging.config import dictConfig
from domain.algorithms.martinc.martinc_algorithm import MartincAlgorithm
from domain.algorithms.grivas.grivas_algorithm import GrivasAlgorithm
from domain.services.twitter_service import TwitterService
from domain.entities.train_dataset import (
    PAN14TrainDataset,
    PAN15TrainDataset,
    PAN19TrainDataset,
)
from utils.logger_config import log_config

dictConfig(log_config)
app = FastAPI()
profiling_service = ProfilingService()
twitter_service = TwitterService()


@app.post("/predict")
def predict(file: UploadFile, algorithm: str = None, dataset: str = "default"):
    uuid = uuid4()

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
        profiling_dataset = PredictDataset(
            filename=filename, file_type=file_type, file=text_file
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    algorithm = __get_algorithm(algorithm)
    train_dataset = __get_train_dataset(dataset)
    __check_compatibilty(algorithm, train_dataset)

    thread = Thread(
        target=profiling_service.predict,
        args=(profiling_dataset, algorithm, train_dataset, uuid),
    )
    thread.start()

    return {"profiling_id": uuid}


@app.post("/predict/twitter")
def predict_twitter(user: str, algorithm: str = None, dataset: str = "default"):
    uuid = uuid4()

    try:
        file = twitter_service.get_tweets(user)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error while fetching tweets")

    try:
        dataset = PredictDataset(
            filename=f"{user}_tweets", file_type=FileType.NDJSON, file=file
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    algorithm = __get_algorithm(algorithm)
    train_dataset = __get_train_dataset(dataset)

    thread = Thread(
        target=profiling_service.predict, args=(dataset, algorithm, train_dataset, uuid)
    )
    thread.start()

    return {"profiling_id": uuid}


@app.get("/profilings/{profiling_id}")
def get_profiling(profiling_id: str):
    try:
        uuid = UUID(profiling_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return profiling_service.get_profiling(uuid)


@app.get("/train")
def train(algorithm: str = "all", dataset: str = "default"):
    algorithm = __get_algorithm(algorithm)
    train_dataset = __get_train_dataset(dataset)
    __check_compatibilty(algorithm, train_dataset)
    return profiling_service.train(algorithm, train_dataset)


@app.get("/performance")
def get_performance(algorithm: str = "all", dataset: str = "default"):
    algorithm = __get_algorithm(algorithm)
    train_dataset = __get_train_dataset(dataset)
    __check_compatibilty(algorithm, train_dataset)
    return profiling_service.get_performance(algorithm, train_dataset)


def __check_compatibilty(algorithm, train_dataset):
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


def __get_algorithm(algorithm_str: str):
    if algorithm_str == "martinc":
        return MartincAlgorithm()
    elif algorithm_str == "grivas":
        return GrivasAlgorithm()
    elif algorithm_str == "all":
        return None
    else:
        algorithm_names = profiling_service.get_algorithm_names()
        raise HTTPException(
            status_code=400,
            detail="Algorithm not supported. Supported algorithms are: "
            + ", ".join(algorithm_names),
        )


def __get_train_dataset(dataset_str: str):
    if dataset_str == "PAN19":
        return PAN19TrainDataset()
    elif dataset_str == "PAN14":
        return PAN14TrainDataset()
    elif dataset_str == "PAN15":
        return PAN15TrainDataset()
    elif dataset_str == "default":
        return None
    else:
        dataset_names = profiling_service.get_dataset_names()
        raise HTTPException(
            status_code=400,
            detail="Dataset not supported. Supported datasets are: "
            + ", ".join(dataset_names),
        )
