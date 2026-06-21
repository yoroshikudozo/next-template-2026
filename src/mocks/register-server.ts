/**
 * サーバー側 MSW 傍受をリクエストごとに貼り直す（ローカルのモック時のみ）。
 *
 * なぜ毎回か: Next.js（Turbopack）は HMR の再コンパイルで global fetch を貼り直し、
 * その際 MSW の FetchInterceptor のパッチが剥がれる。MSW は二重 `listen()` を
 * 許さない（"already enabled network" で throw）ため、`close()` で状態をリセット
 * してから `listen()` し直し、現在の fetch に対して傍受を再適用する。
 *
 * root layout の render から呼ぶ（= リクエストごと、HMR 後の最初の描画でも走る）。
 * `require` は条件付きで、本番バンドルやクライアントに msw を持ち込まない。
 */
export function registerServerMocks() {
  if (
    process.env.NEXT_RUNTIME !== "nodejs" ||
    process.env.NEXT_PUBLIC_API_MOCKING !== "enabled"
  ) {
    return
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { server } = require("./node")
  try {
    server.close()
  } catch {
    // 初回など未起動時の close は無視
  }
  server.listen({ onUnhandledRequest: "bypass" })
}
