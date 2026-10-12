
import { useMemo, useState } from "react"
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react"

type AssignmentStatus = "ACTIVE" | "ENDED" | "CANCELLED"

type Assignment = {
  id: string
  employee: string
  email: string
  site: string
  startsOn: string
  endsOn: string | null
  status: AssignmentStatus
  endReason?: string
}

const initialAssignments: Assignment[] = [
  {
    id: "ASN-001",
    employee: "Akbar",
    email: "Akbar.eos@example.com",
    site: "Site Bandung",
    startsOn: "2026-09-01",
    endsOn: null,
    status: "ACTIVE",
  },
  {
    id: "ASN-002",
    employee: "Dimas Saputra",
    email: "dimas.eos@example.com",
    site: "Site Cikarang",
    startsOn: "2026-09-05",
    endsOn: null,
    status: "ACTIVE",
  },
  {
    id: "ASN-003",
    employee: "Fajar Ramadhan",
    email: "fajar.eos@example.com",
    site: "Site Jakarta",
    startsOn: "2026-08-01",
    endsOn: null,
    status: "ACTIVE",
  },
  {
    id: "ASN-004",
    employee: "Andi Setiawan",
    email: "andi.eos@example.com",
    site: "Site Bandung",
    startsOn: "2026-06-01",
    endsOn: "2026-08-31",
    status: "ENDED",
    endReason: "Masa penugasan sebelumnya berakhir.",
  },
]

const sites = [
  "Site Bandung",
  "Site Cikarang",
  "Site Jakarta",
  "Site Bali",
]

const statusLabels: Record<AssignmentStatus, string> = {
  ACTIVE: "Aktif",
  ENDED: "Berakhir",
  CANCELLED: "Dibatalkan",
}

function formatDate(value: string | null) {
  if (!value) return "—"

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`))
}

function StatusBadge({ status }: { status: AssignmentStatus }) {
  const styles: Record<AssignmentStatus, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    ENDED: "bg-slate-100 text-slate-600 ring-slate-200",
    CANCELLED: "bg-rose-50 text-rose-700 ring-rose-200",
  }

  const Icon = {
    ACTIVE: CheckCircle2,
    ENDED: Clock3,
    CANCELLED: X,
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

export default function Assignments() {
  const [assignments, setAssignments] = useState(initialAssignments)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [siteFilter, setSiteFilter] = useState("ALL")
  const [showCreate, setShowCreate] = useState(false)
  const [endingAssignment, setEndingAssignment] =
    useState<Assignment | null>(null)

  const [employee, setEmployee] = useState("")
  const [site, setSite] = useState("")
  const [startsOn, setStartsOn] = useState("")
  const [endsOn, setEndsOn] = useState("")
  const [endReason, setEndReason] = useState("")
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")

  const activeCount = assignments.filter(
    (item) => item.status === "ACTIVE",
  ).length

  const endedCount = assignments.filter(
    (item) => item.status === "ENDED",
  ).length

  const filteredAssignments = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return assignments.filter((item) => {
      const matchesSearch =
        !keyword ||
        item.employee.toLowerCase().includes(keyword) ||
        item.email.toLowerCase().includes(keyword) ||
        item.id.toLowerCase().includes(keyword)

      const matchesStatus =
        statusFilter === "ALL" || item.status === statusFilter

      const matchesSite =
        siteFilter === "ALL" || item.site === siteFilter

      return matchesSearch && matchesStatus && matchesSite
    })
  }, [assignments, search, statusFilter, siteFilter])

  function resetCreateForm() {
    setEmployee("")
    setSite("")
    setStartsOn("")
    setEndsOn("")
    setError("")
  }

  function createAssignment() {
    setError("")
    setNotice("")

    const name = employee.trim()

    if (!name || !site || !startsOn) {
      setError("Nama EOS, site, dan tanggal mulai wajib diisi.")
      return
    }

    if (endsOn && endsOn < startsOn) {
      setError("Tanggal akhir tidak boleh sebelum tanggal mulai.")
      return
    }

    const conflict = assignments.some((item) => {
      if (
        item.employee.toLowerCase() !== name.toLowerCase() ||
        item.status !== "ACTIVE"
      ) {
        return false
      }

      const existingEndsOn = item.endsOn ?? "9999-12-31"
      const newEndsOn = endsOn || "9999-12-31"

      return startsOn <= existingEndsOn && newEndsOn >= item.startsOn
    })

    if (conflict) {
      setError(
        "EOS ini sudah memiliki assignment aktif pada periode tersebut. Akhiri penugasan sebelumnya atau pilih tanggal lain.",
      )
      return
    }

    const newAssignment: Assignment = {
      id: `ASN-${String(Date.now()).slice(-6)}`,
      employee: name,
      email: "Belum tersedia",
      site,
      startsOn,
      endsOn: endsOn || null,
      status: endsOn ? "ENDED" : "ACTIVE",
      endReason: endsOn
        ? "Tanggal akhir ditentukan saat membuat assignment."
        : undefined,
    }

    setAssignments((current) => [newAssignment, ...current])
    setShowCreate(false)
    resetCreateForm()
    setNotice("Assignment ditambahkan ke preview lokal.")
  }

  function endAssignment() {
    if (!endingAssignment) return

    const reason = endReason.trim()

    if (!reason) {
      setError("Alasan pengakhiran wajib diisi.")
      return
    }

    const confirmed = window.confirm(
      `Akhiri assignment ${endingAssignment.id} untuk ${endingAssignment.employee}?`,
    )

    if (!confirmed) return

    const today = new Date()
    const localDate = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-")

    setAssignments((current) =>
      current.map((item) =>
        item.id === endingAssignment.id
          ? {
              ...item,
              status: "ENDED",
              endsOn: localDate < item.startsOn ? item.startsOn : localDate,
              endReason: reason,
            }
          : item,
      ),
    )

    setEndingAssignment(null)
    setEndReason("")
    setError("")
    setNotice("Assignment diakhiri pada preview lokal.")
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <ShieldCheck className="size-4" />
            Supervisor Workspace
            <span>/</span>
            Master Data
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Penugasan EOS
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Kelola penempatan Engineer On Site ke setiap site operasional.
          </p>
        </div>

        <button
          onClick={() => {
            resetCreateForm()
            setNotice("")
            setShowCreate(true)
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus className="size-4" />
          Tambah assignment
        </button>
      </div>

      {notice && (
        <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          <p>{notice}</p>
          <button
            onClick={() => setNotice("")}
            className="ml-auto rounded p-1 hover:bg-emerald-100"
            aria-label="Tutup pemberitahuan"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Total assignment
            </p>
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <UserRound className="size-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-950">
            {assignments.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Seluruh riwayat penugasan
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Assignment aktif
            </p>
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="size-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-950">
            {activeCount}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Penugasan yang masih berjalan
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Berakhir
            </p>
            <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Clock3 className="size-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-950">
            {endedCount}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Riwayat yang telah selesai
          </p>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Daftar penugasan
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Periksa EOS, site, periode, dan status assignment.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari EOS atau ID..."
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <select
                value={siteFilter}
                onChange={(event) => setSiteFilter(event.target.value)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="ALL">Semua site</option>
                {sites.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="ALL">Semua status</option>
                <option value="ACTIVE">Aktif</option>
                <option value="ENDED">Berakhir</option>
                <option value="CANCELLED">Dibatalkan</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">EOS</th>
                <th className="px-5 py-3 font-semibold">Site</th>
                <th className="px-5 py-3 font-semibold">Tanggal mulai</th>
                <th className="px-5 py-3 font-semibold">Tanggal akhir</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">
                  Tindakan
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredAssignments.map((item) => (
                <tr key={item.id} className="transition hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-700">
                        {item.employee
                          .split(" ")
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">
                          {item.employee}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {item.email}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {item.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-slate-700">
                      <MapPin className="size-4 text-slate-400" />
                      {item.site}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="size-4 text-slate-400" />
                      {formatDate(item.startsOn)}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {formatDate(item.endsOn)}
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={item.status} />
                  </td>

                  <td className="px-5 py-4 text-right">
                    {item.status === "ACTIVE" ? (
                      <button
                        onClick={() => {
                          setEndingAssignment(item)
                          setEndReason("")
                          setError("")
                          setNotice("")
                        }}
                        className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
                      >
                        Akhiri
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">
                        Riwayat
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {filteredAssignments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center">
                    <Search className="mx-auto size-8 text-slate-300" />
                    <p className="mt-3 font-semibold text-slate-700">
                      Penugasan tidak ditemukan
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Coba ubah pencarian atau filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-200 px-5 py-3 text-xs text-slate-500">
          Menampilkan {filteredAssignments.length} dari {assignments.length} assignment · Data preview
        </div>
      </section>

      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
        <AlertCircle className="mt-0.5 size-5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">Mode preview frontend</p>
          <p className="mt-1 text-xs leading-5 text-amber-800">
            Data penugasan masih contoh dan perubahan hanya berada di state
            halaman. Data EOS dan site harus diambil dari API saat backend
            siap. Validasi konflik di frontend ini bukan pengganti validasi
            dan transaksi di server.
          </p>
        </div>
      </div>

      {(showCreate || endingAssignment) && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-5">
          <section className="w-full max-w-lg overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
            <header className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  {showCreate ? "Tambah assignment" : "Akhiri assignment"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {showCreate
                    ? "Isi detail penempatan EOS."
                    : `${endingAssignment?.employee} · ${endingAssignment?.site}`}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCreate(false)
                  setEndingAssignment(null)
                  setError("")
                }}
                aria-label="Tutup form"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="size-5" />
              </button>
            </header>

            <div className="space-y-4 p-5">
              {showCreate ? (
                <>
                  <label className="block text-sm font-medium text-slate-700">
                    Nama EOS
                    <input
                      value={employee}
                      onChange={(event) => setEmployee(event.target.value)}
                      placeholder="Masukkan nama EOS"
                      className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </label>

                  <label className="block text-sm font-medium text-slate-700">
                    Site aktif
                    <select
                      value={site}
                      onChange={(event) => setSite(event.target.value)}
                      className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
                    >
                      <option value="">Pilih site</option>
                      {sites.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Tanggal mulai
                      <input
                        type="date"
                        value={startsOn}
                        onChange={(event) => setStartsOn(event.target.value)}
                        className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                      />
                    </label>

                    <label className="block text-sm font-medium text-slate-700">
                      Tanggal akhir
                      <input
                        type="date"
                        min={startsOn || undefined}
                        value={endsOn}
                        onChange={(event) => setEndsOn(event.target.value)}
                        className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                      />
                      <span className="mt-1 block text-xs font-normal text-slate-500">
                        Kosongkan untuk penugasan aktif tanpa tanggal akhir.
                      </span>
                    </label>
                  </div>

                  <div className="rounded-lg bg-blue-50 p-3 text-xs leading-5 text-blue-800">
                    Sistem preview akan memeriksa apakah EOS sudah mempunyai
                    assignment aktif yang bertumpang tindih.
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">Assignment</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {endingAssignment?.id}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Mulai {formatDate(endingAssignment?.startsOn ?? null)}
                    </p>
                  </div>

                  <label className="block text-sm font-medium text-slate-700">
                    Alasan pengakhiran
                    <textarea
                      value={endReason}
                      onChange={(event) => {
                        setEndReason(event.target.value)
                        setError("")
                      }}
                      rows={4}
                      placeholder="Jelaskan alasan pengakhiran penugasan..."
                      className="mt-2 w-full resize-y rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </label>
                </>
              )}

              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  onClick={() => {
                    setShowCreate(false)
                    setEndingAssignment(null)
                    setError("")
                  }}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>

                <button
                  onClick={showCreate ? createAssignment : endAssignment}
                  className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-white ${
                    showCreate
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-rose-600 hover:bg-rose-700"
                  }`}
                >
                  {showCreate ? "Simpan preview" : "Konfirmasi pengakhiran"}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
