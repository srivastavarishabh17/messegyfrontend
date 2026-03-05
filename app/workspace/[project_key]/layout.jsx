"use client"

import { useEffect, useState } from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function WorkspaceLayout({ children }) {

  const router = useRouter()

  const [plan,setPlan] = useState("Freemium")
  const [expires,setExpires] = useState(null)

  /* ---------------- FETCH PLAN ---------------- */

  const fetchPlan = async () => {

    try{

      const res = await api.get("/api/billing/my-plan")

      if(res.data?.plan){
        setPlan(res.data.plan)
        setExpires(res.data.expires)
      }

    }catch(err){
      console.log("plan fetch failed")
    }

  }

  useEffect(()=>{
    fetchPlan()
  },[])

  return (
    <SidebarProvider>

      <div className="flex min-h-screen w-full bg-[#efeae2]">
        
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Area */}
        <SidebarInset className="flex flex-col bg-background">

          {/* Header */}

          <header className="flex h-16 items-center justify-between border-b px-6 bg-white">

            {/* Left */}

            <div className="flex items-center gap-4">
              <SidebarTrigger />

              <h1 className="text-lg font-semibold">
                Messegy
              </h1>
            </div>

            {/* Right */}

            <div className="flex items-center gap-4">

              {/* PLAN BADGE */}

              <div className="flex items-center gap-2 text-sm">

                <span className="text-muted-foreground">
                  Plan
                </span>

                <span className="px-3 py-1 rounded-md bg-green-600 text-white text-xs font-semibold">
                  {plan}
                </span>

              </div>

              {/* EXPIRY */}

              {expires && (
                <span className="text-xs text-muted-foreground">
                  Expires {new Date(expires).toLocaleDateString()}
                </span>
              )}

              {/* UPGRADE BUTTON */}

              <Button
                variant="outline"
                size="sm"
                onClick={()=>router.push("./plans")}
              >
                Upgrade
              </Button>

            </div>

          </header>

          {/* Page Content */}

          <main className="flex-1 p-8">
            {children}
          </main>

          <Separator />

          {/* Footer */}

          <footer className="h-14 flex items-center justify-between px-6 text-sm text-muted-foreground bg-white">

            <span>
              © {new Date().getFullYear()} Messegy INDIA v2.1
            </span>

            <div className="flex gap-4">

              <span className="hover:text-foreground cursor-pointer">
                Privacy
              </span>

              <span className="hover:text-foreground cursor-pointer">
                Terms
              </span>

              <span className="hover:text-foreground cursor-pointer">
                Support
              </span>

            </div>

          </footer>

        </SidebarInset>

      </div>

    </SidebarProvider>
  )
}