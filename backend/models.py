from sqlalchemy import Column, Integer, String , Enum , DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped , mapped_column
from database import Base 
import datetime

from enum import Enum

class StatusEnum(str, Enum):
    todo = 'todo'
    done = 'done'
    in_progress = 'in_progress'


class Task(Base):
    __tablename__ = "task"

    id : Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    title : Mapped[str] = mapped_column(String(100) , nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=True)
    status: Mapped[StatusEnum] = mapped_column(String, default=StatusEnum.todo, nullable=False)
    created_at : Mapped[DateTime] = mapped_column(nullable=False , default=func.now())
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False, default=func.now())



