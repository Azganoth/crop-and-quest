import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import React from "react";

export const ConfirmationDialog = AlertDialog;
export const ConfirmationDialogTrigger = AlertDialogTrigger;

export interface ConfirmationDialogContentProps {
  title: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  children: React.ReactNode;
}

export function ConfirmationDialogContent({
  title,
  onConfirm,
  confirmText = "Delete",
  cancelText = "Cancel",
  children,
}: ConfirmationDialogContentProps) {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription asChild>
          <div className="text-sm text-muted-foreground">{children}</div>
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel>{cancelText}</AlertDialogCancel>
        <AlertDialogAction variant="destructive" onClick={onConfirm}>
          {confirmText}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
