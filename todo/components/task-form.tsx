"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { Category } from "./todo-app"
import { Badge } from "./ui/badge"

// Define form validation schema
const taskFormSchema = z.object({
  taskText: z
    .string()
    .min(1, { message: "Task cannot be empty" })
    .max(100, { message: "Task is too long (max 100 characters)" })
    .trim(),
})

type TaskFormValues = z.infer<typeof taskFormSchema>

interface TaskFormProps {
  onAddTask: (text: string) => void
  activeCategory: Category
}

export default function TaskForm({ onAddTask, activeCategory }: TaskFormProps) {
  // Initialize form with react-hook-form
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      taskText: "",
    },
  })

  activeCategory = activeCategory === "all" ? "personal" : activeCategory

  // Handle form submission
  function onSubmit(data: TaskFormValues) {
    onAddTask(data.taskText)
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 mb-6">
        <FormField
          control={form.control}
          name="taskText"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input placeholder="Add a new task..." {...field} aria-label="New task text" />
              </FormControl>
              <FormMessage className="text-xs mt-1" />
            </FormItem>
          )}
        />
        <Badge className="h-9" variant="outline">{activeCategory}</Badge>
        <Button type="submit">
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </form>
    </Form>
  )
}

