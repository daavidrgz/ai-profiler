from abc import ABC, abstractmethod
from io import TextIOBase


class Converter(ABC):
    @abstractmethod
    def convert(self, input_file: TextIOBase):
        raise NotImplementedError
