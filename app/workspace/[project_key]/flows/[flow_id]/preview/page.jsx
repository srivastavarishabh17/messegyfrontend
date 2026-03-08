"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { api } from "@/lib/api"
import { Loader2 } from "lucide-react"

export default function FlowPreview(){

  const params = useParams()

  const flow_id = params?.flow_id

  const [screens,setScreens] = useState([])
  const [loading,setLoading] = useState(true)

  async function fetchScreens(){

    try{

      const res = await api.get(`/api/flows/${flow_id}/screens`)

      setScreens(res?.data?.data || [])

    }catch{

      console.log("preview error")

    }finally{

      setLoading(false)

    }

  }

  useEffect(()=>{
    fetchScreens()
  },[])

  if(loading){
    return(
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin"/>
      </div>
    )
  }

  return(

    <div className="max-w-md mx-auto py-10">

      <div className="border rounded-xl p-6 bg-white shadow">

        <h2 className="font-semibold text-lg mb-6">
          WhatsApp Flow Preview
        </h2>

        {screens.map(screen=>(
          
          <div key={screen.id} className="mb-6">

            <h3 className="font-semibold mb-3">
              {screen.title}
            </h3>

            {screen.fields?.map(field=>{

              if(field.type === "text"){
                return(
                  <input
                    key={field.id}
                    placeholder={field.label}
                    className="border px-3 py-2 rounded w-full mb-3"
                  />
                )
              }

              if(field.type === "phone"){
                return(
                  <input
                    key={field.id}
                    placeholder={field.label}
                    className="border px-3 py-2 rounded w-full mb-3"
                  />
                )
              }

              if(field.type === "email"){
                return(
                  <input
                    key={field.id}
                    placeholder={field.label}
                    className="border px-3 py-2 rounded w-full mb-3"
                  />
                )
              }

              if(field.type === "number"){
                return(
                  <input
                    key={field.id}
                    placeholder={field.label}
                    className="border px-3 py-2 rounded w-full mb-3"
                  />
                )
              }

              return null

            })}

          </div>

        ))}

        <button className="bg-green-600 text-white w-full py-2 rounded">
          Submit
        </button>

      </div>

    </div>

  )

}