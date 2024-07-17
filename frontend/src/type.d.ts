export type Todo = {
    id: number
    title: string
    description: string
    status: 'todo' | 'in_progress' | 'done'
    created_at: string
}