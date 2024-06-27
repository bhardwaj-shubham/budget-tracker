import {
  text,
  numeric,
  pgTable,
  serial,
  index,
  timestamp,
  date
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const expenses = pgTable(
  "expenses",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    date: date("date").notNull(),
  },
  (expenses) => {
    return { userIdIndex: index("name_idx").on(expenses.userId) };
  }
);

// Schema for inserting a expenses - can be used to validate API requests
export const insertExpenseSchema = createInsertSchema(expenses, {
  title: z
    .string()
    .min(2, { message: "Title must contain at least 3 character(s)." }),
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, {
      message: "Amount must be a valid monetary value.",
    })
    .refine((value) => parseFloat(value) > 0, {
      message: "Amount must be a greater than 0.",
    }),
});

// Schema for selecting a expenses - can be used to validate API responses
export const selectExpenseSchema = createSelectSchema(expenses);
