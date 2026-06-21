import { describe, expect, it } from "vitest"
import { createSearchParams } from "./factory"
import { field } from "./field"

describe("field.enums — optional（default 省略）", () => {
  const sp = createSearchParams({ role: field.enums(["admin", "guest"]) })

  it("未設定・許可外は undefined", () => {
    expect(sp.parse({}).role).toBeUndefined()
    expect(sp.parse({ role: "xxx" }).role).toBeUndefined()
  })

  it("妥当な値はそのまま", () => {
    expect(sp.parse({ role: "admin" }).role).toBe("admin")
  })

  it("undefined は URL から省略、値はクエリに出る", () => {
    expect(sp.serialize({ role: undefined })).toBe("")
    expect(sp.serialize({ role: "guest" })).toBe("role=guest")
  })
})

describe("field.enums — required（default 有り）", () => {
  const sp = createSearchParams({ sort: field.enums(["asc", "desc"], "asc") })

  it("未設定・許可外は fallback", () => {
    expect(sp.parse({}).sort).toBe("asc")
    expect(sp.parse({ sort: "x" }).sort).toBe("asc")
  })
})
