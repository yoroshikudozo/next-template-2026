// Enables MSW on the server (Server Components, Route Handlers) during local
// development when NEXT_PUBLIC_API_MOCKING=enabled. Runs once per server start.
export async function register() {
  if (process.env.NEXT_PUBLIC_API_MOCKING !== "enabled") {
    return;
  }

  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { server } = await import("./mocks/node");
    server.listen({ onUnhandledRequest: "bypass" });
  }
}
