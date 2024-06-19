import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { api } from "@/lib/api";

export const Route = createFileRoute("/create-expense")({
  component: CreateExpense,
});

function CreateExpense() {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      title: "",
      amount: 0,
    },
    onSubmit: async ({ value }) => {
      await new Promise((r) => setTimeout(r, 3000));

      const res = await api.expenses.$post({ json: value });
      if (!res.ok) {
        throw new Error("Cannot add new expense!");
      }
      navigate({ to: "/expenses" });
    },
  });

  return (
    <div className="p-2 mt-8">
      <h2 className="text-xl font-semibold text-center">Create Expense</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="max-w-xl mx-auto my-4"
      >
        <div className="my-2">
          <form.Field
            name="title"
            children={(field) => (
              <>
                <Label htmlFor={field.name}>Title</Label>
                <Input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors ? (
                  <em role="alert">{field.state.meta.errors.join(", ")}</em>
                ) : null}
              </>
            )}
          />
        </div>

        <div className="my-2">
          <form.Field
            name="amount"
            children={(field) => (
              <>
                <Label htmlFor={field.name}>Amount</Label>
                <Input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  type="number"
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                />
                {field.state.meta.errors ? (
                  <em role="alert">{field.state.meta.errors.join(", ")}</em>
                ) : null}
              </>
            )}
          />
        </div>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit} className="my-2">
              {isSubmitting ? "..." : "Create Expense"}
            </Button>
          )}
        />
      </form>
    </div>
  );
}
