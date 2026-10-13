import { useState } from "react"
import { NavLink, Outlet } from "react-router"
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Building2,
  CalendarDays,
  ChevronLeft,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  Menu,
  Package,
  ShieldCheck,
  Users,
  X,
} from "lucide-react"

const navigation = [
  {
    label: "Dashboard Eksekutif",
    to: "/manager/dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Absensi & Kepatuhan",
    to: "/manager/attendance",
    icon: CalendarDays,
  },
  {
    label: "Daily Report",
    to: "/manager/daily-reports",
    icon: FileText,
  },
  {
    label: "Inventaris",
    to: "/manager/inventory",
    icon: Package,
  },
  {
    label: "Inventory Findings",
    to: "/manager/inventory-findings",
    icon: AlertTriangle,
  },
  {
    label: "Analitik",
    to: "/manager/analytics",
    icon: BarChart3,
  },
  {
    label: "Master Checklist",
    to: "/manager/checklists",
    icon: ClipboardCheck,
  },
]

export function ManagerShell() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 lg:flex">
      <aside className="hidden w-[258px] shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-[76px] items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-700 text-white">
            <Activity className="size-5" />
          </div>

          <div>
            <p className="text-lg font-bold tracking-tight">CMX EOS</p>
            <p className="text-xs text-slate-500">Manager Workspace</p>
          </div>
        </div>

        <div className="px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Management
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
                      "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    ].join(" ")
                  }
                >
                  <Icon className="size-[18px] shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>

        <div className="mt-auto p-4">
          <div className="rounded-2xl bg-slate-900 p-4 text-white">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck className="size-4 text-indigo-300" />
              Manager Access
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-300">
              Monitoring operasional, kehadiran, laporan, dan inventaris
              seluruh site.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs text-slate-300">
              <span className="size-2 rounded-full bg-amber-400" />
              Frontend preview
            </div>
          </div>
        </div>
      </aside>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            aria-label="Tutup menu"
            className="absolute inset-0 bg-slate-950/40"
            onClick={() => setMobileMenuOpen(false)}
          />

          <aside className="relative flex h-full w-[285px] flex-col bg-white shadow-xl">
            <div className="flex h-[76px] items-center justify-between border-b border-slate-200 px-5">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-700 text-white">
                  <Activity className="size-5" />
                </div>

                <div>
                  <p className="font-bold">CMX EOS</p>
                  <p className="text-xs text-slate-500">Manager Workspace</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Tutup navigasi"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="px-4 py-5">
              <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Management
              </p>

              <nav className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        [
                          "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium",
                          isActive
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-slate-600 hover:bg-slate-50",
                        ].join(" ")
                      }
                    >
                      <Icon className="size-[18px] shrink-0" />
                      {item.label}
                    </NavLink>
                  )
                })}
              </nav>
            </div>

            <div className="mt-auto border-t border-slate-200 p-5">
              <p className="text-sm font-semibold">Manager Workspace</p>
              <p className="mt-1 text-xs text-slate-500">
                CMX EOS Operations Platform
              </p>
            </div>
          </aside>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Buka navigasi"
            >
              <Menu className="size-5" />
            </button>

            <div>
              <p className="text-sm font-semibold sm:text-base">
                Manager Workspace
              </p>
              <p className="hidden text-xs text-slate-500 sm:block">
                CMX EOS · Executive Operations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 sm:flex">
              <span className="size-2 rounded-full bg-amber-500" />
              Demo Mode
            </span>

            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                M
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold">Manager</p>
                <p className="text-xs text-slate-500">Management</p>
              </div>
              <ChevronLeft className="hidden size-4 rotate-[-90deg] text-slate-400 sm:block" />
            </div>
          </div>
        </header>

        <main className="mx-auto min-h-[calc(100vh-76px)] max-w-[1600px] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}