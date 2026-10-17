import { useMemo, useState } from "react"
import {
  ClipboardCheck,
  Search,
  Eye,
  X,
  CheckCircle2,
  Clock3,
  ListChecks,
  MapPin,
  CalendarDays,
  ShieldCheck,
} from "lucide-react"

type ChecklistStatus = "Aktif" | "Draft" | "Arsip"

type Checklist = {
  id: string
  code: string
  name: string
  category: string
  description: string
  itemCount: number
  site: string
  status: ChecklistStatus
  updatedAt: string
  items: string[]
}

const demoChecklists: Checklist[] = [
  {
    id: "1",
    code: "CHK-001",
    name: "Checklist Pemeriksaan Site",
    category: "Operasional Site",
    description:
      "Daftar pemeriksaan kondisi umum dan kesiapan operasional di lokasi.",
    itemCount: 8,
    site: "Semua Site",
    status: "Aktif",
    updatedAt: "2026-10-12",
    items: [
      "Kondisi area kerja diperiksa",
      "Peralatan kerja tersedia",
      "Kondisi perangkat diperiksa",
      "Kabel dan koneksi diperiksa",
      "Area kerja aman",
      "Kendala operasional dicatat",
      "Dokumentasi pemeriksaan tersedia",
      "Hasil pemeriksaan dilaporkan",
    ],
  },
  {
    id: "2",
    code: "CHK-002",
    name: "Checklist Keselamatan Kerja",
    category: "Keselamatan",
    description:
      "Pemeriksaan aspek keselamatan sebelum dan selama pekerjaan berlangsung.",
    itemCount: 6,
    site: "Semua Site",
    status: "Aktif",
    updatedAt: "2026-10-10",
    items: [
      "Area kerja diperiksa sebelum pekerjaan",
      "Perlengkapan keselamatan tersedia",
      "Potensi bahaya diidentifikasi",
      "Area kerja tetap tertata",
      "Kondisi tidak aman dilaporkan",
      "Area ditinggalkan dalam kondisi aman",
    ],
  },
  {
    id: "3",
    code: "CHK-003",
    name: "Checklist Inventaris Perangkat",
    category: "Inventaris",
    description:
      "Pemeriksaan identitas, kondisi, dan keberadaan perangkat di site.",
    itemCount: 7,
    site: "Bandung",
    status: "Aktif",
    updatedAt: "2026-10-09",
    items: [
      "Identitas perangkat diperiksa",
      "Label aset dicocokkan",
      "Kondisi fisik diperiksa",
      "Lokasi perangkat diverifikasi",
      "Aksesori perangkat diperiksa",
      "Ketidaksesuaian dicatat",
      "Temuan inventaris dilaporkan",
    ],
  },
  {
    id: "4",
    code: "CHK-004",
    name: "Checklist Dokumentasi Pekerjaan",
    category: "Dokumentasi",
    description:
      "Pemeriksaan kelengkapan dokumentasi pekerjaan dan laporan lapangan.",
    itemCount: 5,
    site: "Cikarang",
    status: "Aktif",
    updatedAt: "2026-10-07",
    items: [
      "Ringkasan pekerjaan tersedia",
      "Waktu pelaksanaan tercatat",
      "Hasil pekerjaan didokumentasikan",
      "Kendala dan temuan dicatat",
      "Laporan dikirim sesuai prosedur",
    ],
  },
  {
    id: "5",
    code: "CHK-005",
    name: "Checklist Perawatan Perangkat",
    category: "Perawatan",
    description:
      "Template pemeriksaan perangkat yang masih dalam tahap penyusunan.",
    itemCount: 4,
    site: "Jakarta",
    status: "Draft",
    updatedAt: "2026-10-05",
    items: [
      "Kondisi perangkat diperiksa",
      "Kebersihan perangkat diperiksa",
      "Koneksi perangkat diperiksa",
      "Hasil pemeriksaan dicatat",
    ],
  },
  {
    id: "6",
    code: "CHK-006",
    name: "Checklist Pemeriksaan Lama",
    category: "Operasional Site",
    description:
      "Template checklist lama yang dipertahankan sebagai referensi.",
    itemCount: 5,
    site: "Bali",
    status: "Arsip",
    updatedAt: "2026-09-20",
    items: [
      "Kondisi area diperiksa",
      "Peralatan diverifikasi",
      "Temuan dicatat",
      "Dokumentasi tersedia",
      "Hasil pemeriksaan disimpan",
    ],
  },
]

const statusStyles: Record<ChecklistStatus, string> = {
  Aktif: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Draft: "border-amber-200 bg-amber-50 text-amber-700",
  Arsip: "border-slate-200 bg-slate-100 text-slate-600",
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`))
}

export default function ManagerChecklists() {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("Semua Kategori")
  const [statusFilter, setStatusFilter] = useState("Semua Status")
  const [selectedChecklist, setSelectedChecklist] =
    useState<Checklist | null>(null)

  const categories = useMemo(
    () => [
      "Semua Kategori",
      ...new Set(demoChecklists.map((item) => item.category)),
    ],
    [],
  )

  const filteredChecklists = useMemo(() => {
    const keyword = search.toLowerCase().trim()

    return demoChecklists.filter((item) => {
      const matchesSearch =
        !keyword ||
        [
          item.code,
          item.name,
          item.category,
          item.site,
          item.description,
        ].some((value) => value.toLowerCase().includes(keyword))

      const matchesCategory =
        categoryFilter === "Semua Kategori" ||
        item.category === categoryFilter

      const matchesStatus =
        statusFilter === "Semua Status" || item.status === statusFilter

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [search, categoryFilter, statusFilter])

  const activeCount = demoChecklists.filter(
    (item) => item.status === "Aktif",
  ).length

  const draftCount = demoChecklists.filter(
    (item) => item.status === "Draft",
  ).length

  const totalItems = demoChecklists
    .filter((item) => item.status === "Aktif")
    .reduce((sum, item) => sum + item.itemCount, 0)

  return (
    <div className="space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <ClipboardCheck className="h-4 w-4" />
            <span>Monitoring Operasional</span>
            <span>/</span>
            <span>Master Checklist</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Master Checklist
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Tinjau template checklist, kategori, cakupan site, dan
            kelengkapan item yang digunakan dalam operasional EOS.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm">
          <Eye className="h-4 w-4" />
          Mode Read-only
        </div>
      </div>

      {/* Preview notice */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
          <div>
            <p className="text-sm font-semibold text-indigo-950">
              Monitoring Master Checklist
            </p>
            <p className="mt-1 text-sm leading-5 text-indigo-800">
              Manager dapat meninjau informasi checklist tanpa mengubah
              template. Data yang ditampilkan saat ini merupakan contoh
              untuk preview UI, bukan master data operasional sebenarnya.
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Template"
          value={demoChecklists.length}
          description="Seluruh template contoh"
          icon={ClipboardCheck}
          iconClass="bg-indigo-50 text-indigo-600"
        />
        <SummaryCard
          title="Template Aktif"
          value={activeCount}
          description="Berstatus aktif pada data contoh"
          icon={CheckCircle2}
          iconClass="bg-emerald-50 text-emerald-600"
        />
        <SummaryCard
          title="Draft"
          value={draftCount}
          description="Belum berstatus aktif"
          icon={Clock3}
          iconClass="bg-amber-50 text-amber-600"
        />
        <SummaryCard
          title="Item Checklist Aktif"
          value={totalItems}
          description="Jumlah item pada template aktif"
          icon={ListChecks}
          iconClass="bg-sky-50 text-sky-600"
        />
      </div>

      {/* Checklist listing */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Daftar Template Checklist
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredChecklists.length} template ditampilkan
              </p>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari nama, kode, kategori..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FilterSelect
              label="Kategori"
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={categories}
            />
            <FilterSelect
              label="Status Template"
              value={statusFilter}
              onChange={setStatusFilter}
              options={["Semua Status", "Aktif", "Draft", "Arsip"]}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Template</th>
                <th className="px-5 py-4 font-semibold">Kategori</th>
                <th className="px-5 py-4 font-semibold">Cakupan Site</th>
                <th className="px-5 py-4 font-semibold">Jumlah Item</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Pembaruan</th>
                <th className="px-5 py-4 text-right font-semibold">Detail</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredChecklists.map((item) => (
                <tr
                  key={item.id}
                  className="transition hover:bg-slate-50/70"
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.code}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {item.category}
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-slate-600">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {item.site}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-2 font-semibold text-slate-700">
                      <ListChecks className="h-4 w-4 text-slate-400" />
                      {item.itemCount} item
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge
                      label={item.status}
                      className={statusStyles[item.status]}
                    />
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                    {formatDate(item.updatedAt)}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedChecklist(item)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Detail
                    </button>
                  </td>
                </tr>
              ))}

              {filteredChecklists.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center">
                    <Search className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-3 font-medium text-slate-700">
                      Checklist tidak ditemukan
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Coba kata kunci atau filter lainnya.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Read-only detail modal */}
      {selectedChecklist && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedChecklist(null)
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="checklist-detail-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
          >
            <div className="sticky top-0 flex items-start justify-between border-b border-slate-100 bg-white p-5 sm:p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {selectedChecklist.code}
                </p>
                <h2
                  id="checklist-detail-title"
                  className="mt-1 text-xl font-bold text-slate-900"
                >
                  {selectedChecklist.name}
                </h2>
              </div>

              <button
                type="button"
                aria-label="Tutup detail"
                onClick={() => setSelectedChecklist(null)}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="flex flex-wrap gap-2">
                <StatusBadge
                  label={selectedChecklist.status}
                  className={statusStyles[selectedChecklist.status]}
                />
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                  {selectedChecklist.category}
                </span>
              </div>

              <p className="text-sm leading-6 text-slate-600">
                {selectedChecklist.description}
              </p>

              <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 p-4 sm:grid-cols-3">
                <DetailField
                  label="Cakupan Site"
                  value={selectedChecklist.site}
                />
                <DetailField
                  label="Jumlah Item"
                  value={`${selectedChecklist.itemCount} item`}
                />
                <DetailField
                  label="Terakhir Diperbarui"
                  value={formatDate(selectedChecklist.updatedAt)}
                />
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-slate-900">
                    Item Checklist
                  </h3>
                  <span className="text-xs text-slate-500">
                    {selectedChecklist.items.length} item contoh
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedChecklist.items.map((item, index) => (
                    <div
                      key={`${selectedChecklist.id}-${index}`}
                      className="flex items-start gap-3 rounded-xl border border-slate-200 p-3"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-600">
                        {index + 1}
                      </span>
                      <p className="pt-0.5 text-sm leading-5 text-slate-700">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">
                <Eye className="mt-0.5 h-4 w-4 shrink-0" />
                Detail ini hanya untuk ditinjau. Pengelolaan template
                tetap mengikuti hak akses dan alur operasional yang berlaku.
              </div>
            </div>
          </section>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <CalendarDays className="h-3.5 w-3.5" />
          Data checklist contoh untuk preview UI
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <Eye className="h-3.5 w-3.5" />
          Read-only
        </span>
      </div>
    </div>
  )
}

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  iconClass,
}: {
  title: string
  value: number
  description: string
  icon: typeof ClipboardCheck
  iconClass: string
}) {
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

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
}) {
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

function StatusBadge({
  label,
  className,
}: {
  label: string
  className: string
}) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${className}`}
    >
      {label}
    </span>
  )
}

function DetailField({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  )
}