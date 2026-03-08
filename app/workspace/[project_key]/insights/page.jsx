"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Loader2 } from "lucide-react"

export default function InsightPage(){

  const [overview,setOverview] = useState(null)
  const [templates,setTemplates] = useState([])
  const [cost,setCost] = useState([])
  const [loading,setLoading] = useState(true)

  async function fetchInsights() {

  try {

    const [overviewRes, templateRes, costRes] = await Promise.all([
      api.get("/api/analytics/overview"),
      api.get("/api/analytics/templates"),
      api.get("/api/analytics/cost")
    ])

    setOverview(overviewRes.data.data)
    setTemplates(templateRes.data.data)
    setCost(costRes.data.data)

  } catch (err) {

    console.error(err)

  } finally {

    setLoading(false)

  }

}

  useEffect(()=>{
    fetchInsights()
  },[])


  if(loading){
    return(
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin h-6 w-6"/>
      </div>
    )
  }

  return(
    <div className="space-y-8">

      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-semibold">
          Messaging Insights
        </h1>
        <p className="text-sm text-muted-foreground">
          Template performance and Meta cost analytics
        </p>
      </div>


      {/* OVERVIEW CARDS */}

      <div className="grid md:grid-cols-5 gap-4">

        <Card title="Messages Sent" value={overview?.messages_sent}/>
        <Card title="Delivered" value={overview?.delivered}/>
        <Card title="Read" value={overview?.read}/>
        <Card title="Failed" value={overview?.failed}/>
        <Card title="Meta Cost" value={`₹${overview?.meta_cost}`}/>

      </div>


      {/* TEMPLATE INSIGHTS */}

      <div className="border rounded-xl bg-white">

        <div className="p-4 border-b font-semibold">
          Template Performance
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-muted">

              <tr>
                <th className="px-4 py-3 text-left">Template</th>
                <th className="px-4 py-3 text-left">Sent</th>
                <th className="px-4 py-3 text-left">Delivered</th>
                <th className="px-4 py-3 text-left">Read</th>
                <th className="px-4 py-3 text-left">Cost</th>
              </tr>

            </thead>

            <tbody>

              {templates.map((t)=>(
                <tr key={t.template_name} className="border-b">

                  <td className="px-4 py-3 font-medium">
                    {t.template_name}
                  </td>

                  <td className="px-4 py-3">
                    {t.sent}
                  </td>

                  <td className="px-4 py-3">
                    {t.delivered}
                  </td>

                  <td className="px-4 py-3">
                    {t.read_count}
                  </td>

                  <td className="px-4 py-3">
                    ₹{Number(t.cost).toFixed(2)}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* DAILY COST */}

      <div className="border rounded-xl bg-white">

        <div className="p-4 border-b font-semibold">
          Daily Cost
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-muted">

              <tr>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Messages</th>
                <th className="px-4 py-3 text-left">Cost</th>
              </tr>

            </thead>

            <tbody>

              {cost.map((c)=>(
                <tr key={c.date} className="border-b">

                  <td className="px-4 py-3">
                    {c.date}
                  </td>

                  <td className="px-4 py-3">
                    {c.messages}
                  </td>

                  <td className="px-4 py-3">
                    ₹{Number(c.cost).toFixed(2)}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}



function Card({title,value}){

  return(
    <div className="border rounded-xl p-4 bg-white">

      <div className="text-xs text-muted-foreground">
        {title}
      </div>

      <div className="text-2xl font-semibold mt-1">
        {value}
      </div>

    </div>
  )
}