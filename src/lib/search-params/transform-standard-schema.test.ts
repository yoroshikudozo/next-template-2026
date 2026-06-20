import type { StandardSchemaV1 } from "@standard-schema/spec"
import * as v from "valibot"
import { describe, expect, it } from "vitest"
import {
  SearchParamsError,
  transformStandardSchema,
} from "./transform-standard-schema"

describe("transformStandardSchema", () => {
  it("valibot スキーマを実行し型付き値を返す", () => {
    const schema = v.object({ q: v.string(), page: v.number() })
    const out = transformStandardSchema(schema, { q: "shoes", page: 2 })
    expect(out).toEqual({ q: "shoes", page: 2 })
  })

  it("検証失敗で SearchParamsError を投げ issues を保持する", () => {
    const schema = v.object({ page: v.number() })
    expect(() => transformStandardSchema(schema, { page: "nope" })).toThrow(
      SearchParamsError,
    )
    try {
      transformStandardSchema(schema, { page: "nope" })
    } catch (e) {
      expect(e).toBeInstanceOf(SearchParamsError)
      expect((e as SearchParamsError).issues.length).toBeGreaterThan(0)
    }
  })

  it("async スキーマは TypeError で弾く", () => {
    const asyncSchema: StandardSchemaV1<unknown, string> = {
      "~standard": {
        version: 1,
        vendor: "test",
        validate: async () => ({ value: "x" }),
      },
    }
    expect(() => transformStandardSchema(asyncSchema, "x")).toThrow(TypeError)
  })
})
