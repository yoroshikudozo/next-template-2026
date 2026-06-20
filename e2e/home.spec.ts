import { expect, test } from "@playwright/test"

test("home page shows the getting started heading", async ({ page }) => {
  await page.goto("/")
  await expect(
    page.getByRole("heading", { name: /to get started/i }),
  ).toBeVisible()
})

test("home page links to the Next.js learning center", async ({ page }) => {
  await page.goto("/")
  const link = page.getByRole("link", { name: /learning/i })
  await expect(link).toHaveAttribute("href", /nextjs\.org\/learn/)
})
