"use client"

import { useEffect, useRef, useState } from "react"
import { api } from "@/lib/api"
import { Loader2, Send, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import clsx from "clsx"

export default function ChatPage() {
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [messageText, setMessageText] = useState("")
  const bottomRef = useRef()

  /* ---------------- FETCH CONVERSATIONS ---------------- */
const soundRef = useRef(null)
const lastMessageIdRef = useRef(null)
  const fetchConversations = async () => {
  try {
    const res = await api.get("/api/conversations")
    setConversations(res.data?.data?.data || [])
  } catch (e) {
    console.error(e)
  }
}

  /* ---------------- FETCH MESSAGES ---------------- */

const fetchMessages = async (conversationId) => {
  try {

    const res = await api.get(`/api/conversations/${conversationId}`)

    const newMessages = res.data?.messages?.data || []

    if (newMessages.length) {

      const latestId = newMessages[newMessages.length - 1].id

      if (
        lastMessageIdRef.current &&
        latestId !== lastMessageIdRef.current
      ) {
       if (
  lastMessageIdRef.current &&
  latestId !== lastMessageIdRef.current
) {
  soundRef.current?.play().catch(()=>{})
}
      }

      lastMessageIdRef.current = latestId
    }

    setMessages(newMessages)

  } catch (e) {
    console.error(e)
  }
}

  /* ---------------- START CONVERSATION ---------------- */

const startConversation = async (contactId) => {
  try {
    const res = await api.post("/api/conversations", {
      contact_id: contactId,
    })

    await fetchConversations()
    setActiveConversation(res.data?.data)
  } catch (e) {
    console.error(e)
  }
}

  /* ---------------- SEND MESSAGE ---------------- */

const sendMessage = async () => {
  if (!activeConversation?.id) return
  if (!messageText.trim()) return

  setSending(true)

  try {
    await api.post(
      `/api/conversations/${activeConversation.id}/messages`,
      { body: messageText }
    )

    setMessageText("")
    fetchMessages(activeConversation.id)
    fetchConversations()
  } catch (err) {
  console.log("FULL ERROR:", err)
  console.log("STATUS:", err?.response?.status)
  console.log("DATA:", err?.response?.data)
} finally {
    setSending(false)
  }
}
  /* ---------------- INIT ---------------- */

  useEffect(() => {
    fetchConversations().finally(() =>
      setLoading(false)
    )
  }, [])

useEffect(() => {
  if (!activeConversation) return

  const interval = setInterval(() => {
    fetchMessages(activeConversation.id)
  }, 3000)

  return () => clearInterval(interval)
}, [activeConversation])

  /* ---------------- AUTO SCROLL ---------------- */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    })
  }, [messages])

  /* ---------------- UI ---------------- */

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin h-6 w-6" />
      </div>
    )

  return (
    <div className="-m-8 h-[calc(100vh-100px)] flex border bg-white overflow-hidden shadow-sm">

      {/* LEFT PANEL */}
      <div className="w-80 border-r hidden md:flex flex-col">

        <div className="p-4 font-semibold border-b">
          Conversations
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => (
            <div
              key={conv.id}
            onClick={() => {
  setActiveConversation(conv)
  fetchMessages(conv.id)
}}
              className={clsx(
                "p-4 cursor-pointer hover:bg-muted transition",
                activeConversation?.id ===
                  conv.id && "bg-muted"
              )}
            >
              <div className="font-medium">
                {conv.contact?.name ||
                  conv.contact?.phone}
              </div>

              <div className="text-xs text-muted-foreground truncate">
                {conv.last_message}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CENTER CHAT */}
      <div className="flex-1 flex flex-col">

        {!activeConversation ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a conversation
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="p-4 border-b bg-gray-100 font-medium flex items-center gap-3">
  <div className="h-9 w-9 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
    {activeConversation.contact?.name?.[0]}
  </div>

  <div>
    <div>
      {activeConversation.contact?.name}
    </div>
    <div className="text-xs text-muted-foreground">
      {activeConversation.contact?.phone}
    </div>
  </div>
</div>

            {/* MESSAGES */}
            {/* MESSAGES */}
<div className="flex-1 overflow-y-auto p-6 space-y-2 bg-[#efeae2]">

  {messages.map((msg) => {
    const isOut = msg.direction === "out"

    return (
      <div
        key={msg.id}
        className={clsx(
          "flex",
          isOut ? "justify-end" : "justify-start"
        )}
      >
        <div
          className={clsx(
            "relative max-w-[75%] px-4 py-2 rounded-lg text-sm shadow-sm",
            isOut
              ? "bg-[#dcf8c6]"
              : "bg-white",
            msg.status === "failed" &&
              "border border-red-400"
          )}
        >
          {/* Message Body */}
          <div className="whitespace-pre-wrap break-words">
            {msg.body}
          </div>

          {/* Timestamp + Status */}
          <div className="flex justify-end items-center gap-1 mt-1 text-[10px] text-gray-500">
            {new Date(
              msg.created_at
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}

            {isOut && msg.status === "failed" && (
              <span className="text-red-500">
                Failed
              </span>
            )}
          </div>
        </div>
      </div>
    )
  })}

  <div ref={bottomRef} />
</div>

            {/* INPUT */}
            <div className="p-4 border-t flex gap-2">
              <Input
                value={messageText}
                onChange={(e) =>
                  setMessageText(e.target.value)
                }
                placeholder="Type a message..."
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  sendMessage()
                }
              />

              <Button
                onClick={sendMessage}
                disabled={sending}
              >
                {sending ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </>
        )}
      </div>

      {/* RIGHT PANEL */}
      {/* RIGHT PANEL */}
{activeConversation && (
  <div className="w-80 border-l bg-white hidden lg:flex flex-col">

    {/* Profile Header */}
    <div className="p-6 border-b flex flex-col items-center text-center">
      <div className="h-20 w-20 rounded-full bg-[#25D366] text-white flex items-center justify-center text-2xl font-bold mb-3">
        {activeConversation.contact?.name?.[0] || "?"}
      </div>

      <div className="font-semibold text-lg">
        {activeConversation.contact?.name || "Unknown"}
      </div>

      <div className="text-sm text-muted-foreground">
        {activeConversation.contact?.phone}
      </div>
    </div>

    {/* Contact Details */}
    <div className="p-6 space-y-4 text-sm flex-1 overflow-y-auto">

      <div>
        <p className="text-xs text-muted-foreground">
          Email
        </p>
        <p>
          {activeConversation.contact?.email || "—"}
        </p>
      </div>

      <div>
        <p className="text-xs text-muted-foreground">
          Created At
        </p>
        <p>
          {new Date(
            activeConversation.contact?.created_at
          ).toLocaleDateString()}
        </p>
      </div>

      <div>
        <p className="text-xs text-muted-foreground">
          Last Message
        </p>
        <p className="truncate">
          {activeConversation.last_message || "—"}
        </p>
      </div>

      <div>
        <p className="text-xs text-muted-foreground">
          Total Messages
        </p>
        <p>
          {messages.length}
        </p>
      </div>

    </div>

    {/* Quick Actions */}
    <div className="p-6 border-t space-y-2">
      <Button variant="outline" className="w-full">
        View Full Contact
      </Button>

      <Button variant="outline" className="w-full">
        Add Tag
      </Button>

      <Button
        variant="destructive"
        className="w-full"
      >
        Block Contact
      </Button>
    </div>

  </div>
)}
<audio ref={soundRef} preload="auto">
  <source src="/sounds/3.mp3" type="audio/mpeg" />
</audio>
    </div>
  )
}