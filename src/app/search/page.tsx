import { SearchView } from "@/components/search/search-view"

/**
 * ルートエントリ。`searchParams`（Next.js 16 では Promise）を await して
 * search 機能の View に渡すだけ。ロジックは features/search 側に置く。
 */
export default async function SearchPage(props: PageProps<"/search">) {
  return <SearchView searchParams={await props.searchParams} />
}
