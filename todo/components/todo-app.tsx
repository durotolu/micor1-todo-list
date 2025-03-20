"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import TaskList from "@/components/task-list"
import TaskForm from "@/components/task-form"
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"

export type Task = {
  id: string
  text: string
  completed: boolean
  category: string
}

export type Category = "all" | "work" | "personal" | "shopping"

const categories: Category[] = ["all", "work", "personal", "shopping"]

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

  const addTask = (text: string) => {
    const category = activeCategory === "all" ? "personal" : activeCategory

    const task: Task = {
      id: Date.now().toString(),
      text,
      completed: false,
      category,
    }

    setTasks([...tasks, task])

    toast(`"${text}" added to ${category}`,)
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

  const filteredTasks = activeCategory === "all" ? tasks : tasks.filter((task) => task.category === activeCategory)

  return (
    <div className="mx-auto max-w-3xl">
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
          <TaskForm onAddTask={addTask} activeCategory={activeCategory} />

          <Tabs
            defaultValue="all"
            value={activeCategory}
            onValueChange={(value) => setActiveCategory(value as Category)}
          >
            <TabsList className="grid grid-cols-4 mb-4 w-full">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="capitalize cursor-pointer">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category} value={category}>
                <TaskList tasks={filteredTasks} onDelete={confirmDeleteTask} onToggleComplete={toggleTaskCompletion} />
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

