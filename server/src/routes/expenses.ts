import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { getUser } from "../config/kinde";
import { db } from "../db";
import {
  expenses as expenseTable,
  insertExpenseSchema,
} from "../db/schema/expenses";
import { and, desc, eq, sum } from "drizzle-orm";
import { createExpenseSchema } from "../../sharedType";

export const expensesRoute = new Hono();

expensesRoute
  .get("/", getUser, async (c) => {
    const user = c.var.user;

    const expenses = await db
      .select()
      .from(expenseTable)
      .where(eq(expenseTable.userId, user.id))
      .orderBy(expenseTable.createdAt)
      .limit(10);

    return c.json({ expenses: expenses });
  })
  .post("/", getUser, zValidator("json", createExpenseSchema), async (c) => {
    const expense = await c.req.valid("json");
    const user = c.var.user;

    const validatedExpense = insertExpenseSchema.parse({
      ...expense,
      userId: user.id,
    });

    const result = await db
      .insert(expenseTable)
      .values(validatedExpense)
      .returning()
      .then((res) => res[0]);

    c.status(201);
    return c.json(result);
  })
  .get("/total-spent", getUser, async (c) => {
    const user = c.var.user;

    const totalSpent = await db
      .select({ total: sum(expenseTable.amount) })
      .from(expenseTable)
      .where(eq(expenseTable.userId, user.id))
      .limit(1)
      .then((res) => res[0]);

    return c.json(totalSpent);
  })
  .get("/:id{[0-9]+}", getUser, async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const user = c.var.user;

    const expense = await db
      .select()
      .from(expenseTable)
      .where(and(eq(expenseTable.userId, user.id), eq(expenseTable.id, id)))
      .orderBy(desc(expenseTable.createdAt))
      .then((res) => res[0]);

    if (!expense) {
      return c.notFound();
    }

    return c.json(expense);
  })
  .delete("/:id{[0-9]+}", getUser, async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const user = c.var.user;

    const expense = await db
      .delete(expenseTable)
      .where(and(eq(expenseTable.userId, user.id), eq(expenseTable.id, id)))
      .returning()
      .then((res) => res[0]);

    if (!expense) {
      return c.notFound();
    }

    c.status(200);
    return c.json(expense);
  });
