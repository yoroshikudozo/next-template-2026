/** @type {import("prettier").Config} */
export default {
  semi: false, // shadcn 生成物に合わせる（唯一のデフォルト外）
  plugins: ["prettier-plugin-tailwindcss"],
  // Tailwind v4 は CSS-first。設定の起点を globals.css に向ける
  tailwindStylesheet: "./src/app/globals.css",
  // cn()/cva() 内のクラスも並べ替え対象にする
  tailwindFunctions: ["cn", "cva"],
}
