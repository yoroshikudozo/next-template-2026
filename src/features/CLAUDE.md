# features/&lt;name&gt; の規約

## 型と定数を分ける（`types.ts` / `consts.ts`）

`features/<name>/types.ts` を作る・触るときは:

- **型は `types.ts`、ランタイム値（定数・配列）は `consts.ts`** に置く。
  `types.ts` に `export const` を書かない。
- **enum 的な「閉じた集合」は『定数 + `keyof typeof`』パターン**で定義する。
  `consts.ts` に const オブジェクト（**大文字キー → 小文字の wire 値**）と
  `Object.values` で導出した配列を置き、`types.ts` で `typeof` から型を導出する。
  依存は **`types.ts → consts.ts` の一方向**（consts は types を import しない）。

```ts
// consts.ts — 値だけ
export const USER_ROLE = {
  ADMIN: "admin",
  MEMBER: "member",
  GUEST: "guest",
} as const
export const USER_ROLES = Object.values(USER_ROLE) // UserRole[]

// types.ts — 型だけ（typeof 用に値 import。emit 時に除去される）
import { USER_ROLE } from "./consts"
export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE] // "admin" | "member" | "guest"
```

- キー（大文字）はコードからの参照名、**値（小文字）が正準** = API / モック / URL に流れる。
- 数値コードは使わない（必要になったら別途）。
