"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function FlowDetail(){

  const router = useRouter()
  const params = useParams()

  const project_key = params?.project_key
  const flow_id = params?.flow_id

  const [flow,setFlow] = useState(null)
  const [loading,setLoading] = useState(true)
  const [publishing,setPublishing] = useState(false)

  /* ---------------- FETCH FLOW ---------------- */

  async function fetchFlow(){

    try{

      const res = await api.get(`/api/flows/${flow_id}`)

      const data =
        res?.data?.data ||
        res?.data

      setFlow(data)

    }catch(err){

      toast.error("Failed to load flow")

    }finally{

      setLoading(false)

    }

  }

  useEffect(()=>{
    if(flow_id){
      fetchFlow()
    }
  },[flow_id])


  /* ---------------- PUBLISH FLOW ---------------- */

  async function publish(){

    try{

      setPublishing(true)

      await api.post(`/api/flows/${flow_id}/publish`)

      toast.success("Flow published")

      fetchFlow()

    }catch{

      toast.error("Publish failed")

    }finally{

      setPublishing(false)

    }

  }


  /* ---------------- LOADING ---------------- */

  if(loading){

    return(
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin h-6 w-6"/>
      </div>
    )

  }

  if(!flow){
    return <div className="p-8">Flow not found</div>
  }


  /* ---------------- UI ---------------- */

  return(

    <div className="w-full px-8 py-8">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-2xl font-semibold mb-1">
            {flow.name}
          </h1>

          <p className="text-sm text-gray-500">
            Manage WhatsApp flow settings
          </p>

        </div>

        <span
          className={`px-3 py-1 text-xs rounded-full ${
            flow.status === "published"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {flow.status}
        </span>

      </div>


      {/* ACTION CARD */}

      <div className="bg-white border rounded-xl p-8">

        <h2 className="text-lg font-semibold mb-4">
          Flow Actions
        </h2>

        <div className="flex gap-3 flex-wrap">

          <button
            onClick={publish}
            disabled={publishing || flow.status === "published"}
            className="bg-green-600 text-white px-5 py-2 rounded-md disabled:opacity-50"
          >
            {publishing ? "Publishing..." : "Publish Flow"}
          </button>

          <button
            onClick={()=>alert("Send Flow UI coming")}
            className="bg-black text-white px-5 py-2 rounded-md"
          >
            Send Flow
          </button>

          <button
            onClick={()=>router.push(`/workspace/${project_key}/flows/${flow_id}/screens`)}
            className="border px-5 py-2 rounded-md"
          >
            Open Screen Editor
          </button>

          <button
            onClick={()=>router.push(`/workspace/${project_key}/flows/${flow_id}/submissions`)}
            className="border px-5 py-2 rounded-md"
          >
            View Submissions
          </button>

        </div>

      </div>

    </div>

  )

}