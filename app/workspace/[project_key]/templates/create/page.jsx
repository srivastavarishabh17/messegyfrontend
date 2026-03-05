"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import { toast } from "sonner"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Select from "react-select"
import { useEffect } from "react"

export default function CreateTemplatePage() {
  const router = useRouter()
  const [processing, setProcessing] = useState(false)
const [variableSamples, setVariableSamples] = useState({})
  const [form, setForm] = useState({
    name: "",
    language: "en_US",
    category: "UTILITY",
    type: "TEXT",
    body: "",
    footer: "",
    actionsType: "NONE",
    ctaUrlTitle: "",
    ctaUrl: "",
    quickReplies: [""],
  })

  /* -----------------------------
     Detect Variables {{1}}
  ----------------------------- */
const detectedVars = useMemo(() => {
  const regex = /{{(\d+)}}/g
  const found = []
  let match

  while ((match = regex.exec(form.body)) !== null) {
    found.push(Number(match[1]))
  }

  return [...new Set(found)].sort((a, b) => a - b)
}, [form.body])

const previewBody = useMemo(() => {
  let text = form.body

  detectedVars.forEach((v) => {
    const sample = variableSamples[v] || `{{${v}}}`
    text = text.replaceAll(`{{${v}}}`, sample)
  })

  return text
}, [form.body, variableSamples])
  /* -----------------------------
     Body Character Count
  ----------------------------- */
  const bodyCount = form.body.length


useEffect(() => {
  setVariableSamples((prev) => {
    const updated = { ...prev }

    detectedVars.forEach((v) => {
      if (!updated[v]) {
        updated[v] = ""
      }
    })

    Object.keys(updated).forEach((key) => {
      if (!detectedVars.includes(Number(key))) {
        delete updated[key]
      }
    })

    return updated
  })
}, [detectedVars])
  /* -----------------------------
     Submit
  ----------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setProcessing(true)

    try { 
     await api.post("/api/templates", {
  ...form,
  variables: detectedVars.map((v) => ({
    index: v,
    sample: variableSamples[v],
  })),
})
      toast.success("Template created")
      router.push("..")
    } catch (e) {
      toast.error("Creation failed")
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-10">

      {/* ================= LEFT SIDE ================= */}
      <div className="space-y-6">

        <h1 className="text-2xl font-semibold">
          New Template Message
        </h1>

        <Card className="p-6 space-y-6">

          {/* Language */}
          <div>
            <div className="text-sm font-medium">
              Template Language
            </div>
            <div className="text-xs text-muted-foreground mb-2">
              WhatsApp-approved language locale
            </div>
            <Select
              defaultValue={{
                value: "en_US",
                label: "English (United States)",
              }}
              options={[
                { value: "en_US", label: "English (United States)" },
                { value: "hi_IN", label: "Hindi (India)" },
                { value: "en_GB", label: "English (UK)" },
              ]}
              onChange={(s) =>
                setForm({ ...form, language: s.value })
              }
            />
          </div>

          {/* Template Name */}
          <div>
            <div className="text-sm font-medium">
              Template Name
            </div>
            <div className="text-xs text-muted-foreground mb-2">
              Lowercase letters, numbers & underscores only.
            </div>
            <Input
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value
                    .toLowerCase()
                    .replace(/\s+/g, "_")
                    .replace(/[^a-z0-9_]/g, ""),
                })
              }
            />
          </div>

          {/* Template Type */}
          <div>
            <div className="text-sm font-medium">
              Template Type
            </div>
            <div className="text-xs text-muted-foreground mb-2">
              Your template type.
            </div>
            <Select
              defaultValue={{
                value: "TEXT",
                label: "Text",
              }}
              options={[
                { value: "TEXT", label: "Text" },
                { value: "IMAGE", label: "Image" },
                { value: "VIDEO", label: "Video" },
                { value: "DOCUMENT", label: "Document" },
                { value: "LOCATION", label: "Location" },
              ]}
              onChange={(s) =>
                setForm({ ...form, type: s.value })
              }
            />
          </div>

          {/* Template Format */}
          <div>
            <div className="text-sm font-medium">
              Template Format
            </div>
            <div className="text-xs text-muted-foreground mb-2">
              Use *bold*, _italic_. Max 1024 chars.
            </div>
            <Textarea
              rows={5}
              maxLength={1024}
              placeholder="Hello {{1}}, your order {{2}} is confirmed"
              value={form.body}
              onChange={(e) =>
                setForm({ ...form, body: e.target.value })
              }
            />
            <div className="text-xs text-right text-muted-foreground">
              {bodyCount} / 1024
            </div>
            {/* Variable Samples */}
{detectedVars.length > 0 && (
  <div className="space-y-3 mt-4">
    <div className="text-sm font-medium text-red-600">
      Sample values required for approval
    </div>

    {detectedVars.map((v) => (
      <Input
        key={v}
        placeholder={`Sample value for {{${v}}}`}
        value={variableSamples[v] || ""}
        onChange={(e) =>
          setVariableSamples({
            ...variableSamples,
            [v]: e.target.value,
          })
        }
      />
    ))}
  </div>
)}
          </div>

          {/* Footer */}
          <div>
            <div className="text-sm font-medium">
              Template Footer (Optional)
            </div>
            <div className="text-xs text-muted-foreground mb-2">
              Max 60 characters.
            </div>
            <Input
              maxLength={60}
              value={form.footer}
              onChange={(e) =>
                setForm({ ...form, footer: e.target.value })
              }
            />
          </div>

          {/* Interactive Actions */}
          <div>
            <div className="text-sm font-medium">
              Interactive Actions
            </div>
            <div className="text-xs text-muted-foreground mb-3">
              CTA & Quick Replies (optional)
            </div>

            <div className="flex gap-6 text-sm mb-4">
              {["NONE", "CTA", "QUICK", "ALL"].map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={form.actionsType === type}
                    onChange={() =>
                      setForm({ ...form, actionsType: type })
                    }
                  />
                  {type}
                </label>
              ))}
            </div>

            {/* CTA */}
            {(form.actionsType === "CTA" ||
              form.actionsType === "ALL") && (
              <div className="space-y-2">
                <Input
                  placeholder="Button Title"
                  value={form.ctaUrlTitle}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      ctaUrlTitle: e.target.value,
                    })
                  }
                />
                <Input
                  placeholder="https://example.com"
                  value={form.ctaUrl}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      ctaUrl: e.target.value,
                    })
                  }
                />
              </div>
            )}

            {/* Quick Replies */}
            {(form.actionsType === "QUICK" ||
              form.actionsType === "ALL") && (
              <div className="space-y-2 mt-3">
                {form.quickReplies.map((qr, i) => (
                  <Input
                    key={i}
                    value={qr}
                    placeholder={`Reply ${i + 1}`}
                    onChange={(e) => {
                      const updated = [...form.quickReplies]
                      updated[i] = e.target.value
                      setForm({
                        ...form,
                        quickReplies: updated,
                      })
                    }}
                  />
                ))}

                {form.quickReplies.length < 3 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setForm({
                        ...form,
                        quickReplies: [
                          ...form.quickReplies,
                          "",
                        ],
                      })
                    }
                  >
                    + Add Quick Reply
                  </Button>
                )}
              </div>
            )}
          </div>

          <Button onClick={handleSubmit} disabled={processing}>
            {processing && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Submit to Meta
          </Button>

        </Card>
      </div>

      {/* ================= RIGHT SIDE PREVIEW ================= */}
      <div>

        <div className="text-sm mb-3 text-muted-foreground">
          WhatsApp Preview
        </div>

        <div className="bg-[#efeae2] rounded-2xl p-6 min-h-[550px]">

          <div className="bg-white rounded-xl px-4 py-3 text-sm shadow max-w-[75%]">

            <div className="whitespace-pre-wrap">
             {previewBody || "Your message preview..."}
            </div>

            {form.footer && (
              <div className="text-xs text-gray-500 border-t mt-2 pt-2">
                {form.footer}
              </div>
            )}

            {(form.actionsType === "CTA" && form.ctaUrlTitle) && (
              <div className="mt-3 border-t pt-2 text-blue-600 text-sm">
                🔗 {form.ctaUrlTitle}
              </div>
            )}

            {(form.actionsType === "QUICK" ||
              form.actionsType === "ALL") &&
              form.quickReplies
                .filter((q) => q.trim())
                .map((q, i) => (
                  <div
                    key={i}
                    className="mt-2 inline-block border rounded-full px-3 py-1 text-xs mr-2"
                  >
                    {q}
                  </div>
                ))}

            <div className="text-[10px] text-gray-400 text-right mt-2">
              04:09
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}