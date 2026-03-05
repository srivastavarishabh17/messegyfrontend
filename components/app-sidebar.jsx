"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, usePathname } from "next/navigation"
import {
  LayoutDashboard,
  MessageCircle,
  Megaphone,
  Users,
  Users2,
  Send,
  FileText,
  Workflow,
  TrendingUp,
  Plug,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react"

import { api } from "@/lib/api"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar(props) {
  const router = useRouter()
  const pathname = usePathname()
  const { project_key } = useParams()

  const [workspaces, setWorkspaces] = useState([])

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const res = await api.get("/api/workspaces")
        setWorkspaces(res.data.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchWorkspaces()
  }, [])

  const makeHref = (path) =>
    `/workspace/${project_key}/${path}`

  const isActive = (path) =>
    pathname === makeHref(path)

  return (
    <Sidebar className="bg-[#075E54] text-white p-2" collapsible="icon" {...props}>
      {/* HEADER */}
      <SidebarHeader>
        <div className="space-y-2">
          <p className="text-l font-bold">
            Messegy Workspace
          </p>

          <select
            className="w-full border rounded-md p-2 text-sm"
            value={project_key}
            onChange={(e) =>
              router.push(
                `/workspace/${e.target.value}/dashboard`
              )
            }
          >
            {workspaces.map((ws) => (
              <option
                key={ws.id}
                value={ws.project_key}
              >
                {ws.project_name}
              </option>
            ))}
          </select>
        </div>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent>

        {/* MAIN MENU */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-white">
            Main Menu
          </SidebarGroupLabel>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isActive("dashboard")}
                onClick={() =>
                  router.push(makeHref("dashboard"))
                }
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isActive("chat")}
                onClick={() =>
                  router.push(makeHref("chat"))
                }
              >
                <MessageCircle className="h-4 w-4" />
                <span>Live Chat</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* CONTACTS */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-white">
            Contacts
          </SidebarGroupLabel>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isActive("contact-groups")}
                onClick={() =>
                  router.push(
                    makeHref("contact-groups")
                  )
                }
              >
                <Users2 className="h-4 w-4" />
                <span>Contacts Group</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isActive("contacts")}
                onClick={() =>
                  router.push(makeHref("contacts"))
                }
              >
                <Users className="h-4 w-4" />
                <span>Contacts</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* AUTOMATION */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-white">
            Automation
          </SidebarGroupLabel>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isActive("campaigns")}
                onClick={() =>
                  router.push(makeHref("campaigns"))
                }
              >
                <Send className="h-4 w-4" />
                <span>Campaigns</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isActive("templates")}
                onClick={() =>
                  router.push(makeHref("templates"))
                }
              >
                <FileText className="h-4 w-4" />
                <span>Templates</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isActive("flows")}
                onClick={() =>
                  router.push(makeHref("flows"))
                }
              >
                <Workflow className="h-4 w-4" />
                <span>Flows</span>
              </SidebarMenuButton>
            </SidebarMenuItem> */}
          </SidebarMenu>
        </SidebarGroup>

        {/* GROWTH */}
        {/* <SidebarGroup>
          <SidebarGroupLabel className="text-white">
            Growth
          </SidebarGroupLabel>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isActive("growth")}
                onClick={() =>
                  router.push(makeHref("growth"))
                }
              >
                <TrendingUp className="h-4 w-4" />
                <span>Growth</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isActive("integrations")}
                onClick={() =>
                  router.push(
                    makeHref("integrations")
                  )
                }
              >
                <Plug className="h-4 w-4" />
                <span>Integrations</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isActive("wa-pay")}
                onClick={() =>
                  router.push(makeHref("wa-pay"))
                }
              >
                <CreditCard className="h-4 w-4" />
                <span>WA Pay</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup> */}

        {/* SETTINGS */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-white">
            Settings
          </SidebarGroupLabel>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isActive("settings")}
                onClick={() =>
                  router.push(makeHref("settings"))
                }
              >
                <Settings className="h-4 w-4" />
                <span>Workspace Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() =>
                  router.push("/workspace")
                }
              >
                <span>All Workspace</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => {
                localStorage.removeItem("token")
                router.push("/login")
              }}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}