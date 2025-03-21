"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import type { Category } from "./todo-app"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

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
  setActiveCategory: (category: Category) => void
}

export default function TaskForm({ onAddTask, activeCategory, setActiveCategory }: TaskFormProps) {
  // Initialize form with react-hook-form
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      taskText: "",
    },
  })

  const categories = ["personal", "work", "shopping", "all"]

  // Handle form submission
  function onSubmit(data: TaskFormValues) {
    onAddTask(data.taskText)
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 mb-6 flex-col md:flex-row w-full">
        <div className="flex w-full gap-2">
          <FormField
            control={form.control}
            name="taskText"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input disabled={activeCategory === "all"} placeholder="Add a new task..." {...field} aria-label="New task text" />
                </FormControl>
                <FormMessage className="text-xs mt-1" />
              </FormItem>
            )}
          />
          <Select value={activeCategory} onValueChange={(value) => setActiveCategory(value as Category)}> 
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? '' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </form>
    </Form>
  )
}

