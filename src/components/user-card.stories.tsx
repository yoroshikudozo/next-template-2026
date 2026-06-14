import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor, within } from "storybook/test";
import { http, HttpResponse } from "msw";
import { UserCard } from "./user-card";

const meta = {
  title: "Components/UserCard",
  component: UserCard,
  tags: ["autodocs"],
} satisfies Meta<typeof UserCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Uses the default handler from .storybook/preview (returns "Mocked User").
export const Success: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.getByText("Mocked User")).toBeInTheDocument(),
    );
  },
};

// Overrides the handler for this story to exercise the error state.
export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("https://api.example.com/user", () =>
          HttpResponse.json(null, { status: 500 }),
        ),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.getByText(/Failed to fetch user: 500/)).toBeInTheDocument(),
    );
  },
};
