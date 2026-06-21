import { beforeAll, describe, expect, it, vi } from "vitest"
import { userSearchSchema } from "../search-schema"
import { getUsers } from "./get-users"

// MSW ハンドラ（*/api/users）に解決させるため絶対 URL の base を与える。
beforeAll(() => {
  vi.stubEnv("API_URL", "http://localhost:3000/api")
})

describe("getUsers (MSW 経由)", () => {
  it("フィルタなしで先頭ページ（5件）と総数を返す", async () => {
    const res = await getUsers(userSearchSchema.parse({}))
    expect(res.total).toBe(20)
    expect(res.users).toHaveLength(5)
    expect(res.page).toBe(1)
  })

  it("role で絞り込む", async () => {
    const res = await getUsers(userSearchSchema.parse({ role: "admin" }))
    expect(res.total).toBe(5)
    expect(res.users.every((u) => u.role === "admin")).toBe(true)
  })

  it("role を複数指定すると OR 絞り込みになる", async () => {
    const res = await getUsers(userSearchSchema.parse({ role: "admin,guest" }))
    expect(res.total).toBe(10) // admin 5 + guest 5
    expect(
      res.users.every((u) => u.role === "admin" || u.role === "guest"),
    ).toBe(true)
  })

  it("q で名前/メールを部分一致検索する", async () => {
    const res = await getUsers(userSearchSchema.parse({ q: "alice" }))
    expect(res.total).toBe(1)
    expect(res.users[0].name).toBe("Alice Johnson")
  })

  it("sort=-created で作成日の降順になる", async () => {
    const res = await getUsers(userSearchSchema.parse({ sort: "-created" }))
    expect(res.users[0].name).toBe("Tina Reed") // 最新の createdAt
  })

  it("page でページングする", async () => {
    const res = await getUsers(userSearchSchema.parse({ page: "2" }))
    expect(res.page).toBe(2)
    expect(res.users).toHaveLength(5)
  })

  it("範囲外の page は最終ページに丸められる（取り残しを防ぐ）", async () => {
    const res = await getUsers(userSearchSchema.parse({ page: "99" }))
    expect(res.page).toBe(4) // total 20 / 5件 = 4 ページ
    expect(res.users).toHaveLength(5)
  })

  it("role 未指定なら絞り込みなし（全件）", async () => {
    const res = await getUsers(userSearchSchema.parse({}))
    expect(res.total).toBe(20)
  })
})
