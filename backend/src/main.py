from io import StringIO
import time
from fastapi import FastAPI, UploadFile
from domain.services.profiling_service import ProfilingService
from application.file_type import FileType
from application.dataset import Dataset
from logging.config import dictConfig
from domain.algorithms.martinc_celebrity.profiler import MartincCelebrity
from utils.logger_config import log_config

dictConfig(log_config)
app = FastAPI()
profiling_service = ProfilingService()


@app.post("/profiling")
def profiling(file: UploadFile):
    extension = file.filename.split(".")[-1]

    try:
        file_type = FileType(extension)
    except Exception as e:
        return {
            "error": "File type not supported. Supported file types are: "
            + ", ".join([file_type.value for file_type in FileType])
        }

    filename = file.filename
    content = file.file.read().decode("utf-8")
    text_file = StringIO(content)

    try:
        dataset = Dataset(filename=filename, file_type=file_type, file=text_file)
    except Exception as e:
        return {"error": str(e)}

    algorithm = MartincCelebrity()

    start = time.time()
    output = profiling_service.autoprofile(dataset, algorithm)
    end = time.time()

    return {
        "algorithm": algorithm.NAME,
        "time": int((end - start) * 1000),
        "output": output,
    }


@app.get("/train")
def train():
    return profiling_service.train()
