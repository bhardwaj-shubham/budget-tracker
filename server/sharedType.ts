import { insertExpenseSchema } from "./src/db/schema/expenses";
import { z } from "zod";

export const createExpenseSchema = insertExpenseSchema.omit({
  userId: true,
  createdAt: true,
});

export type createExpense = z.infer<typeof createExpenseSchema>;
