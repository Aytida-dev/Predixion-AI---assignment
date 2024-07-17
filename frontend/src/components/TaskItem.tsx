import { Todo } from "@/type"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { STATUS } from "@/App"
import { Badge } from "./ui/badge"
import { useState } from "react"
import { Loader2 } from "lucide-react"

type props = {
    selectedTask: Todo
    handleCloseModal: () => void
    updateTasks: (id: number, status?: Todo['status']) => void
}

export default function TaskItem({ selectedTask, handleCloseModal, updateTasks }: props) {
    if (selectedTask === null) return null

    const [status, setStatus] = useState(selectedTask.status)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)

    async function handleSave() {
        if (status === selectedTask.status) return

        setSaving(true)

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${selectedTask.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            })

            if (!response.ok) {
                throw new Error('Failed to update task status')
            }
            selectedTask.status = status
            updateTasks(selectedTask.id, status)

            handleCloseModal()
        } catch (error) {
            console.error(error)
            setSaving(false)
        }
    }

    async function handleDelete() {
        setDeleting(true)

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${selectedTask.id}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                throw new Error('Failed to delete task')
            }

            setDeleting(false)
            updateTasks(selectedTask.id)
            handleCloseModal()
        } catch (error) {
            console.error(error)
            setDeleting(false)
        }
    }

    return (
        <Dialog open={selectedTask !== null} onOpenChange={handleCloseModal}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        <div className="flex justify-between pr-4">
                            <span>{selectedTask?.title || "New Task"}</span>
                            <Badge variant={selectedTask.status ?? ""}>{STATUS[selectedTask.status].text}</Badge>
                        </div>
                    </DialogTitle>
                    <DialogDescription>{selectedTask?.description || "Add a new task"}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 mt-4">
                    <div className="grid gap-1">
                        <div className="text-muted-foreground">{new Date(selectedTask.created_at).toLocaleString() || ""}</div>
                    </div>
                    <div className="grid gap-1">
                        <Label>Change status</Label>
                        <Select value={status}
                            onValueChange={(value: any) => {
                                setStatus(value)
                            }}
                        >
                            <SelectTrigger className="w-1/2">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todo">Todo</SelectItem>
                                <SelectItem value="in_progress">In progress</SelectItem>
                                <SelectItem value="done">Done</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter className="gap-3">

                    <Button
                        variant="destructive"
                        disabled={deleting || saving}
                        onClick={() => handleDelete()}
                    >
                        {
                            deleting ? <Loader2 className="animate-spin" /> : "Delete"
                        }
                    </Button>

                    <Button
                        disabled={selectedTask.status === status || saving || deleting}
                        onClick={() => handleSave()}
                    >
                        {
                            saving ? <Loader2 className="animate-spin" /> : "Save"
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}