import {
  ClipboardList,
  Home,
  MoreHorizontal,
  Package,
} from "lucide-react"
import { NavLink } from "react-router"

const navItems = [
  {
    label: "Home",
    path: "/home",
    icon: Home,
  },
  {
    label: "Report",
    path: "/report",
    icon: ClipboardList,
  },
  {
    label: "Inventory",
    path: "/inventory",
    icon: Package,
  },
  {
    label: "More",
    path: "/more",
    icon: MoreHorizontal,
  },
]

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex min-w-16 flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 transition ${
                  isActive
                    ? "text-[#2563eb]"
                    : "text-slate-400 hover:text-slate-600"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className="size-5"
                    strokeWidth={isActive ? 2.3 : 2}
                  />

                  <span className="text-[11px] font-medium">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}