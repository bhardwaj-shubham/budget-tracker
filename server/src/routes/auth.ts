import { Hono } from "hono";
import { getUser, kindeClient, sessionManager } from "../config/kinde";

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

authRoute.get("/me", getUser, async (c) => {
  const user = c.var.user;
  return c.json({ user });
});
