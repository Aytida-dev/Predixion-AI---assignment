import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Navbar from "./components/Navbar"
import Filter from "./components/Filter"
import { PlusIcon } from "lucide-react"
import { Todo } from "@/type"
import TaskDescModal from "./components/TaskDescModal"
import AllTasks from "./components/AllTasks"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./components/ui/dialog"
import CreateTaskForm from "./components/CreateTaskForm"

export const STATUS = {
  todo: {
    color: 'bg-red-50',
    text: 'Todo'
  },
  in_progress: {
    color: 'bg-yellow-50',
    text: 'In Progress'
  },
  done: {
    color: 'bg-green-50',
    text: 'Done'
  }
}

// const demoTodos: Todo[] = [
//   {
//     id: 1,
//     title: "Finish project proposal",
//     description: "Write up the project proposal and send it to the client.",
//     status: 'done',
//     created_at: new Date("2022-09-01")
//   },
//   {
//     id: 2,
//     title: "Schedule team meeting",
//     description: "Coordinate with the team to set up a meeting time.",
//     status: 'in_progress',
//     created_at: new Date("2021-09-05")
//   },
//   {
//     id: 3,
//     title: "Buy groceries",
//     description: "Pick up milk, eggs, and bread from the store.",
//     status: 'done',
//     created_at: new Date("2021-09-03")
//   },
//   {
//     id: 4,
//     title: "Clean the house",
//     description: "Vacuum, dust, and tidy up the living room and kitchen.",
//     status: 'todo',
//     created_at: new Date("2021-09-02")
//   },
// ]
function App() {
  const [tasks, setTasks] = useState<Todo[] | null>(null)
  const [selectedTask, setSelectedTask] = useState<Todo | null>(null)
  const [filter, setFilter] = useState("All")
  const [creatingTask, setCreatingTask] = useState(false)

  async function getAllTasks() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks`)

      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }

      const data = await response.json()

      setTasks(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getAllTasks()
  }, [])

  const handleTaskClick = (task: Todo) => {
    setSelectedTask(task)
  }

  const handleCloseModal = () => {
    setSelectedTask(null)
  }

  const closeModel = () => {
    setCreatingTask(false)
  }

  function updateTask(id?: number, status?: Todo['status'], task?: Todo) {
    if (!tasks) return

    if (id && status) {
      setTasks(tasks.map(task => {
        if (task.id === id) {
          return {
            ...task,
            status
          }
        }
        return task
      }))
      return
    }

    if (id) {
      setTasks(tasks.filter(task => task.id !== id))
      return
    }

    if (task) {
      setTasks([task, ...tasks])
      return
    }

  }



  const filteredTasks = useMemo(() => {
    if (tasks === null) return null
    switch (filter) {
      case "Todo":
        return tasks.filter((task) => task.status === 'todo')
      case "In progress":
        return tasks.filter((task) => task.status === 'in_progress')
      case "Done":
        return tasks.filter((task) => task.status === 'done')
      case "Created at (ASC)":
        return tasks.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      case "Created at (DESC)":
        return tasks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      default:
        return tasks
    }
  }, [tasks, filter])

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar />
      <main className="flex-1 p-6 flex justify-center bg-secondary">
        <div className="w-full max-w-[1000px]">
          <div className="flex items-center justify-between mb-4">
            <Filter filter={filter} setFilter={setFilter} />
            <Button disabled={!filteredTasks} onClick={() => setCreatingTask(true)}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
          <AllTasks filteredTasks={filteredTasks} handleTaskClick={handleTaskClick} />
        </div>
      </main>
      <TaskDescModal selectedTask={selectedTask as Todo} handleCloseModal={handleCloseModal} updateTasks={updateTask} />
      <Dialog open={creatingTask} onOpenChange={closeModel}>
        <DialogContent>
          <DialogTitle>Add Task</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new task
          </DialogDescription>
          <CreateTaskForm closeModel={closeModel} updateTasks={updateTask} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App
