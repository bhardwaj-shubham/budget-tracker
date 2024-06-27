import { createFileRoute } from "@tanstack/react-router";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
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

export const Route = createFileRoute("/_authenticated/expenses")({
  component: Expenses,
});

async function getAllExpenses() {
  const res = await api.expenses.$get();
  if (!res.ok) {
    throw new Error("Cannot fetch the total spent");
  }
  const data = await res.json();
  return data;
}

function Expenses() {
  const { data, isPending, error } = useQuery({
    queryKey: ["get-all-expenses"],
    queryFn: getAllExpenses,
  });

  if (error) {
    return (
      <h4 className="text-center items-center text-lg">
        Error: {error.message}
      </h4>
    );
  }

  if (data) {
    console.log(data);
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
              </TableRow>
            ))
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
      </TableRow>
    ));
}
