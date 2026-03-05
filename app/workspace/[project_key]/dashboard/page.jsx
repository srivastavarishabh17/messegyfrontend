"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { api } from "@/lib/api"
import { Loader2 } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function DashboardPage() {
  const { project_key } = useParams()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get(
          `/api/dashboard?project_key=${project_key}`
        )
        setData(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (project_key) fetchDashboard()
  }, [project_key])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-6 w-6" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center">
        Dashboard not available
      </div>
    )
  }

  const { trial_days_left, meta, stats, qr_url } = data

  return (
    <div className="min-h-screen  space-y-8">

      {/* Trial Banner */}
      {trial_days_left > 0 && (
        <div className="bg-[#178d72] text-white rounded-xl p-6 flex justify-between items-center">
          <div>
            <p className="font-semibold">
              {trial_days_left} Days Left in Your Trial
            </p>
            <p className="text-sm opacity-90">
              Upgrade now to unlock all premium features.
            </p>
          </div>
          <Button variant="secondary">
            Upgrade Plan
          </Button>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          <Card>
            <CardContent className="p-6 space-y-6">

              <h2 className="text-lg font-semibold">
                Meta WhatsApp Details
              </h2>

              <div className="grid md:grid-cols-3 gap-4 text-sm">

                <InfoBox label="Verified Business Name" value={meta.verified_business_name} />
                <InfoBox label="WhatsApp Number" value={meta.whatsapp_number} />
                <InfoBox label="Platform" value={meta.platform} />
                <InfoBox label="Quality Rating" value={meta.quality_rating} />
                <InfoBox label="Display Name Status" value={meta.display_name_status} />

                <div>
                  <p className="text-muted-foreground text-xs">
                    API Status
                  </p>
                  <Badge>
                    {meta.api_status}
                  </Badge>
                </div>

                <InfoBox label="Throughput" value={meta.throughput} />

              </div>

            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <StatCard title="Contact Groups" value={stats.contact_groups} />
            <StatCard title="Total Contacts" value={stats.total_contacts} />
            <StatCard title="Active Contacts" value={stats.active_contacts} />
          </div>

          {/* FAQ Section */}
<Card>
  <CardContent className="p-6 space-y-4">
    <h2 className="text-lg font-semibold">
      Frequently Asked Questions
    </h2>

    <Accordion type="single" collapsible className="w-full">

      <AccordionItem value="item-1">
        <AccordionTrigger>
          What does Quality Rating mean?
        </AccordionTrigger>
        <AccordionContent>
          Quality rating reflects how users interact with your messages.
          Green indicates high engagement and low complaint rates.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger>
          What is Messaging Limit / Throughput?
        </AccordionTrigger>
        <AccordionContent>
          Throughput defines how many messages your WhatsApp number
          can send within a 24-hour period.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3">
        <AccordionTrigger>
          Why is API Status important?
        </AccordionTrigger>
        <AccordionContent>
          API status shows whether your WhatsApp Cloud API
          is properly connected to Messegy.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-4">
        <AccordionTrigger>
          How can I increase my messaging limit?
        </AccordionTrigger>
        <AccordionContent>
          You can upgrade your plan or improve message quality
          to unlock higher sending tiers.
        </AccordionContent>
      </AccordionItem>

    </Accordion>

  </CardContent>
</Card>

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          <Card>
            <CardContent className="p-2 text-center space-y-4">
              <p className="text-sm font-medium">
                Scan to Quick Message
              </p>
              <img
                src={qr_url}
                alt="QR Code"
                className="mx-auto h-40"
              />
              <p className="text-xs text-muted-foreground">
                Scan to open WhatsApp chat
              </p>
            </CardContent>
          </Card>

          <FeatureCard
            title="WhatsApp Link Generator"
            description="Create shareable links & QR for your WA business number"
          />

          <FeatureCard
            title="WhatsApp Website Widget"
            description="Drive WhatsApp sales with personalised CTAs"
          />

        </div>
      </div>
    </div>
  )
}

/* Small Components */

function InfoBox({ label, value }) {
  return (
    <div>
      <p className="text-muted-foreground text-xs">
        {label}
      </p>
      <div className="font-medium">
        {value || "—"}
      </div>
    </div>
  )
}

function StatCard({ title, value }) {
  return (
    <Card>
      <CardContent className="p-6 space-y-2">
        <p className="text-sm text-muted-foreground">
          {title}
        </p>
        <p className="text-2xl font-bold">
          {value ?? 0}
        </p>
      </CardContent>
    </Card>
  )
}

function FeatureCard({ title, description }) {
  return (
    <Card className="bg-[#178d72] text-white">
      <CardContent className="p-6 space-y-2">
        <p className="font-semibold">
          {title}
        </p>
        <p className="text-sm opacity-90">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}