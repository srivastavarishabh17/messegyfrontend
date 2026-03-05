"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { Loader2, Plus, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function WorkspacePage() {
  const router = useRouter()

  const [workspaces, setWorkspaces] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const res = await api.get("/api/workspaces")
        const data = res.data.data || []

        if (!data.length) {
          router.replace("/workspace/onboarding")
          return
        }

        if (data.length === 1) {
          router.replace(
            `/workspace/${data[0].project_key}/dashboard`
          )
          return
        }

        setWorkspaces(data)
      } catch (err) {
        localStorage.clear()
        router.replace("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchWorkspaces()
  }, [router])

  const logout = () => {
    localStorage.clear()
    router.replace("/login")
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted p-10">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-bold">
              Your Workspaces
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage your WhatsApp Business projects
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>

            <Button
              onClick={() =>
                router.push("/workspace/onboarding")
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Workspace
            </Button>
          </div>
        </div>

        {/* WORKSPACE GRID */}
        <div className="grid md:grid-cols-3 gap-6">
          {workspaces.map((ws) => (
            <Card
              key={ws.project_key}
              className="cursor-pointer hover:shadow-lg transition"
              onClick={() =>
                router.push(
                  `/workspace/${ws.project_key}/dashboard`
                )
              }
            >
              <CardContent className="p-6 space-y-4">

                {/* Title */}
                <div>
                  <h2 className="text-lg font-semibold">
                    {ws.project_name}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Key: {ws.project_key}
                  </p>
                </div>

                {/* Status */}
                <div className="flex justify-between items-center text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ws.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {ws.status.toUpperCase()}
                  </span>

                  <span className="text-muted-foreground">
                    WA: {ws.wa_account_status}
                  </span>
                </div>

                {/* Quality */}
                <div className="text-sm">
                  <span className="text-muted-foreground">
                    Quality Rating:
                  </span>{" "}
                  <span
                    className={`font-medium ${
                      ws.wa_quality_rating === "green"
                        ? "text-green-600"
                        : ws.wa_quality_rating === "yellow"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {ws.wa_quality_rating}
                  </span>
                </div>

                {/* Created */}
                <div className="text-xs text-muted-foreground">
                  Created:{" "}
                  {new Date(
                    ws.created_at
                  ).toLocaleDateString()}
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}