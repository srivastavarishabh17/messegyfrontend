"use client"

import { useEffect,useState } from "react"
import { useParams } from "next/navigation"
import { api } from "@/lib/api"
import { toast } from "sonner"

export default function FlowSubmissions(){

  const { flow_id } = useParams()

  const [data,setData] = useState([])

  async function fetchSubmissions(){

    try{

      const res = await api.get(`/api/flows/${flow_id}/submissions`)

      setData(res.data.data || [])

    }catch{

      toast.error("Failed to load submissions")

    }

  }

  useEffect(()=>{
    fetchSubmissions()
  },[])

  return(

    <div className="max-w-6xl mx-auto">

      <h1 className="text-xl font-semibold mb-6">
        Flow Submissions
      </h1>

      <table className="w-full border">

        <thead>

          <tr className="border-b">
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Created</th>
          </tr>

        </thead>

        <tbody>

          {data.map(row=>(
            
            <tr key={row.id} className="border-b">

              <td className="p-3">{row.id}</td>
              <td className="p-3">{row.status}</td>
              <td className="p-3">{row.created_at}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )

}