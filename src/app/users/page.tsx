import { UserSearch } from "@/components/users/user-search"

/**
 * ルートエントリ。`searchParams`（Next.js 16 では Promise）を await して
 * users 機能の View に渡すだけ。ロジックは features/users・components/users 側。
 */
export default async function UsersPage(props: PageProps<"/users">) {
  return <UserSearch searchParams={await props.searchParams} />
}
