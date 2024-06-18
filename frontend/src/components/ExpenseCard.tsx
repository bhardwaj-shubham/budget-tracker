import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Ellipsis } from "lucide-react";

async function getTotalSpent() {
  const res = await api.expenses["total-spent"].$get();
  if (!res.ok) {
    throw new Error("Cannot fetch the total spent");
  }
  const data = await res.json();
  return data;
}

const ExpenseCard = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["get-total-spent"],
    queryFn: getTotalSpent,
  });

  if (error) {
    return (
      <h4 className="text-center items-center text-lg">
        Error: {error.message}
      </h4>
    );
  }

  return (
    <div className="">
      <Card className="w-[350px] m-auto mt-28">
        <CardHeader>
          <CardTitle>Total Spent</CardTitle>
          <CardDescription>The total amount you've spent.</CardDescription>
        </CardHeader>
        <CardContent>
          {isPending ? <Ellipsis className="animate-ping" /> : data.totalSpent}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseCard;