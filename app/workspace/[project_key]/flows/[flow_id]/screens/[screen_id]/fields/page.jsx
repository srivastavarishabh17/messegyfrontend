"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Loader2, Plus } from "lucide-react"

export default function FieldsPage(){

  const params = useParams()
  const router = useRouter()

  const project_key = params?.project_key
  const flow_id = params?.flow_id
  const screen_id = params?.screen_id

  const [fields,setFields] = useState([])
  const [label,setLabel] = useState("")
  const [type,setType] = useState("text")

  const [loading,setLoading] = useState(true)
  const [creating,setCreating] = useState(false)


  /* ---------------- FETCH FIELDS ---------------- */

  async function fetchFields(){

    try{

      const res = await api.get(`/api/screens/${screen_id}/fields`)

      setFields(res?.data?.data || [])

    }catch{

      toast.error("Failed to load fields")

    }finally{

      setLoading(false)

    }

  }

  useEffect(()=>{
    if(screen_id) fetchFields()
  },[screen_id])


  /* ---------------- CREATE FIELD ---------------- */

  async function createField(){

    if(!label.trim()){
      toast.error("Field label required")
      return
    }

    try{

      setCreating(true)

      await api.post(`/api/screens/${screen_id}/fields`,{
        label,
        type
      })

      setLabel("")
      fetchFields()

    }catch{

      toast.error("Failed to create field")

    }finally{

      setCreating(false)

    }

  }


  /* ---------------- DELETE FIELD ---------------- */

  async function deleteField(id){

    if(!confirm("Delete this field?")) return

    try{

      await api.delete(`/api/fields/${id}`)

      toast.success("Field deleted")

      fetchFields()

    }catch{

      toast.error("Delete failed")

    }

  }


  /* ---------------- LOADING ---------------- */

  if(loading){

    return(
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin"/>
      </div>
    )

  }


  return(

    <div className="w-full px-8 py-8">


      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-2xl font-semibold">
            Screen Fields
          </h1>

          <p className="text-sm text-gray-500">
            Manage fields inside this screen
          </p>

        </div>

        <button
          onClick={()=>router.back()}
          className="border px-4 py-2 rounded"
        >
          Back
        </button>

      </div>


      {/* CREATE FIELD */}

      <div className="bg-white border rounded-xl p-6 mb-8">

        <h2 className="font-semibold mb-4">
          Add Field
        </h2>

        <div className="flex gap-3 flex-wrap">

          <input
            value={label}
            onChange={(e)=>setLabel(e.target.value)}
            placeholder="Field label"
            className="border px-4 py-2 rounded-md w-64"
          />

          <select
            value={type}
            onChange={(e)=>setType(e.target.value)}
            className="border px-4 py-2 rounded-md"
          >
            <option value="text">Text</option>
            <option value="phone">Phone</option>
            <option value="email">Email</option>
            <option value="number">Number</option>
            <option value="dropdown">Dropdown</option>
          </select>

          <button
            onClick={createField}
            disabled={creating}
            className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <Plus size={16}/>
            {creating ? "Adding..." : "Add Field"}
          </button>

        </div>

      </div>


      {/* FIELDS LIST */}

      {fields.length === 0 && (

        <div className="border rounded-xl p-10 text-center bg-white">
          No fields added yet
        </div>

      )}


      <div className="space-y-4">

        {fields.map(field=>(
          
          <div
            key={field.id}
            className="border rounded-xl p-5 bg-white flex justify-between items-center"
          >

            <div>

              <h3 className="font-semibold">
                {field.label}
              </h3>

              <p className="text-xs text-gray-400">
                Type: {field.type}
              </p>

            </div>


            <button
              onClick={()=>deleteField(field.id)}
              className="text-red-600 text-sm"
            >
              Delete
            </button>

          </div>

        ))}

      </div>

    </div>

  )

}