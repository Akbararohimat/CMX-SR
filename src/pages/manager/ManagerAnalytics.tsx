import { useMemo, useState } from "react"
import { useNavigate } from "react-router"
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Eye,
  ClipboardList,
  Clock3,
  FileText,
  MapPin,
  Package,
  RefreshCw,
  ShieldAlert,
  Users,
} from "lucide-react"

type SiteData = {
  name: string
  attendance: number
  reports: number
  findings: number
  highRisk: number
}

const demoSites: SiteData[] = [
  {
    name: "Bandung",
    attendance: 94,
    reports: 92,
    findings: 8,
    highRisk: 2,
  },
  {
    name: "Cikarang",
    attendance: 88,
    reports: 85,
    findings: 6,
    highRisk: 1,
  },
  {
    name: "Jakarta",
    attendance: 97,
    reports: 96,
    findings: 4,
    highRisk: 1,
  },
  {
    name: "Bali",
    attendance: 91,
    reports: 89,
    findings: 3,
    highRisk: 0,
  },
]

const demoTrend = [
  { label: "Minggu 1", attendance: 86, reports: 80 },
  { label: "Minggu 2", attendance: 91, reports: 87 },
  { label: "Minggu 3", attendance: 88, reports: 84 },
  { label: "Minggu 4", attendance: 95, reports: 92 },
]

const periodOptions = [
  { label: "7 hari terakhir", value: "7" },
  { label: "30 hari terakhir", value: "30" },
  { label: "90 hari terakhir", value: "90" },
]

export default function ManagerAnalytics() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState("30")
  const [selectedSite, setSelectedSite] = useState("Semua Site")

  const visibleSites = useMemo(
    () =>
      selectedSite === "Semua Site"
        ? demoSites
        : demoSites.filter((site) => site.name === selectedSite),
    [selectedSite],
  )

  const averages = useMemo(() => {
    if (visibleSites.length === 0) {
      return { attendance: 0, reports: 0 }
    }

    return {
      attendance: Math.round(
        visibleSites.reduce((sum, site) => sum + site.attendance, 0) /
          visibleSites.length,
      ),
      reports: Math.round(
        visibleSites.reduce((sum, site) => sum + site.reports, 0) /
          visibleSites.length,
      ),
    }
  }, [visibleSites])

  const totalFindings = visibleSites.reduce(
    (sum, site) => sum + site.findings,
    0,
  )

  const totalHighRisk = visibleSites.reduce(
    (sum, site) => sum + site.highRisk,
    0,
  )

  return (
    <div className="space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <Activity className="h-4 w-4" />
            <span>Manager</span>
            <span>/</span>
            <span>Analitik</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Analitik Operasional
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Pantau kepatuhan absensi, Daily Report, dan kondisi inventaris
            dari seluruh site dalam satu tampilan.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative">
            <span className="sr-only">Pilih site</span>
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={selectedSite}
              onChange={(event) => setSelectedSite(event.target.value)}
              className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-8 text-sm font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 sm:w-44"
            >
              <option value="Semua Site">Semua Site</option>
              {demoSites.map((site) => (
                <option key={site.name} value={site.name}>
                  {site.name}
                </option>
              ))}
            </select>
          </label>

          <label className="relative">
            <span className="sr-only">Pilih periode</span>
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-8 text-sm font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 sm:w-48"
            >
              {periodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Preview notice */}
      <div className="flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4">
        <Activity className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
        <div>
          <p className="text-sm font-semibold text-indigo-950">
            Executive overview
          </p>
          <p className="mt-1 text-sm leading-5 text-indigo-800">
            Tampilan ini menggunakan data dummy untuk preview. Periode
            dan site merupakan filter UI; angka tren mingguan belum
            dihitung dari data backend.
          </p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Kepatuhan Absensi"
          value={`${averages.attendance}%`}
          description="Rata-rata site terpilih"
          icon={Users}
          iconClass="bg-indigo-50 text-indigo-600"
          trend="+4% dibanding periode sebelumnya"
          trendUp
          onClick={() => navigate("/manager/attendance")}
        />

        <MetricCard
          title="Kepatuhan Daily Report"
          value={`${averages.reports}%`}
          description="Rata-rata laporan tersubmit"
          icon={FileText}
          iconClass="bg-sky-50 text-sky-600"
          trend="+3% dibanding periode sebelumnya"
          trendUp
          onClick={() => navigate("/manager/daily-reports")}
        />

        <MetricCard
          title="Inventory Findings"
          value={String(totalFindings)}
          description="Total temuan pada site terpilih"
          icon={Package}
          iconClass="bg-amber-50 text-amber-600"
          trend="Temuan yang perlu dipantau"
          onClick={() => navigate("/manager/inventory-findings")}
        />

        <MetricCard
          title="Risiko Tinggi"
          value={String(totalHighRisk)}
          description="Temuan risiko tinggi yang belum selesai"
          icon={ShieldAlert}
          iconClass="bg-red-50 text-red-600"
          trend="Perlu perhatian lebih lanjut"
          onClick={() => navigate("/manager/inventory-findings")}
        />
      </div>

      {/* Trend and inventory summary */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Tren Kepatuhan
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Perbandingan absensi dan Daily Report
              </p>
            </div>

            <span className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
              <CalendarDays className="h-3.5 w-3.5" />
              Tren contoh mingguan
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-slate-600">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
              Absensi
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
              Daily Report
            </span>
          </div>

          <div className="mt-5 space-y-5">
            {demoTrend.map((week) => (
              <div key={week.label}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-600">
                    {week.label}
                  </span>
                  <span className="text-xs tabular-nums text-slate-500">
                    {week.attendance}% / {week.reports}%
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all"
                      style={{ width: `${week.attendance}%` }}
                    />
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-sky-400 transition-all"
                      style={{ width: `${week.reports}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">
            Grafik ini merupakan ilustrasi tren. Gunakan data agregat
            dari backend untuk pelaporan operasional yang sebenarnya.
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold text-slate-900">
                Ringkasan Inventaris
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Status temuan terpantau
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
              <Package className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-red-100 bg-red-50/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-red-800">
                Risiko tinggi
              </span>
              <span className="text-2xl font-bold text-red-700">
                {totalHighRisk}
              </span>
            </div>
            <p className="mt-1 text-xs leading-5 text-red-700">
              Temuan yang belum berstatus selesai.
            </p>
          </div>

          <div className="mt-3 rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-slate-700">
                Total temuan
              </span>
              <span className="text-2xl font-bold text-slate-900">
                {totalFindings}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Seluruh temuan pada site terpilih.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/manager/inventory-findings")}
            className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
          >
            Lihat Inventory Findings
            <ArrowRight className="h-4 w-4" />
          </button>
        </section>
      </div>

      {/* Site comparison */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="font-semibold text-slate-900">
              Perbandingan Antar Site
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Ringkasan kepatuhan dan temuan per lokasi
            </p>
          </div>
          <span className="w-fit rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500">
            {visibleSites.length} site ditampilkan
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Site</th>
                <th className="px-5 py-4 font-semibold">Kepatuhan Absensi</th>
                <th className="px-5 py-4 font-semibold">Daily Report</th>
                <th className="px-5 py-4 font-semibold">Temuan</th>
                <th className="px-5 py-4 font-semibold">Risiko Tinggi</th>
                <th className="px-5 py-4 text-right font-semibold">Detail</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {visibleSites.map((site) => (
                <tr key={site.name} className="transition hover:bg-slate-50/70">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <span className="font-semibold text-slate-800">
                        {site.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <ProgressValue value={site.attendance} />
                  </td>

                  <td className="px-5 py-4">
                    <ProgressValue value={site.reports} />
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-semibold text-slate-800">
                      {site.findings}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex min-w-8 items-center justify-center rounded-lg px-2.5 py-1.5 text-xs font-bold ${
                        site.highRisk > 0
                          ? "bg-red-50 text-red-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {site.highRisk}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        navigate("/manager/inventory-findings")
                      }
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
                    >
                      Lihat
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {visibleSites.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    Tidak ada data untuk site yang dipilih.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Operational attention */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
            <Clock3 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">
              Area Pemantauan Manager
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Gunakan ringkasan berikut untuk menelusuri area operasional
              yang membutuhkan perhatian lebih lanjut.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          <AttentionCard
            icon={Users}
            title="Kepatuhan Absensi"
            description="Tinjau catatan kehadiran dan keterlambatan per periode."
            action="Buka Absensi"
            onClick={() => navigate("/manager/attendance")}
          />
          <AttentionCard
            icon={FileText}
            title="Daily Report"
            description="Pantau laporan yang belum disubmit dan status pelaporan."
            action="Buka Daily Report"
            onClick={() => navigate("/manager/daily-reports")}
          />
          <AttentionCard
            icon={Package}
            title="Inventory Findings"
            description="Tinjau temuan inventaris dan progres tindak lanjut."
            action="Buka Temuan"
            onClick={() => navigate("/manager/inventory-findings")}
          />
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <RefreshCw className="h-3.5 w-3.5" />
          Data preview belum terhubung ke API
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Eye className="h-3.5 w-3.5" />
          Akses baca saja
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  iconClass,
  trend,
  trendUp,
  onClick,
}: {
  title: string
  value: string
  description: string
  icon: typeof Users
  iconClass: string
  trend: string
  trendUp?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
        <div className={`rounded-xl p-3 ${iconClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          {trendUp ? (
            <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5 text-slate-400" />
          )}
          {trend}
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-600" />
      </div>
    </button>
  )
}

function ProgressValue({ value }: { value: number }) {
  return (
    <div className="min-w-32">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="font-semibold tabular-nums text-slate-700">
          {value}%
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${
            value >= 95
              ? "bg-emerald-500"
              : value >= 90
                ? "bg-indigo-500"
                : "bg-amber-500"
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

function AttentionCard({
  icon: Icon,
  title,
  description,
  action,
  onClick,
}: {
  icon: typeof ClipboardList
  title: string
  description: string
  action: string
  onClick: () => void
}) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 p-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-indigo-600" />
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      </div>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
        {description}
      </p>
      <button
        type="button"
        onClick={onClick}
        className="mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-indigo-700 hover:text-indigo-900"
      >
        {action}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}