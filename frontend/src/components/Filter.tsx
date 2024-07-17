import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button"
import { FilterIcon } from "lucide-react"

export default function Filter({ filter, setFilter }: { filter: string, setFilter: (filter: string) => void }) {
    return (
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                        <FilterIcon className="w-4 h-4" />
                        <span>{filter}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => setFilter("All")}>
                        All
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() => setFilter("Todo")}

                    >
                        Todo
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() => setFilter("In progress")}
                    >
                        In progress
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() => setFilter("Done")}
                    >
                        Done
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() => setFilter("Created at (ASC)")}
                    >
                        Created at (ASC)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() => setFilter("Created at (DESC)")}
                    >
                        Created at (DESC)
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}