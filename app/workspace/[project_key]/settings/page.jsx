"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { api } from "@/lib/api"

export default function WorkspaceSettingsPage() {

  const { project_key } = useParams()

  const [loadingKeys, setLoadingKeys] = useState(false)

  const [general, setGeneral] = useState({
    widget_name: "",
    default_language: "",
    auto_reply: false,
    business_hours: "",
  })

  const [apiKeys, setApiKeys] = useState({
    publicKey: "",
    secretKey: "",
  })

  const [webhook, setWebhook] = useState({
    url: "",
    event: "MESSAGE_RECEIVED",
    status: "ACTIVE",
  })

  const [security, setSecurity] = useState({
    ip_whitelist: "",
    token_expiry_days: 30,
  })

  /* ================= LOAD API KEYS ================= */

const loadApiKeys = async () => {
  try {
    setLoadingKeys(true)

    console.log("Project Key:", project_key)

    const res = await api.get(
      `/api/workspace/${project_key}/settings/api-keys`
    )

    console.log("FULL RESPONSE:", res)
    console.log("RESPONSE DATA:", res.data)

    setApiKeys({
      publicKey: res.data.data.project_key || "",
      secretKey: res.data.data.project_secret || "",
    })

  } catch (err) {
    console.error("API ERROR:", err)
    console.error("ERROR RESPONSE:", err?.response)
    toast.error("Failed to load API keys")
  } finally {
    setLoadingKeys(false)
  }
}

  useEffect(() => {
    if (project_key) {
      loadApiKeys()
    }
  }, [project_key])

  /* ================= SAVE FUNCTIONS ================= */

const saveGeneral = async () => {
  try {
    await api.put(
      `/api/workspace/${project_key}/settings/general`,
      { general }
    )
    toast.success("General settings saved")
  } catch (err) {
    console.error(err)
    toast.error("Save failed")
  }
}
  const saveWebhook = async () => {
    try {
      await api.put(
        `/api/workspace/${project_key}/settings/webhook`,
        webhook
      )
      toast.success("Webhook settings saved")
    } catch {
      toast.error("Save failed")
    }
  }

  const saveSecurity = async () => {
    try {
      await api.put(
        `/api/workspace/${project_key}/settings/security`,
        {
          ...security,
          ip_whitelist: security.ip_whitelist
            .split("\n")
            .map((ip) => ip.trim())
            .filter(Boolean),
        }
      )
      toast.success("Security settings saved")
    } catch {
      toast.error("Save failed")
    }
  }

  const regenerateSecret = async () => {
    try {
      await api.post(
        `/api/workspace/${project_key}/settings/api-keys/regenerate`
      )
      toast.success("Secret regenerated")
      loadApiKeys()
    } catch {
      toast.error("Regeneration failed")
    }
  }

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-semibold">
        Workspace Settings
      </h1>

      <Tabs defaultValue="general">

        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="webhook">Webhooks</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* ================= GENERAL ================= */}
        <TabsContent value="general">
          <Card className="p-6 space-y-6">

            <Input
              placeholder="Widget Name"
              value={general.widget_name}
              onChange={(e) =>
                setGeneral({ ...general, widget_name: e.target.value })
              }
            />

            <Select
              value={general.default_language}
              onValueChange={(v) =>
                setGeneral({ ...general, default_language: v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Default Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Hindi">Hindi</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex justify-between items-center">
              <span>Auto Reply</span>
              <Switch
                checked={general.auto_reply}
                onCheckedChange={(v) =>
                  setGeneral({ ...general, auto_reply: v })
                }
              />
            </div>

            <Input
              placeholder="Business Hours"
              value={general.business_hours}
              onChange={(e) =>
                setGeneral({ ...general, business_hours: e.target.value })
              }
            />

            <Button onClick={saveGeneral}>
              Save General Settings
            </Button>

          </Card>
        </TabsContent>

        {/* ================= API KEYS ================= */}
        <TabsContent value="api">
          <Card className="p-6 space-y-6">

            <Input className="font-mono text-xs text-blue-500 bg-blue-50" value={apiKeys.publicKey}  />
            <Input value={apiKeys.secretKey} />

            <Button
              variant="destructive"
              onClick={regenerateSecret}
              disabled={loadingKeys}
            >
              Regenerate Secret
            </Button>

          </Card>
        </TabsContent>

        {/* ================= WEBHOOK ================= */}
        <TabsContent value="webhook">
          <Card className="p-6 space-y-6">

            <Input
              placeholder="Webhook URL"
              value={webhook.url}
              onChange={(e) =>
                setWebhook({ ...webhook, url: e.target.value })
              }
            />

            <Select
              value={webhook.event}
              onValueChange={(v) =>
                setWebhook({ ...webhook, event: v })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MESSAGE_RECEIVED">
                  Message Received
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={webhook.status}
              onValueChange={(v) =>
                setWebhook({ ...webhook, status: v })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="DISABLED">Disabled</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={saveWebhook}>
              Save Webhook Settings
            </Button>

          </Card>
        </TabsContent>

        {/* ================= SECURITY ================= */}
        <TabsContent value="security">
          <Card className="p-6 space-y-6">

            <Textarea
              placeholder="One IP per line"
              value={security.ip_whitelist}
              onChange={(e) =>
                setSecurity({
                  ...security,
                  ip_whitelist: e.target.value,
                })
              }
            />

            <Input
              type="number"
              value={security.token_expiry_days}
              onChange={(e) =>
                setSecurity({
                  ...security,
                  token_expiry_days: Number(e.target.value),
                })
              }
            />

            <Button onClick={saveSecurity}>
              Save Security Settings
            </Button>

          </Card>
        </TabsContent>

      </Tabs>

    </div>
  )
}