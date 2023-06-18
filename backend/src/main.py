from io import StringIO
from fastapi import FastAPI, UploadFile
from domain.services.profiling_service import ProfilingService
from application.dataset import Dataset
from logging.config import dictConfig
from utils.logger_config import log_config

dictConfig(log_config)
app = FastAPI()
profiling_service = ProfilingService()


@app.post("/profiling")
def profiling(file: UploadFile):
    supported_extensions = ["csv", "ndjson"]
    extension = file.filename.split(".")[-1]
    if extension not in supported_extensions:
        return {
            "error": "File type not supported. Supported file types are: "
            + ", ".join(supported_extensions)
            + "."
        }

    filename = file.filename
    content = file.file.read().decode("utf-8")
    text_file = StringIO(content)

    try:
        dataset = Dataset(filename=filename, file_type=extension, file=text_file)
    except Exception as e:
        return {"error": str(e)}

    return profiling_service.autoprofile(dataset)


@app.get("/train")
def train():
    return profiling_service.train()
