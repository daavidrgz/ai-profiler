from abc import ABC, abstractmethod
from uuid import UUID

from domain.entities.profiling import Profiling


class ProfilingRepository(ABC):
    @abstractmethod
    def get_profiling(self, profiling_id: UUID):
        raise NotImplementedError

    @abstractmethod
    def create_profiling(self, profiling: Profiling):
        raise NotImplementedError

    @abstractmethod
    def update_profiling(self, profiling: Profiling):
        raise NotImplementedError
    
    @abstractmethod
    def delete_profiling(self, profiling_id: UUID):
        raise NotImplementedError
