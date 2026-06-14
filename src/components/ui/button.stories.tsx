import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Button } from "./button"

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Button",
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "outline",
        "secondary",
        "ghost",
        "destructive",
        "link",
      ],
    },
    size: {
      control: "select",
      options: ["default", "xs", "sm", "lg", "icon"],
    },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Secondary: Story = { args: { variant: "secondary" } }

export const Outline: Story = { args: { variant: "outline" } }

export const Destructive: Story = { args: { variant: "destructive" } }

export const Ghost: Story = { args: { variant: "ghost" } }

export const Link: Story = { args: { variant: "link" } }

export const Small: Story = { args: { size: "sm" } }

export const Disabled: Story = { args: { disabled: true } }
