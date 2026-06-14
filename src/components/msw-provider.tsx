"use client";

import { Suspense, use } from "react";

// Starts the MSW browser worker once, before client components render, when
// NEXT_PUBLIC_API_MOCKING=enabled. The promise is created at module scope so it
// is only ever awaited a single time.
const mockingEnabledPromise =
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_API_MOCKING === "enabled"
    ? import("@/mocks/browser").then(async ({ worker }) => {
        await worker.start({
          onUnhandledRequest(request, print) {
            // Let Next.js internal requests pass through silently.
            if (new URL(request.url).pathname.startsWith("/_next")) {
              return;
            }
            print.warning();
          },
        });
      })
    : Promise.resolve();

export function MSWProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  use(mockingEnabledPromise);
  return <Suspense>{children}</Suspense>;
}
