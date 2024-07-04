import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import {
  createExpense,
  getAllExpensesQueryOptions,
  loadingCreateExpenseQueryOptions,
} from "@/lib/api";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { createExpenseSchema } from "@server/sharedType";
import { CalendarIcon, LoaderCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/create-expense")({
  component: CreateExpense,
});

function CreateExpense() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      title: "",
      amount: "0",
      date: new Date().toLocaleDateString(),
    },
    onSubmit: async ({ value }) => {
      const existingExpenses = await queryClient.ensureQueryData(
        getAllExpensesQueryOptions(1)
      );

      navigate({ to: "/expenses?page=1" });

      queryClient.setQueryData(loadingCreateExpenseQueryOptions.queryKey, {
        expense: value,
      });

      try {
        const newExpense = await createExpense({ value });

        // insert the new expense into the existing expenses
        queryClient.setQueryData(["get-all-expenses", 1], {
          ...existingExpenses,
          expenses: [newExpense, ...existingExpenses.expenses],
        });

        // success state
        toast.success("Expense created", {
          description: `Successfully created new expense: ${newExpense.id}`,
        });
      } catch (error) {
        console.error(error);
        // error state
        toast.error("Error", {
          description: "Failed to create expense. Please try again.",
        });
      } finally {
        queryClient.setQueryData(loadingCreateExpenseQueryOptions.queryKey, {});
      }
    },
  });

  return (
    <div className="p-2 mt-8 ">
      <h2 className="text-xl font-semibold text-center">Create Expense</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="max-w-sm mx-auto my-4"
      >
        <div className="my-2">
          <form.Field
            name="title"
            validators={{
              onChange: createExpenseSchema.shape.title,
            }}
            children={(field) => (
              <div>
                <Label htmlFor={field.name}>Title</Label>
                <Input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="my-2"
                />
                {field.state.meta.errors ? (
                  <em role="alert">{field.state.meta.errors.join(", ")}</em>
                ) : null}
              </div>
            )}
          />
        </div>

        <div className="my-2">
          <form.Field
            name="amount"
            validators={{
              onChange: createExpenseSchema.shape.amount,
            }}
            children={(field) => (
              <div>
                <Label htmlFor={field.name}>Amount</Label>
                <Input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  type="number"
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="my-2"
                />
                {field.state.meta.errors ? (
                  <em role="alert">{field.state.meta.errors.join(", ")}</em>
                ) : null}
              </div>
            )}
          />
        </div>

        <div className="my-2">
          <form.Field
            name="date"
            validators={{
              onChange: createExpenseSchema.shape.date,
            }}
            children={(field) => (
              <div className="flex flex-col">
                <Label htmlFor={field.name} className="mr-4">
                  Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !field.state.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.state.value ? (
                        new Date(field.state.value).toLocaleDateString()
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={new Date(field.state.value)}
                      onSelect={(date) => {
                        field.handleChange(
                          (date ?? new Date()).toLocaleDateString()
                        );
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {field.state.meta.errors ? (
                  <em role="alert">{field.state.meta.errors.join(", ")}</em>
                ) : null}
              </div>
            )}
          />
        </div>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit} className="my-2">
              {isSubmitting ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "Create Expense"
              )}
            </Button>
          )}
        />
      </form>
    </div>
  );
}
