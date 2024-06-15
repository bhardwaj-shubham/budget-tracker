import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const expenseRoute = new Hono();

const expenseSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(2).max(100),
  amount: z.number().int().positive(),
});

type Expense = z.infer<typeof expenseSchema>;

const createExpenseSchema = expenseSchema.omit({ id: true });

const fakeExpenses: Expense[] = [
  { id: 1, title: "Groceries", amount: 50 },
  { id: 2, title: "Utilities", amount: 100 },
  { id: 3, title: "Rent", amount: 1000 },
];

expenseRoute
  .get("/", async (c) => {
    return c.json({ expenses: fakeExpenses });
  })
  .post("/", zValidator("json", createExpenseSchema), async (c) => {
    const expense = await c.req.valid("json");

    console.log(expense);
    fakeExpenses.push({ ...expense, id: fakeExpenses.length + 1 });

    c.status(201);
    return c.json({ message: "Success" });
  })
  .get("/total-spent", (c) => {
    const totalSpent = fakeExpenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );
    return c.json({ totalSpent });
  })
  .get("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));

    const expense = fakeExpenses.find((expense) => expense.id === id);
    if (!expense) {
      return c.notFound();
    }

    return c.json({ expense: expense });
  })
  .delete("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));

    const index = fakeExpenses.findIndex((expense) => expense.id === id);

    if (index === -1) {
      return c.notFound();
    }

    fakeExpenses.splice(index, 1);

    c.status(200);
    return c.json({ message: "Expense deleted" });
  });

export default expenseRoute;
