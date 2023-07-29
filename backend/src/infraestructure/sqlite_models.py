import json
from sqlalchemy import Column, String
from infraestructure.sqlite_database import Base
from domain.entities.profiling import Profiling


class SqliteProfilingModel(Base):
    __tablename__ = "profilings"

    id = Column(String, primary_key=True, index=True)
    status = Column(String, index=False)
    result = Column(String, index=False)

    def toProfiling(self):
        return Profiling(
            id=self.id,
            status=self.status,
            result=json.loads(self.result),
        )
