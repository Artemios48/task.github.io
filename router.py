from fastapi import APIRouter, Depends
from schemas import STaskAdd,STask, STaskId
from typing import Annotated, Optional
from repository import TaskRepository
from fastapi.responses import JSONResponse
from database import  delete_last_task, edit_by_id

router = APIRouter(
    prefix='/tasks',
    tags=['Тасочки'],
)

@router.post("")
async def add_task(task: Annotated[STaskAdd, Depends()],) -> STaskId:
    task_id = await TaskRepository.add_one(task)
    return {'ok':True, 'task_id':task_id}


@router.get("")
async def get_tasks() -> list[STask]:
    tasks = await TaskRepository.find_all()
    return tasks

@router.delete("/del")
async def add_task():
    await delete_last_task()
    
@router.put("/edit/{task_id}/{tittle}/{discription}") # Используем PUT для обновления
async def edit_task(task_id: int, tittle: str, discription:str):
    await edit_by_id(task_id,tittle, discription) # Передаем task_id в edit_by_id

#нужно доделать это ГРЕБАННОЕ РЕДАКТИРОВАНИЕ ,НО СНАЧАЛА ПРОЙТИ ГАЙД КОТОРЫЙ Я КАЧАЛ УЖЕ 1000 ЛЕТ НАЗАД 
# пока что я отступлю и буду делать проект , но я за тобой слежу *_*

