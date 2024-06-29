import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { userQueryOptions } from "@/lib/api";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
});

function Profile() {
  const { data, isPending, error } = useQuery(userQueryOptions);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-500 text-white p-4 rounded-lg">
          <h1 className="text-2xl font-bold mb-4">User not logged in</h1>
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle
          name="loader"
          size="64"
          className="text-gray-500 animate-spin"
        />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center mt-10">
      <Card className="w-[350px] shadow-md bg-gradient-to-r from-indigo-500 from-50% via-sky-500 via-100%">
        <CardHeader>
          <Avatar className="h-16 w-16 ">
            <AvatarFallback className="bg-white text-black font-bold text-3xl">
              {data.user.name[0]}
            </AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent>
          <CardTitle className="text-2xl">Hey, {data.user.name}!</CardTitle>
        </CardContent>
        <CardFooter className="flex justify-between mt-4">
          <Button
            variant="outline"
            asChild
            className="w-40 bg-red-500 hover:bg-red-600 text-white border-0 shadow-md"
          >
            <a href="/api/logout" className="font-semibold">
              Logout
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
