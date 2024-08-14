from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, Mapped, MappedColumn
from sqlalchemy import delete, select
from typing import Annotated, Optional

engine = create_async_engine('sqlite+aiosqlite:///tasks.db')
new_session = async_sessionmaker(engine ,expire_on_commit=False)

class Model(DeclarativeBase):
    pass

class TasksOrm(Model):
    __tablename__ = 'Tasks'

    id:Mapped[int] = MappedColumn(primary_key=True)
    name:Mapped[str]
    description:Mapped[Optional[str]]

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Model.metadata.create_all)

async def delete_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Model.metadata.drop_all)

async def delete_last_task():
    """Удаляет последнюю задачу из базы данных (с максимальным ID)."""
    async with new_session() as session:
        # Получение ID последней задачи
        result = await session.execute(select(TasksOrm.id).order_by(TasksOrm.id.desc()).limit(1))
        last_task_id = result.scalar_one_or_none()

        # Если задача найдена
        if last_task_id is not None:
            # Удаление задачи по полученному ID
            stmt = delete(TasksOrm).where(TasksOrm.id == last_task_id)
            await session.execute(stmt)
            await session.commit()
            return True # Успешное удаление
        else:
            return False # Задача не найдена


