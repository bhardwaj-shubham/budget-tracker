import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { userQueryOptions } from "@/lib/api";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="flex justify-center items-center h-screen">
      <div className="bg-gray-200 text-black p-4 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Hello, {data.user.name}</h1>
        <Button variant="destructive" asChild>
          <a href="/api/logout">Logout</a>
        </Button>
      </div>
    </div>
  );
}
