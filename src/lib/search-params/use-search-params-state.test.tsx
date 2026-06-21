import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

const push = vi.fn()
// 実 Next の useRouter は安定参照を返すので、モックも毎回同じ object を返す。
const router = { push }
vi.mock("next/navigation", () => ({
  useRouter: () => router,
  usePathname: () => "/search",
  useSearchParams: () => new URLSearchParams("type=0,1&page=2"),
}))

import { createSearchParams } from "./factory"
import { field as f } from "./field"
import { useSearchParamsState } from "./use-search-params-state"

const sp = createSearchParams({
  type: f.commaNumbers(),
  page: f.number(1),
  q: f.string(),
})

describe("useSearchParamsState", () => {
  it("現在の URL を型付き値として読む", () => {
    const { result } = renderHook(() => useSearchParamsState(sp))
    expect(result.current[0]).toEqual({ type: [0, 1], page: 2, q: "" })
  })

  it("再レンダーしても values / setValues の identity が安定する", () => {
    const { result, rerender } = renderHook(() => useSearchParamsState(sp))
    const [values1, setValues1] = result.current
    rerender()
    const [values2, setValues2] = result.current
    // URL（query）が変わらなければ再 parse もコールバック再生成も起きない
    expect(values2).toBe(values1)
    expect(setValues2).toBe(setValues1)
  })

  it("setValues は既存値とマージして router.push する", () => {
    const { result } = renderHook(() => useSearchParamsState(sp))
    act(() => result.current[1]({ page: 3 }))

    expect(push).toHaveBeenCalledTimes(1)
    const pushed = push.mock.calls[0][0] as string
    expect(pushed.startsWith("/search?")).toBe(true)
    // 既存の type を保ったまま page だけ更新されている
    expect(sp.parse(pushed.split("?")[1])).toEqual({
      type: [0, 1],
      page: 3,
      q: "",
    })
  })
})
