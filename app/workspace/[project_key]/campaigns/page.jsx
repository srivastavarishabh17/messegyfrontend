"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { useRouter, useParams } from "next/navigation"

export default function CampaignsPage(){

  const router = useRouter()
  const { project_key } = useParams()

  const [campaigns,setCampaigns] = useState([])
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    if(project_key){
      fetchCampaigns()
    }
  },[project_key])

  const fetchCampaigns = async ()=>{

    try{

      setLoading(true)

      const res = await api.get(`/api/whatsapp/campaigns?project_key=${project_key}`)

      setCampaigns(res.data?.data || [])

    }catch(e){

      toast.error("Failed to load campaigns")

    }finally{

      setLoading(false)

    }

  }

  return(

    <div className="p-2 space-y-6">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <h1 className="text-2xl font-semibold">
          WhatsApp Campaigns
        </h1>

        <div className="flex gap-3">

          <button
            onClick={() => router.push(`/workspace/${project_key}/campaigns/create`)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Create Campaign
          </button>

          <button
            onClick={fetchCampaigns}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Refresh
          </button>

        </div>

      </div>

      {/* TABLE */}

      <div className="bg-white border rounded-xl overflow-hidden">

        {loading ? (

          <div className="p-8 text-center text-gray-500">
            Loading campaigns...
          </div>

        ) : campaigns.length === 0 ? (

          <div className="p-8 text-center text-gray-500">
            No campaigns found
          </div>

        ) : (

          <table className="w-full text-sm">

            <thead className="bg-gray-50 border-b">

              <tr>

                <th className="text-left p-3">Campaign ID</th>
                <th className="text-left p-3">Message</th>
                <th className="text-left p-3">Sent</th>
                <th className="text-left p-3">Delivered</th>
                <th className="text-left p-3">Read</th>
                <th className="text-left p-3">Failed</th>
                <th className="text-left p-3">Created</th>

              </tr>

            </thead>

            <tbody>

              {campaigns.map((c,i)=>(
                <tr
                  key={i}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-3">
                    {c.campaign_id || "-"}
                  </td>

                  <td className="p-3 max-w-xs truncate">
                    {c.body}
                  </td>

                  <td className="p-3">
                    {c.total_sent}
                  </td>

                  <td className="p-3 text-green-600">
                    {c.delivered}
                  </td>

                  <td className="p-3 text-blue-600">
                    {c.read_count}
                  </td>

                  <td className="p-3 text-red-600">
                    {c.failed}
                  </td>

                  <td className="p-3">
                    {new Date(c.created_at).toLocaleString()}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>

  )

}