from sqlalchemy import Column, Integer, String
from infraestrcuture.database import Base


class Result(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True, index=True)
    file = Column(String, index=True)
