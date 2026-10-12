import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  MapPin,
  Package,
  ShieldAlert,
} from "lucide-react"
import { useNavigate } from "react-router"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function getGreeting() {
  const hour = new Date().getHours()

  if (hour >= 4 && hour < 11) return "Selamat pagi"
  if (hour >= 11 && hour < 15) return "Selamat siang"
  if (hour >= 15 && hour < 18) return "Selamat sore"

  return "Selamat malam"
}

function Home() {
  const navigate = useNavigate()

  // Nama ini hanya informasi tampilan dari sesi login saat ini.
  // Identitas resmi tetap harus dikonfirmasi oleh backend.
  const username = sessionStorage.getItem("cmx_username")?.trim()

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="mx-auto w-full max-w-md px-5 pb-6 pt-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/cmx-logo.png"
              alt="CMX"
              className="size-11 object-contain"
            />

            <div>
              <p className="text-xs font-medium text-slate-400">
                CMX · EOS
              </p>

              <p className="text-sm font-semibold text-[#071b49]">
                Operations Platform
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/more")}
            className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50"
            aria-label="Buka menu dan notifikasi"
          >
            <Bell className="size-5" />
          </button>
        </header>

        <section className="mt-8">
          <p className="text-sm text-slate-500">{getGreeting()}</p>

          <h1 className="mt-1 break-words text-2xl font-bold tracking-tight text-[#071b49]">
            {username || "Akun EOS"}
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Pantau aktivitas operasionalmu hari ini.
          </p>
        </section>

        <Card className="mt-6 overflow-hidden rounded-2xl border-0 bg-[#071b49] text-white shadow-lg shadow-blue-950/10">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-white/10">
                    <Clock3 className="size-4" />
                  </span>

                  <p className="text-sm font-medium text-blue-100">
                    Status Kehadiran
                  </p>
                </div>

                <h2 className="mt-5 text-xl font-bold">
                  Belum dapat dipastikan
                </h2>

                <p className="mt-1 text-sm leading-6 text-blue-100/70">
                  Status absensi akan ditampilkan setelah data kehadiran
                  tersedia dari server.
                </p>
              </div>

              <Badge className="shrink-0 border border-white/15 bg-white/10 text-blue-100 hover:bg-white/10">
                Belum tersedia
              </Badge>
            </div>

            <div className="mt-5 flex items-start gap-2 text-xs leading-5 text-blue-100/70">
              <MapPin className="mt-0.5 size-3.5 shrink-0" />

              <span>
                Validasi lokasi dan status kehadiran resmi memerlukan
                layanan backend.
              </span>
            </div>

            <Button
              type="button"
              onClick={() => navigate("/check-in")}
              className="mt-5 h-11 w-full rounded-xl bg-white font-semibold text-[#071b49] hover:bg-blue-50"
            >
              <CheckCircle2 className="mr-2 size-4" />
              Buka Check-in
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/clock-out")}
              className="mt-3 h-11 w-full rounded-xl border-white/25 bg-white/10 font-semibold text-white hover:bg-white/20 hover:text-white"
            >
              <Clock3 className="mr-2 size-4" />
              Buka Clock Out
            </Button>
          </CardContent>
        </Card>

        <section className="mt-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                Aktivitas
              </p>

              <h2 className="mt-1 text-lg font-bold text-[#071b49]">
                Hari Ini
              </h2>
            </div>

            <Badge
              variant="secondary"
              className="rounded-full bg-slate-100 text-slate-500"
            >
              Belum tersedia
            </Badge>
          </div>

          <Card className="mt-4 rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="flex flex-col items-center px-5 py-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <CalendarDays className="size-6" />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-800">
                Data aktivitas belum tersedia
              </h3>

              <p className="mt-1 max-w-[260px] text-xs leading-5 text-slate-400">
                Riwayat aktivitas akan ditampilkan setelah terhubung
                dengan layanan data.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mt-7">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
              Akses Cepat
            </p>

            <h2 className="mt-1 text-lg font-bold text-[#071b49]">
              Menu Operasional
            </h2>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Card
              className="cursor-pointer rounded-2xl border-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              onClick={() => navigate("/report")}
            >
              <CardContent className="p-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ClipboardList className="size-5" />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-800">
                  Daily Report
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Laporan operasional harian
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer rounded-2xl border-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              onClick={() => navigate("/inventory")}
            >
              <CardContent className="p-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Package className="size-5" />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-800">
                  Inventory
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Lihat inventaris site
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Card className="mt-7 rounded-2xl border-amber-200 bg-white shadow-sm">
          <CardHeader className="sr-only">
            <CardTitle>Status Integrasi</CardTitle>
          </CardHeader>

          <CardContent className="flex items-start gap-3 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <ShieldAlert className="size-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800">
                Integrasi layanan
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Status server, autentikasi resmi, dan data operasional
                belum dikonfirmasi oleh backend.
              </p>
            </div>

            <Badge
              variant="outline"
              className="shrink-0 border-amber-200 bg-amber-50 text-amber-700"
            >
              Pending
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Home