"use client"

import type { Task } from "@/components/todo-app"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { CalendarIcon, Pencil, Save, Trash2, X } from "lucide-react"
import { useState } from "react"

interface TaskItemProps {
  task: Task
  onDelete: (id: string) => void
  onToggleComplete: (id: string) => void
  onStartEdit: (id: string) => void
  onSaveEdit: (id: string, newText: string) => void
}

export default function TaskItem({ task, onDelete, onToggleComplete, onStartEdit, onSaveEdit }: TaskItemProps) {
  const [editText, setEditText] = useState(task.text)
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
              <Input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSaveEdit(task.id, editText)}
                className="flex-1"
                autoFocus
              />
            ) : (
              <label
                htmlFor={`task-${task.id}`}
                className={`flex-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}
              >
                {task.text}
              </label>
            )
          }
          <div className="flex items-center gap-2">
            <Badge className={`${categoryColor} text-white capitalize text-xs`}>{task.category}</Badge>
            {task.dueDate && (
              <div className="flex items-center text-xs text-muted-foreground gap-1">
                <CalendarIcon className="h-3 w-3" />
                {format(task.dueDate, "PPP")}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-1">
        {task.isEditing ? (
          <>
            <Button variant="ghost" size="icon" onClick={() => onSaveEdit(task.id, editText)} aria-label="Save changes">
              <Save className="h-4 w-4 text-green-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setEditText(task.text)
                onSaveEdit(task.id, task.text)
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

