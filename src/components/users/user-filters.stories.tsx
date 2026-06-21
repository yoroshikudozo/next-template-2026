import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { getRouter } from "@storybook/nextjs-vite/navigation.mock"
import { expect, fireEvent, within } from "storybook/test"
import { UserFilters } from "./user-filters"

const meta = {
  title: "Users/UserFilters",
  component: UserFilters,
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/users" },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof UserFilters>

export default meta
type Story = StoryObj<typeof meta>

/** フィルタ未設定の初期状態。 */
export const Default: Story = {}

/** URL にフィルタが入っている状態（query から復元される）。 */
export const WithActiveFilters: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/users",
        query: {
          q: "alice",
          role: "admin",
          status: "active",
          sort: "-created",
        },
      },
    },
  },
}

/** role を選ぶと履歴を汚さない replace で URL が更新される（次の値はマージ）。 */
export const SelectingRoleUpdatesUrl: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const roleSelect = canvas.getByDisplayValue("権限：すべて")
    await fireEvent.change(roleSelect, { target: { value: "admin" } })
    await expect(getRouter().replace).toHaveBeenCalled()
  },
}
