import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

const push = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
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
