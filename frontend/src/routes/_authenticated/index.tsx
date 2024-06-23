import { createFileRoute } from "@tanstack/react-router";
import ExpenseCard from "@/components/ExpenseCard";

export const Route = createFileRoute("/_authenticated/")({
  component: App,
});

function App() {
  return (
    <>
      <ExpenseCard />
    </>
  );
}
