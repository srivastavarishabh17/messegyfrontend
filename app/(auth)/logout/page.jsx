
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("workspaceKey")

    router.replace("/login")
  }, [router])

  return null
}