from io import StringIO
from threading import Thread
from uuid import uuid4, UUID
from fastapi import FastAPI, HTTPException, UploadFile
from domain.services.profiling_service import ProfilingService
from application.file_type import FileType
from application.dataset import Dataset
from logging.config import dictConfig
from domain.algorithms.martinc.profiler import MartincAlgorithm
from domain.algorithms.grivas.profiler import GrivasAlgorithm
from utils.logger_config import log_config

dictConfig(log_config)
app = FastAPI()
profiling_service = ProfilingService()


@app.post("/predict")
def predict(algorithm: str, file: UploadFile):
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
        dataset = Dataset(filename=filename, file_type=file_type, file=text_file)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    algorithm = __get_algorithm(algorithm)

    thread = Thread(target=profiling_service.predict, args=(dataset, algorithm, uuid))
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
def train(algorithm: str = "all"):
    algorithm = __get_algorithm(algorithm)
    return profiling_service.train(algorithm)


@app.get("/performance")
def get_performance(algorithm: str = "all"):
    algorithm = __get_algorithm(algorithm)
    return profiling_service.get_performance(algorithm)


def __get_algorithm(algorithm_str: str):
    if algorithm_str == "martinc":
        return MartincAlgorithm()
    elif algorithm_str == "grivas":
        return GrivasAlgorithm()
    elif algorithm_str == "all":
        return None
    else:
        algorithm_names = profiling_service.get_algotihm_names()
        raise HTTPException(
            status_code=400,
            detail="Algorithm not supported. Supported algorithms are: "
            + ", ".join(algorithm_names),
        )
