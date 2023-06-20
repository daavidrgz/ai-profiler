from io import StringIO
from threading import Thread
from uuid import uuid4
from fastapi import FastAPI, HTTPException, UploadFile
from domain.services.profiling_service import ProfilingService
from application.file_type import FileType
from application.dataset import Dataset
from logging.config import dictConfig
from domain.algorithms.martinc_celebrity.profiler import MartincCelebrity
from utils.logger_config import log_config

dictConfig(log_config)
app = FastAPI()
profiling_service = ProfilingService()


@app.post("/autoprofile")
def autoprofile(file: UploadFile):
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

    algorithm = MartincCelebrity()

    thread = Thread(
        target=profiling_service.autoprofile, args=(dataset, algorithm, uuid)
    )
    thread.start()

    return {"profiling_id": uuid}


@app.get("/autoprofile/{profiling_id}")
def get_profiling(profiling_id: str):
    return profiling_service.get_profiling(profiling_id)


@app.get("/train")
def train():
    return profiling_service.train()
