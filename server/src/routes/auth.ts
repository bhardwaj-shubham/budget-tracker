import { Hono } from "hono";
import { kindeClient, sessionManager } from "../config/kinde";

export const authRoute = new Hono();

authRoute.get("/login", async (c) => {
  const loginUrl = await kindeClient.login(sessionManager(c));
  return c.redirect(loginUrl.toString());
});

authRoute.get("/register", async (c) => {
  const registerUrl = await kindeClient.register(sessionManager(c));
  return c.redirect(registerUrl.toString());
});

authRoute.get("/callback", async (c) => {
  const url = new URL(c.req.url);
  await kindeClient.handleRedirectToApp(sessionManager(c), url);
  return c.redirect("/");
});

authRoute.get("/logout", async (c) => {
  const logoutUrl = await kindeClient.logout(sessionManager(c));
  return c.redirect(logoutUrl.toString());
});

authRoute.get("/me", async (c) => {
  const manager = sessionManager(c);
  const isAuthenticated = await kindeClient.isAuthenticated(manager);

  if (!isAuthenticated) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const user = await kindeClient.getUserProfile(manager);
  return c.json({ user });
});
