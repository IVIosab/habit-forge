import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Label } from "@/components/ui/label"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full m-6">
        <div className="flex">
          <SidebarTrigger />
          <h1 className="text-xl font-medium"> Habits </h1>
        </div>
        <SidebarInset>{children}</SidebarInset>
      </main>
    </SidebarProvider>
  )
}
