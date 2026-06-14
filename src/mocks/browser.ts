import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// Request interceptor for the browser: Client Components and Storybook.
export const worker = setupWorker(...handlers);
