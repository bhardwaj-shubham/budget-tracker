import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-gray-200 text-black p-4 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">About Page</h1>
        <p className="text-gray-700">
          Welcome to the About page of our budget tracker application!
        </p>
      </div>
    </div>
  );
}
