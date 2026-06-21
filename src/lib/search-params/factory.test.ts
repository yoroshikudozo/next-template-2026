import { describe, expect, it } from "vitest"
import { createSearchParams } from "./factory"
import { field as f } from "./field"

const sp = createSearchParams({
  q: f.string(),
  size: f.commaStrings(),
  type: f.commaNumbers(),
  tag: f.repeatStrings(),
  sort: f.enums(["asc", "desc"], "asc"),
  page: f.number(1),
})

describe("createSearchParams.parse", () => {
  it("サーバーの object 形を型付き値へ", () => {
    const v = sp.parse({
      q: "shoes",
      size: "s,m",
      type: "0,1",
      tag: ["a", "b"],
      sort: "desc",
      page: "2",
    })
    expect(v).toEqual({
      q: "shoes",
      size: ["s", "m"],
      type: [0, 1],
      tag: ["a", "b"],
      sort: "desc",
      page: 2,
    })
  })

  it("未指定は各 field の fallback", () => {
    const v = sp.parse({})
    expect(v).toEqual({
      q: "",
      size: [],
      type: [],
      tag: [],
      sort: "asc",
      page: 1,
    })
  })

  it("不正値は fallback に丸める", () => {
    const v = sp.parse({ sort: "weird", page: "abc" })
    expect(v.sort).toBe("asc")
    expect(v.page).toBe(1)
  })

  it("URLSearchParams からも同じ結果（repeat を畳む）", () => {
    const params = new URLSearchParams("type=0,1&tag=a&tag=b&page=2")
    const v = sp.parse(params)
    expect(v.type).toEqual([0, 1])
    expect(v.tag).toEqual(["a", "b"])
    expect(v.page).toBe(2)
  })

  it("クエリ文字列（先頭 ? 付き）からも parse できる", () => {
    const v = sp.parse("?q=shoes&size=s,m")
    expect(v.q).toBe("shoes")
    expect(v.size).toEqual(["s", "m"])
  })

  it("ブラケットでネストする攻撃的入力でも throw せず fallback する", () => {
    // qs.parse がネスト object/配列を吐くケース。以前はここで TypeError が
    // クライアントレンダリングをクラッシュさせていた。
    expect(() =>
      sp.parse("page[x]=1&q[a]=b&type[z]=9&tag[0][bad]=1"),
    ).not.toThrow()
    const v = sp.parse("page[x]=1&q[a]=b&type[z]=9&tag[0][bad]=1")
    expect(v).toEqual({
      q: "",
      size: [],
      type: [],
      tag: [],
      sort: "asc",
      page: 1,
    })
  })
})

describe("createSearchParams.serialize", () => {
  it("カンマ field は結合、repeat field は繰り返し、空は省略", () => {
    const query = sp.serialize({
      q: "shoes",
      type: [0, 1],
      tag: ["a", "b"],
      page: 2,
      size: [],
    })
    const params = new URLSearchParams(query)
    expect(params.get("q")).toBe("shoes")
    expect(params.get("type")).toBe("0,1")
    expect(params.getAll("tag")).toEqual(["a", "b"])
    expect(params.get("page")).toBe("2")
    expect(params.has("size")).toBe(false) // 空配列は省略
  })

  it("parse ↔ serialize がラウンドトリップする", () => {
    const original = {
      q: "shoes",
      size: ["s", "m"],
      type: [0, 1],
      tag: ["a", "b"],
      sort: "desc" as const,
      page: 2,
    }
    expect(sp.parse(sp.serialize(original))).toEqual(original)
  })
})
