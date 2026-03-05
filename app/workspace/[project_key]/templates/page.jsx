"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Loader2, Trash2, RefreshCw, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function TemplatesPage() {
  const router = useRouter()
  const { project_key } = useParams()

  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  const [viewMode, setViewMode] = useState("list")
  const [testModalOpen, setTestModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  /* ---------------- FETCH ---------------- */

  const fetchTemplates = async () => {
    try {
      const res = await api.get("/api/templates")
      setTemplates(
        Array.isArray(res.data?.data?.data)
          ? res.data.data.data
          : []
      )
    } catch {
      toast.error("Failed to load templates")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  /* ---------------- ACTIONS ---------------- */

  const handleDelete = async (id) => {
    if (!confirm("Delete this template?")) return

    setProcessing(true)
    try {
      await api.delete(`/api/templates/${id}`)
      toast.success("Template deleted")
      fetchTemplates()
    } catch {
      toast.error("Delete failed")
    } finally {
      setProcessing(false)
    }
  }

  const handleSync = async () => {
    setProcessing(true)
    try {
      await api.post("/api/templates/sync")
      toast.success("Templates synced")
      fetchTemplates()
    } catch (e) {
      toast.error(e?.response?.data?.message || "Sync failed")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin h-6 w-6" />
      </div>
    )
  }

  return (
    <>
      <div className="space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Templates</h1>

          <div className="flex gap-4 items-center">

            {/* View Toggle */}
            <div className="flex border rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-1 text-sm ${
                  viewMode === "list"
                    ? "bg-black text-white"
                    : "bg-white"
                }`}
              >
                List
              </button>

              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-1 text-sm ${
                  viewMode === "grid"
                    ? "bg-black text-white"
                    : "bg-white"
                }`}
              >
                Grid
              </button>
            </div>

            <Button
              variant="outline"
              onClick={handleSync}
              disabled={processing}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync
            </Button>

            <Button
              onClick={() =>
                router.push(
                  `/workspace/${project_key}/templates/create`
                )
              }
            >
              Create Template
            </Button>

          </div>
        </div>

        {/* ================= LIST VIEW ================= */}
        {viewMode === "list" ? (

          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr className="text-left">
                  <th className="p-4">Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Language</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {templates.map((t) => (
                  <tr
                    key={t.id}
                    className="border-t hover:bg-muted/40 transition"
                  >
                    <td className="p-4 font-medium">
                      {t.name}
                    </td>

                    <td className="p-4">
                      {t.category}
                    </td>

                    <td className="p-4">
                      {t.language}
                    </td>

                    <td className="p-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          t.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>

                    <td className="p-4 text-right flex justify-end gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedTemplate(t)
                          setTestModalOpen(true)
                        }}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Test
                      </Button>

                      <Trash2
                        className="h-4 w-4 text-red-500 cursor-pointer"
                        onClick={() => handleDelete(t.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        ) : (

          /* ================= GRID VIEW ================= */

          <div className="grid md:grid-cols-3 gap-8">
            {templates.map((t) => {
              const bodyComponent = t.components?.find(
                (c) => c.type === "BODY"
              )

              const bodyText =
                bodyComponent?.text || "No preview available"

              return (
                <div
                  key={t.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border"
                >
                  <div className="bg-[#efeae2] p-6 min-h-[240px]">
                    <div className="bg-white rounded-lg shadow-sm p-4 text-sm max-w-[85%]">
                      {bodyText.replace(/{{\d+}}/g, "example")}
                    </div>
                  </div>

                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-sm">
                        {t.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t.category} • {t.language}
                      </div>
                    </div>

                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        t.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <div className="px-4 pb-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setSelectedTemplate(t)
                        setTestModalOpen(true)
                      }}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Test
                    </Button>

                    <Trash2
                      className="h-4 w-4 text-red-500 cursor-pointer"
                      onClick={() => handleDelete(t.id)}
                    />
                  </div>
                </div>
              )
            })}
          </div>

        )}

      </div>

      {/* MODAL */}
      {testModalOpen && selectedTemplate && (
        <TestTemplateModal
          template={selectedTemplate}
          onClose={() => {
            setTestModalOpen(false)
            setSelectedTemplate(null)
          }}
        />
      )}
    </>
  )
}