import { STATUS } from "@/App";
import { Todo } from "@/type";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";

export default function AllTasks({ filteredTasks, handleTaskClick }: { filteredTasks: Todo[] | null, handleTaskClick: (task: Todo) => void }) {
    if (filteredTasks === null) {
        const array = [1, 2, 3, 4, 5]
        return (
            <div className="grid gap-2" >
                {array.map((key) => (
                    <div key={key}>

                        <Skeleton
                            key={key}
                            className="p-3 rounded-lg h-12 bg-slate-400"

                        />
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="grid gap-2">
            {filteredTasks.map((task) => (
                <div
                    key={task.id}
                    className={`flex items-center gap-2 p-3 ${STATUS[task.status].color} text-card-foreground rounded-lg hover:bg-accent hover:shadow-md transition-colors cursor-pointer`}
                    onClick={() => handleTaskClick(task)}
                >
                    <div
                        className={`flex-1 text-sm font-medium ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}
                    >
                        {task.title}
                    </div>
                    <Badge variant={task.status}>{STATUS[task.status].text}</Badge>
                </div>
            ))}
        </div>
    )
}