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

export default function RegisterPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
    referred_by: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("")
    setLoading(true)

    try {
      await api.post("/api/register", form)

      router.push("/login")
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Registration failed"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">

      <Card className="w-full max-w-md">

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
            <CardTitle className="text-2xl">
              Create your account
            </CardTitle>

            <CardDescription>
              Start using Messegy today
            </CardDescription>
          </div>

        </CardHeader>

        <CardContent>

          <form onSubmit={handleSubmit} className="space-y-4">

            <Input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <Input
              name="password_confirmation"
              type="password"
              placeholder="Confirm Password"
              value={form.password_confirmation}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <Input
              name="phone"
              placeholder="Phone (optional)"
              value={form.phone}
              onChange={handleChange}
              disabled={loading}
            />

            <Input
              name="referred_by"
              placeholder="Referral Username (optional)"
              value={form.referred_by}
              onChange={handleChange}
              disabled={loading}
            />

            {error && (
              <p className="text-sm text-red-500 text-center">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              {loading
                ? "Creating account..."
                : "Register"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">

              Already have an account?{" "}

              <Link
                href="/login"
                className="underline underline-offset-4"
              >
                Sign in
              </Link>

            </div>

          </form>

        </CardContent>

      </Card>

    </div>
  )
}