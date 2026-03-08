"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function FlowsPage(){

  const router = useRouter()
  const params = useParams()
  const project_key = params?.project_key

  const [flows,setFlows] = useState([])
  const [loading,setLoading] = useState(true)

  /* ---------------- FETCH FLOWS ---------------- */

  const fetchFlows = async () => {

    setLoading(true)

    try{

      const res = await api.get("/api/flows")

      const list =
        res?.data?.data ||
        res?.data?.flows ||
        res?.data ||
        []

      setFlows(list)

    }catch(err){

      console.error(err)
      toast.error("Failed to load flows")

    }finally{

      setLoading(false)

    }

  }

  useEffect(()=>{
    fetchFlows()
  },[])


  /* ---------------- LOADING ---------------- */

  if(loading){

    return(
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin h-6 w-6"/>
      </div>
    )

  }

  /* ---------------- UI ---------------- */

  return(

    <div className="max-w-full mx-auto p-6 bg-white rounded-lg shadow">

      <div className="flex items-center justify-between mb-8">

        <h1 className="text-2xl font-semibold">
          Flows
        </h1>

        <button
          onClick={() =>
            router.push(`/workspace/${project_key}/flows/create`)
          }
          className="bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Create Flow
        </button>

      </div>


      {/* EMPTY STATE */}

      {flows.length === 0 && (

        <div className="border rounded-lg p-10 text-center">

          <p className="text-sm text-gray-500 mb-4">
            No flows created yet
          </p>

          <button
            onClick={() =>
              router.push(`/workspace/${project_key}/flows/create`)
            }
            className="bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Create First Flow
          </button>

        </div>

      )}


      {/* FLOWS LIST */}

      {flows.length > 0 && (

        <div className="grid md:grid-cols-3 gap-6">

          {flows.map((flow)=>(
            
            <div
              key={flow.id}
              className="border rounded-xl p-6 bg-white shadow-sm"
            >

              <h2 className="text-lg font-semibold mb-2">
                {flow.name}
              </h2>

              <p className="text-sm text-gray-500 mb-4">
                Status: {flow.status}
              </p>

              <button
                onClick={() =>
                  router.push(`/workspace/${project_key}/flows/${flow.id}`)
                }
                className="text-sm bg-black text-white px-3 py-2 rounded"
              >
                Manage
              </button>

            </div>

          ))}

        </div>

      )}

    </div>

  )

}