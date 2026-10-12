
import { useMemo, useState } from "react"
import {
  AlertCircle,
  ArrowDownUp,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Search,
  ShieldCheck,
  UserRound,
  X,
  XCircle,
} from "lucide-react"

type RequestStatus = "PENDING" | "APPROVED" | "REJECTED"
type Decision = "approve" | "reject"

type AttendanceRequest = {
  id: string
  code: string
  employee: string
  initials: string
  site: string
  workDate: string
  requestedAt: string
  type: string
  currentTime: string
  requestedTime: string
  reason: string
  evidence: string[]
  currentLateMinutes: number
  requestedLateMinutes: number
  status: RequestStatus
  decisionReason?: string
}

const initialRequests: AttendanceRequest[] = [
  {
    id: "1",
    code: "AR-2026-001",
    employee: "Rizky Pratama",
    initials: "RP",
    site: "Site Bandung",
    workDate: "12 Okt 2026",
    requestedAt: "12 Okt 2026, 09.15",
    type: "Koreksi jam check-in",
    currentTime: "08.42 WIB",
    requestedTime: "08.05 WIB",
    reason:
      "Jam check-in yang tercatat tidak sesuai dengan waktu kedatangan. Saya melampirkan bukti pendukung untuk diperiksa.",
    evidence: ["Bukti kedatangan.jpg"],
    currentLateMinutes: 42,
    requestedLateMinutes: 5,
    status: "PENDING",
  },
]

const statusLabels: Record<RequestStatus, string> = {
  PENDING: "Menunggu",
  APPROVED: "Diterima",
  REJECTED: "Ditolak",
}

function StatusBadge({ status }: { status: RequestStatus }) {
  const styles: Record<RequestStatus, string> = {
    PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
    APPROVED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    REJECTED: "bg-rose-50 text-rose-700 ring-rose-200",
  }

  const Icon = {
    PENDING: Clock3,
    APPROVED: CheckCircle2,
    REJECTED: XCircle,
  }[status]

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles[status]}`}
    >
      <Icon className="size-3.5" />
      {statusLabels[status]}
    </span>
  )
}

export default function AttendanceRequests() {
  const [requests, setRequests] = useState(initialRequests)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [siteFilter, setSiteFilter] = useState("ALL")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [decision, setDecision] = useState<Decision | null>(null)
  const [decisionReason, setDecisionReason] = useState("")
  const [error, setError] = useState("")

  const selectedRequest =
    requests.find((request) => request.id === selectedId) ?? null

  const filteredRequests = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return requests.filter((request) => {
      const matchesSearch =
        !keyword ||
        request.employee.toLowerCase().includes(keyword) ||
        request.code.toLowerCase().includes(keyword)

      const matchesStatus =
        statusFilter === "ALL" || request.status === statusFilter

      const matchesSite =
        siteFilter === "ALL" || request.site === siteFilter

      return matchesSearch && matchesStatus && matchesSite
    })
  }, [requests, search, statusFilter, siteFilter])

  const pendingCount = requests.filter(
    (request) => request.status === "PENDING",
  ).length

  const approvedCount = requests.filter(
    (request) => request.status === "APPROVED",
  ).length

  const rejectedCount = requests.filter(
    (request) => request.status === "REJECTED",
  ).length

  function openDecision(nextDecision: Decision) {
    if (!selectedRequest || selectedRequest.status !== "PENDING") return

    setDecision(nextDecision)
    setDecisionReason("")
    setError("")
  }

  function submitDecision() {
    if (!selectedRequest || !decision) return

    const reason = decisionReason.trim()

    if (!reason) {
      setError("Alasan keputusan wajib diisi.")
      return
    }

    const confirmed = window.confirm(
      `Yakin ingin ${
        decision === "approve" ? "menerima" : "menolak"
      } pengajuan ${selectedRequest.code}?`,
    )

    if (!confirmed) return

    setRequests((current) =>
      current.map((request) =>
        request.id === selectedRequest.id
          ? {
              ...request,
              status:
                decision === "approve" ? "APPROVED" : "REJECTED",
              decisionReason: reason,
            }
          : request,
      ),
    )

    setDecision(null)
    setDecisionReason("")
    setError("")
    setSelectedId(null)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <ShieldCheck className="size-4" />
            Supervisor Workspace
            <span>/</span>
            Attendance
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Pengajuan Absensi
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Periksa bukti dan tinjau perubahan data kehadiran EOS.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700">
          <MapPin className="size-4" />
          Semua site aktif
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: "Total pengajuan",
            value: requests.length,
            icon: FileText,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Menunggu review",
            value: pendingCount,
            icon: Clock3,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "Diterima",
            value: approvedCount,
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Ditolak",
            value: rejectedCount,
            icon: XCircle,
            color: "text-rose-600",
            bg: "bg-rose-50",
          },
        ].map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-500 sm:text-sm">
                  {item.label}
                </span>
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${item.bg} ${item.color}`}
                >
                  <Icon className="size-4" />
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-950">
                {item.value}
              </p>
            </div>
          )
        })}
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Daftar pengajuan
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Waktu menggunakan zona waktu site masing-masing.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="relative sm:col-span-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari EOS atau nomor..."
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="ALL">Semua status</option>
                <option value="PENDING">Menunggu</option>
                <option value="APPROVED">Diterima</option>
                <option value="REJECTED">Ditolak</option>
              </select>

              <select
                value={siteFilter}
                onChange={(event) => setSiteFilter(event.target.value)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="ALL">Semua site</option>
                <option value="Site Bandung">Site Bandung</option>
                <option value="Site Cikarang">Site Cikarang</option>
                <option value="Site Jakarta">Site Jakarta</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">EOS</th>
                <th className="px-5 py-3 font-semibold">Site / tanggal</th>
                <th className="px-5 py-3 font-semibold">Jenis perubahan</th>
                <th className="px-5 py-3 font-semibold">Evidence</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">
                  Detail
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  className="transition hover:bg-slate-50/80"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
                        {request.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">
                          {request.employee}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {request.code}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-700">
                      {request.site}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {request.workDate}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {request.type}
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-slate-600">
                      <FileText className="size-4 text-blue-500" />
                      {request.evidence.length} lampiran
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={request.status} />
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedId(request.id)
                        setDecision(null)
                        setError("")
                      }}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                      Tinjau
                    </button>
                  </td>
                </tr>
              ))}

              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100">
                      <Search className="size-5 text-slate-400" />
                    </div>
                    <p className="mt-3 font-medium text-slate-700">
                      Pengajuan tidak ditemukan
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Coba ubah kata kunci atau filter yang digunakan.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-200 px-5 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Menampilkan {filteredRequests.length} dari {requests.length} pengajuan
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ArrowDownUp className="size-3.5" />
            Data preview
          </span>
        </div>
      </section>

      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
        <AlertCircle className="mt-0.5 size-5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">Mode preview frontend</p>
          <p className="mt-1 text-xs leading-5 text-amber-800">
            Data contoh dan keputusan di halaman ini hanya disimpan sementara
            di state aplikasi. Belum ada perubahan attendance yang tersimpan
            ke server atau audit trail backend.
          </p>
        </div>
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-5">
          <section className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
            <header className="flex items-start justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Review absensi
                </p>
                <h2 className="mt-1 text-lg font-bold text-slate-950">
                  {selectedRequest.code}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Diajukan {selectedRequest.requestedAt}
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedId(null)
                  setDecision(null)
                }}
                aria-label="Tutup detail"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="size-5" />
              </button>
            </header>

            <div className="space-y-5 overflow-y-auto p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-700">
                    {selectedRequest.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {selectedRequest.employee}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {selectedRequest.site}
                    </p>
                  </div>
                </div>
                <StatusBadge status={selectedRequest.status} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    <CalendarDays className="mr-1 inline size-4" />
                    Tanggal kerja
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    {selectedRequest.workDate}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {selectedRequest.type}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    <Clock3 className="mr-1 inline size-4" />
                    Perbandingan jam
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs text-slate-500">Tercatat</p>
                      <p className="mt-1 font-semibold text-rose-600">
                        {selectedRequest.currentTime}
                      </p>
                    </div>
                    <ArrowDownUp className="size-4 text-slate-400" />
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Diminta</p>
                      <p className="mt-1 font-semibold text-emerald-700">
                        {selectedRequest.requestedTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Alasan pengajuan EOS
                </h3>
                <p className="mt-2 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                  {selectedRequest.reason}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Lampiran pendukung
                </h3>
                <div className="mt-2 space-y-2">
                  {selectedRequest.evidence.map((file) => (
                    <div
                      key={file}
                      className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"
                    >
                      <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <FileText className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-800">
                          {file}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Nama contoh — file belum terhubung
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Dampak potensial keterlambatan
                </h3>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">
                      Berdasarkan data saat ini
                    </p>
                    <p className="mt-1 text-xl font-bold text-slate-900">
                      {selectedRequest.currentLateMinutes} menit
                    </p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-3">
                    <p className="text-xs text-blue-700">
                      Jika disetujui
                    </p>
                    <p className="mt-1 text-xl font-bold text-blue-800">
                      {selectedRequest.requestedLateMinutes} menit
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Ini simulasi dampak dari data contoh, bukan perhitungan
                  periode resmi. Agregat keterlambatan harus dihitung ulang
                  oleh backend setelah keputusan disetujui.
                </p>
              </div>

              {selectedRequest.decisionReason && (
                <div className="rounded-xl border border-slate-200 p-4">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Catatan keputusan sebelumnya
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {selectedRequest.decisionReason}
                  </p>
                </div>
              )}

              {selectedRequest.status === "PENDING" && (
                <div className="space-y-3 rounded-xl border border-slate-200 p-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Keputusan Supervisor
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Pilih tindakan dan isi alasan keputusan.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => openDecision("approve")}
                      className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                        decision === "approve"
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      }`}
                    >
                      <Check className="size-4" />
                      Terima
                    </button>
                    <button
                      onClick={() => openDecision("reject")}
                      className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                        decision === "reject"
                          ? "border-rose-600 bg-rose-600 text-white"
                          : "border-rose-200 text-rose-700 hover:bg-rose-50"
                      }`}
                    >
                      <X className="size-4" />
                      Tolak
                    </button>
                  </div>

                  {decision && (
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-700">
                        Alasan keputusan
                        <textarea
                          value={decisionReason}
                          onChange={(event) => {
                            setDecisionReason(event.target.value)
                            setError("")
                          }}
                          rows={3}
                          placeholder={
                            decision === "approve"
                              ? "Jelaskan dasar persetujuan..."
                              : "Jelaskan alasan penolakan..."
                          }
                          className="mt-2 w-full resize-y rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      </label>

                      {error && (
                        <p className="text-sm text-rose-600">{error}</p>
                      )}

                      <button
                        onClick={submitDecision}
                        className={`w-full rounded-lg px-4 py-3 text-sm font-semibold text-white transition ${
                          decision === "approve"
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : "bg-rose-600 hover:bg-rose-700"
                        }`}
                      >
                        Konfirmasi {decision === "approve" ? "Terima" : "Tolak"}
                      </button>

                      <p className="text-xs leading-5 text-slate-500">
                        Preview saja. Pada integrasi backend, keputusan harus
                        divalidasi server, disimpan secara transaksional, dan
                        dicatat ke audit trail.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                <UserRound className="mt-0.5 size-4 shrink-0" />
                Data EOS dan evidence di halaman ini masih contoh. File
                lampiran belum bisa dibuka sampai API dan penyimpanan file
                dihubungkan.
              </div>
            </div>

            <footer className="border-t border-slate-200 p-4 sm:px-6">
              <button
                onClick={() => {
                  setSelectedId(null)
                  setDecision(null)
                }}
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Tutup detail
              </button>
            </footer>
          </section>
        </div>
      )}
    </div>
  )
}
