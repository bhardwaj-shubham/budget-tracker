import { createFileRoute } from "@tanstack/react-router";
import {
  deleteExpense,
  getAllExpensesQueryOptions,
  loadingCreateExpenseQueryOptions,
} from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Trash2Icon, EllipsisIcon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/expenses")({
  component: Expenses,
});

function Expenses() {
  const { data, isPending, error } = useQuery(getAllExpensesQueryOptions);
  const { data: loadingCreateExpense } = useQuery(
    loadingCreateExpenseQueryOptions
  );

  if (error) {
    return (
      <h4 className="text-center items-center text-lg">
        Error: {error.message}
      </h4>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-center text-lg font-semibold my-2">All Expenses</h2>
      <Table>
        <TableCaption>A list of all your expenses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Date</TableHead>
            <TableHead className="text-right">Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending ? (
            <SkeltonTable />
          ) : (
            data?.expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">{expense.id}</TableCell>
                <TableCell>{expense.title}</TableCell>
                <TableCell className="text-right">{expense.amount}</TableCell>
                <TableCell className="text-right">{expense.date}</TableCell>
                <TableCell className="text-right">
                  <DeleteExpenseButton id={expense.id} />
                </TableCell>
              </TableRow>
            ))
          )}

          {loadingCreateExpense?.expense && (
            <TableRow>
              <TableCell className="font-medium">
                <Skeleton className="h-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4" />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function SkeltonTable() {
  return Array(3)
    .fill(0)
    .map((_, id) => (
      <TableRow key={id}>
        <TableCell className="font-medium">
          <Skeleton className="h-4" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-4" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-4" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-4" />
        </TableCell>
      </TableRow>
    ));
}

function DeleteExpenseButton({ id }: { id: number }) {
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
