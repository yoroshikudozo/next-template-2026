import { describe, expect, it } from "vitest"
import { joinComma, omitEmpty, repeat, toStr } from "./encode"

describe("toStr", () => {
  it("文字列・数値・真偽値を文字列化", () => {
    expect(toStr("a")).toBe("a")
    expect(toStr(2)).toBe("2")
    expect(toStr(true)).toBe("true")
  })
})

describe("joinComma", () => {
  it("カンマ結合、空配列は undefined", () => {
    expect(joinComma([0, 1])).toBe("0,1")
    expect(joinComma(["a", "b"])).toBe("a,b")
    expect(joinComma([])).toBeUndefined()
  })
})

describe("repeat", () => {
  it("配列はそのまま、空文字は除去、空は undefined", () => {
    expect(repeat(["a", "b"])).toEqual(["a", "b"])
    expect(repeat(["a", "", "b"])).toEqual(["a", "b"])
    expect(repeat([])).toBeUndefined()
    expect(repeat([""])).toBeUndefined()
  })
})

describe("omitEmpty", () => {
  it("空文字・未指定は undefined", () => {
    expect(omitEmpty("a")).toBe("a")
    expect(omitEmpty("")).toBeUndefined()
    expect(omitEmpty(undefined)).toBeUndefined()
  })
})
