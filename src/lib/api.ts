export type User = {
  id: string;
  name: string;
};

export async function getUser(): Promise<User> {
  const response = await fetch("https://api.example.com/user");

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }

  return response.json();
}
