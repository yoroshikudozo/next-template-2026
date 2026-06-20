import { describe, expect, it } from "vitest"
import { ensureArray, firstOf, oneOf, splitComma, toNumber } from "./decode"

describe("firstOf", () => {
  it("配列なら先頭、単一値はそのまま、未指定は undefined", () => {
    expect(firstOf(["a", "b"])).toBe("a")
    expect(firstOf("a")).toBe("a")
    expect(firstOf(undefined)).toBeUndefined()
  })
})

describe("ensureArray", () => {
  it("単一値も配列化し、未指定は空配列", () => {
    expect(ensureArray(["a", "b"])).toEqual(["a", "b"])
    expect(ensureArray("a")).toEqual(["a"])
    expect(ensureArray(undefined)).toEqual([])
  })
})

describe("splitComma", () => {
  it("カンマ区切りを配列に、空は空配列", () => {
    expect(splitComma("0,1")).toEqual(["0", "1"])
    expect(splitComma("")).toEqual([])
    expect(splitComma(undefined)).toEqual([])
  })

  it("各要素を trim し空要素を捨てる", () => {
    expect(splitComma(" a , b ")).toEqual(["a", "b"])
    expect(splitComma("a,,b,")).toEqual(["a", "b"])
  })
})

describe("toNumber", () => {
  it("数値化、非数値・空は fallback", () => {
    expect(toNumber("2", 1)).toBe(2)
    expect(toNumber("abc", 1)).toBe(1)
    expect(toNumber("", 1)).toBe(1)
    expect(toNumber(undefined, 1)).toBe(1)
  })
})

describe("oneOf", () => {
  it("許可リスト内はそのまま、外は fallback", () => {
    const allowed = ["asc", "desc"] as const
    expect(oneOf("asc", allowed, "asc")).toBe("asc")
    expect(oneOf("desc", allowed, "asc")).toBe("desc")
    expect(oneOf("xxx", allowed, "asc")).toBe("asc")
    expect(oneOf(undefined, allowed, "asc")).toBe("asc")
  })
})
