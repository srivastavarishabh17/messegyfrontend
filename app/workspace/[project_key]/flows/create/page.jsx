"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function CreateFlow(){

  const router = useRouter()
  const params = useParams()
  const project_key = params?.project_key

  const [name,setName] = useState("")
  const [loading,setLoading] = useState(false)

  async function createFlow(){

    if(!name.trim()){
      toast.error("Flow name required")
      return
    }

    try{

      setLoading(true)

      const res = await api.post("/api/flows",{ name })

      const flowId =
        res?.data?.data?.id ||
        res?.data?.id

      toast.success("Flow created")

      router.push(`/workspace/${project_key}/flows/${flowId}`)

    }catch(err){

      console.error(err)
      toast.error("Create failed")

    }finally{

      setLoading(false)

    }

  }

  return(

    <div className="w-full px-8 py-8">

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-2xl font-semibold mb-2">
          Create Flow
        </h1>

        <p className="text-sm text-gray-500">
          Create a WhatsApp flow to capture leads, bookings, or customer inputs.
        </p>

      </div>


      {/* FORM CARD */}

      <div className="bg-white border rounded-xl p-8 max-w-full">

        <div className="mb-6">

          <label className="text-sm font-medium block mb-2">
            Flow Name
          </label>

          <input
            type="text"
            placeholder="Example: Loan Application Flow"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            onKeyDown={(e)=>{
              if(e.key === "Enter") createFlow()
            }}
            className="w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
          />

        </div>


        {/* ACTIONS */}

        <div className="flex items-center gap-3">

          <button
            disabled={loading}
            onClick={createFlow}
            className="bg-green-600 text-white px-6 py-3 rounded-md flex items-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin"/>}
            {loading ? "Creating..." : "Create Flow"}
          </button>

          <button
            onClick={()=>router.back()}
            className="px-6 py-3 border rounded-md"
          >
            Cancel
          </button>

        </div>

      </div>

    </div>

  )

}