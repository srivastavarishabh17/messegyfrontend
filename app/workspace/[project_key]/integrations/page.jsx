"use client"

import { Link, Globe, Boxes, Table, ShoppingBag, CreditCard } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
const integrations = [
  {
    icon: Link,
    title: "WhatsApp Link Generator",
    desc: "Create shareable links & QR for your WA business number",
    status: "installed",
    color: "bg-green-100 text-green-600"
  },
  {
    icon: Globe,
    title: "WhatsApp Website Widget",
    desc: "Drive WhatsApp sales with personalised CTAs",
    status: "installed",
    color: "bg-teal-100 text-teal-600"
  },
  {
    icon: Boxes,
    title: "WooCommerce",
    desc: "Boost your cart recovery & reengage with your customers to upsell.",
    status: null,
    color: "bg-purple-100 text-purple-600"
  },

  {
    icon: ShoppingBag,
    title: "Shopify",
    desc: "Provide live chat support to your customers & boost cart recovery.",
    status: null,
    color: "bg-green-100 text-green-700"
  },
]



export default function IntegrationsPage() {
const router = useRouter()
const { project_key } = useParams()
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="bg-[#0F5132] text-white rounded-xl p-6">
        <h1 className="text-2xl font-semibold">
          App Store
        </h1>

        <p className="text-sm text-white/80 mt-1">
          Dashboard › App Store
        </p>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-6">

        {integrations.map((app, i) => {

          const Icon = app.icon

          return (
            <div
              key={i}
              className="border rounded-xl p-6 bg-white hover:shadow-md transition"
            >

              {/* ICON */}
              <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${app.color}`}>
                <Icon className="h-6 w-6"/>
              </div>

              {/* TITLE */}
              <div className="flex items-center gap-2 mt-4">

                <h3 className="font-semibold text-lg">
                  {app.title}
                </h3>

                {app.status === "installed" && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    INSTALLED
                  </span>
                )}

                {app.status === "new" && (
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                    NEW
                  </span>
                )}

              </div>

              {/* DESCRIPTION */}
              <p className="text-sm text-gray-500 mt-2">
                {app.desc}
              </p>

              {/* ACTION */}
             <button
  onClick={() =>
    router.push(`/workspace/${project_key}/integrations/${app.title.toLowerCase().replace(/\s+/g,"-")}`)
  }
  className="mt-5 text-sm text-green-700 font-medium hover:underline"
>
  View Details
</button>

            </div>
          )
        })}

      </div>

    </div>
  )
}