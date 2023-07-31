from uuid import UUID


class Profiling:
    def __init__(
        self,
        id: UUID,
        status: str,
        algorithm: str,
        train_dataset: str,
        time: int = None,
        output: list[dict] = None,
    ):
        self.id = id
        self.status = status
        self.algorithm = algorithm
        self.train_dataset = train_dataset
        self.time = time
        self.output = output