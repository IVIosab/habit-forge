"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, BarChart, LogOut } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useSession, signOut } from "@/lib/authClient"

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, isPending, error } = useSession()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const routes = [
    {
      href: "/habits",
      label: "Habits",
      icon: Home
    },
    {
      href: "/statistics",
      label: "Statistics",
      icon: BarChart
    }
  ]

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)

      await signOut({
        fetchOptions: {
          onSuccess: () => {
            // Redirect to landing page after successful logout
            router.push("/")
          }
        }
      })
    } catch (error) {
      console.error("Logout failed:", error)
      // Even if logout fails, redirect to landing page
      router.push("/")
    } finally {
      setIsLoggingOut(false)
    }
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2)
  }

  // Handle session error or no session with useEffect
  useEffect(() => {
    if (!isPending && (error || !session?.user)) {
      router.push("/")
    }
  }, [error, session?.user, isPending, router])

  // Show loading state while session is loading
  if (isPending) {
    return (
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-gray-900 to-gray-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">HF</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Habit Forge</h2>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {routes.map((route) => (
                  <SidebarMenuItem key={route.href}>
                    <div className="flex items-center space-x-3 px-3 py-2 rounded-lg border border-gray-200 animate-pulse">
                      <div className="h-5 w-5 bg-gray-200 rounded"></div>
                      <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    </div>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 w-full p-3 rounded-lg border border-gray-200 animate-pulse">
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 w-20 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
    )
  }

  // Don't render if no session (but don't redirect in render)
  if (!isPending && (error || !session?.user)) {
    return null
  }

  const user = session?.user

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-gray-900 to-gray-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">HF</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Habit Forge</h2>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map((route) => (
                <SidebarMenuItem key={route.href}>
                  <SidebarMenuButton asChild isActive={pathname === route.href}>
                    <Link
                      href={route.href}
                      className={`
                        flex items-center space-x-3 px-3 py-2 rounded-lg border transition-all duration-200 ease-in-out
                        ${
                          pathname === route.href
                            ? "border-gray-300 bg-gray-50 text-gray-900 shadow-sm"
                            : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm hover:scale-[1.02]"
                        }
                      `}
                    >
                      <route.icon className="h-5 w-5" />
                      <span className="font-medium">{route.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center space-x-3 w-full p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 ease-in-out hover:shadow-sm"
              disabled={isLoggingOut}
            >
              {user && (
                <>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gray-100 text-gray-600 text-sm font-medium">
                      {getUserInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {user.email}
                    </div>
                  </div>
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end" className="w-56">
            <div className="px-2 py-1.5">
              <div className="text-sm font-medium text-gray-900">
                {user?.name}
              </div>
              <div className="text-xs text-gray-500">{user?.email}</div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
