import json
from uuid import UUID
from sqlalchemy.orm import Session

from domain.entities.profiling import Profiling
from domain.repositories.profiling_repository import ProfilingRepository
from infraestructure.postgres_database import SessionLocal
from infraestructure.postgres_database import engine
from infraestructure import postgres_models


class PostgresProfilingRepository(ProfilingRepository):
    def __init__(self):
        postgres_models.Base.metadata.create_all(bind=engine)

    def get_profiling(self, profiling_id: UUID):
        db = SessionLocal()
        db_profiling = self.__get_profiling_raw(db, profiling_id)
        db.close()
        if db_profiling is None:
            return None
        return db_profiling.toProfiling()

    def create_profiling(self, profiling: Profiling):
        db = SessionLocal()
        db_profiling = postgres_models.PostgresProfilingModel(
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
        
    def delete_profiling(self, profiling_id: UUID):
        db = SessionLocal()
        db_profiling = self.__get_profiling_raw(db, profiling_id)
        if db_profiling is None:
            return None
        db.delete(db_profiling)
        db.commit()
        db.close()

    def __get_profiling_raw(self, db: Session, profiling_id: UUID):
        return (
            db.query(postgres_models.PostgresProfilingModel)
            .filter(postgres_models.PostgresProfilingModel.id == str(profiling_id))
            .first()
        )
