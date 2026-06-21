// role/status の許可値は単一ソース（const オブジェクト）。大文字キーはコードから参照する
// シンボル名、値（小文字）が wire = API / モック / URL に流れる正準値。
// 型（UserRole 等）は const と不可分なのでここに同居させる。
export const USER_ROLE = {
  ADMIN: "admin",
  MEMBER: "member",
  GUEST: "guest",
} as const

export const USER_STATUS = {
  ACTIVE: "active",
  INVITED: "invited",
  SUSPENDED: "suspended",
} as const

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE]
export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS]

// イテレーション / field.enums 用の許可値配列。
export const USER_ROLES = Object.values(USER_ROLE)
export const USER_STATUSES = Object.values(USER_STATUS)
