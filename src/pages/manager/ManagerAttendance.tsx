import { useMemo, useState } from "react"
import {
  CalendarDays,
  Search,
  Download,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  Users,
  MapPin,
  ChevronDown,
  Eye,
  X,
} from "lucide-react"

type AttendanceStatus = "Hadir" | "Terlambat" | "Belum Check-in" | "Tidak Hadir"

type AttendanceRecord = {
  id: number
  name: string
  employeeId: string
  site: string
  date: string
  checkIn: string
  checkOut: string
  status: AttendanceStatus
  location: string
  notes: string
}

const attendanceData: AttendanceRecord[] = [
  {
    id: 1,
    name: "Andi Pratama",
    employeeId: "ENG-001",
    site: "Bandung",
    date: "2026-10-14",
    checkIn: "07:52",
    checkOut: "17:03",
    status: "Hadir",
    location: "Bandung Site",
    notes: "Check-in dan Clock Out tercatat normal.",
  },
  {
    id: 2,
    name: "Rizky Maulana",
    employeeId: "ENG-002",
    site: "Jakarta",
    date: "2026-10-14",
    checkIn: "08:24",
    checkOut: "—",
    status: "Terlambat",
    location: "Jakarta Site",
    notes: "Check-in melewati jam kerja yang ditentukan.",
  },
  {
    id: 3,
    name: "Dimas Saputra",
    employeeId: "ENG-003",
    site: "Cikarang",
    date: "2026-10-14",
    checkIn: "—",
    checkOut: "—",
    status: "Belum Check-in",
    location: "Belum tersedia",
    notes: "Belum ada catatan check-in untuk tanggal ini.",
  },
  {
    id: 4,
    name: "Fajar Ramadhan",
    employeeId: "ENG-004",
    site: "Bali",
    date: "2026-10-14",
    checkIn: "07:48",
    checkOut: "16:59",
    status: "Hadir",
    location: "Bali Site",
    notes: "Kehadiran tercatat lengkap.",
  },
  {
    id: 5,
    name: "Bima Kurniawan",
    employeeId: "ENG-005",
    site: "Bandung",
    date: "2026-10-14",
    checkIn: "—",
    checkOut: "—",
    status: "Tidak Hadir",
    location: "Belum tersedia",
    notes: "Tidak ada catatan kehadiran pada tanggal ini.",
  },
  {
    id: 6,
    name: "Yoga Firmansyah",
    employeeId: "ENG-006",
    site: "Jakarta",
    date: "2026-10-14",
    checkIn: "08:02",
    checkOut: "—",
    status: "Hadir",
    location: "Jakarta Site",
    notes: "Check-in tercatat. Clock Out belum tersedia.",
  },
]

const statusStyles: Record<AttendanceStatus, string> = {
  Hadir: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Terlambat: "border-amber-200 bg-amber-50 text-amber-700",
  "Belum Check-in": "border-blue-200 bg-blue-50 text-blue-700",
  "Tidak Hadir": "border-rose-200 bg-rose-50 text-rose-700",
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default function ManagerAttendance() {
  const [search, setSearch] = useState("")
  const [selectedSite, setSelectedSite] = useState("Semua Site")
  const [selectedStatus, setSelectedStatus] = useState("Semua Status")
  const [selectedDate, setSelectedDate] = useState("2026-10-14")
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(
    null,
  )

  const filteredData = useMemo(() => {
    return attendanceData.filter((record) => {
      const matchesSearch =
        record.name.toLowerCase().includes(search.toLowerCase()) ||
        record.employeeId.toLowerCase().includes(search.toLowerCase())

      const matchesSite =
        selectedSite === "Semua Site" || record.site === selectedSite

      const matchesStatus =
        selectedStatus === "Semua Status" ||
        record.status === selectedStatus

      const matchesDate = record.date === selectedDate

      return matchesSearch && matchesSite && matchesStatus && matchesDate
    })
  }, [search, selectedSite, selectedStatus, selectedDate])

  const total = filteredData.length
  const present = filteredData.filter(
    (record) => record.status === "Hadir" || record.status === "Terlambat",
  ).length
  const late = filteredData.filter(
    (record) => record.status === "Terlambat",
  ).length
  const pending = filteredData.filter(
    (record) => record.status === "Belum Check-in",
  ).length

  function exportCsv() {
    const header = [
      "Nama",
      "ID Engineer",
      "Site",
      "Tanggal",
      "Check In",
      "Clock Out",
      "Status",
      "Lokasi",
    ]

    const rows = filteredData.map((record) => [
      record.name,
      record.employeeId,
      record.site,
      record.date,
      record.checkIn,
      record.checkOut,
      record.status,
      record.location,
    ])

    const csvContent = [header, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      )
      .join("\r\n")

    const blob = new Blob(["\uFEFF", csvContent], {
      type: "text/csv;charset=utf-8;",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `manager-attendance-${selectedDate}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const stats = [
    {
      label: "Total Engineer",
      value: total,
      description: "Sesuai filter aktif",
      icon: Users,
      color: "bg-indigo-50 text-indigo-700",
    },
    {
      label: "Hadir",
      value: present,
      description: "Termasuk yang terlambat",
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Terlambat",
      value: late,
      description: "Perlu pemantauan",
      icon: Clock3,
      color: "bg-amber-50 text-amber-700",
    },
    {
      label: "Belum Check-in",
      value: pending,
      description: "Menunggu catatan masuk",
      icon: AlertTriangle,
      color: "bg-blue-50 text-blue-700",
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
            Absensi & Kepatuhan
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Pantau kehadiran Engineer On Site, waktu Check In, dan Clock Out
            seluruh site dalam satu tampilan.
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
              Data pada halaman ini masih berupa contoh frontend dan belum
              terhubung ke API backend.
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
              <p className="mt-3 text-xs text-slate-500">{stat.description}</p>
            </div>
          )
        })}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Rekap Kehadiran Engineer
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Cari dan filter data berdasarkan tanggal, site, atau status.
              </p>
            </div>

            <div className="relative w-full lg:max-w-xs">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari nama atau ID engineer..."
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
                Status Kehadiran
              </span>
              <span className="relative block">
                <select
                  value={selectedStatus}
                  onChange={(event) => setSelectedStatus(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                >
                  <option>Semua Status</option>
                  <option>Hadir</option>
                  <option>Terlambat</option>
                  <option>Belum Check-in</option>
                  <option>Tidak Hadir</option>
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
            data
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
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-white text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4 font-semibold">Engineer</th>
                <th className="px-5 py-4 font-semibold">Site</th>
                <th className="px-5 py-4 font-semibold">Check In</th>
                <th className="px-5 py-4 font-semibold">Clock Out</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((record) => (
                <tr
                  key={record.id}
                  className="transition hover:bg-slate-50/80"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-700">
                        {record.name
                          .split(" ")
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {record.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {record.employeeId}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-sm text-slate-700">
                      <MapPin className="size-3.5 text-slate-400" />
                      {record.site}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-semibold text-slate-800">
                      {record.checkIn}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600">
                      {record.checkOut}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[record.status]}`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedRecord(record)}
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
                      Data tidak ditemukan
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

      {selectedRecord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
          onClick={() => setSelectedRecord(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="attendance-detail-title"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-700">
                  Detail Kehadiran
                </p>
                <h2
                  id="attendance-detail-title"
                  className="mt-2 text-xl font-bold text-slate-900"
                >
                  {selectedRecord.name}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedRecord.employeeId}
                </p>
              </div>
              <button
                type="button"
                aria-label="Tutup detail"
                onClick={() => setSelectedRecord(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-5">
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[selectedRecord.status]}`}
              >
                {selectedRecord.status}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Tanggal</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {formatDate(selectedRecord.date)}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Site</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {selectedRecord.site}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Check In</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {selectedRecord.checkIn}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Clock Out</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {selectedRecord.checkOut}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <MapPin className="size-4 text-indigo-600" />
                Lokasi
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {selectedRecord.location}
              </p>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-800">
                Catatan
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {selectedRecord.notes}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedRecord(null)}
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