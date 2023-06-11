from application.dataset_dto import DatasetDto
from domain.algorithms.martinc_celebrity.profiler import MartincCelebrity
from domain.converters.csv_to_ndjson_converter import CsvToNdjsonConverter


class ProfilingService:
    def autoprofile(self, data_file):
        martinc_celebrity = MartincCelebrity()
        output = CsvToNdjsonConverter().convert(data_file)
        return {"output": output}
