import { createFileRoute } from "@tanstack/react-router";
import ExpenseCard from "@/components/ExpenseCard";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <>
      <ExpenseCard />
    </>
  );
}
