import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import * as React from "react";

import { api } from "@/lib/api";

const ExpenseCard = () => {
  const [totalSpent, setTotalSpent] = React.useState(0);

  React.useEffect(() => {
    const fetchTotalSpent = async () => {
      const response = await api.expenses["total-spent"].$get();
      const data = await response.json();
      setTotalSpent(data.totalSpent);
      console.log(data);
    };
    fetchTotalSpent();
  }, []);

  return (
    <div className="">
      <Card className="w-[350px] m-auto mt-28">
        <CardHeader>
          <CardTitle>Total Spent</CardTitle>
          <CardDescription>The total amount you've spent.</CardDescription>
        </CardHeader>
        <CardContent>{totalSpent}</CardContent>
      </Card>
    </div>
  );
};

export default ExpenseCard;
