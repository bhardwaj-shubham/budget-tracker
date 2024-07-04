import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2Icon, EllipsisIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { deleteExpense, getAllExpensesQueryOptions } from "@/lib/api";
import { type selectExpense } from "@server/sharedType";

export function DeleteExpenseButton({ id }: { id: number }) {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: deleteExpense,
    onError: () => {
      toast.error("Error", {
        description: `Failed to delete expense: ${id}.`,
      });
    },
    onSuccess: async () => {
      toast.success("Expense Deleted", {
        description: `Successfully deleted expense: ${id}.`,
      });

      const existingExpenses = await queryClient.ensureQueryData(
        getAllExpensesQueryOptions(1)
      );

      // remove the deleted expense from the existing expenses
      queryClient.setQueryData(["get-all-expenses", 1], {
        ...existingExpenses,
        expenses: existingExpenses.expenses.filter(
          (e: selectExpense) => e.id !== id
        ),
      });
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
