import { useMemo, useState } from "react"
import {
  AlertTriangle,
  Search,
  Eye,
  X,
  ClipboardList,
  CircleAlert,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  Filter,
} from "lucide-react"

type FindingSeverity = "Tinggi" | "Sedang" | "Rendah"
type FindingStatus = "Terbuka" | "Dalam Proses" | "Selesai"

type InventoryFinding = {
  id: string
  code: string
  title: string
  asset: string
  assetTag: string
  site: string
  category: string
  severity: FindingSeverity
  status: FindingStatus
  reportedBy: string
  reportedAt: string
  description: string
  followUp: string
}

const demoFindings: InventoryFinding[] = [
  {
    id: "1",
    code: "IF-001",
    title: "Perangkat tidak ditemukan",
    asset: "Access Point",
    assetTag: "AST-001",
    site: "Bandung",
    category: "Kehilangan Aset",
    severity: "Tinggi",
    status: "Terbuka",
    reportedBy: "Tim Engineer",
    reportedAt: "2026-10-12",
    description:
      "Perangkat tercatat dalam inventaris, tetapi belum ditemukan saat pemeriksaan lokasi.",
    followUp:
      "Menunggu verifikasi lokasi dan konfirmasi dari petugas site.",
  },
  {
    id: "2",
    code: "IF-002",
    title: "Kondisi perangkat menurun",
    asset: "Network Switch",
    assetTag: "AST-002",
    site: "Cikarang",
    category: "Kondisi Aset",
    severity: "Sedang",
    status: "Dalam Proses",
    reportedBy: "Supervisor Site",
    reportedAt: "2026-10-11",
    description:
      "Kondisi perangkat memerlukan pemeriksaan lebih lanjut berdasarkan laporan lapangan.",
    followUp:
      "Pemeriksaan teknis sedang ditindaklanjuti oleh tim terkait.",
  },
  {
    id: "3",
    code: "IF-003",
    title: "Jumlah stok tidak sesuai",
    asset: "Kabel LAN",
    assetTag: "STK-014",
    site: "Jakarta",
    category: "Selisih Stok",
    severity: "Sedang",
    status: "Terbuka",
    reportedBy: "Petugas Inventaris",
    reportedAt: "2026-10-10",
    description:
      "Jumlah fisik material berbeda dengan jumlah yang tercatat pada data inventaris.",
    followUp:
      "Menunggu rekonsiliasi antara stok fisik dan catatan inventaris.",
  },
  {
    id: "4",
    code: "IF-004",
    title: "Data aset perlu diverifikasi",
    asset: "UPS",
    assetTag: "AST-008",
    site: "Bandung",
    category: "Data Aset",
    severity: "Rendah",
    status: "Selesai",
    reportedBy: "Tim Engineer",
    reportedAt: "2026-10-08",
    description:
      "Informasi aset perlu dicocokkan dengan kondisi dan identitas perangkat di lokasi.",
    followUp:
      "Verifikasi telah diselesaikan berdasarkan data demo.",
  },
  {
    id: "5",
    code: "IF-005",
    title: "Material rusak",
    asset: "Konektor RJ45",
    assetTag: "STK-021",
    site: "Cikarang",
    category: "Kondisi Material",
    severity: "Tinggi",
    status: "Dalam Proses",
    reportedBy: "Petugas Inventaris",
    reportedAt: "2026-10-07",
    description:
      "Sejumlah material dilaporkan dalam kondisi yang perlu diperiksa sebelum digunakan.",
    followUp:
      "Menunggu hasil pemeriksaan material dan keputusan tim terkait.",
  },
]

const severityStyles: Record<FindingSeverity, string> = {
  Tinggi: "border-red-200 bg-red-50 text-red-700",
  Sedang: "border-amber-200 bg-amber-50 text-amber-700",
  Rendah: "border-blue-200 bg-blue-50 text-blue-700",
}

const statusStyles: Record<FindingStatus, string> = {
  Terbuka: "border-red-200 bg-red-50 text-red-700",
  "Dalam Proses": "border-amber-200 bg-amber-50 text-amber-700",
  Selesai: "border-emerald-200 bg-emerald-50 text-emerald-700",
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`))
}

export default function ManagerInventoryFindings() {
  const [search, setSearch] = useState("")
  const [siteFilter, setSiteFilter] = useState("Semua Site")
  const [severityFilter, setSeverityFilter] = useState("Semua Tingkat")
  const [statusFilter, setStatusFilter] = useState("Semua Status")
  const [selectedFinding, setSelectedFinding] =
    useState<InventoryFinding | null>(null)

  const sites = useMemo(
    () => ["Semua Site", ...new Set(demoFindings.map((item) => item.site))],
    [],
  )

  const filteredFindings = useMemo(() => {
    const keyword = search.toLowerCase().trim()

    return demoFindings.filter((item) => {
      const matchesSearch =
        !keyword ||
        [
          item.code,
          item.title,
          item.asset,
          item.assetTag,
          item.site,
          item.category,
        ].some((value) => value.toLowerCase().includes(keyword))

      const matchesSite =
        siteFilter === "Semua Site" || item.site === siteFilter

      const matchesSeverity =
        severityFilter === "Semua Tingkat" ||
        item.severity === severityFilter

      const matchesStatus =
        statusFilter === "Semua Status" || item.status === statusFilter

      return (
        matchesSearch &&
        matchesSite &&
        matchesSeverity &&
        matchesStatus
      )
    })
  }, [search, siteFilter, severityFilter, statusFilter])

  const openCount = demoFindings.filter(
    (item) => item.status === "Terbuka",
  ).length

  const progressCount = demoFindings.filter(
    (item) => item.status === "Dalam Proses",
  ).length

  const highSeverityCount = demoFindings.filter(
    (item) => item.severity === "Tinggi" && item.status !== "Selesai",
  ).length

  const completedCount = demoFindings.filter(
    (item) => item.status === "Selesai",
  ).length

  return (
    <div className="space-y-6 text-slate-900">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <Package className="h-4 w-4" />
            <span>Monitoring Operasional</span>
            <span>/</span>
            <span>Inventory Findings</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Inventory Findings
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Pantau temuan inventaris dari seluruh site, tingkat risiko,
            dan progres tindak lanjut yang dilaporkan.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm">
          <Eye className="h-4 w-4" />
          Mode Read-only
        </div>
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4">
        <div className="flex items-start gap-3">
          <ClipboardList className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
          <div>
            <p className="text-sm font-semibold text-blue-900">
              Ringkasan temuan inventaris
            </p>
            <p className="mt-1 text-sm leading-5 text-blue-800">
              Gunakan filter untuk meninjau temuan per site dan status.
              Data contoh di halaman ini perlu diganti dengan data backend
              setelah API tersedia.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Temuan"
          value={demoFindings.length}
          description="Seluruh temuan tercatat"
          icon={ClipboardList}
          iconClass="bg-indigo-50 text-indigo-600"
        />
        <SummaryCard
          title="Temuan Terbuka"
          value={openCount}
          description="Memerlukan tindak lanjut"
          icon={CircleAlert}
          iconClass="bg-red-50 text-red-600"
        />
        <SummaryCard
          title="Dalam Proses"
          value={progressCount}
          description="Sedang ditindaklanjuti"
          icon={Clock3}
          iconClass="bg-amber-50 text-amber-600"
        />
        <SummaryCard
          title="Risiko Tinggi"
          value={highSeverityCount}
          description={`${completedCount} temuan selesai`}
          icon={AlertTriangle}
          iconClass="bg-orange-50 text-orange-600"
        />
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Daftar Inventory Findings
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredFindings.length} temuan ditampilkan
              </p>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari kode, aset, atau site..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <FilterSelect
              label="Site"
              value={siteFilter}
              onChange={setSiteFilter}
              options={sites}
            />
            <FilterSelect
              label="Tingkat Risiko"
              value={severityFilter}
              onChange={setSeverityFilter}
              options={["Semua Tingkat", "Tinggi", "Sedang", "Rendah"]}
            />
            <FilterSelect
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                "Semua Status",
                "Terbuka",
                "Dalam Proses",
                "Selesai",
              ]}
            />
            <button
              type="button"
              onClick={() => {
                setSearch("")
                setSiteFilter("Semua Site")
                setSeverityFilter("Semua Tingkat")
                setStatusFilter("Semua Status")
              }}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <Filter className="h-4 w-4" />
              Reset Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Temuan</th>
                <th className="px-5 py-4 font-semibold">Aset / Material</th>
                <th className="px-5 py-4 font-semibold">Site</th>
                <th className="px-5 py-4 font-semibold">Tingkat Risiko</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Tanggal</th>
                <th className="px-5 py-4 text-right font-semibold">Detail</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredFindings.map((item) => (
                <tr key={item.id} className="transition hover:bg-slate-50/70">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{item.code}</p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-700">{item.asset}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.assetTag}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-slate-600">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {item.site}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge
                      label={item.severity}
                      className={severityStyles[item.severity]}
                    />
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge
                      label={item.status}
                      className={statusStyles[item.status]}
                    />
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                    {formatDate(item.reportedAt)}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedFinding(item)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Lihat
                    </button>
                  </td>
                </tr>
              ))}

              {filteredFindings.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center">
                    <Search className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-3 font-medium text-slate-700">
                      Temuan tidak ditemukan
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Coba ubah kata kunci atau filter yang dipilih.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedFinding && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedFinding(null)
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="finding-detail-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
          >
            <div className="sticky top-0 flex items-start justify-between border-b border-slate-100 bg-white p-5 sm:p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {selectedFinding.code}
                </p>
                <h2
                  id="finding-detail-title"
                  className="mt-1 text-xl font-bold text-slate-900"
                >
                  {selectedFinding.title}
                </h2>
              </div>

              <button
                type="button"
                aria-label="Tutup detail"
                onClick={() => setSelectedFinding(null)}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="flex flex-wrap gap-2">
                <StatusBadge
                  label={`Risiko ${selectedFinding.severity}`}
                  className={severityStyles[selectedFinding.severity]}
                />
                <StatusBadge
                  label={selectedFinding.status}
                  className={statusStyles[selectedFinding.status]}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DetailField label="Aset / Material" value={selectedFinding.asset} />
                <DetailField label="Kode Aset" value={selectedFinding.assetTag} />
                <DetailField label="Kategori" value={selectedFinding.category} />
                <DetailField label="Site" value={selectedFinding.site} />
                <DetailField label="Dilaporkan oleh" value={selectedFinding.reportedBy} />
                <DetailField
                  label="Tanggal laporan"
                  value={formatDate(selectedFinding.reportedAt)}
                />
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  Deskripsi Temuan
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {selectedFinding.description}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  Tindak Lanjut
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {selectedFinding.followUp}
                </p>
              </div>

              <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                Halaman Manager hanya menampilkan informasi. Perubahan status
                dan tindak lanjut dilakukan melalui alur operasional yang sesuai.
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

type SummaryCardProps = {
  title: string
  value: number
  description: string
  icon: typeof Package
  iconClass: string
}

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  iconClass,
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
          <p className="mt-2 text-xs text-slate-500">{description}</p>
        </div>
        <div className={`rounded-xl p-3 ${iconClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}

type FilterSelectProps = {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: FilterSelectProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

type StatusBadgeProps = {
  label: string
  className: string
}

function StatusBadge({ label, className }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${className}`}
    >
      {label}
    </span>
  )
}

type DetailFieldProps = {
  label: string
  value: string
}

function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  )
}