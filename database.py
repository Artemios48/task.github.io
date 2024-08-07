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
'''
async def delete_last_task():
    async with engine.begin() as conn:
        session = async_sessionmaker(bind=conn, expire_on_commit=False)()
        result = await session.execute(session.query(Model).order_by(Model.id.desc()).limit(1))
        last_element = result.first()
        await session.delete(last_element)
        await session.commit()'''


