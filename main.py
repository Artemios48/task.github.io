from fastapi import FastAPI, Depends
from contextlib import asynccontextmanager
from database import create_tables, delete_tables#, delete_last_task
from router import router as tasks_router
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    await delete_tables()
    print("база очищена")
    #await delete_last_task()
    #print('Последняя тасочка умерла')
    await create_tables()
    print("база готова")
    yield
    print("выключение")

    

app = FastAPI(lifespan=lifespan) 
app.include_router(tasks_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Разрешить доступ с любого домена
    allow_credentials=True,
    allow_methods=["*"], # Разрешить все методы (GET, POST, PUT, DELETE, ...)
    allow_headers=["*"], # Разрешить все заголовки
)


#uvicorn main:app --reload | https://www.youtube.com/watch?v=gBfkX9H3szQ? 14:47
'''@app.get("/tasks")
def get_tasks():
    task = task(name='Запиши че то')
    return {'data' : task} '''
      