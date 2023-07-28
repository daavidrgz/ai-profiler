import json
from uuid import UUID
from sqlalchemy.orm import Session

from domain.entities.profiling import Profiling
from domain.repositories.profiling_repository import ProfilingRepository
from infraestructure.sqlite_database import SessionLocal
from infraestructure.sqlite_database import engine
from infraestructure import sqlite_models


class SqliteRepository(ProfilingRepository):
    def __init__(self):
        sqlite_models.Base.metadata.create_all(bind=engine)

    def get_profiling(self, profiling_id: UUID):
        db = SessionLocal()
        db_profiling = self.__get_profiling_raw(db, profiling_id)
        db.close()
        if db_profiling is None:
            return None
        return db_profiling.toProfiling()

    def create_profiling(self, profiling: Profiling):
        db = SessionLocal()
        db_profiling = sqlite_models.ProfilingModel(
            id=str(profiling.id),
            status=profiling.status,
            result=json.dumps(profiling.result),
        )
        db.add(db_profiling)
        db.commit()
        db.refresh(db_profiling)
        db.close()

    def update_profiling(self, profiling: Profiling):
        db = SessionLocal()
        db_profiling = self.__get_profiling_raw(db, profiling_id=profiling.id)

        if db_profiling is None:
            self.create_profiling(db, profiling)

        db_profiling.status = profiling.status
        db_profiling.result = json.dumps(profiling.result)
        db.commit()
        db.refresh(db_profiling)
        db.close()

    def __get_profiling_raw(self, db: Session, profiling_id: UUID):
        return (
            db.query(sqlite_models.ProfilingModel)
            .filter(sqlite_models.ProfilingModel.id == str(profiling_id))
            .first()
        )
