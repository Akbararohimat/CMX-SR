
import { NavLink, Outlet } from "react-router"
import {
  ClipboardCheck,
  LayoutDashboard,
  MapPinned,
  Package,
  Users,
} from "lucide-react"

const navigation = [
  {
    label: "Dashboard",
    to: "/supervisor",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Pengajuan Absensi",
    to: "/supervisor/attendance-requests",
    icon: ClipboardCheck,
  },
  {
    label: "Assignment EOS",
    to: "/supervisor/assignments",
    icon: Users,
  },
  {
    label: "Master Site",
    to: "/supervisor/sites",
    icon: MapPinned,
  },
  {
    label: "Inventory Finding",
    to: "/supervisor/inventory-findings",
    icon: Package,
  },
]

export function BackofficeShell() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 md:flex">
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">
        <div className="border-b border-slate-200 px-6 py-5">
          <p className="text-lg font-bold tracking-tight">CMX EOS</p>
          <p className="mt-1 text-xs text-slate-500">
            Operations Platform
          </p>
        </div>

        <div className="px-5 py-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Supervisor
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    ].join(" ")
                  }
                >
                  <Icon className="size-4 shrink-0" />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-slate-200 p-5">
          <p className="text-sm font-medium">Backoffice</p>
          <p className="mt-1 text-xs text-slate-500">
            Frontend preview
          </p>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 md:px-8">
          <div>
            <p className="text-sm font-semibold">Supervisor Workspace</p>
            <p className="text-xs text-slate-500">
              CMX EOS Operations Platform
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            Supervisor
          </span>
        </header>

        <main className="p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
