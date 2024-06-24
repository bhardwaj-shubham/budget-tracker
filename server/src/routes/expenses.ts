import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { getUser } from "../config/kinde";
import { db } from "../db";
import { expenses as expenseTable } from "../db/schema/expenses";
import { eq } from "drizzle-orm";

export const expensesRoute = new Hono();

const expenseSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(2).max(100),
  amount: z.string(),
});

type Expense = z.infer<typeof expenseSchema>;

const createExpenseSchema = expenseSchema.omit({ id: true });

const fakeExpenses: Expense[] = [
  { id: 1, title: "Groceries", amount: "50" },
  { id: 2, title: "Utilities", amount: "100" },
  { id: 3, title: "Rent", amount: "1000" },
];

expensesRoute
  .get("/", getUser, async (c) => {
    const user = c.var.user;

    const expenses = await db
      .select()
      .from(expenseTable)
      .where(eq(expenseTable.userId, user.id));

    return c.json({ expenses: expenses });
  })
  .post("/", getUser, zValidator("json", createExpenseSchema), async (c) => {
    const expense = await c.req.valid("json");
    const user = c.var.user;

    const result = await db
      .insert(expenseTable)
      .values({
        ...expense,
        userId: user.id,
      })
      .returning();

    c.status(201);
    return c.json(result);
  })
  .get("/total-spent", getUser, (c) => {
    const totalSpent = fakeExpenses.reduce(
      (total, expense) => total + +expense.amount,
      0
    );
    return c.json({ totalSpent });
  })
  .get("/:id{[0-9]+}", getUser, (c) => {
    const id = Number.parseInt(c.req.param("id"));

    const expense = fakeExpenses.find((expense) => expense.id === id);
    if (!expense) {
      return c.notFound();
    }

    return c.json({ expense: expense });
  })
  .delete("/:id{[0-9]+}", getUser, (c) => {
    const id = Number.parseInt(c.req.param("id"));

    const index = fakeExpenses.findIndex((expense) => expense.id === id);

    if (index === -1) {
      return c.notFound();
    }

    fakeExpenses.splice(index, 1);

    c.status(200);
    return c.json({ message: "Expense deleted" });
  });
