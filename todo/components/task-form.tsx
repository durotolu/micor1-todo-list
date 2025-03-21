"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, Plus } from "lucide-react"
import { useEffect } from "react"
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
  category: z
    .string()
    .refine((val) => val !== "all", { message: "Please select a category" }),
  dueDate: z.date().optional()
})

type TaskFormValues = z.infer<typeof taskFormSchema>

interface TaskFormProps {
  onAddTask: (text: string, dueDate?: Date) => void
  activeCategory: Category
  setActiveCategory: (category: Category) => void
}

export default function TaskForm({ onAddTask, activeCategory, setActiveCategory }: TaskFormProps) {
  // Initialize form with react-hook-form
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      taskText: "",
      category: activeCategory,
      dueDate: undefined,
    },
  })

  const categories = ["personal", "work", "shopping", "all"]

  // Update form default values when activeCategory changes
  useEffect(() => {
    form.setValue("category", activeCategory)
  }, [activeCategory, form])

  // Handle form submission
  function onSubmit(data: TaskFormValues) {
    if (activeCategory === "all") {
      form.setError("category", { message: "Please select a category" })
      return
    }
    onAddTask(data.taskText, data.dueDate)
    form.reset({
      taskText: "",
      category: activeCategory,
      dueDate: undefined
    })
  }

  return (
    <Form {...form}>
      <form onClick={() => {
          if (activeCategory === "all") {
            form.setError("category", { message: "Please select a category" })
          }
        }} onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 mb-6 flex-col md:flex-row w-full">
        <div className="flex w-full gap-2">
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex-none">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={"w-[200px] pl-3 text-left font-normal"}
                        disabled={activeCategory === "all"}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taskText"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input disabled={activeCategory === "all"} placeholder="Add a new task..." {...field} aria-label="New task text" className="disabled:bg-muted disabled:cursor-not-allowed" />
                </FormControl>
                <FormMessage className="text-xs mt-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <Select
                  value={activeCategory}
                  onValueChange={(value) => {
                    setActiveCategory(value as Category);
                    field.onChange(value);
                    if (value !== "all") {
                      form.clearErrors("category");
                    }
                  }}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category}
                        value={category}
                        disabled={category === "all"}
                        className={category === "all" ? "text-muted-foreground" : ""}
                      >
                        {category === "all" ? "" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs mt-1" />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={activeCategory === "all"}>
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </form>
    </Form>
  )
}

