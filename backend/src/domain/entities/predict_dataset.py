from io import IOBase
import csv
import json
from domain.converters.csv_to_ndjson_converter import CsvToNdjsonConverter
from domain.converters.ndjson_to_csv_converter import NdjsonToCsvConverter
from domain.entities.file_type import FileType


class PredictDataset:
    FIELDNAMES = ["id", "text"]

    def __init__(self, filename: str, file_type: FileType, file: IOBase):
        self.file_type = file_type
        self.filename = filename
        self.file = file
        self.check_validity()

    def get_documents(self):
        self.convert_to_ndjson()

        documents = {}
        for line in self.file:
            lx = json.loads(line)
            if isinstance(lx["text"], list):
                tokens_word = " ".join(lx["text"])
            else:
                tokens_word = lx["text"]

            documents[lx["id"]] = documents.get(lx["id"], "") + tokens_word
        return documents

    def convert_to_ndjson(self):
        if self.file_type == FileType.CSV:
            self.file = CsvToNdjsonConverter().convert(self.file)

    def convert_to_csv(self):
        if self.file_type == FileType.NDJSON:
            self.file = NdjsonToCsvConverter().convert(self.file)

    def check_validity(self):
        if self.file_type == FileType.CSV:
            self.__csv_validator()
        elif self.file_type == FileType.NDJSON:
            self.__ndjson_validator()
        else:
            raise Exception("File type not supported.")
        self.file.seek(0)

    def __csv_validator(self):
        reader = csv.DictReader(self.file)

        if reader.fieldnames is None:
            raise Exception("CSV file does not have a header")

        if not all(attr in reader.fieldnames for attr in self.FIELDNAMES):
            raise Exception(
                "CSV file does not have mandatory fields. Expected: id, text"
            )

    def __ndjson_validator(self):
        for line in self.file:
            try:
                json_line = json.loads(line)
            except json.decoder.JSONDecodeError:
                raise Exception("NDJSON file is not valid JSON")
            if not all(attr in json_line for attr in self.FIELDNAMES):
                raise Exception(
                    "NDJSON file does not have mandatory fields. Expected: id, text"
                )
