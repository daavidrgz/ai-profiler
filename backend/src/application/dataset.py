from io import IOBase
import csv
from domain.converters.csv_to_ndjson_converter import CsvToNdjsonConverter
from domain.converters.ndjson_to_csv_converter import NdjsonToCsvConverter


class Dataset:
    FIELDNAMES = ["id", "text"]

    def __init__(self, filename: str, file_type: str, file: IOBase):
        self.file_type = file_type
        self.filename = filename
        self.file = file
        self.check_validity()

    def convert_to_ndjson(self):
        if self.file_type == "csv":
            self.file = CsvToNdjsonConverter().convert(self.file)

    def convert_to_csv(self):
        if self.file_type == "ndjson":
            self.file = NdjsonToCsvConverter().convert(self.file)

    def check_validity(self):
        if self.file_type == "csv":
            self.__csv_validator()
        elif self.file_type == "ndjson":
            self.__ndjson_validator()
        else:
            raise Exception("File type not supported.")
        self.file.seek(0)

    def __csv_validator(self):
        reader = csv.DictReader(self.file)

        if reader.fieldnames is None:
            raise Exception("CSV file does not have a header")

        if reader.fieldnames != Dataset.FIELDNAMES:
            raise Exception(
                "CSV file does not have the correct fields. Expected: id, text"
            )

    def __ndjson_validator(self):
        pass
