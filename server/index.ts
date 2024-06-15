import app from "./src/app";

const server = Bun.serve({
  port: process.env.PORT || 3000,
  fetch: app.fetch,
});

console.log("Server running on port", server.port);
