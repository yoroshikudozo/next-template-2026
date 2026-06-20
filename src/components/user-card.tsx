"use client"

import { useEffect, useState } from "react"
import { getUser, type User } from "@/lib/api"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type State =
  | { status: "loading" }
  | { status: "success"; user: User }
  | { status: "error"; message: string }

export function UserCard() {
  const [state, setState] = useState<State>({ status: "loading" })

  useEffect(() => {
    let active = true
    getUser()
      .then((user) => {
        if (active) setState({ status: "success", user })
      })
      .catch((error: unknown) => {
        if (active) {
          setState({
            status: "error",
            message: error instanceof Error ? error.message : "Unknown error",
          })
        }
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <Card className="w-72">
      <CardHeader>
        <CardTitle>User</CardTitle>
        <CardDescription>Fetched from the API via MSW.</CardDescription>
      </CardHeader>
      <CardContent>
        {state.status === "loading" && <Skeleton className="h-5 w-32" />}
        {state.status === "success" && (
          <p className="text-sm font-medium">{state.user.name}</p>
        )}
        {state.status === "error" && (
          <p className="text-sm text-destructive">{state.message}</p>
        )}
      </CardContent>
    </Card>
  )
}
