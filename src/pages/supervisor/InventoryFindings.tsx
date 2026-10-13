
import { useMemo, useState } from "react"
import {
  AlertCircle,
  AlertTriangle,
  ArrowDownUp,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Package,
  Search,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react"

type FindingStatus = "OPEN" | "IN_REVIEW" | "RESOLVED" | "REJECTED"

type FindingType =
  | "ASSET_DAMAGED"
  | "ASSET_MISSING"
  | "ASSET_DATA_MISMATCH"
  | "STOCK_LOW"
  | "STOCK_DAMAGED"
  | "ASSET_REGISTRATION_NEEDED"
  | "OTHER"

type Finding = {
  id: string
  code: string
  title: string
  type: FindingType
  description: string
  site: string
  reporter: string
  assetCode: string
  createdAt: string
  status: FindingStatus
  evidence: string[]
  decisionReason?: string
  history: {
    action: string
    actor: string
    date: string
    note: string
  }[]
}

type Decision = "resolve" | "reject"

const initialFindings: Finding[] = [
  {
    id: "1",
    code: "IF-2026-001",
    title: "Access Point mengalami kerusakan",
    type: "ASSET_DAMAGED",
    description:
      "Access Point di ruang jaringan tidak menyala setelah dilakukan pengecekan. Perangkat perlu diperiksa lebih lanjut sebelum digunakan kembali.",
    site: "Site Bandung",
    reporter: "Rizky Pratama",
    assetCode: "CMX-BDG-NET-001",
    createdAt: "12 Okt 2026, 08.15",
    status: "OPEN",
    evidence: ["Foto perangkat.jpg", "Foto indikator perangkat.jpg"],
    history: [
      {
        action: "Temuan dibuat",
        actor: "Rizky Pratama",
        date: "12 Okt 2026, 08.15",
        note: "Temuan dilaporkan beserta bukti pendukung.",
      },
    ],
  },
  {
    id: "2",
    code: "IF-2026-002",
    title: "Stok kabel LAN menipis",
    type: "STOCK_LOW",
    description:
      "Persediaan kabel LAN tersisa sedikit dan perlu diperiksa untuk mendukung kebutuhan operasional.",
    site: "Site Cikarang",
    reporter: "Dimas Saputra",
    assetCode: "STK-LAN-001",
    createdAt: "11 Okt 2026, 10.30",
    status: "IN_REVIEW",
    evidence: ["Foto stok kabel.jpg"],
    history: [
      {
        action: "Temuan dibuat",
        actor: "Dimas Saputra",
        date: "11 Okt 2026, 10.30",
        note: "EOS melaporkan stok material menipis.",
      },
      {
        action: "Review dimulai",
        actor: "Supervisor",
        date: "11 Okt 2026, 11.00",
        note: "Temuan sedang diperiksa.",
      },
    ],
  },
  {
    id: "3",
    code: "IF-2026-003",
    title: "Data perangkat tidak sesuai",
    type: "ASSET_DATA_MISMATCH",
    description:
      "Label aset pada perangkat berbeda dengan data yang tercatat pada daftar inventaris.",
    site: "Site Jakarta",
    reporter: "Nadia Putri",
    assetCode: "CMX-JKT-NET-014",
    createdAt: "10 Okt 2026, 09.20",
    status: "RESOLVED",
    evidence: ["Foto label aset.jpg"],
    decisionReason: "Hasil pemeriksaan sudah dicatat dan diverifikasi.",
    history: [
      {
        action: "Temuan dibuat",
        actor: "Nadia Putri",
        date: "10 Okt 2026, 09.20",
        note: "Perbedaan label aset dilaporkan.",
      },
      {
        action: "Temuan diselesaikan",
        actor: "Supervisor",
        date: "10 Okt 2026, 13.20",
        note: "Hasil pemeriksaan sudah diverifikasi.",
      },
    ],
  },
  {
    id: "4",
    code: "IF-2026-004",
    title: "Perangkat belum terdaftar",
    type: "ASSET_REGISTRATION_NEEDED",
    description:
      "Ditemukan perangkat jaringan di lokasi kerja yang belum memiliki pencatatan inventaris.",
    site: "Site Bali",
    reporter: "Fajar Nugraha",
    assetCode: "Belum tersedia",
    createdAt: "09 Okt 2026, 14.10",
    status: "OPEN",
    evidence: ["Foto perangkat.jpg"],
    history: [
      {
        action: "Temuan dibuat",
        actor: "Fajar Nugraha",
        date: "09 Okt 2026, 14.10",
        note: "Perangkat diajukan untuk diverifikasi.",
      },
    ],
  },
]

const statusLabels: Record<FindingStatus, string> = {
  OPEN: "Terbuka",
  IN_REVIEW: "Dalam review",
  RESOLVED: "Selesai",
  REJECTED: "Ditolak",
}

const typeLabels: Record<FindingType, string> = {
  ASSET_DAMAGED: "Aset rusak",
  ASSET_MISSING: "Aset hilang",
  ASSET_DATA_MISMATCH: "Data aset tidak sesuai",
  STOCK_LOW: "Stok menipis",
  STOCK_DAMAGED: "Stok rusak",
  ASSET_REGISTRATION_NEEDED: "Aset belum terdaftar",
  OTHER: "Lainnya",
}

function StatusBadge({ status }: { status: FindingStatus }) {
  const styles: Record<FindingStatus, string> = {
    OPEN: "bg-amber-50 text-amber-700 ring-amber-200",
    IN_REVIEW: "bg-blue-50 text-blue-700 ring-blue-200",
    RESOLVED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    REJECTED: "bg-rose-50 text-rose-700 ring-rose-200",
  }

  const Icon = {
    OPEN: Clock3,
    IN_REVIEW: AlertCircle,
    RESOLVED: CheckCircle2,
    REJECTED: XCircle,
  }[status]

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles[status]}`}
    >
      <Icon className="size-3.5" />
      {statusLabels[status]}
    </span>
  )
}

export default function InventoryFindings() {
  const [findings, setFindings] = useState(initialFindings)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [siteFilter, setSiteFilter] = useState("ALL")
  const [typeFilter, setTypeFilter] = useState("ALL")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [decision, setDecision] = useState<Decision | null>(null)
  const [decisionReason, setDecisionReason] = useState("")
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")

  const selectedFinding =
    findings.find((finding) => finding.id === selectedId) ?? null

  const filteredFindings = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return findings.filter((finding) => {
      const matchesSearch =
        !keyword ||
        finding.code.toLowerCase().includes(keyword) ||
        finding.title.toLowerCase().includes(keyword) ||
        finding.reporter.toLowerCase().includes(keyword) ||
        finding.assetCode.toLowerCase().includes(keyword)

      const matchesStatus =
        statusFilter === "ALL" || finding.status === statusFilter

      const matchesSite =
        siteFilter === "ALL" || finding.site === siteFilter

      const matchesType =
        typeFilter === "ALL" || finding.type === typeFilter

      return matchesSearch && matchesStatus && matchesSite && matchesType
    })
  }, [findings, search, statusFilter, siteFilter, typeFilter])

  const openCount = findings.filter(
    (finding) => finding.status === "OPEN",
  ).length

  const reviewCount = findings.filter(
    (finding) => finding.status === "IN_REVIEW",
  ).length

  const resolvedCount = findings.filter(
    (finding) => finding.status === "RESOLVED",
  ).length

  const rejectedCount = findings.filter(
    (finding) => finding.status === "REJECTED",
  ).length

  function openFinding(id: string) {
    setSelectedId(id)
    setDecision(null)
    setDecisionReason("")
    setError("")
    setNotice("")
  }

  function startReview() {
    if (!selectedFinding || selectedFinding.status !== "OPEN") return

    const confirmed = window.confirm(
      `Mulai review untuk ${selectedFinding.code}?`,
    )

    if (!confirmed) return

    const now = new Date().toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    })

    setFindings((current) =>
      current.map((finding) =>
        finding.id === selectedFinding.id
          ? {
              ...finding,
              status: "IN_REVIEW",
              history: [
                ...finding.history,
                {
                  action: "Review dimulai",
                  actor: "Supervisor",
                  date: now,
                  note: "Temuan mulai ditinjau oleh Supervisor.",
                },
              ],
            }
          : finding,
      ),
    )

    setNotice("Review dimulai. Status diperbarui di preview lokal.")
  }

  function openDecision(nextDecision: Decision) {
    if (!selectedFinding || selectedFinding.status !== "IN_REVIEW") return

    setDecision(nextDecision)
    setDecisionReason("")
    setError("")
    setNotice("")
  }

  function submitDecision() {
    if (!selectedFinding || !decision) return

    const reason = decisionReason.trim()

    if (!reason) {
      setError("Catatan keputusan wajib diisi.")
      return
    }

    if (reason.length < 5) {
      setError("Catatan keputusan minimal 5 karakter.")
      return
    }

    const confirmed = window.confirm(
      `Yakin ingin ${
        decision === "resolve" ? "menyelesaikan" : "menolak"
      } temuan ${selectedFinding.code}?`,
    )

    if (!confirmed) return

    const now = new Date().toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    })

    const nextStatus: FindingStatus =
      decision === "resolve" ? "RESOLVED" : "REJECTED"

    const action =
      decision === "resolve" ? "Temuan diselesaikan" : "Temuan ditolak"

    setFindings((current) =>
      current.map((finding) =>
        finding.id === selectedFinding.id
          ? {
              ...finding,
              status: nextStatus,
              decisionReason: reason,
              history: [
                ...finding.history,
                {
                  action,
                  actor: "Supervisor",
                  date: now,
                  note: reason,
                },
              ],
            }
          : finding,
      ),
    )

    setDecision(null)
    setDecisionReason("")
    setError("")
    setNotice(
      `${action}. Perubahan hanya tersimpan sementara di preview frontend.`,
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <ShieldCheck className="size-4" />
            Supervisor Workspace
            <span>/</span>
            Inventory Finding
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Inventory Finding
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Tinjau temuan inventaris, periksa evidence, dan tindak lanjuti
            laporan dari EOS.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700">
          <MapPin className="size-4" />
          Semua site
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: "Total temuan",
            value: findings.length,
            icon: FileText,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Temuan terbuka",
            value: openCount,
            icon: AlertTriangle,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "Dalam review",
            value: reviewCount,
            icon: Clock3,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            label: "Selesai",
            value: resolvedCount,
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
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
          <div className="flex flex-col gap-4">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Daftar temuan
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Periksa detail dan evidence sebelum mengambil keputusan.
                </p>
              </div>

              <span className="flex w-fit items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">
                <ArrowDownUp className="size-3.5" />
                {filteredFindings.length} temuan
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari kode, aset, pelapor..."
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="ALL">Semua status</option>
                <option value="OPEN">Terbuka</option>
                <option value="IN_REVIEW">Dalam review</option>
                <option value="RESOLVED">Selesai</option>
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
                <option value="Site Bali">Site Bali</option>
              </select>

              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="ALL">Semua jenis temuan</option>
                {Object.entries(typeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Temuan</th>
                <th className="px-5 py-3 font-semibold">Site</th>
                <th className="px-5 py-3 font-semibold">Jenis</th>
                <th className="px-5 py-3 font-semibold">Pelapor</th>
                <th className="px-5 py-3 font-semibold">Evidence</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Detail</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredFindings.map((finding) => (
                <tr
                  key={finding.id}
                  className="transition hover:bg-slate-50/80"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                        <Package className="size-5" />
                      </div>
                      <div className="max-w-[260px]">
                        <p className="font-semibold text-slate-800">
                          {finding.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {finding.code}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {finding.assetCode}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-700">{finding.site}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {finding.createdAt}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {typeLabels[finding.type]}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {finding.reporter}
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-slate-600">
                      <FileText className="size-4 text-blue-500" />
                      {finding.evidence.length} lampiran
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={finding.status} />
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => openFinding(finding.id)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                      Tinjau
                    </button>
                  </td>
                </tr>
              ))}

              {filteredFindings.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100">
                      <Search className="size-5 text-slate-400" />
                    </div>
                    <p className="mt-3 font-medium text-slate-700">
                      Temuan tidak ditemukan
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
            Menampilkan {filteredFindings.length} dari {findings.length} temuan
          </span>
          <span>{rejectedCount} temuan ditolak</span>
        </div>
      </section>

      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
        <AlertCircle className="mt-0.5 size-5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">Mode preview frontend</p>
          <p className="mt-1 text-xs leading-5 text-amber-800">
            Data dan keputusan masih menggunakan state lokal. Belum tersimpan
            ke backend dan belum mengubah data aset maupun stok.
          </p>
        </div>
      </div>

      {selectedFinding && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-5">
          <section className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
            <header className="flex items-start justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Detail Inventory Finding
                </p>
                <h2 className="mt-1 text-lg font-bold text-slate-950">
                  {selectedFinding.code}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Dilaporkan {selectedFinding.createdAt}
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
              {notice && (
                <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                  {notice}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedFinding.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {typeLabels[selectedFinding.type]}
                  </p>
                </div>
                <StatusBadge status={selectedFinding.status} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    <MapPin className="mr-1 inline size-4" />
                    Lokasi site
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    {selectedFinding.site}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    <Package className="mr-1 inline size-4" />
                    Kode aset / stok
                  </p>
                  <p className="mt-2 break-all font-semibold text-slate-900">
                    {selectedFinding.assetCode}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Deskripsi temuan
                </h3>
                <p className="mt-2 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                  {selectedFinding.description}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Evidence pendukung
                  </h3>
                  <span className="text-xs text-slate-500">
                    {selectedFinding.evidence.length} lampiran
                  </span>
                </div>

                <div className="mt-2 space-y-2">
                  {selectedFinding.evidence.map((file, index) => (
                    <div
                      key={`${file}-${index}`}
                      className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <FileText className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-800">
                          {file}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Referensi lampiran dummy
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Riwayat temuan
                </h3>
                <div className="mt-3 space-y-4">
                  {selectedFinding.history.map((item, index) => (
                    <div key={`${item.action}-${index}`} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                          {index === 0 ? (
                            <FileText className="size-4" />
                          ) : (
                            <Clock3 className="size-4" />
                          )}
                        </span>
                        {index < selectedFinding.history.length - 1 && (
                          <span className="mt-1 h-full w-px bg-slate-200" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1 pb-2">
                        <p className="text-sm font-semibold text-slate-800">
                          {item.action}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {item.actor} · {item.date}
                        </p>
                        <p className="mt-2 text-sm leading-5 text-slate-600">
                          {item.note}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedFinding.decisionReason && (
                <div className="rounded-xl border border-slate-200 p-4">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Catatan keputusan
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {selectedFinding.decisionReason}
                  </p>
                </div>
              )}

              {selectedFinding.status === "OPEN" && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <h3 className="text-sm font-semibold text-blue-900">
                    Mulai pemeriksaan
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-blue-800">
                    Tandai temuan sedang ditinjau sebelum memberikan keputusan.
                  </p>
                  <button
                    onClick={startReview}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    <ShieldCheck className="size-4" />
                    Mulai review
                  </button>
                </div>
              )}

              {selectedFinding.status === "IN_REVIEW" && (
                <div className="space-y-3 rounded-xl border border-slate-200 p-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Keputusan Supervisor
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Isi catatan yang menjelaskan dasar keputusan.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => openDecision("resolve")}
                      className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                        decision === "resolve"
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      }`}
                    >
                      <Check className="size-4" />
                      Selesaikan
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
                      Tolak temuan
                    </button>
                  </div>

                  {decision && (
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-700">
                        Catatan keputusan
                        <textarea
                          value={decisionReason}
                          onChange={(event) => {
                            setDecisionReason(event.target.value)
                            setError("")
                          }}
                          rows={3}
                          placeholder={
                            decision === "resolve"
                              ? "Jelaskan hasil pemeriksaan dan tindak lanjut..."
                              : "Jelaskan alasan temuan ditolak..."
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
                          decision === "resolve"
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : "bg-rose-600 hover:bg-rose-700"
                        }`}
                      >
                        Konfirmasi{" "}
                        {decision === "resolve" ? "Penyelesaian" : "Penolakan"}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {(selectedFinding.status === "RESOLVED" ||
                selectedFinding.status === "REJECTED") && (
                <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                  Temuan ini sudah memiliki keputusan. Tindakan lanjutan tidak
                  tersedia di preview ini.
                </div>
              )}

              <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                Aksi ini masih lokal. Saat backend diintegrasikan, keputusan
                perlu dikirim melalui API Supervisor beserta alasan, otorisasi,
                dan audit trail. Penyelesaian temuan tidak otomatis mengubah
                data aset atau stok.
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
