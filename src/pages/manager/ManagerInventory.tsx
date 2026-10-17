import { useMemo, useState } from "react"
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Eye,
  Package,
  Search,
  X,
} from "lucide-react"

type InventoryItem = {
  id: string
  assetTag: string
  name: string
  category: string
  site: string
  condition: "Baik" | "Perlu Pemeriksaan" | "Bermasalah"
  kind: "Aset" | "Material / Sparepart"
  quantity?: number
  unit?: string
  note: string
}

const demoInventory: InventoryItem[] = [
  {
    id: "INV-001",
    assetTag: "CMX-BDG-NET-0001",
    name: "Access Point",
    category: "Networking",
    site: "Site Bandung",
    condition: "Baik",
    kind: "Aset",
    note: "Data contoh untuk preview antarmuka.",
  },
  {
    id: "INV-002",
    assetTag: "CMX-CMH-NET-0002",
    name: "Network Switch",
    category: "Networking",
    site: "Site Cimahi",
    condition: "Perlu Pemeriksaan",
    kind: "Aset",
    note: "Perlu pemeriksaan kondisi aset.",
  },
  {
    id: "INV-003",
    assetTag: "CMX-JKT-POW-0003",
    name: "UPS",
    category: "Power",
    site: "Site Jakarta",
    condition: "Bermasalah",
    kind: "Aset",
    note: "Status contoh. Temuan resmi harus merujuk data server.",
  },
  {
    id: "INV-004",
    assetTag: "MAT-001",
    name: "Kabel LAN",
    category: "Kabel",
    site: "Site Bandung",
    condition: "Baik",
    kind: "Material / Sparepart",
    quantity: 24,
    unit: "pcs",
    note: "Data jumlah stok contoh.",
  },
  {
    id: "INV-005",
    assetTag: "MAT-002",
    name: "Konektor RJ45",
    category: "Konektor",
    site: "Site Cimahi",
    condition: "Perlu Pemeriksaan",
    kind: "Material / Sparepart",
    quantity: 8,
    unit: "pcs",
    note: "Data jumlah stok contoh.",
  },
  {
    id: "INV-006",
    assetTag: "MAT-003",
    name: "Adaptor Power",
    category: "Power",
    site: "Site Jakarta",
    condition: "Bermasalah",
    kind: "Material / Sparepart",
    quantity: 2,
    unit: "pcs",
    note: "Status contoh untuk preview.",
  },
]

const conditionStyles: Record<InventoryItem["condition"], string> = {
  Baik: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Perlu Pemeriksaan": "border-amber-200 bg-amber-50 text-amber-700",
  Bermasalah: "border-rose-200 bg-rose-50 text-rose-700",
}

export default function ManagerInventory() {
  const [search, setSearch] = useState("")
  const [siteFilter, setSiteFilter] = useState("Semua Site")
  const [kindFilter, setKindFilter] = useState("Semua Jenis")
  const [conditionFilter, setConditionFilter] = useState("Semua Status")
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)

  const sites = useMemo(
    () => [...new Set(demoInventory.map((item) => item.site))],
    [],
  )

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return demoInventory.filter((item) => {
      const matchesSearch =
        !keyword ||
        item.name.toLowerCase().includes(keyword) ||
        item.assetTag.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword) ||
        item.site.toLowerCase().includes(keyword)

      const matchesSite =
        siteFilter === "Semua Site" || item.site === siteFilter

      const matchesKind =
        kindFilter === "Semua Jenis" || item.kind === kindFilter

      const matchesCondition =
        conditionFilter === "Semua Status" ||
        item.condition === conditionFilter

      return (
        matchesSearch &&
        matchesSite &&
        matchesKind &&
        matchesCondition
      )
    })
  }, [search, siteFilter, kindFilter, conditionFilter])

  const totalAssets = demoInventory.filter(
    (item) => item.kind === "Aset",
  ).length

  const totalMaterials = demoInventory.filter(
    (item) => item.kind === "Material / Sparepart",
  ).length

  const needsAttention = demoInventory.filter(
    (item) => item.condition !== "Baik",
  ).length

  const resetFilters = () => {
    setSearch("")
    setSiteFilter("Semua Site")
    setKindFilter("Semua Jenis")
    setConditionFilter("Semua Status")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
            <Package className="size-4" />
            Monitoring Operasional
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Inventaris
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Pantau aset, material, dan kondisi inventaris dari seluruh site.
            Halaman Manager bersifat read-only.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
          <Activity className="size-4" />
          Frontend Preview
        </div>
      </div>

      <div className="flex gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
          <Eye className="size-5" />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-800">
            Mode pemantauan
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Manager dapat meninjau data dan kondisi inventaris, tetapi tidak
            mengubah aset maupun melakukan mutasi stok dari halaman ini.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Item"
          value={demoInventory.length}
          description="Seluruh jenis inventaris"
          icon={Package}
          iconClass="bg-indigo-50 text-indigo-600"
        />

        <SummaryCard
          title="Aset"
          value={totalAssets}
          description="Item kategori aset"
          icon={Activity}
          iconClass="bg-sky-50 text-sky-600"
        />

        <SummaryCard
          title="Material / Sparepart"
          value={totalMaterials}
          description="Item material dan suku cadang"
          icon={Package}
          iconClass="bg-violet-50 text-violet-600"
        />

        <SummaryCard
          title="Perlu Perhatian"
          value={needsAttention}
          description="Perlu pemeriksaan atau bermasalah"
          icon={AlertTriangle}
          iconClass="bg-amber-50 text-amber-600"
        />
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5 sm:p-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-bold text-slate-900">
              Daftar Inventaris
            </h2>
            <p className="text-sm text-slate-500">
              Cari item dan tinjau statusnya berdasarkan site.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="relative sm:col-span-2 xl:col-span-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari nama, kode, kategori..."
                aria-label="Cari inventaris"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            <FilterSelect
              label="Site"
              value={siteFilter}
              onChange={setSiteFilter}
              options={["Semua Site", ...sites]}
            />

            <FilterSelect
              label="Jenis"
              value={kindFilter}
              onChange={setKindFilter}
              options={[
                "Semua Jenis",
                "Aset",
                "Material / Sparepart",
              ]}
            />

            <FilterSelect
              label="Status"
              value={conditionFilter}
              onChange={setConditionFilter}
              options={[
                "Semua Status",
                "Baik",
                "Perlu Pemeriksaan",
                "Bermasalah",
              ]}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              Menampilkan{" "}
              <span className="font-semibold text-slate-800">
                {filteredItems.length}
              </span>{" "}
              dari {demoInventory.length} item contoh
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Reset filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Item</th>
                <th className="px-5 py-4 font-semibold">Kode</th>
                <th className="px-5 py-4 font-semibold">Site</th>
                <th className="px-5 py-4 font-semibold">Jenis</th>
                <th className="px-5 py-4 font-semibold">Jumlah</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Detail</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-slate-50/80"
                >
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-800">
                      {item.name}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {item.category}
                    </div>
                  </td>

                  <td className="px-5 py-4 font-mono text-xs text-slate-600">
                    {item.assetTag}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {item.site}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                      {item.kind}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {item.quantity !== undefined
                      ? `${item.quantity} ${item.unit ?? ""}`
                      : "—"}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${conditionStyles[item.condition]}`}
                    >
                      {item.condition}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      aria-label={`Lihat detail ${item.name}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      <Eye className="size-3.5" />
                      Detail
                    </button>
                  </td>
                </tr>
              ))}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <Search className="size-5" />
                    </div>
                    <p className="mt-3 font-semibold text-slate-800">
                      Inventaris tidak ditemukan
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Coba ubah kata kunci atau filter yang dipilih.
                    </p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      Hapus semua filter
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-2 border-t border-slate-100 px-5 py-4 text-xs leading-5 text-slate-500">
          <CheckCircle2 className="size-4 shrink-0 text-slate-400" />
          Data di atas merupakan contoh tampilan, bukan data inventaris resmi.
        </div>
      </section>

      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedItem(null)
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="inventory-detail-title"
            className="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-xl sm:rounded-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-100 p-5 sm:p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                  Detail Inventaris
                </p>
                <h2
                  id="inventory-detail-title"
                  className="mt-2 text-xl font-bold text-slate-900"
                >
                  {selectedItem.name}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedItem.assetTag}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label="Tutup detail"
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-4">
                <div>
                  <p className="text-xs text-slate-500">Status kondisi</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {selectedItem.condition}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${conditionStyles[selectedItem.condition]}`}
                >
                  {selectedItem.condition}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DetailField label="Kategori" value={selectedItem.category} />
                <DetailField label="Site" value={selectedItem.site} />
                <DetailField label="Jenis" value={selectedItem.kind} />
                <DetailField
                  label="Jumlah"
                  value={
                    selectedItem.quantity !== undefined
                      ? `${selectedItem.quantity} ${selectedItem.unit ?? ""}`
                      : "Tidak berlaku"
                  }
                />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Catatan
                </p>
                <p className="mt-2 rounded-xl border border-slate-200 p-4 text-sm leading-6 text-slate-600">
                  {selectedItem.note}
                </p>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                Informasi ini masih berupa data preview. Status dan jumlah
                resmi harus berasal dari backend.
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-100 p-5">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Tutup
              </button>
            </div>
          </section>
        </div>
      )}
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
  icon: typeof Package
  iconClass: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={`flex size-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon className="size-5" />
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500">{description}</p>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <div className="relative">
      <label className="sr-only">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={`Filter ${label}`}
        className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
    </div>
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
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  )
}