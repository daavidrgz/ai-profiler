from io import StringIO, TextIOBase
from domain.converters.converter import Converter
import csv
import json


class CsvToNdjsonConverter(Converter):
    def convert(self, input_file: TextIOBase):
        output_file = StringIO()
        reader = csv.DictReader(input_file)
        for row in reader:
            line = json.dumps(row)
            output_file.write(line + "\n")

        output_file.seek(0)
        return output_file
