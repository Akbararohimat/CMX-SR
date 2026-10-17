
import { useMemo, useState } from "react"
import {
  CalendarDays,
  Search,
  Download,
  FileText,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Users,
  MapPin,
  ChevronDown,
  Eye,
  X,
  ClipboardCheck,
} from "lucide-react"

type ReportStatus = "Disetujui" | "Menunggu Review" | "Perlu Revisi"

type DailyReportRecord = {
  id: number
  name: string
  employeeId: string
  site: string
  date: string
  title: string
  description: string
  startTime: string
  endTime: string
  status: ReportStatus
  findings: string
  followUp: string
}

const dailyReportData: DailyReportRecord[] = [
  {
    id: 1,
    name: "Andi Pratama",
    employeeId: "ENG-001",
    site: "Bandung",
    date: "2026-10-14",
    title: "Pemeriksaan perangkat jaringan",
    description:
      "Melakukan pemeriksaan konektivitas jaringan, pengecekan access point, dan memastikan perangkat berfungsi normal.",
    startTime: "08:00",
    endTime: "16:30",
    status: "Disetujui",
    findings: "Satu access point memerlukan pemantauan lanjutan.",
    followUp: "Jadwalkan pemeriksaan ulang pada kunjungan berikutnya.",
  },
  {
    id: 2,
    name: "Rizky Maulana",
    employeeId: "ENG-002",
    site: "Jakarta",
    date: "2026-10-14",
    title: "Instalasi perangkat",
    description:
      "Melakukan instalasi perangkat jaringan dan konfigurasi awal sesuai kebutuhan site.",
    startTime: "09:00",
    endTime: "17:00",
    status: "Menunggu Review",
    findings: "Konfigurasi awal selesai.",
    followUp: "Menunggu pemeriksaan laporan oleh penanggung jawab.",
  },
  {
    id: 3,
    name: "Dimas Saputra",
    employeeId: "ENG-003",
    site: "Cikarang",
    date: "2026-10-14",
    title: "Pemeliharaan jaringan",
    description:
      "Melakukan pemeliharaan berkala pada perangkat jaringan di area operasional.",
    startTime: "08:15",
    endTime: "16:00",
    status: "Perlu Revisi",
    findings: "Dokumentasi perangkat belum lengkap.",
    followUp: "Lengkapi dokumentasi dan kirim ulang laporan.",
  },
  {
    id: 4,
    name: "Fajar Ramadhan",
    employeeId: "ENG-004",
    site: "Bali",
    date: "2026-10-14",
    title: "Pengecekan konektivitas",
    description:
      "Melakukan pengecekan konektivitas dan pengujian jaringan pada area site.",
    startTime: "08:00",
    endTime: "16:45",
    status: "Disetujui",
    findings: "Tidak ada kendala utama yang ditemukan.",
    followUp: "Lanjutkan pemantauan rutin.",
  },
  {
    id: 5,
    name: "Bima Kurniawan",
    employeeId: "ENG-005",
    site: "Bandung",
    date: "2026-10-14",
    title: "Pembaruan inventaris",
    description:
      "Memeriksa kesesuaian data inventaris perangkat dengan kondisi aktual di site.",
    startTime: "08:30",
    endTime: "15:30",
    status: "Menunggu Review",
    findings: "Terdapat beberapa data yang perlu diverifikasi.",
    followUp: "Menunggu verifikasi data inventaris.",
  },
  {
    id: 6,
    name: "Yoga Firmansyah",
    employeeId: "ENG-006",
    site: "Jakarta",
    date: "2026-10-14",
    title: "Troubleshooting perangkat",
    description:
      "Melakukan pemeriksaan awal terhadap kendala perangkat dan pengujian konektivitas.",
    startTime: "08:00",
    endTime: "16:00",
    status: "Perlu Revisi",
    findings: "Penyebab kendala belum didokumentasikan secara lengkap.",
    followUp: "Tambahkan hasil pemeriksaan dan tindakan perbaikan.",
  },
]

const statusStyles: Record<ReportStatus, string> = {
  Disetujui: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Menunggu Review": "border-amber-200 bg-amber-50 text-amber-700",
  "Perlu Revisi": "border-rose-200 bg-rose-50 text-rose-700",
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default function ManagerDailyReports() {
  const [search, setSearch] = useState("")
  const [selectedSite, setSelectedSite] = useState("Semua Site")
  const [selectedStatus, setSelectedStatus] = useState("Semua Status")
  const [selectedDate, setSelectedDate] = useState("2026-10-14")
  const [selectedReport, setSelectedReport] =
    useState<DailyReportRecord | null>(null)

  const filteredData = useMemo(() => {
    return dailyReportData.filter((report) => {
      const keyword = search.toLowerCase()

      const matchesSearch =
        report.name.toLowerCase().includes(keyword) ||
        report.employeeId.toLowerCase().includes(keyword) ||
        report.title.toLowerCase().includes(keyword)

      const matchesSite =
        selectedSite === "Semua Site" || report.site === selectedSite

      const matchesStatus =
        selectedStatus === "Semua Status" ||
        report.status === selectedStatus

      const matchesDate = report.date === selectedDate

      return (
        matchesSearch &&
        matchesSite &&
        matchesStatus &&
        matchesDate
      )
    })
  }, [search, selectedSite, selectedStatus, selectedDate])

  const total = filteredData.length
  const approved = filteredData.filter(
    (report) => report.status === "Disetujui",
  ).length
  const pending = filteredData.filter(
    (report) => report.status === "Menunggu Review",
  ).length
  const revision = filteredData.filter(
    (report) => report.status === "Perlu Revisi",
  ).length

  function exportCsv() {
    const header = [
      "Nama Engineer",
      "ID Engineer",
      "Site",
      "Tanggal",
      "Judul Pekerjaan",
      "Waktu Mulai",
      "Waktu Selesai",
      "Status",
      "Deskripsi",
      "Temuan",
      "Tindak Lanjut",
    ]

    const rows = filteredData.map((report) => [
      report.name,
      report.employeeId,
      report.site,
      report.date,
      report.title,
      report.startTime,
      report.endTime,
      report.status,
      report.description,
      report.findings,
      report.followUp,
    ])

    const csvContent = [header, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\r\n")

    const blob = new Blob(["\uFEFF", csvContent], {
      type: "text/csv;charset=utf-8;",
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url
    link.download = `manager-daily-reports-${selectedDate}.csv`
    link.click()

    URL.revokeObjectURL(url)
  }

  const stats = [
    {
      label: "Total Laporan",
      value: total,
      description: "Sesuai filter aktif",
      icon: FileText,
      color: "bg-indigo-50 text-indigo-700",
    },
    {
      label: "Disetujui",
      value: approved,
      description: "Laporan telah disetujui",
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Menunggu Review",
      value: pending,
      description: "Perlu ditinjau",
      icon: Clock3,
      color: "bg-amber-50 text-amber-700",
    },
    {
      label: "Perlu Revisi",
      value: revision,
      description: "Perlu perbaikan laporan",
      icon: AlertTriangle,
      color: "bg-rose-50 text-rose-700",
    },
  ]

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700">
            <CalendarDays className="size-4" />
            Monitoring Operasional
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Daily Report
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Pantau laporan pekerjaan harian Engineer On Site dari seluruh
            site dalam satu tampilan.
          </p>
        </div>

        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-800"
        >
          <Download className="size-4" />
          Export CSV
        </button>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-700" />
          <div>
            <p className="text-sm font-semibold text-amber-900">
              Mode preview
            </p>
            <p className="mt-1 text-xs leading-5 text-amber-800">
              Data laporan masih berupa contoh frontend dan belum terhubung
              ke API backend.
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                    {stat.value}
                  </p>
                </div>

                <div
                  className={`flex size-11 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <Icon className="size-5" />
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                {stat.description}
              </p>
            </div>
          )
        })}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Rekap Daily Report
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Cari laporan berdasarkan engineer, judul pekerjaan, tanggal,
                site, atau status.
              </p>
            </div>

            <div className="relative w-full lg:max-w-xs">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari engineer atau pekerjaan..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <label className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-600">
                Tanggal
              </span>
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-600">
                Site
              </span>
              <span className="relative block">
                <select
                  value={selectedSite}
                  onChange={(event) => setSelectedSite(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                >
                  <option>Semua Site</option>
                  <option>Bandung</option>
                  <option>Cikarang</option>
                  <option>Jakarta</option>
                  <option>Bali</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              </span>
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-600">
                Status Laporan
              </span>
              <span className="relative block">
                <select
                  value={selectedStatus}
                  onChange={(event) => setSelectedStatus(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                >
                  <option>Semua Status</option>
                  <option>Disetujui</option>
                  <option>Menunggu Review</option>
                  <option>Perlu Revisi</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              </span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-5 py-3">
          <p className="text-xs text-slate-500">
            Menampilkan{" "}
            <span className="font-semibold text-slate-800">
              {filteredData.length}
            </span>{" "}
            laporan
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("")
              setSelectedSite("Semua Site")
              setSelectedStatus("Semua Status")
              setSelectedDate("2026-10-14")
            }}
            className="text-xs font-semibold text-indigo-700 hover:text-indigo-900"
          >
            Reset filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-white text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4 font-semibold">Engineer</th>
                <th className="px-5 py-4 font-semibold">Pekerjaan</th>
                <th className="px-5 py-4 font-semibold">Site</th>
                <th className="px-5 py-4 font-semibold">Waktu</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">
                  Detail
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredData.map((report) => (
                <tr
                  key={report.id}
                  className="transition hover:bg-slate-50/80"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-700">
                        {report.name
                          .split(" ")
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {report.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {report.employeeId}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="max-w-xs px-5 py-4">
                    <p className="text-sm font-semibold text-slate-800">
                      {report.title}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {report.description}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-sm text-slate-700">
                      <MapPin className="size-3.5 text-slate-400" />
                      {report.site}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-800">
                      {report.startTime} – {report.endTime}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatDate(report.date)}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[report.status]}`}
                    >
                      {report.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedReport(report)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      <Eye className="size-3.5" />
                      Detail
                    </button>
                  </td>
                </tr>
              ))}

              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <Search className="size-5" />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-800">
                      Laporan tidak ditemukan
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Coba ubah kata kunci atau filter yang dipilih.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm"
          onClick={() => setSelectedReport(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="daily-report-detail-title"
            className="my-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-700">
                  <ClipboardCheck className="size-4" />
                  Detail Daily Report
                </p>
                <h2
                  id="daily-report-detail-title"
                  className="mt-2 text-xl font-bold text-slate-900"
                >
                  {selectedReport.title}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedReport.name} · {selectedReport.employeeId}
                </p>
              </div>

              <button
                type="button"
                aria-label="Tutup detail"
                onClick={() => setSelectedReport(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-5">
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[selectedReport.status]}`}
              >
                {selectedReport.status}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Engineer</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {selectedReport.name}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Site</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {selectedReport.site}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Tanggal</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {formatDate(selectedReport.date)}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Waktu Pekerjaan</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {selectedReport.startTime} – {selectedReport.endTime}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  Deskripsi Pekerjaan
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {selectedReport.description}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  Temuan
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {selectedReport.findings}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  Tindak Lanjut
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {selectedReport.followUp}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedReport(null)}
              className="mt-6 w-full rounded-xl bg-indigo-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-800"
            >
              Tutup
            </button>
          </section>
        </div>
      )}
    </div>
  )
}
