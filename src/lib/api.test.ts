import { http, HttpResponse } from "msw"
import { describe, expect, it } from "vitest"
import { server } from "@/mocks/node"
import { getUser } from "./api"

describe("getUser", () => {
  it("returns the user from the default handler", async () => {
    await expect(getUser()).resolves.toEqual({ id: "1", name: "Mocked User" })
  })

  it("propagates server errors via a runtime handler override", async () => {
    server.use(
      http.get("https://api.example.com/user", () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    )

    await expect(getUser()).rejects.toThrow(/Failed to fetch user: 500/)
  })
})
