from domain.converters.converter import Converter

import csv
import json


class CsvToNdjsonConverter(Converter):
    def convert(self, input_file):
        # Convert a csv file to ndjson
        output = ""
        reader = csv.DictReader(input_file)
        for row in reader:
            line = json.dumps(row)
            output += line + "\n"
            
        return output
