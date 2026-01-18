import { usePromptContext } from '@/contexts/PromptContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function ConfirmDeleteModal() {
  const { isDeleteModalOpen, cancelDelete, confirmDeleteSelected } = usePromptContext();

  return (
    <AlertDialog open={isDeleteModalOpen} onOpenChange={(open) => !open && cancelDelete()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete prompt?</AlertDialogTitle>
          <AlertDialogDescription>
            This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmDeleteSelected}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
