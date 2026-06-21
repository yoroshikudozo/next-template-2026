// typeof で派生するため値 import（emit 時に型のみ使用として除去される）。
import { USER_ROLE, USER_STATUS } from "./consts"

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE]
export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS]

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  /** ISO 8601 */
  createdAt: string
}

/** GET /api/users のレスポンス。 */
export interface UsersResponse {
  users: User[]
  total: number
  page: number
  perPage: number
}
