"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function OnboardingPage() {
  const router = useRouter()

  const [projectName, setProjectName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCreate = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      const res = await api.post("/api/workspaces", {
        project_name: projectName,
        description: description,
      })

      const workspace = res.data.data

      toast.success("Workspace created successfully")

      setTimeout(() => {
        router.push(`/workspace/${workspace.project_key}/dashboard`)
      }, 800)

    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to create workspace"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-6">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Create Workspace</h1>
            <p className="text-sm text-muted-foreground">
              Create your WhatsApp Business project
            </p>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
              disabled={loading}
            />

            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {loading ? "Creating..." : "Create Workspace"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}