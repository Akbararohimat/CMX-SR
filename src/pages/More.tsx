import { useState } from "react"
import { useNavigate } from "react-router"
import {
  Activity,
  Bell,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Info,
  LogOut,
  MapPin,
  Settings,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type MenuItem = {
  label: string
  description: string
  icon: typeof UserRound
  action: () => void
}

export default function More() {
  const navigate = useNavigate()
  const [showLogout, setShowLogout] = useState(false)
  const [notice, setNotice] = useState("")

  const username =
    sessionStorage.getItem("cmx_username") || "Pengguna CMX"

  const initials = username
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()

  const openNotice = (message: string) => {
    setNotice(message)
  }

  const accountMenu: MenuItem[] = [
    {
      label: "Profil Saya",
      description: "Informasi akun dan identitas",
      icon: UserRound,
      action: () => openNotice("Halaman Profil Saya belum tersedia."),
    },
    {
      label: "Riwayat Aktivitas",
      description: "Lihat aktivitas operasional",
      icon: Activity,
      action: () => openNotice("Riwayat Aktivitas belum tersedia."),
    },
    {
      label: "Laporan Saya",
      description: "Lihat laporan yang pernah dibuat",
      icon: ClipboardList,
      action: () => navigate("/report"),
    },
  ]

  const appMenu: MenuItem[] = [
    {
      label: "Notifikasi",
      description: "Pengingat dan informasi terbaru",
      icon: Bell,
      action: () => openNotice("Pengaturan notifikasi belum tersedia."),
    },
    {
      label: "Pengaturan",
      description: "Preferensi aplikasi",
      icon: Settings,
      action: () => openNotice("Pengaturan aplikasi belum tersedia."),
    },
    {
      label: "Bantuan",
      description: "Panduan penggunaan CMX EOS",
      icon: CircleHelp,
      action: () => openNotice("Pusat bantuan belum tersedia."),
    },
  ]

  const renderMenu = (items: MenuItem[]) =>
    items.map((item, index) => {
      const Icon = item.icon

      return (
        <div key={item.label}>
          <button
            type="button"
            onClick={item.action}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-slate-50 active:bg-slate-100"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Icon className="size-5" />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-slate-800">
                {item.label}
              </span>
              <span className="mt-0.5 block text-xs text-slate-500">
                {item.description}
              </span>
            </span>

            <ChevronRight className="size-4 shrink-0 text-slate-400" />
          </button>

          {index !== items.length - 1 && (
            <Separator className="mx-3 w-auto opacity-60" />
          )}
        </div>
      )
    })

  const handleLogout = () => {
    sessionStorage.removeItem("cmx_dummy_auth")
    sessionStorage.removeItem("cmx_username")
    setShowLogout(false)
    navigate("/login", { replace: true })
  }

  return (
    <section className="mx-auto min-h-screen w-full max-w-md bg-slate-50 px-4 pb-28 pt-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
          CMX EOS
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Lainnya
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Akun, aktivitas, dan pengaturan aplikasi.
        </p>
      </div>

      <Card className="mb-5 overflow-hidden rounded-2xl border-0 bg-white shadow-sm">
        <div className="h-2 bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400" />

        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-14 border border-blue-100">
              <AvatarFallback className="bg-blue-50 text-lg font-bold text-blue-700">
                {initials || "CM"}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <h2 className="truncate font-bold text-slate-900">
                {username}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Akun pengguna CMX EOS
              </p>
              <div className="mt-2">
                <Badge className="border-0 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
                  <ShieldCheck className="mr-1 size-3" />
                  Login aktif
                </Badge>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <MapPin className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-slate-500">Site penugasan</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                Sekolah Rakyat Bandung
              </p>
              <p className="mt-1 text-xs text-slate-500">
                SR-JBR-BDG-001
              </p>
            </div>
          </div>

          <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
            Informasi akun dan site masih menggunakan data demo.
          </p>
        </CardContent>
      </Card>

      <div className="mb-5">
        <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-slate-500">
          Akun & aktivitas
        </h2>

        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-1.5">
            {renderMenu(accountMenu)}
          </CardContent>
        </Card>
      </div>

      <div className="mb-5">
        <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-slate-500">
          Aplikasi
        </h2>

        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-1.5">
            {renderMenu(appMenu)}
          </CardContent>
        </Card>
      </div>

      <div className="mb-5">
        <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-slate-500">
          Tentang
        </h2>

        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Info className="size-5" />
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800">
                  CMX EOS Operations Platform
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Engineer On Site
                </p>
              </div>

              <Badge variant="secondary">Demo</Badge>
            </div>

            <Separator className="my-3" />

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Versi aplikasi</span>
              <span className="font-medium text-slate-700">0.1.0</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={() => setShowLogout(true)}
        className="h-12 w-full rounded-xl border-red-200 bg-white font-semibold text-red-600 hover:bg-red-50 hover:text-red-700"
      >
        <LogOut className="mr-2 size-4" />
        Keluar dari akun
      </Button>

      <p className="mt-5 text-center text-xs text-slate-400">
        CMX EOS · Operations made accountable
      </p>

      {notice && (
        <div
          role="status"
          className="fixed bottom-24 left-4 right-4 z-50 mx-auto flex max-w-md items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg"
        >
          <Info className="mt-0.5 size-5 shrink-0 text-blue-600" />
          <p className="flex-1 text-sm text-slate-700">{notice}</p>
          <button
            type="button"
            aria-label="Tutup pemberitahuan"
            onClick={() => setNotice("")}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {showLogout && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/40 p-4 sm:items-center">
          <button
            type="button"
            aria-label="Tutup konfirmasi logout"
            className="absolute inset-0 cursor-default"
            onClick={() => setShowLogout(false)}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"
          >
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <LogOut className="size-6" />
            </div>

            <h2 id="logout-title" className="text-lg font-bold text-slate-900">
              Keluar dari akun?
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Kamu perlu login kembali untuk mengakses fitur CMX EOS.
            </p>

            <div className="mt-5 flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowLogout(false)}
                className="h-11 flex-1 rounded-xl"
              >
                Batal
              </Button>

              <Button
                type="button"
                onClick={handleLogout}
                className="h-11 flex-1 rounded-xl bg-red-600 hover:bg-red-700"
              >
                Ya, keluar
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
