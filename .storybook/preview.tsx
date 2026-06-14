import type { Preview } from "@storybook/nextjs-vite";
import { initialize, mswLoader } from "msw-storybook-addon";
import { handlers } from "../src/mocks/handlers";
import "../src/app/globals.css";

// Start the MSW worker once for all stories. The worker script is served from
// /public via Storybook's staticDirs.
initialize({ onUnhandledRequest: "bypass" });

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
    // Default request handlers applied to every story; override per-story via
    // parameters.msw.handlers.
    msw: { handlers },
  },
  loaders: [mswLoader],
};

export default preview;
