/**
 * 汎用 HTTP クライアント（feature 非依存）。
 *
 * baseURL はサーバーでは `API_URL`、ブラウザでは `NEXT_PUBLIC_API_URL` を使う。
 * feature 固有のエンドポイントは features/<x>/api 側でこれを呼ぶ。
 */
/** サーバーは API_URL、ブラウザは NEXT_PUBLIC_API_URL。呼び出し時に解決する。 */
function baseUrl(): string {
  const url = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL
  // 未設定は設定ミス。相対 URL を静かに作って後段で謎エラーにせず、ここで落とす。
  if (!url) {
    throw new Error(
      "API base URL is not set (define API_URL or NEXT_PUBLIC_API_URL)",
    )
  }
  return url
}

/** API がエラー応答（非 2xx）を返したときに投げる。 */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

/** GET して JSON を返す。`path` は baseURL からの相対（例: `/users?q=a`）。 */
export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${baseUrl()}${path}`, {
    headers: { accept: "application/json" },
  })
  if (!res.ok) {
    throw new ApiError(res.status, `GET ${path} failed: ${res.status}`)
  }
  return (await res.json()) as T
}
