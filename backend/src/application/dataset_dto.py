from pydantic import BaseModel


class DatasetDto(BaseModel):
    name: str
    file_type: str
