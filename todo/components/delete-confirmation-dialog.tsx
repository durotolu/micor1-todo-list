"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { X } from "lucide-react"
import type { Task } from "./todo-app"

interface DeleteConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  taskId: string | null
  tasks: Task[]
}

export default function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  taskId,
  tasks,
}: DeleteConfirmationDialogProps) {
  // Find the task to be deleted
  const taskToDelete = tasks.find((task) => task.id === taskId)

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex justify-between">
            Confirm Deletion
          <AlertDialogCancel><X className="h-4 w-4 text-destructive" /></AlertDialogCancel>
          </AlertDialogTitle>
          <AlertDialogDescription>
            {taskToDelete ? (
              <>
                Are you sure you want to delete the task: <span className="font-medium">&quot;{taskToDelete.text}&quot;</span>?
                <br />
                This action cannot be undone.
              </>
            ) : (
              "Are you sure you want to delete this task? This action cannot be undone."
            )}
          </AlertDialogDescription>
          
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

