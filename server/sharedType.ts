import { insertExpenseSchema } from "./src/db/schema/expenses";

export const createExpenseSchema = insertExpenseSchema.omit({
  userId: true,
  createdAt: true,
});
