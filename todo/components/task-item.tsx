"use client"

import type { Task } from "@/components/todo-app"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, Pencil, Save, Trash2, X } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

interface TaskItemProps {
  task: Task
  onDelete: (id: string) => void
  onToggleComplete: (id: string) => void
  onStartEdit: (id: string) => void
  onSaveEdit: (id: string, newText: string, newDueDate?: Date) => void
}

const editTaskSchema = z.object({
  text: z.string().min(1, { message: "Task text cannot be empty" })
})

type EditTaskFormValues = z.infer<typeof editTaskSchema>

export default function TaskItem({ task, onDelete, onToggleComplete, onStartEdit, onSaveEdit }: TaskItemProps) {
  const [editDueDate, setEditDueDate] = useState<Date | undefined>(task.dueDate)
  
  const form = useForm<EditTaskFormValues>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      text: task.text
    }
  })
  const categoryColors = {
    work: "bg-rose-500",
    personal: "bg-emerald-500",
    shopping: "bg-amber-500",
  }

  const categoryColor = categoryColors[task.category as keyof typeof categoryColors] || "bg-slate-500"

  return (
    <li className="flex items-center justify-between p-3 rounded-md border bg-card">
      <div className="flex items-center gap-3 flex-1">
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={() => onToggleComplete(task.id)}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        />
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
          {
            task.isEditing ? (
              <Form {...form}>
                <form className="w-full" onSubmit={form.handleSubmit((data) => onSaveEdit(task.id, data.text, editDueDate))}>
                  <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <Input
                            {...field}
                            onKeyDown={(e) => e.key === "Enter" && form.handleSubmit((data) => onSaveEdit(task.id, data.text, editDueDate))()}
                            className="flex-1"
                            autoFocus
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            ) : (
              <label
                htmlFor={`task-${task.id}`}
                className={`flex-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}
              >
                {task.text}
              </label>
            )
          }
          <div className="flex items-center gap-2 pr-1">
            <Badge className={`${categoryColor} text-white capitalize text-xs`}>{task.category}</Badge>
            {task.isEditing ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-8 w-[200px] pl-3 text-left font-normal">
                    {editDueDate ? (
                      format(editDueDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={editDueDate}
                    onSelect={setEditDueDate}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            ) : task.dueDate ? (
              <div className="flex items-center text-xs text-muted-foreground gap-1">
                <CalendarIcon className="h-3 w-3" />
                {format(task.dueDate, "PPP")}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex gap-1">
        {task.isEditing ? (
          <>
            <Button variant="ghost" size="icon" onClick={form.handleSubmit((data) => onSaveEdit(task.id, data.text, editDueDate))} aria-label="Save changes">
              <Save className="h-4 w-4 text-green-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                form.reset({ text: task.text })
                setEditDueDate(task.dueDate)
                onSaveEdit(task.id, task.text, task.dueDate)
              }}
              aria-label="Cancel editing"
            >
              <X className="h-4 w-4 text-destructive" />
            </Button>
          </>
        ) : (
          <Button variant="ghost" size="icon" onClick={() => onStartEdit(task.id)} aria-label={`Edit task: ${task.text}`}>
            <Pencil className="h-4 w-4" />
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)} aria-label={`Delete task: ${task.text}`}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </li>
  )
}

