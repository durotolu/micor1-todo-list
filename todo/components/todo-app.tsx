"use client"

import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"
import TaskList from "@/components/task-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import TaskForm from "./task-form"

export type Task = {
  id: string
  text: string
  completed: boolean
  category: string
  isEditing?: boolean
  dueDate?: Date
}

export type Category = "all" | "work" | "personal" | "shopping"

const categories: Category[] = ["all", "personal", "work", "shopping"]

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeCategory, setActiveCategory] = useState<Category>("all")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }

    // Check user's preferred color scheme
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const addTask = (text: string, dueDate?: Date) => {
    const task: Task = {
      id: Date.now().toString(),
      text,
      completed: false,
      category: activeCategory,
      dueDate
    }

    setTasks([...tasks, task])

    toast(`"${text}" added to ${activeCategory}`,)
  }

  const confirmDeleteTask = (id: string) => {
    setTaskToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const deleteTask = () => {
    if (taskToDelete) {
      setTasks(tasks.filter((task) => task.id !== taskToDelete))
      toast("Task deleted",)
      setTaskToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const cancelDelete = () => {
    setTaskToDelete(null)
    setIsDeleteDialogOpen(false)
  }

  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const startEditTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, isEditing: true } : { ...task, isEditing: false })))
  }

  const saveEditedTask = (id: string, newText: string, newDueDate?: Date) => {
    if (newText.trim()) {
      setTasks(tasks.map((task) => task.id === id ? { ...task, text: newText.trim(), dueDate: newDueDate, isEditing: false } : task))
      toast("Task updated")
    }
  }

  const filteredTasks = tasks.filter((task) => activeCategory === "all" ? true : task.category === activeCategory)

  return (
    <div className="mx-auto max-w-4xl">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl font-bold">Todo List Manager</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </CardHeader>
        <CardContent>
          <TaskForm onAddTask={addTask} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
          <Tabs
            defaultValue="all"
            value={activeCategory}
            onValueChange={(value) => setActiveCategory(value as Category)}
          >
            <TabsList className="grid grid-cols-1 md:grid-cols-4 mb-4 w-full h-full">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className=" hover:opacity-75 capitalize cursor-pointer">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category} value={category}>
                <TaskList
                  tasks={filteredTasks}
                  onDelete={confirmDeleteTask}
                  onToggleComplete={toggleTaskCompletion}
                  onStartEdit={startEditTask}
                  onSaveEdit={saveEditedTask}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={cancelDelete}
        onConfirm={deleteTask}
        taskId={taskToDelete}
        tasks={tasks}
      />
    </div>
  )
}

