from uuid import UUID


class Profiling:
    def __init__(self, id: UUID, status: str, result: dict = {}):
        self.id = id
        self.status = status
        self.result = result
