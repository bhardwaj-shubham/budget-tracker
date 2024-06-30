import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2Icon, EllipsisIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { deleteExpense, getAllExpensesQueryOptions } from "@/lib/api";

export function DeleteExpenseButton({ id }: { id: number }) {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: deleteExpense,
    onError: () => {
      toast.error("Error", {
        description: `Failed to delete expense: ${id}.`,
      });
    },
    onSuccess: () => {
      toast.success("Expense Deleted", {
        description: `Successfully deleted expense: ${id}.`,
      });

      // remove the deleted expense from the existing expenses
      queryClient.setQueryData(
        getAllExpensesQueryOptions.queryKey,
        (existingExpenses) => ({
          ...existingExpenses,
          expenses: existingExpenses.expenses.filter(
            (expense) => expense.id !== id
          ),
        })
      );
    },
  });

  return (
    <Button onClick={() => mutate.mutate({ id })} variant="outline" size="icon">
      {mutate.isPending ? (
        <EllipsisIcon className="animate-ping h-4 w-4" />
      ) : (
        <Trash2Icon className="h-4 w-4" />
      )}
    </Button>
  );
}
