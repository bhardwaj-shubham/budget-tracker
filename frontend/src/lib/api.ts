import { hc } from "hono/client";
import type { ApiRoutes } from "@server/src/app";
import { queryOptions } from "@tanstack/react-query";
import { type createExpense } from "@server/sharedType";

const client = hc<ApiRoutes>("/");

export const api = client.api;

async function getCurrentUser() {
  const res = await api.me.$get();
  if (!res.ok) {
    throw new Error("Server Error");
  }

  const data = await res.json();
  return data;
}

export async function getAllExpenses(page: number) {
  const res = await api.expenses.$get({ query: { page: page.toString() } });
  if (!res.ok) {
    throw new Error("Cannot fetch the total spent");
  }
  const data = await res.json();
  return data;
}

export async function createExpense({ value }: { value: createExpense }) {
  const res = await api.expenses.$post({ json: value });
  if (!res.ok) {
    throw new Error("Cannot add new expense!");
  }

  const newExpense = await res.json();
  return newExpense;
}

export async function deleteExpense({ id }: { id: number }) {
  const res = await api.expenses[":id{[0-9]+}"].$delete({
    param: { id: id.toString() },
  });

  if (!res.ok) {
    throw new Error("Cannot add new expense!");
  }
}

export const userQueryOptions = queryOptions({
  queryKey: ["get-current-user"],
  queryFn: getCurrentUser,
  staleTime: Infinity,
});

export const getAllExpensesQueryOptions = (page: number = 1) =>
  queryOptions({
    queryKey: ["get-all-expenses", page],
    queryFn: () => getAllExpenses(page),
    staleTime: 1000 * 60 * 5,
  });

export const loadingCreateExpenseQueryOptions = queryOptions<{
  expense?: createExpense;
}>({
  queryKey: ["loading-create-expense"],
  queryFn: async () => {
    return {};
  },
  staleTime: Infinity,
});
