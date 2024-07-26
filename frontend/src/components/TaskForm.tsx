import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Loader2 } from "lucide-react"
import { Todo } from "@/type"
import { Textarea } from "./ui/textarea"
import { toast } from "sonner"

const formSchema = z.object({
    title: z.string().nonempty().max(100),
    description: z.string().nonempty().max(255),
    status: z.enum(["todo", "in_progress", "done"]),
    file: z.string().optional()
})

type props = {
    closeModel: () => void,
    updateTasks: (id?: number, status?: Todo['status'], task?: Todo) => void

}

export default function TaskForm({ closeModel, updateTasks }: props) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            status: "todo",
            file: ""
        },
    })

    const loading = form.formState.isSubmitting

    async function onSubmit(data: z.infer<typeof formSchema>) {
        delete data.file
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                throw new Error('Failed to create task')
            }

            const task = await response.json()
            updateTasks(undefined, undefined, task)
            closeModel();
            toast.success("Task created successfully")

        } catch (error: any) {
            console.log(error);
            closeModel();
            toast.error("Failed to create task")

        }


    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" flex flex-col items-center gap-2 mt-2">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormControl>
                                <Input placeholder="Title of the task" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem className="w-full mb-4">
                            <FormControl>
                                <Textarea placeholder="Description of task" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />




                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <Select value={field.value} onValueChange={field.onChange}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="done">Done</SelectItem>
                                    <SelectItem value="todo">Todo</SelectItem>
                                    <SelectItem value="in_progress">In progress</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                        <FormItem className="w-full mb-4">
                            <FormControl>
                                <Input placeholder="Add file" {...field} type="file" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className={`${loading ? "w-20 rounded-full" : "w-1/2"} transition-all`}>{
                    loading ? <Loader2 className=" animate-spin" /> : "Submit"
                }</Button>

            </form>
        </Form>
    )

}