# src/components の規約

UI の置き場。`ui/` に汎用プリミティブ（shadcn）、`<feature>/` に機能別コンポーネント。

## shadcn 中心・native 要素を直に使わない

`<select>` / `<input>` / `<button>` などの生 native 要素や手書き control を直接書かない。
`src/components/ui` の shadcn コンポーネントを使う。必要なプリミティブが無ければ
ui に足してから使う（className は最小限）。

## デフォルトのスケールを className で打ち消さない

shadcn の既定スタイル（**高さ・padding・色・角丸・フォント**）を className で上書きしない。
とくに高さ / padding を縮めてコンポーネントのスケールを崩さない。スケールを変えたいときは
個別 override ではなく ui 側の既定（`h-8` 等の design token）を見直す。
※ **幅・レイアウト**（`flex` / `gap` / `min-w` / ラッパ）は対象外 ― 上書きでも wrapper でも自由に制御してよい。

## `components/ui` は基本触らない

`ui/` 配下は原則改変しない。挙動を足したいときは**呼び出し側で合成**する
（例: `Button` の `render` に `next/link` の `Link` を渡してソフトナビ化）。
呼び出し側で表現できない一般化のときだけ最小変更を許容（例: `Pagination` の Link 対応）。

## 裸の `Link` を使わない（文中リンクを除く）

clickable な control は常に `Button`、遷移は `Button` の `render` に `Link` を渡す。
`buttonVariants` を素の要素に手書きしない。例外は**段落内のインラインテキストリンクのみ**
（そこは裸 `<Link>` で可）。
