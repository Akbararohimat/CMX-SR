import { Outlet } from "react-router"
import { BottomNav } from "@/components/app-shell/bottom-nav"

export function AppShell() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <main className="min-h-screen pb-20">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  )
}