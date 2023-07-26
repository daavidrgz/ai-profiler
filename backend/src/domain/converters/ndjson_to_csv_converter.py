from io import StringIO, TextIOBase
from domain.converters.converter import Converter
import csv
import json


class NdjsonToCsvConverter(Converter):
    def convert(self, input_file: TextIOBase):
        output_file = StringIO()
        writer = csv.DictWriter(output_file, fieldnames=["id", "name", "age"])
        writer.writeheader()
        for line in input_file:
            row = json.loads(line)
            writer.writerow(row)

        output_file.seek(0)
        return output_file
