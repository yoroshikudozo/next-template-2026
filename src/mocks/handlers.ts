import { userHandlers } from "./users/handlers"

// 各 feature の MSW ハンドラを集約する。feature 固有の定義は
// features/<x>/handlers.ts 側に置く。node.ts / browser.ts がこれを使う。
export const handlers = [...userHandlers]
