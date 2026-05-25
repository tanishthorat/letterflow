import * as React from "react"
import { Trash2, X } from "lucide-react"
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

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  onConfirm: () => void;
}

export function DeleteDialog({
  open,
  onOpenChange,
  title = "Confirm removal",
  description,
  onConfirm
}: DeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-[#1E1E1E] border-none text-white sm:rounded-2xl max-w-[400px] p-8">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <AlertDialogHeader className="space-y-4">
          <AlertDialogTitle className="text-xl text-center font-medium">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-300 text-center text-base">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="sm:justify-center mt-6 gap-3 flex-row justify-center">
          <AlertDialogAction
            variant={"destructive"}
            onClick={onConfirm}
            className="bg-destructive text-white hover:bg-destructive/90 rounded-xl px-6 font-medium gap-2 m-0"
          >
            <Trash2 className="w-4 h-4" />
            Yes, remove
          </AlertDialogAction>
          <AlertDialogCancel className="bg-[#333333] text-white hover:bg-[#404040] hover:text-white border-none rounded-xl px-6 font-medium m-0 mt-0">
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
