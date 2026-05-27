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
      <AlertDialogContent className="bg-card border border-border text-card-foreground sm:rounded-2xl max-w-[400px] p-8">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <AlertDialogHeader className="space-y-4">
          <AlertDialogTitle className="text-xl text-center font-medium text-foreground">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-foreground/80 text-center text-base">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="sm:justify-center mt-6 gap-3 flex-row justify-center">
          <AlertDialogAction
            variant={"destructive"}
            onClick={onConfirm}
            className="text-white rounded-xl not-dark:text-foreground hover:not-dark:text-foreground px-6 font-medium gap-2 m-0 hover:text-white"
          >
            <Trash2 className="w-4 h-4" />
            Yes, remove
          </AlertDialogAction>
          <AlertDialogCancel className="bg-transparent text-foreground hover:bg-muted/50 hover:text-foreground border border-border rounded-xl px-6 font-medium m-0 mt-0">
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
