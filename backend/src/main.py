import io
from typing import Annotated, Union
from fastapi import FastAPI, UploadFile, File
from domain.services.profiling_service import ProfilingService
from application.dataset_dto import DatasetDto

app = FastAPI()
profiling_service = ProfilingService()


@app.post("/profiling")
def profiling(file: Annotated[bytes, File()]):
    stream = io.StringIO(file.decode("utf-8"))
    return profiling_service.autoprofile(stream)


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
