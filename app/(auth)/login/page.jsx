import Link from "next/link"
import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">

      

      {/* Centered Form */}
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-sm">
          
          <LoginForm />
        </div>
      </div>

    </div>
  )
}