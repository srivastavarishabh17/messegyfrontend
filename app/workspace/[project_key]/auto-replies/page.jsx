"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { api } from "@/lib/api"

export default function AutoRepliesPage() {

  const { project_key } = useParams()

  const [data,setData] = useState([])
  const [form,setForm] = useState({
    name:"",
    trigger_keyword:"",
    match_type:"contains",
    reply_message:""
  })

  const load = async()=>{

    const res = await api.get(
      `/api/auto-replies?workspace_id=${project_key}`
    )

    setData(res.data.data)

  }

  useEffect(()=>{
    load()
  },[])

  const change = (e)=>{
    setForm({
      ...form,
      [e.target.name]:e.target.value
    })
  }

  const submit = async(e)=>{
    e.preventDefault()

    await api.post("/api/auto-replies",{
      workspace_id:project_key,
      ...form
    })

    setForm({
      name:"",
      trigger_keyword:"",
      match_type:"contains",
      reply_message:""
    })

    load()
  }

  const remove = async(id)=>{

    await api.delete(`/api/auto-replies/${id}`)

    load()

  }

  return (

    <div className="p-2 space-y-8 max-full">

      <div>
        <h1 className="text-2xl font-semibold">
          Auto Replies
        </h1>

        <p className="text-sm text-gray-500">
          Automatically respond to incoming messages using keyword rules.
        </p>
      </div>

      {/* CREATE FORM */}

      <div className="border rounded-xl p-6 bg-white">

        <form
          onSubmit={submit}
          className="grid grid-cols-4 gap-4"
        >

          <input
            name="name"
            value={form.name}
            placeholder="Rule Name"
            onChange={change}
            className="border rounded-lg px-3 py-2"
          />

          <input
            name="trigger_keyword"
            value={form.trigger_keyword}
            placeholder="Keyword"
            onChange={change}
            className="border rounded-lg px-3 py-2"
          />

          <select
            name="match_type"
            value={form.match_type}
            onChange={change}
            className="border rounded-lg px-3 py-2"
          >
            <option value="contains">Contains</option>
            <option value="exact">Exact</option>
            <option value="starts_with">Starts With</option>
          </select>

          <button className="bg-black text-white rounded-lg px-4">
            Create
          </button>

          <textarea
            name="reply_message"
            value={form.reply_message}
            placeholder="Reply Message..."
            onChange={change}
            className="border rounded-lg px-3 py-2 col-span-4"
          />

        </form>

      </div>


      {/* AUTO REPLY LIST */}

      <div className="border rounded-xl bg-white">

        {data.length === 0 && (
          <div className="p-6 text-sm text-gray-500">
            No auto replies created yet
          </div>
        )}

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
                Keyword: {item.trigger_keyword} • {item.match_type}
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

    </div>
  )
}