"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Loader2, Plus } from "lucide-react"

export default function FlowBuilder(){

const router = useRouter()
const params = useParams()

const project_key = params?.project_key
const flow_id = params?.flow_id

  const [screens,setScreens] = useState([])
  const [title,setTitle] = useState("")
  const [loading,setLoading] = useState(true)
  const [creating,setCreating] = useState(false)

  /* ---------------- FETCH SCREENS ---------------- */

  async function fetchScreens(){

    try{

      const res = await api.get(`/api/flows/${flow_id}/screens`)

      setScreens(res?.data?.data || [])

    }catch(err){

      toast.error("Failed to load screens")

    }finally{

      setLoading(false)

    }

  }

  useEffect(()=>{
    if(flow_id) fetchScreens()
  },[flow_id])


  /* ---------------- CREATE SCREEN ---------------- */

  async function createScreen(){

    if(!title.trim()){
      toast.error("Screen title required")
      return
    }

    try{

      setCreating(true)

      await api.post(`/api/flows/${flow_id}/screens`,{
        title
      })

      setTitle("")
      fetchScreens()

    }catch{

      toast.error("Failed to create screen")

    }finally{

      setCreating(false)

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


  return(

    <div className="w-full px-2 py-2">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-2xl font-semibold mb-1">
            Flow Builder
          </h1>

          <p className="text-sm text-gray-500">
            Create screens and fields for your WhatsApp flow
          </p>

        </div>

      </div>


      {/* CREATE SCREEN */}

      <div className="bg-white border rounded-xl p-6 mb-8">

        <h2 className="font-semibold mb-4">
          Add New Screen
        </h2>

        <div className="flex gap-3">

          <input
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            placeholder="Example: Lead Information"
            className="border px-4 py-2 rounded-md w-80"
          />

          <button
            onClick={createScreen}
            disabled={creating}
            className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50"
          >
            <Plus size={16}/>
            {creating ? "Adding..." : "Add Screen"}
          </button>

        </div>

      </div>


      {/* EMPTY STATE */}

      {screens.length === 0 && (

        <div className="border rounded-xl p-10 text-center bg-white">

          <p className="text-sm text-gray-500 mb-4">
            No screens created yet
          </p>

          <p className="text-xs text-gray-400">
            Start by creating the first screen of your flow
          </p>

        </div>

      )}


      {/* SCREEN LIST */}

      <div className="space-y-4">

        {screens.map(screen=>(
          
          <div
            key={screen.id}
            className="bg-white border rounded-xl p-6"
          >

            <div className="flex items-center justify-between">

              <div>

                <h2 className="font-semibold text-lg">
                  {screen.title}
                </h2>

                <p className="text-xs text-gray-400">
                  Screen ID: {screen.screen_key}
                </p>

              </div>


              {/* ACTIONS */}

              <div className="flex gap-3">

                <button
  className="text-sm text-blue-600"
  onClick={() =>
    router.push(
      `/workspace/${project_key}/flows/${flow_id}/screens/${screen.id}/fields`
    )
  }
>
  Add Field
</button>
<button
  onClick={() =>
    router.push(`/workspace/${project_key}/flows/${flow_id}/preview`)
  }
  className="bg-black text-white px-4 py-2 rounded"
>
Preview Flow
</button>
                <button
                  className="text-sm text-red-600"
                  onClick={()=>alert("Delete Screen")}
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  )

}