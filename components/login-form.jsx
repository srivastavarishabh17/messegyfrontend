"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { api } from "@/lib/api"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

export function LoginForm() {
  const router = useRouter()

  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

const handleSubmit = async (e) => {
  e.preventDefault()
  setError("")
  setLoading(true)

  try {
    const res = await api.post("/api/login", {
      login,
      password,
    })

    const { access_token, user } = res.data

    localStorage.setItem("token", access_token)
    localStorage.setItem("user", JSON.stringify(user))

    const projects = user?.projects || []

    if (projects.length === 0) {
      router.push("/onboarding")
    } else if (projects.length === 1) {
      router.push(`/workspace/${projects[0].id}/dashboard`)
    } else {
      router.push("/workspace")
    }

  } catch (err) {
    setError(
      err?.response?.data?.message || "Invalid credentials"
    )
  } finally {
    setLoading(false)
  }
}

  return (
    <Card className="w-full">
      <CardHeader className="text-center space-y-4">

        <div className="flex justify-center">
          <Link href="/">
            <Image
              src="/messegyBlank.png"
              alt="Messegy Logo"
              width={120}
              height={40}
              priority
            />
          </Link>
        </div>

        <div>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </div>

      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">

          <Input
            placeholder="Email or Username"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            disabled={loading}
            required
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />

          {error && (
            <p className="text-sm text-destructive text-center">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {loading ? "Signing in..." : "Login"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="underline underline-offset-4"
            >
              Sign up
            </Link>
          </div>

        </form>
      </CardContent>
    </Card>
  )
}