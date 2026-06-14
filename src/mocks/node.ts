import { setupServer } from "msw/node"
import { handlers } from "./handlers"

// Request interceptor for Node.js: Server Components, Route Handlers, and tests.
export const server = setupServer(...handlers)
