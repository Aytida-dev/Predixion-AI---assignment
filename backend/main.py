from fastapi import FastAPI , HTTPException , Depends , status , Header

from dotenv import load_dotenv 
load_dotenv()

from pydantic import BaseModel , Field
from typing import Annotated
from sqlalchemy.ext.asyncio import AsyncSession 
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.future import select
from datetime import datetime
from typing import Optional

from models import Task , StatusEnum , User
from database import  get_db


app = FastAPI( title="Task API", version="0.1" , description="A simple task API" )


class TaskResponse(BaseModel):
    id : int
    title : str
    description : str
    status : StatusEnum
    created_at : datetime

class CreateTask(BaseModel):
    title : str = Field(... , min_length=1 , max_length=100)
    description : str = Field(... , min_length=1 , max_length=255)
    status : Optional[StatusEnum]

class UpdateTask(BaseModel):
    status : StatusEnum

class RegisterUser(BaseModel):
    username : str = Field(... , min_length=1 , max_length=100)
    number : str = Field(... , min_length=1 , max_length=100)
    password : str = Field(... , min_length=1 , max_length=100)

class LoginUser(BaseModel):
    number : str = Field(... , min_length=1 , max_length=100)
    password : str = Field(... , min_length=1 , max_length=100)



db_dependency = Annotated[AsyncSession, Depends(get_db)]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/" , status_code=status.HTTP_200_OK)
async def index():
    return {"message" : "Welcome to the Task API"}



@app.get("/api/tasks" , response_model=list[TaskResponse],  status_code=status.HTTP_200_OK )
async def get_tasks(db : db_dependency  ):

    tasks = await db.execute(select(Task).order_by(Task.created_at.desc()))
    # tasks = await db.execute(select(Task).where(Task.user_id == user).order_by(Task.created_at.desc()))
    tasks = tasks.scalars().all()
    return tasks


@app.post("/api/tasks" , status_code=status.HTTP_201_CREATED)
async def create_task(task : CreateTask, loginHash : str , db :db_dependency):
   

    new_task = Task(**task.dict())

    try:
        db.add(new_task)
        await db.commit()
        await db.refresh(new_task)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Could not create task")
    
    return new_task

@app.put("/api/tasks/{task_id}" , status_code=status.HTTP_200_OK)
async def update_task(body : UpdateTask , task_id : int  , loginHash : str  , db : db_dependency):
   

    task = await db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    task.status = body.status
    await db.commit()

    return {
        "message" : "Status updated",
        "new_status" : body.status
    }

    
@app.delete("/api/tasks/{task_id}" , status_code=status.HTTP_200_OK)
async def delete_task(task_id : int ,loginHash : str ,db : db_dependency):
    task = await db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    await db.delete(task)
    await db.commit()



    return {
        "message" : "Task deleted",
        "task_id" : task_id
    }

# create routes for simple authentication
# create routes for user registration
# create routes for user login
# create routes for user logout

AUTH_SET = {"1234" : "8862928826"}

@app.post("/api/register" , status_code=status.HTTP_201_CREATED)
async def register_user(userData : RegisterUser , db : db_dependency):
    user = await db.get(User , userData.number)
    if user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    new_user = User(**userData.dict())
    try:
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Could not register user")
    
    return new_user

@app.post("/api/login" , status_code=status.HTTP_200_OK)
async def login_user(userData : LoginUser , db : db_dependency):
    # get user using number
    user = await db.execute(select(User).where(User.number == userData.number))
    user = user.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.password != userData.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    
    return {
        "message" : "Login successful",
        "user" : user.username,
    }


def verifyUser(loginHash):
    return AUTH_SET.get(loginHash , None)