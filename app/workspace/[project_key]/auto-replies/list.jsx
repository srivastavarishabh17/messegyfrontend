"use client"

import { useEffect,useState } from "react"
import { api } from "@/lib/api"

export default function AutoReplyList({ projectKey }) {

  const [data,setData] = useState([])

  useEffect(()=>{

    load()

  },[])

  const load = async()=>{

    const res = await api.get(
      `/auto-replies?workspace_id=${projectKey}`
    )

    setData(res.data.data)

  }

  const remove = async(id)=>{

    await api.delete(`/auto-replies/${id}`)

    load()

  }

  return (

    <div className="border rounded-xl bg-white">

      {data.map((item)=>(
        <div
          key={item.id}
          className="flex justify-between items-center p-4 border-b"
        >

          <div>

            <div className="font-medium">
              {item.name}
            </div>

            <div className="text-sm text-gray-500">
              Keyword: {item.trigger_keyword}
            </div>

            <div className="text-sm mt-1">
              {item.reply_message}
            </div>

          </div>

          <button
            onClick={()=>remove(item.id)}
            className="text-red-500"
          >
            Delete
          </button>

        </div>
      ))}

    </div>

  )
}