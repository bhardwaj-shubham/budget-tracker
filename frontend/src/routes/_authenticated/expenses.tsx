import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  getAllExpensesQueryOptions,
  loadingCreateExpenseQueryOptions,
} from "@/lib/api";
import { SkeltonTable } from "@/components/SkeltonTable";
import { DeleteExpenseButton } from "@/components/DeleteExpenseButton";

export const Route = createFileRoute("/_authenticated/expenses")({
  component: Expenses,
  validateSearch: (search) =>
    search as {
      page: string;
    },
});

function Expenses() {
  const { page } = Route.useSearch();
  const navigate = useNavigate();

  const { data, isPending, error } = useQuery({
    ...getAllExpensesQueryOptions(parseInt(page)),
    placeholderData: keepPreviousData,
  });

  const { data: loadingCreateExpense } = useQuery(
    loadingCreateExpenseQueryOptions
  );

  const nextPage = () => {
    if (data?.expenses.length === 0) {
      return;
    }

    navigate({ search: { page: (parseInt(page) + 1).toString() } });
  };

  const prevPage = () => {
    if (parseInt(page) === 1) {
      return;
    }

    navigate({ search: { page: (parseInt(page) - 1).toString() } });
  };

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

          {loadingCreateExpense?.expense && <SkeltonTable />}
        </TableBody>
      </Table>
      <div className="my-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={prevPage}
                className={`${
                  parseInt(page) === 1
                    ? "opacity-75 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                disabled={parseInt(page) === 1}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>{page}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={nextPage}
                className={`${
                  data?.expenses.length === 0
                    ? "opacity-75 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                disabled={data?.expenses.length === 0}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
