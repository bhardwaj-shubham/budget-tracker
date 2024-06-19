import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: Root,
});

function NavBar() {
  return (
    <div className="p-2 flex gap-2 mx-2">
      <Link to="/" className="[&.active]:font-bold mx-4">
        Home
      </Link>
      <Link to="/expenses" className="[&.active]:font-bold mx-4">
        Expenses
      </Link>
      <Link to="/create-expense" className="[&.active]:font-bold mx-4">
        Create
      </Link>
      <Link to="/about" className="[&.active]:font-bold mx-4">
        About
      </Link>
    </div>
  );
}

function Root() {
  return (
    <>
      <NavBar />
      <hr />
      <Outlet />
    </>
  );
}
