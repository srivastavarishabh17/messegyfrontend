"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { toast } from "sonner"

/* =========================
VARIABLE EXTRACTOR
========================= */

function extractVariables(template){

  const body = template?.components?.find(
    c => c.type === "BODY"
  )

  if(!body) return []

  const text = body.text || ""

  const matches = [...text.matchAll(/{{(\d+)}}/g)]

  const count = Math.max(
    0,
    ...matches.map(m => parseInt(m[1]))
  )

  return Array.from({length: count}, (_,i)=> i+1)

}

/* =========================
PAGE
========================= */

export default function CreateCampaignPage(){

  const [mode,setMode] = useState("single")

  const [templates,setTemplates] = useState([])
  const [contacts,setContacts] = useState([])
  const [groups,setGroups] = useState([])

  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    fetchTemplates()
    fetchData()
  },[])

  const fetchTemplates = async () => {

    try {

      const res = await api.get("/api/templates")

      const list = Array.isArray(res.data?.data?.data)
        ? res.data.data.data
        : []

      const approvedTemplates = list.filter(
        (t) => t.status === "approved"
      )

      setTemplates(approvedTemplates)

    } catch {

      toast.error("Failed to load templates")

    } finally {

      setLoading(false)

    }

  }

  const fetchData = async () => {

    try {

      const [contactsRes, groupsRes] = await Promise.all([
        api.get("/api/contacts"),
        api.get("/api/contact-groups"),
      ])

      setContacts(contactsRes.data?.data || [])
      setGroups(groupsRes.data?.data || [])

    } catch {

      toast.error("Failed to load contacts")

    }

  }

  return(

    <div className="p-4 min-h-screen space-y-8">

      <div>

        <h1 className="text-2xl font-semibold">
          Create WhatsApp Campaign
        </h1>

        <p className="text-gray-500 text-sm">
          Send single messages or bulk campaigns using approved WhatsApp templates.
        </p>

      </div>

      <div className="flex gap-3">

        <button
          onClick={()=>setMode("single")}
          className={`px-4 py-2 rounded border ${
            mode==="single"
              ? "bg-black text-white"
              : "bg-white"
          }`}
        >
          Single Message
        </button>

        <button
          onClick={()=>setMode("bulk")}
          className={`px-4 py-2 rounded border ${
            mode==="bulk"
              ? "bg-black text-white"
              : "bg-white"
          }`}
        >
          Bulk Campaign
        </button>

      </div>

      {mode==="single" && (
        <SingleCampaign
          templates={templates}
          contacts={contacts}
          loading={loading}
        />
      )}

      {mode==="bulk" && (
        <BulkCampaign
          templates={templates}
          groups={groups}
          loading={loading}
        />
      )}

    </div>

  )

}

/* =========================
SINGLE CAMPAIGN
========================= */

function SingleCampaign({templates,contacts,loading}){

  const [phone,setPhone] = useState("")
  const [template,setTemplate] = useState(null)
  const [variables,setVariables] = useState({})

  const variableIndexes = extractVariables(template)

  const send = async ()=>{

    if(!phone){
      toast.error("Please select contact")
      return
    }

    if(!template){
      toast.error("Please select template")
      return
    }

    const vars = variableIndexes.map(i => variables[i] || "")

    try{

      await api.post("/api/whatsapp/singlecampaign",{
        phone,
        template_name:template.name,
        language:template.language,
        variables:vars
      })

      toast.success("Message sent successfully")

      setVariables({})

    }catch(e){

      toast.error(
        e?.response?.data?.message || "Failed to send message"
      )

    }

  }

  return(

    <div className="bg-white border rounded-xl p-6 space-y-6 shadow-sm">

      <h2 className="text-lg font-semibold">
        Send Single Message
      </h2>

      <div className="space-y-2">

        <label className="text-sm text-gray-600">
          Contact
        </label>

        <select
          className="w-full border p-2 rounded"
          value={phone}
          onChange={(e)=>setPhone(e.target.value)}
        >

          <option value="">
            Select Contact
          </option>

          {contacts.map(c=>(
            <option key={c.id} value={c.phone}>
              {c.name || c.phone}
            </option>
          ))}

        </select>

      </div>

      <div className="space-y-2">

        <label className="text-sm text-gray-600">
          Template
        </label>

        <select
          className="w-full border p-2 rounded"
          value={template?.id || ""}
          onChange={(e)=>{

            const t = templates.find(
              x => x.id == e.target.value
            )

            setTemplate(t)
            setVariables({})

          }}
        >

          <option value="">
            {loading ? "Loading templates..." : "Select Template"}
          </option>

          {templates.map(t=>(
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}

        </select>

      </div>

      {variableIndexes.length > 0 && (

        <div className="space-y-3">

          <label className="text-sm text-gray-600">
            Template Variables
          </label>

          {variableIndexes.map(i => (

            <input
              key={i}
              className="w-full border p-2 rounded"
              placeholder={`Variable ${i}`}
              value={variables[i] || ""}
              onChange={(e)=>setVariables({
                ...variables,
                [i]:e.target.value
              })}
            />

          ))}

        </div>

      )}

      <button
        onClick={send}
        className="bg-green-600 text-white px-5 py-2 rounded"
      >
        Send Message
      </button>

    </div>

  )

}

/* =========================
BULK CAMPAIGN
========================= */

function BulkCampaign({templates,groups,loading}){

  const [group,setGroup] = useState("")
  const [template,setTemplate] = useState(null)
  const [variables,setVariables] = useState({})
  const [sendType,setSendType] = useState("manual")
  const [schedule,setSchedule] = useState("")

  const variableIndexes = extractVariables(template)

  const send = async ()=>{

    if(!group){
      toast.error("Please select group")
      return
    }

    if(!template){
      toast.error("Please select template")
      return
    }

    const vars = variableIndexes.map(i => variables[i] || "")

    try{

      await api.post("/api/whatsapp/bulkcampaign",{
        group_id:group,
        template_name:template.name,
        send_type:sendType,
        schedule_at:schedule,
        variables:vars
      })

      toast.success("Campaign created successfully")

      setVariables({})
      setSchedule("")

    }catch(e){

      toast.error(
        e?.response?.data?.message || "Campaign failed"
      )

    }

  }

  return(

    <div className="bg-white border rounded-xl p-6 space-y-6 shadow-sm">

      <h2 className="text-lg font-semibold">
        Bulk Campaign
      </h2>

      <div className="space-y-2">

        <label className="text-sm text-gray-600">
          Contact Group
        </label>

        <select
          className="w-full border p-2 rounded"
          value={group}
          onChange={(e)=>setGroup(e.target.value)}
        >

          <option value="">
            Select Group
          </option>

          {groups.map(g=>(
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}

        </select>

      </div>

      <div className="space-y-2">

        <label className="text-sm text-gray-600">
          Template
        </label>

        <select
          className="w-full border p-2 rounded"
          value={template?.id || ""}
          onChange={(e)=>{

            const t = templates.find(
              x => x.id == e.target.value
            )

            setTemplate(t)
            setVariables({})

          }}
        >

          <option value="">
            {loading ? "Loading templates..." : "Select Template"}
          </option>

          {templates.map(t=>(
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}

        </select>

      </div>

      {variableIndexes.length > 0 && (

        <div className="space-y-3">

          <label className="text-sm text-gray-600">
            Template Variables
          </label>

          {variableIndexes.map(i => (

            <input
              key={i}
              className="w-full border p-2 rounded"
              placeholder={`Variable ${i}`}
              value={variables[i] || ""}
              onChange={(e)=>setVariables({
                ...variables,
                [i]:e.target.value
              })}
            />

          ))}

        </div>

      )}

      <div className="space-y-2">

        <label className="text-sm text-gray-600">
          Send Type
        </label>

        <select
          className="w-full border p-2 rounded"
          value={sendType}
          onChange={(e)=>setSendType(e.target.value)}
        >

          <option value="manual">
            Send Now
          </option>

          <option value="scheduled">
            Schedule
          </option>

        </select>

      </div>

      {sendType==="scheduled" && (

        <input
          type="datetime-local"
          className="w-full border p-2 rounded"
          value={schedule}
          onChange={(e)=>setSchedule(e.target.value)}
        />

      )}

      <button
        onClick={send}
        className="bg-blue-600 text-white px-5 py-2 rounded"
      >
        Run Campaign
      </button>

    </div>

  )

}