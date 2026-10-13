import { useMemo, useState } from "react"
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Download,
  FileCheck2,
  FileText,
  PackageSearch,
  Search,
  ShieldAlert,
  TrendingUp,
  Users,
  Wifi,
  Clock3,
  Building2,
} from "lucide-react"

type Site = "Semua Site" | "Bandung" | "Cikarang" | "Jakarta" | "Bali"
type Range = "Hari ini" | "7 hari" | "Periode 21–20"

type SiteMetric = {
  site: Exclude<Site, "Semua Site">
  timezone: "WIB" | "WITA"
  attendance: number
  report: number
  findings: number
  lateMinutes: number
  networkIssues: number
}

type Finding = {
  id: string
  site: Exclude<Site, "Semua Site">
  title: string
  category: string
  status: "OPEN" | "UNDER_REVIEW" | "RESOLVED"
  age: string
  tone: "red" | "amber" | "green"
}

const siteMetrics: SiteMetric[] = [
  {
    site: "Bandung",
    timezone: "WIB",
    attendance: 96,
    report: 92,
    findings: 3,
    lateMinutes: 48,
    networkIssues: 2,
  },
  {
    site: "Cikarang",
    timezone: "WIB",
    attendance: 91,
    report: 88,
    findings: 5,
    lateMinutes: 67,
    networkIssues: 4,
  },
  {
    site: "Jakarta",
    timezone: "WIB",
    attendance: 98,
    report: 95,
    findings: 2,
    lateMinutes: 21,
    networkIssues: 1,
  },
  {
    site: "Bali",
    timezone: "WITA",
    attendance: 94,
    report: 90,
    findings: 4,
    lateMinutes: 39,
    networkIssues: 3,
  },
]

const attendanceTrend = [
  { day: "Sen", attendance: 91, reports: 87 },
  { day: "Sel", attendance: 94, reports: 89 },
  { day: "Rab", attendance: 89, reports: 86 },
  { day: "Kam", attendance: 96, reports: 93 },
  { day: "Jum", attendance: 92, reports: 90 },
  { day: "Sab", attendance: 97, reports: 94 },
  { day: "Min", attendance: 95, reports: 91 },
]

const initialFindings: Finding[] = [
  {
    id: "IF-2026-0142",
    site: "Cikarang",
    title: "Access point tidak stabil",
    category: "Konektivitas",
    status: "OPEN",
    age: "2 jam lalu",
    tone: "red",
  },
  {
    id: "IF-2026-0139",
    site: "Bali",
    title: "Perangkat perlu pemeriksaan",
    category: "Perangkat",
    status: "UNDER_REVIEW",
    age: "5 jam lalu",
    tone: "amber",
  },
  {
    id: "IF-2026-0135",
    site: "Bandung",
    title: "Stok kabel UTP menipis",
    category: "Material",
    status: "OPEN",
    age: "Kemarin",
    tone: "red",
  },
  {
    id: "IF-2026-0128",
    site: "Jakarta",
    title: "Pengecekan lingkungan ruang server",
    category: "Lingkungan",
    status: "RESOLVED",
    age: "Kemarin",
    tone: "green",
  },
]

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cx(
        "rounded-2xl border border-slate-200/80 bg-white shadow-sm",
        className,
      )}
    >
      {children}
    </section>
  )
}

function ProgressBar({
  value,
  tone = "blue",
}: {
  value: number
  tone?: "blue" | "green" | "amber"
}) {
  const colors = {
    blue: "bg-blue-600",
    green: "bg-emerald-500",
    amber: "bg-amber-500",
  }

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className={cx("h-full rounded-full transition-all", colors[tone])}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  )
}

function StatusPill({
  children,
  tone = "slate",
}: {
  children: React.ReactNode
  tone?: "green" | "amber" | "red" | "slate" | "blue"
}) {
  const styles = {
    green: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
    amber: "bg-amber-50 text-amber-700 ring-amber-600/15",
    red: "bg-rose-50 text-rose-700 ring-rose-600/15",
    slate: "bg-slate-100 text-slate-600 ring-slate-500/10",
    blue: "bg-blue-50 text-blue-700 ring-blue-600/15",
  }

  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset",
        styles[tone],
      )}
    >
      {children}
    </span>
  )
}

function KpiCard({
  title,
  value,
  helper,
  icon: Icon,
  trend,
  trendUp = true,
  tone = "blue",
}: {
  title: string
  value: string
  helper: string
  icon: typeof Users
  trend: string
  trendUp?: boolean
  tone?: "blue" | "green" | "amber" | "red"
}) {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-rose-50 text-rose-700",
  }

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
        </div>
        <div className={cx("rounded-xl p-2.5", tones[tone])}>
          <Icon size={20} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span
          className={cx(
            "inline-flex items-center gap-1 font-semibold",
            trendUp ? "text-emerald-700" : "text-rose-700",
          )}
        >
          {trendUp ? (
            <ArrowUpRight size={14} />
          ) : (
            <ArrowDownRight size={14} />
          )}
          {trend}
        </span>
        <span className="text-slate-400">{helper}</span>
      </div>
    </Card>
  )
}

function TrendChart() {
  const width = 660
  const height = 220
  const left = 34
  const right = 14
  const top = 16
  const bottom = 32

  const x = (index: number) =>
    left + index * ((width - left - right) / (attendanceTrend.length - 1))

  const y = (value: number) =>
    top + ((100 - value) / 20) * (height - top - bottom)

  const pointsFor = (key: "attendance" | "reports") =>
    attendanceTrend
      .map((item, index) => `${x(index)},${y(item[key])}`)
      .join(" ")

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto min-w-[480px] w-full"
          role="img"
          aria-label="Grafik tren kehadiran dan Daily Report selama tujuh hari"
        >
          {[80, 90, 100].map((value) => (
            <g key={value}>
              <line
                x1={left}
                x2={width - right}
                y1={y(value)}
                y2={y(value)}
                stroke="#e2e8f0"
                strokeDasharray="4 5"
              />
              <text
                x={left - 8}
                y={y(value) + 4}
                textAnchor="end"
                fontSize="11"
                fill="#94a3b8"
              >
                {value}%
              </text>
            </g>
          ))}

          <polyline
            points={pointsFor("attendance")}
            fill="none"
            stroke="#2563eb"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <polyline
            points={pointsFor("reports")}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {attendanceTrend.map((item, index) => (
            <g key={item.day}>
              <circle
                cx={x(index)}
                cy={y(item.attendance)}
                r="4"
                fill="white"
                stroke="#2563eb"
                strokeWidth="2.5"
              />
              <circle
                cx={x(index)}
                cy={y(item.reports)}
                r="4"
                fill="white"
                stroke="#10b981"
                strokeWidth="2.5"
              />
              <text
                x={x(index)}
                y={height - 9}
                textAnchor="middle"
                fontSize="11"
                fill="#94a3b8"
              >
                {item.day}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
        <span className="inline-flex items-center gap-2">
          <i className="size-2.5 rounded-full bg-blue-600" />
          Kepatuhan absensi
        </span>
        <span className="inline-flex items-center gap-2">
          <i className="size-2.5 rounded-full bg-emerald-500" />
          Submission Daily Report
        </span>
      </div>
    </div>
  )
}

export default function ManagerDashboard() {
  const [site, setSite] = useState<Site>("Semua Site")
  const [range, setRange] = useState<Range>("Hari ini")
  const [query, setQuery] = useState("")
  const [findings, setFindings] = useState(initialFindings)
  const [notice, setNotice] = useState("")

  const filteredSites = useMemo(
    () =>
      siteMetrics.filter(
        (item) => site === "Semua Site" || item.site === site,
      ),
    [site],
  )

  const filteredFindings = useMemo(
    () =>
      findings.filter(
        (item) =>
          (site === "Semua Site" || item.site === site) &&
          `${item.id} ${item.site} ${item.title} ${item.category}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [findings, site, query],
  )

  const averageAttendance = filteredSites.length
    ? Math.round(
        filteredSites.reduce((sum, item) => sum + item.attendance, 0) /
          filteredSites.length,
      )
    : 0

  const averageReports = filteredSites.length
    ? Math.round(
        filteredSites.reduce((sum, item) => sum + item.report, 0) /
          filteredSites.length,
      )
    : 0

  const openFindings = filteredSites.reduce(
    (sum, item) => sum + item.findings,
    0,
  )

  const overThreshold = filteredSites.filter(
    (item) => item.lateMinutes > 60,
  ).length

  const exportPreview = () => {
    const header = [
      "ID",
      "Site",
      "Temuan",
      "Kategori",
      "Status",
      "Waktu",
    ]

    const rows = filteredFindings.map((item) => [
      item.id,
      item.site,
      item.title,
      item.category,
      item.status,
      item.age,
    ])

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n")

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    })

    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")

    anchor.href = url
    anchor.download = "manager-inventory-findings.csv"
    anchor.click()

    URL.revokeObjectURL(url)
    setNotice("Export CSV berhasil dibuat dari data demonstrasi.")
  }

  const updateFinding = (id: string) => {
    setFindings((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status:
                item.status === "OPEN"
                  ? "UNDER_REVIEW"
                  : item.status === "UNDER_REVIEW"
                    ? "RESOLVED"
                    : "OPEN",
              tone:
                item.status === "OPEN"
                  ? "amber"
                  : item.status === "UNDER_REVIEW"
                    ? "green"
                    : "red",
            }
          : item,
      ),
    )
  }

  return (
    <div className="space-y-6 text-slate-900">
      <section className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
        <div>
          <p className="text-sm font-semibold text-indigo-600">
            Executive Overview
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Selamat datang, Manager
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Pantau kehadiran engineer, kelengkapan laporan, inventaris,
            dan temuan operasional dalam satu dashboard.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm">
            <Building2 size={16} className="text-slate-400" />
            <span className="sr-only">Filter site</span>
            <select
              value={site}
              onChange={(event) => setSite(event.target.value as Site)}
              className="bg-transparent font-medium outline-none"
            >
              <option>Semua Site</option>
              <option>Bandung</option>
              <option>Cikarang</option>
              <option>Jakarta</option>
              <option>Bali</option>
            </select>
          </label>

          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm">
            <CalendarDays size={16} className="text-slate-400" />
            <span className="sr-only">Filter periode</span>
            <select
              value={range}
              onChange={(event) => setRange(event.target.value as Range)}
              className="bg-transparent font-medium outline-none"
            >
              <option>Hari ini</option>
              <option>7 hari</option>
              <option>Periode 21–20</option>
            </select>
          </label>
        </div>
      </section>

      {notice && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <div className="flex items-start gap-2">
            <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
            <p>{notice}</p>
          </div>
          <button
            type="button"
            onClick={() => setNotice("")}
            className="text-emerald-700"
            aria-label="Tutup pemberitahuan"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-sm text-amber-900">
        <AlertTriangle size={18} className="mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold">Mode demonstrasi</p>
          <p className="mt-1 leading-5 text-amber-800">
            Semua angka merupakan data contoh. Periode{" "}
            <strong>{range}</strong> belum memfilter data berdasarkan tanggal
            karena backend belum dihubungkan.
          </p>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <KpiCard
          title="Kehadiran Rata-rata"
          value={`${averageAttendance}%`}
          helper={`Cakupan: ${filteredSites.length} site`}
          trend="+2,4%"
          trendUp
          tone="blue"
          icon={Users}
        />

        <KpiCard
          title="Daily Report submitted"
          value={`${averageReports}%`}
          helper={`Periode: ${range}`}
          trend="+1,8%"
          trendUp
          tone="green"
          icon={FileCheck2}
        />

        <KpiCard
          title="EOS > 60 menit terlambat"
          value={String(overThreshold)}
          helper="Site dengan akumulasi di atas batas"
          trend="Perlu ditinjau"
          trendUp={false}
          tone="amber"
          icon={Clock3}
        />

        <KpiCard
          title="Inventory Findings terbuka"
          value={String(openFindings)}
          helper="Temuan lintas-site"
          trend="Butuh tindak lanjut"
          trendUp={false}
          tone="red"
          icon={ShieldAlert}
        />
      </section>

      <section className="grid gap-5 2xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.9fr)]">
        <Card className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Tren kepatuhan
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Perbandingan attendance dan Daily Report · 7 hari terakhir
              </p>
            </div>
            <StatusPill tone="blue">Data simulasi</StatusPill>
          </div>

          <div className="mt-5">
            <TrendChart />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 p-3.5">
              <p className="text-xs text-slate-500">
                Rata-rata attendance
              </p>
              <p className="mt-1.5 text-xl font-bold text-slate-900">
                {averageAttendance}%
              </p>
              <p className="mt-1 text-[11px] text-emerald-700">
                Ringkasan simulasi
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3.5">
              <p className="text-xs text-slate-500">
                Rata-rata submission
              </p>
              <p className="mt-1.5 text-xl font-bold text-slate-900">
                {averageReports}%
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Dari site terpilih
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Ringkasan isu operasional
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Indikator site yang perlu perhatian
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-700">
              <Activity size={18} />
            </div>
          </div>

          <div className="mt-5 space-y-5">
            {[
              {
                label: "Temuan inventaris terbuka",
                value: openFindings,
                suffix: "temuan",
                tone: "red",
                icon: ShieldAlert,
              },
              {
                label: "Site dengan gangguan jaringan",
                value: filteredSites.filter(
                  (item) => item.networkIssues > 0,
                ).length,
                suffix: "site",
                tone: "amber",
                icon: Wifi,
              },
              {
                label: "Akumulasi telat di atas 60 menit",
                value: overThreshold,
                suffix: "site",
                tone: "blue",
                icon: Clock3,
              },
            ].map(({ label, value, suffix, tone, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className={cx(
                    "flex size-10 items-center justify-center rounded-xl",
                    tone === "red"
                      ? "bg-rose-50 text-rose-700"
                      : tone === "amber"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-blue-50 text-blue-700",
                  )}
                >
                  <Icon size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-800">
                    {label}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Dari filter site aktif
                  </p>
                </div>
                <p className="shrink-0 text-sm font-bold text-slate-900">
                  {value}{" "}
                  <span className="text-[11px] font-medium text-slate-400">
                    {suffix}
                  </span>
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 p-3.5">
            <p className="text-xs font-semibold text-slate-800">
              Catatan kepatuhan
            </p>
            <p className="mt-1.5 text-xs leading-5 text-slate-500">
              Keterlambatan lebih dari 60 menit perlu ditinjau sesuai periode
              operasional dan zona waktu site.
            </p>
          </div>
        </Card>
      </section>

      <section className="grid gap-5 2xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Kepatuhan per site
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Zona waktu dan metrik ringkas
              </p>
            </div>
            <Building2 size={18} className="text-slate-400" />
          </div>

          <div className="divide-y divide-slate-100">
            {filteredSites.map((item) => (
              <div
                key={item.site}
                className="grid gap-4 px-5 py-4 sm:grid-cols-[minmax(100px,0.75fr)_minmax(120px,1fr)_minmax(120px,1fr)] sm:items-center sm:px-6"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {item.site}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Zona waktu: {item.timezone}
                  </p>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500">
                      Attendance
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {item.attendance}%
                    </span>
                  </div>
                  <ProgressBar
                    value={item.attendance}
                    tone={item.attendance >= 95 ? "green" : "blue"}
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500">
                      Daily Report
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {item.report}%
                    </span>
                  </div>
                  <ProgressBar
                    value={item.report}
                    tone={item.report >= 95 ? "green" : "amber"}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3 text-[11px] text-slate-500 sm:px-6">
            Periode: {range} · Site: {site} · Data simulasi
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Inventory Findings
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Temuan yang memerlukan tindak lanjut
              </p>
            </div>

            <button
              type="button"
              onClick={exportPreview}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <Download size={14} />
              Export CSV
            </button>
          </div>

          <div className="border-b border-slate-100 px-5 py-3 sm:px-6">
            <label className="relative block">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari ID, site, atau temuan..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs outline-none placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </label>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredFindings.length ? (
              filteredFindings.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 px-5 py-4 sm:px-6"
                >
                  <div
                    className={cx(
                      "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl",
                      item.tone === "red"
                        ? "bg-rose-50 text-rose-700"
                        : item.tone === "amber"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-emerald-50 text-emerald-700",
                    )}
                  >
                    <AlertTriangle size={16} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-semibold text-slate-800">
                        {item.title}
                      </p>
                      <StatusPill
                        tone={
                          item.status === "OPEN"
                            ? "red"
                            : item.status === "UNDER_REVIEW"
                              ? "amber"
                              : "green"
                        }
                      >
                        {item.status === "UNDER_REVIEW"
                          ? "UNDER REVIEW"
                          : item.status}
                      </StatusPill>
                    </div>

                    <p className="mt-1 text-[11px] text-slate-500">
                      {item.id} · {item.site} · {item.category}
                    </p>
                    <p className="mt-1.5 text-[10px] text-slate-400">
                      {item.age}
                    </p>

                    <button
                      type="button"
                      onClick={() => updateFinding(item.id)}
                      className="mt-2 text-[11px] font-semibold text-blue-700 hover:text-blue-900"
                    >
                      Ubah status demo
                    </button>
                  </div>

                  <ArrowRight
                    size={15}
                    className="mt-1 shrink-0 text-slate-300"
                  />
                </div>
              ))
            ) : (
              <div className="px-6 py-10 text-center">
                <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <Search size={17} />
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-700">
                  Tidak ada temuan
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Coba kata kunci atau filter site lain.
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3 text-[11px] text-slate-500 sm:px-6">
            Ringkasan saja. Evidence sensitif tidak ditampilkan di dashboard
            Manager.
          </div>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="flex items-start gap-3 p-5">
          <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-800">Status data</h2>
            <p className="mt-1.5 text-xs leading-5 text-slate-500">
              Data operasional resmi akan ditampilkan setelah API backend
              terhubung.
            </p>
          </div>
        </Card>

        <Card className="flex items-start gap-3 p-5">
          <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
            <CalendarDays size={18} />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-800">
              Periode operasional
            </h2>
            <p className="mt-1.5 text-xs leading-5 text-slate-500">
              Rekap mengikuti periode operasional dan zona waktu masing-masing
              site setelah integrasi backend.
            </p>
          </div>
        </Card>

        <Card className="flex items-start gap-3 p-5">
          <div className="rounded-xl bg-violet-50 p-2.5 text-violet-700">
            <ShieldAlert size={18} />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-800">
              Privasi Manager
            </h2>
            <p className="mt-1.5 text-xs leading-5 text-slate-500">
              Dashboard hanya menampilkan agregat, bukan selfie, koordinat GPS
              presisi, atau evidence sensitif.
            </p>
          </div>
        </Card>
      </section>

      <footer className="flex flex-col gap-1 border-t border-slate-200 py-5 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <span>CMX EOS · Manager Workspace</span>
        <span>UI prototype · Data demonstrasi</span>
      </footer>
    </div>
  )
}