import { useMemo, useState, type ChangeEvent, type FormEvent } from "react"
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Box,
  CheckCircle2,
  ClipboardList,
  Clock3,
  ImagePlus,
  Package,
  Plus,
  Search,
  ShieldAlert,
  Trash2,
  Wrench,
  X,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
type InventoryTab = "assets" | "stock" | "findings"
type AssetStatus =
  | "INSTALLED"
  | "STOCK"
  | "MAINTENANCE"
  | "DAMAGED"
  | "LOST"
  | "RETIRED"
type Asset = {
  id: string
  tag: string
  name: string
  category: string
  brand: string
  location: string
  status: AssetStatus
  serialNumber: string
}
type StockItem = {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  minimum: number
  location: string
}
type FindingStatus =
  | "OPEN"
  | "UNDER_REVIEW"
  | "RESOLVED"
  | "CLOSED"
  | "REJECTED"
type FindingType =
  | "ASSET_DAMAGED"
  | "ASSET_MISSING"
  | "ASSET_DATA_MISMATCH"
  | "STOCK_LOW"
  | "STOCK_DAMAGED"
  | "ASSET_REGISTRATION_NEEDED"
  | "OTHER"
type FindingAttachment = {
  id: string
  name: string
  size: number
  previewUrl: string
}
type Finding = {
  id: string
  title: string
  type: FindingType
  assetTag: string
  description: string
  status: FindingStatus
  createdAt: string
  attachments?: FindingAttachment[]
}
const siteName = "Sekolah Rakyat Bandung"
const siteCode = "SR-JBR-BDG-001"
const initialAssets: Asset[] = [
  {
    id: "1",
    tag: "CMX.SR-JBR-BDG-001.ROUTER.001",
    name: "Router Utama",
    category: "Router",
    brand: "MikroTik",
    location: "Ruang Server",
    status: "INSTALLED",
    serialNumber: "SN-RT-2026-001",
  },
  {
    id: "2",
    tag: "CMX.SR-JBR-BDG-001.ACCESS_POINT.001",
    name: "Access Point Lantai 1",
    category: "Access Point",
    brand: "Huawei",
    location: "Koridor Lantai 1",
    status: "INSTALLED",
    serialNumber: "SN-AP-2026-002",
  },
  {
    id: "3",
    tag: "CMX.SR-JBR-BDG-001.SWITCH.001",
    name: "Network Switch",
    category: "Switch",
    brand: "TP-Link",
    location: "Ruang Server",
    status: "MAINTENANCE",
    serialNumber: "SN-SW-2026-003",
  },
  {
    id: "4",
    tag: "CMX.SR-JBR-BDG-001.ACCESS_POINT.002",
    name: "Access Point Lantai 2",
    category: "Access Point",
    brand: "Huawei",
    location: "Lantai 2",
    status: "DAMAGED",
    serialNumber: "SN-AP-2026-004",
  },
]
const initialStock: StockItem[] = [
  {
    id: "1",
    name: "Kabel LAN Cat6",
    category: "Kabel",
    quantity: 24,
    unit: "meter",
    minimum: 10,
    location: "Gudang Site",
  },
  {
    id: "2",
    name: "RJ45 Connector",
    category: "Konektor",
    quantity: 8,
    unit: "pcs",
    minimum: 10,
    location: "Gudang Site",
  },
  {
    id: "3",
    name: "Patch Cord",
    category: "Kabel",
    quantity: 15,
    unit: "pcs",
    minimum: 5,
    location: "Gudang Site",
  },
  {
    id: "4",
    name: "Adaptor Access Point",
    category: "Adaptor",
    quantity: 3,
    unit: "pcs",
    minimum: 5,
    location: "Gudang Site",
  },
]
const initialFindings: Finding[] = [
  {
    id: "FND-0002",
    title: "Access Point mengalami gangguan",
    type: "ASSET_DAMAGED",
    assetTag: "CMX.SR-JBR-BDG-001.ACCESS_POINT.002",
    description:
      "Access Point lantai 2 perlu diperiksa karena perangkat tidak beroperasi normal.",
    status: "OPEN",
    createdAt: "2026-10-05",
  },
  {
    id: "FND-0001",
    title: "Stok RJ45 hampir habis",
    type: "STOCK_LOW",
    assetTag: "-",
    description:
      "Stok RJ45 Connector perlu diperiksa dan ditindaklanjuti.",
    status: "UNDER_REVIEW",
    createdAt: "2026-10-04",
  },
]
const assetStatusLabels: Record<AssetStatus, string> = {
  INSTALLED: "Terpasang",
  STOCK: "Tersedia",
  MAINTENANCE: "Maintenance",
  DAMAGED: "Rusak",
  LOST: "Hilang",
  RETIRED: "Dipensiunkan",
}
const findingStatusLabels: Record<FindingStatus, string> = {
  OPEN: "Terbuka",
  UNDER_REVIEW: "Ditinjau",
  RESOLVED: "Selesai ditangani",
  CLOSED: "Ditutup",
  REJECTED: "Ditolak",
}
const findingTypeLabels: Record<FindingType, string> = {
  ASSET_DAMAGED: "Aset rusak",
  ASSET_MISSING: "Aset hilang",
  ASSET_DATA_MISMATCH: "Data aset tidak cocok",
  STOCK_LOW: "Stok menipis",
  STOCK_DAMAGED: "Material rusak",
  ASSET_REGISTRATION_NEEDED: "Aset belum terdaftar",
  OTHER: "Lainnya",
}
function StatusBadge({ status }: { status: AssetStatus | FindingStatus }) {
  const label =
    status in assetStatusLabels
      ? assetStatusLabels[status as AssetStatus]
      : findingStatusLabels[status as FindingStatus]
  const className =
    status === "DAMAGED" ||
    status === "LOST" ||
    status === "OPEN" ||
    status === "REJECTED"
      ? "border-red-200 bg-red-50 text-red-700"
      : status === "MAINTENANCE" ||
          status === "UNDER_REVIEW"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : status === "INSTALLED" ||
            status === "RESOLVED" ||
            status === "CLOSED"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-slate-100 text-slate-600"
  return (
    <Badge
      variant="outline"
      className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${className}`}
    >
      {label}
    </Badge>
  )
}
function EmptyState({
  title,
  description,
}: {

  title: string

  description: string

}) {

  return (
    <div className="flex flex-col items-center px-5 py-12 text-center">
      <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <ClipboardList size={22} />
      </div>
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  )
}
export default function Inventory() {
  const [activeTab, setActiveTab] = useState<InventoryTab>("assets")
  const [assets] = useState(initialAssets)
  const [stock] = useState(initialStock)
  const [findings, setFindings] = useState(initialFindings)
  const [search, setSearch] = useState("")
  const [assetFilter, setAssetFilter] = useState("ALL")
  const [findingFilter, setFindingFilter] = useState("ALL")
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [showFindingForm, setShowFindingForm] = useState(false)
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null)
  const [notice, setNotice] = useState("")
  const [findingTitle, setFindingTitle] = useState("")
  const [findingType, setFindingType] =
    useState<FindingType>("ASSET_DAMAGED")
  const [findingAsset, setFindingAsset] = useState("")
  const [findingDescription, setFindingDescription] = useState("")
  const [findingAttachments, setFindingAttachments] = useState<FindingAttachment[]>([])
  const filteredAssets = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return assets.filter((asset) => {
      const matchesSearch = [
        asset.name,
        asset.tag,
        asset.category,
        asset.brand,
        asset.location,
      ].some((value) => value.toLowerCase().includes(keyword))
      const matchesStatus =
        assetFilter === "ALL" || asset.status === assetFilter
      return matchesSearch && matchesStatus
    })
  }, [assets, search, assetFilter])
  const filteredStock = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return stock.filter((item) => {
      const matchesSearch = [
        item.name,
        item.category,
        item.location,
      ].some((value) => value.toLowerCase().includes(keyword))
      return matchesSearch
    })
  }, [stock, search])
  const filteredFindings = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return findings.filter((finding) => {
      const matchesSearch = [
        finding.id,
        finding.title,
        finding.assetTag,
        finding.description,
        findingTypeLabels[finding.type],
      ].some((value) => value.toLowerCase().includes(keyword))
      const matchesStatus =
        findingFilter === "ALL" || finding.status === findingFilter
      return matchesSearch && matchesStatus
    })
  }, [findings, search, findingFilter])
  const damagedAssets = assets.filter(
    (asset) => asset.status === "DAMAGED" || asset.status === "LOST",
  ).length
  const lowStockCount = stock.filter(
    (item) => item.quantity <= item.minimum,
  ).length
  const openFindingCount = findings.filter(
    (finding) =>
      finding.status === "OPEN" || finding.status === "UNDER_REVIEW",
  ).length
  function resetFindingForm(keepAttachments = false) {
    if (!keepAttachments) {
      findingAttachments.forEach((attachment) => URL.revokeObjectURL(attachment.previewUrl))
    }
    setFindingTitle("")
    setFindingType("ASSET_DAMAGED")
    setFindingAsset("")
    setFindingDescription("")
    setFindingAttachments([])
    setShowFindingForm(false)
  }
  function handleFindingFiles(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? [])
    event.target.value = ""
    if (selectedFiles.length === 0) return
    const remainingSlots = 5 - findingAttachments.length
    if (remainingSlots <= 0) {
      setNotice("Maksimal 5 foto bukti untuk satu temuan.")
      return
    }
    const accepted: FindingAttachment[] = []
    let rejectedCount = 0
    for (const file of selectedFiles) {
      if (accepted.length >= remainingSlots) {
        rejectedCount += 1
        continue
      }
      if (!file.type.startsWith("image/")) {
        rejectedCount += 1
        continue
      }
      if (file.size > 10 * 1024 * 1024) {
        rejectedCount += 1
        continue
      }
      accepted.push({
        id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        size: file.size,
        previewUrl: URL.createObjectURL(file),
      })
    }
    if (accepted.length > 0) {
      setFindingAttachments((current) => [...current, ...accepted])
    }
    setNotice(
      rejectedCount > 0
        ? `${accepted.length} foto ditambahkan. ${rejectedCount} file dilewati; gunakan gambar maksimal 10 MB dan total maksimal 5 foto.`
        : `${accepted.length} foto bukti ditambahkan.`,
    )
  }
  function removeFindingAttachment(attachmentId: string) {
    setFindingAttachments((current) => {
      const target = current.find((attachment) => attachment.id === attachmentId)
      if (target) URL.revokeObjectURL(target.previewUrl)
      return current.filter((attachment) => attachment.id !== attachmentId)
    })
  }
  function handleCreateFinding(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!findingTitle.trim() || findingDescription.trim().length < 5) return
    if (findingAttachments.length === 0) {
      setNotice("Tambahkan minimal 1 foto bukti sebelum menyimpan temuan.")
      return
    }
    const newFinding: Finding = {
      id: `FND-${String(findings.length + 1).padStart(4, "0")}`,
      title: findingTitle.trim(),
      type: findingType,
      assetTag: findingAsset || "-",
      description: findingDescription.trim(),
      status: "OPEN",
      createdAt: new Date().toLocaleDateString("en-CA"),
      attachments: [...findingAttachments],
    }
    setFindings((current) => [newFinding, ...current])
    resetFindingForm(true)
    setActiveTab("findings")
    setSearch("")
    setFindingFilter("ALL")
    setNotice("Temuan ditambahkan ke daftar demo beserta foto bukti. Data belum dikirim ke server.")
  }
  function goToTab(tab: InventoryTab) {
    setActiveTab(tab)
    setSearch("")
    setSelectedAsset(null)
    setSelectedFinding(null)
    setNotice("")
  }
  return (
    <section className="mx-auto min-h-screen w-full max-w-3xl px-4 pb-28 pt-5 sm:px-6 sm:pt-7">
      {selectedAsset ? (
        <div className="space-y-5">
          <button
            type="button"
            onClick={() => setSelectedAsset(null)}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft size={17} />
            Kembali ke inventaris
          </button>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
              Detail aset
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {selectedAsset.name}
            </h1>
            <p className="mt-1 break-all text-xs leading-5 text-slate-500">
              {selectedAsset.tag}
            </p>
          </div>

          <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="space-y-5 p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Package size={23} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedAsset.category}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {selectedAsset.brand}
                  </p>
                </div>
                <StatusBadge status={selectedAsset.status} />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Lokasi pemasangan</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {selectedAsset.location}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Nomor seri</p>
                  <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                    {selectedAsset.serialNumber || "Belum tersedia"}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 sm:col-span-2">
                  <p className="text-xs text-slate-500">Site</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {siteName}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{siteCode}</p>
                </div>
              </div>
              <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3">
                <div className="flex items-start gap-2.5">
                  <ShieldAlert
                    size={17}
                    className="mt-0.5 shrink-0 text-blue-700"
                  />
                  <p className="text-xs leading-5 text-blue-900">
                    Asset Tag bersifat tetap. Jika ada kerusakan atau
                    ketidaksesuaian data, buat Inventory Finding untuk
                    ditindaklanjuti oleh petugas berwenang.
                  </p>
                </div>
              </div>
              <Button
                className="w-full rounded-xl"
                onClick={() => {
                  setFindingAsset(selectedAsset.tag)
                  setFindingType(
                    selectedAsset.status === "DAMAGED"
                      ? "ASSET_DAMAGED"
                      : selectedAsset.status === "LOST"
                        ? "ASSET_MISSING"
                        : "ASSET_DATA_MISMATCH",
                  )
                  setSelectedAsset(null)
                  setShowFindingForm(true)
                  setActiveTab("findings")
                }}
              >
                <AlertTriangle size={16} />
                Laporkan Temuan
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : selectedFinding ? (
        <div className="space-y-5">
          <button
            type="button"
            onClick={() => setSelectedFinding(null)}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft size={17} />
            Kembali ke temuan
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
              Detail Inventory Finding
            </p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              {selectedFinding.title}
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              {selectedFinding.id}
            </p>
          </div>
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="space-y-4 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Badge variant="outline" className="rounded-full">
                  {findingTypeLabels[selectedFinding.type]}
                </Badge>
                <StatusBadge status={selectedFinding.status} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Tanggal dibuat</p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {selectedFinding.createdAt}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Asset Tag terkait</p>
                <p className="mt-1 break-all text-sm font-medium text-slate-800">
                  {selectedFinding.assetTag}

                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Deskripsi temuan</p>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {selectedFinding.description}
                </p>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold text-slate-700">Bukti foto</p>
                  <span className="text-[11px] text-slate-400">{selectedFinding.attachments?.length ?? 0} foto</span>
                </div>
                {(selectedFinding.attachments?.length ?? 0) > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {selectedFinding.attachments?.map((attachment) => (
                      <a key={attachment.id} href={attachment.previewUrl} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                        <img src={attachment.previewUrl} alt={attachment.name} className="aspect-square w-full object-cover transition group-hover:scale-[1.02]" />
                        <p className="truncate px-2 py-2 text-[11px] text-slate-600">{attachment.name}</p>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-xl border border-dashed border-slate-200 px-3 py-5 text-center text-xs text-slate-400">Tidak ada foto bukti pada data demo ini.</p>
                )}
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs leading-5 text-amber-900">
                  Status tindak lanjut pada halaman ini hanya data demo.
                  Perubahan status resmi dan unggahan bukti membutuhkan
                  backend.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                <Box size={12} />
                INVENTARIS SITE
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Inventory
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Pantau aset dan material site kamu.
              </p>
            </div>

            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-blue-700 shadow-sm">
              <Package size={21} />
            </div>
          </div>
          <Card className="mb-5 overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-[#10265d] via-[#173b83] to-[#2563eb] text-white shadow-md shadow-blue-950/10">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-blue-100">
                    Site aktif
                  </p>
                  <h2 className="mt-1 text-lg font-bold">{siteName}</h2>
                  <p className="mt-1 text-xs text-blue-100">{siteCode}</p>
                </div>
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <Package size={20} />
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/15 pt-4">
                <div>
                  <p className="text-[11px] text-blue-100">Total aset</p>
                  <p className="mt-1 text-2xl font-bold">{assets.length}</p>
                </div>
                <div>
                  <p className="text-[11px] text-blue-100">Stok menipis</p>
                  <p className="mt-1 text-2xl font-bold">{lowStockCount}</p>
                </div>
                <div>
                  <p className="text-[11px] text-blue-100">Temuan aktif</p>
                  <p className="mt-1 text-2xl font-bold">{openFindingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          {notice && (
            <div
              role="status"
              className="mb-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs leading-5 text-emerald-800"
            >
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
              <span>{notice}</span>
              <button
                type="button"
                aria-label="Tutup pemberitahuan"
                onClick={() => setNotice("")}
                className="ml-auto rounded-md p-0.5 hover:bg-emerald-100"
              >
                <X size={15} />
              </button>
            </div>
          )}
          <div className="mb-4 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => goToTab("assets")}
              className={`rounded-xl border p-3 text-left transition ${
                activeTab === "assets"
                  ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Package size={18} />
              <p className="mt-2 text-xs font-semibold">Aset</p>
              <p
                className={`mt-0.5 text-[11px] ${
                  activeTab === "assets" ? "text-blue-100" : "text-slate-400"
                }`}
              >
                {assets.length} item
              </p>
            </button>
            <button
              type="button"
              onClick={() => goToTab("stock")}
              className={`rounded-xl border p-3 text-left transition ${
                activeTab === "stock"
                  ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Box size={18} />
              <p className="mt-2 text-xs font-semibold">Material</p>
              <p
                className={`mt-0.5 text-[11px] ${
                  activeTab === "stock" ? "text-blue-100" : "text-slate-400"
                }`}
              >
                {stock.length} item
              </p>
            </button>
            <button
              type="button"
              onClick={() => goToTab("findings")}
              className={`rounded-xl border p-3 text-left transition ${
                activeTab === "findings"
                  ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <AlertTriangle size={18} />
              <p className="mt-2 text-xs font-semibold">Temuan</p>
              <p
                className={`mt-0.5 text-[11px] ${
                  activeTab === "findings" ? "text-blue-100" : "text-slate-400"
                }`}
              >
                {findings.length} laporan
              </p>
            </button>
          </div>
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
            <Search size={17} className="shrink-0 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={
                activeTab === "assets"
                  ? "Cari nama aset, tag, kategori..."
                  : activeTab === "stock"
                    ? "Cari material atau sparepart..."
                    : "Cari nomor atau deskripsi temuan..."
              }
              aria-label="Cari inventaris"
              className="h-11 min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
            {search && (
              <button
                type="button"
                aria-label="Hapus pencarian"
                onClick={() => setSearch("")}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={15} />
              </button>
            )}
          </div>
          {activeTab === "assets" && (
            <>
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Aset Site
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {filteredAssets.length} aset ditemukan
                  </p>
                </div>
                <select
                  aria-label="Filter status aset"
                  value={assetFilter}
                  onChange={(event) => setAssetFilter(event.target.value)}
                  className="h-9 max-w-[150px] rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:border-blue-400"
                >
                  <option value="ALL">Semua status</option>
                  <option value="INSTALLED">Terpasang</option>
                  <option value="STOCK">Tersedia</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="DAMAGED">Rusak</option>
                  <option value="LOST">Hilang</option>
                  <option value="RETIRED">Dipensiunkan</option>
                </select>
              </div>
              <div className="space-y-3">
                {filteredAssets.map((asset) => (
                  <Card
                    key={asset.id}
                    className="rounded-2xl border-slate-200 shadow-sm transition hover:border-blue-200"
                  >

                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                          {asset.category === "Router" ? (
                            <Wrench size={20} />
                          ) : (
                            <Package size={20} />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-semibold text-slate-900">
                              {asset.name}
                            </h3>
                            <StatusBadge status={asset.status} />
                          </div>
                          <p className="mt-1 text-xs text-slate-500">
                            {asset.brand} · {asset.category}
                          </p>
                          <p className="mt-2 break-all font-mono text-[10px] leading-4 text-slate-500">
                            {asset.tag}
                          </p>
                          <div className="mt-3 flex items-center justify-between gap-3">
                            <span className="text-xs text-slate-500">
                              {asset.location}
                            </span>
                            <button
                              type="button"
                              onClick={() => setSelectedAsset(asset)}
                              className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900"
                            >
                              Detail
                              <ArrowRight size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredAssets.length === 0 && (
                  <EmptyState
                    title="Aset tidak ditemukan"
                    description="Coba ubah kata pencarian atau filter status."
                  />
                )}
              </div>
              {damagedAssets > 0 && (
                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3">
                  <AlertTriangle
                    size={17}
                    className="mt-0.5 shrink-0 text-amber-700"
                  />
                  <div>
                    <p className="text-xs font-semibold text-amber-900">
                      Perlu perhatian
                    </p>
                    <p className="mt-1 text-xs leading-5 text-amber-800">
                      Ada {damagedAssets} aset dengan status rusak atau hilang.
                      Periksa detail dan buat temuan jika diperlukan.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
          {activeTab === "stock" && (
            <>
              <div className="mb-3">
                <h2 className="text-sm font-bold text-slate-900">
                  Material & Sparepart
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Informasi ketersediaan stok site
                </p>
              </div>
              <div className="mb-3 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3">
                <ShieldAlert
                  size={16}
                  className="mt-0.5 shrink-0 text-blue-700"
                />
                <p className="text-xs leading-5 text-blue-900">
                  Tampilan hanya-baca. Perubahan jumlah stok harus melalui
                  transaksi inventaris yang tercatat oleh petugas berwenang.
                </p>
              </div>
              <div className="space-y-3">
                {filteredStock.map((item) => {
                  const isLow = item.quantity <= item.minimum

                  return (
                    <Card
                      key={item.id}
                      className="rounded-2xl border-slate-200 shadow-sm"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                            <Box size={19} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-sm font-semibold text-slate-900">
                                {item.name}
                              </h3>
                              {isLow && (
                                <Badge
                                  variant="outline"
                                  className="rounded-full border-amber-200 bg-amber-50 text-[10px] text-amber-800"
                                >
                                  Stok menipis
                                </Badge>
                              )}
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                              {item.category} · {item.location}
                            </p>
                            <div className="mt-4 flex items-end justify-between gap-3">
                              <div>
                                <p className="text-[11px] text-slate-500">
                                  Jumlah tersedia
                                </p>
                                <p
                                  className={`mt-0.5 text-2xl font-bold ${
                                    isLow ? "text-amber-700" : "text-slate-900"
                                  }`}
                                >
                                  {item.quantity}
                                  <span className="ml-1 text-xs font-medium text-slate-500">
                                    {item.unit}
                                  </span>
                                </p>
                              </div>
                              <p className="text-right text-[11px] leading-4 text-slate-500">
                                Minimum stok
                                <br />
                                <span className="font-semibold text-slate-700">
                                  {item.minimum} {item.unit}
                                </span>
                              </p>
                            </div>

                            {isLow && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-3 h-9 w-full rounded-lg border-amber-200 text-amber-800 hover:bg-amber-50"
                                onClick={() => {
                                  setFindingType(
                                    item.category === "Kabel" ||
                                      item.category === "Konektor"
                                      ? "STOCK_LOW"
                                      : "STOCK_LOW",
                                  )
                                  setFindingAsset("")
                                  setFindingTitle(
                                    `Stok ${item.name} perlu ditindaklanjuti`,
                                  )
                                  setFindingDescription(
                                    `Stok saat ini ${item.quantity} ${item.unit}, sedangkan minimum stok ${item.minimum} ${item.unit}. Mohon dilakukan pemeriksaan.`,
                                  )
                                  setShowFindingForm(true)
                                  setActiveTab("findings")
                                }}
                              >
                                <AlertTriangle size={14} />
                                Laporkan Stok Menipis
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                {filteredStock.length === 0 && (
                  <EmptyState
                    title="Material tidak ditemukan"
                    description="Coba kata pencarian yang berbeda."
                  />
                )}
              </div>
            </>
          )}

          {activeTab === "findings" && (
            <>
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Inventory Findings
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Laporkan masalah aset atau material
                  </p>
                </div>
                {!showFindingForm && (
                  <Button
                    size="sm"
                    className="shrink-0 rounded-xl"
                    onClick={() => setShowFindingForm(true)}
                  >
                    <Plus size={15} />
                    Buat Temuan
                  </Button>
                )}
              </div>

              {showFindingForm && (
                <Card className="mb-4 rounded-2xl border-blue-200 shadow-sm">
                  <CardContent className="p-4">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          Buat Inventory Finding
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Isi informasi masalah yang ditemukan di site.
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label="Tutup formulir"
                        onClick={() => resetFindingForm()}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <form
                      onSubmit={handleCreateFinding}
                      className="space-y-4"
                    >
                      <div>
                        <label
                          htmlFor="finding-title"
                          className="mb-1.5 block text-xs font-semibold text-slate-700"
                        >
                          Judul temuan <span className="text-red-500">*</span>
                        </label>

                        <input
                          id="finding-title"
                          required
                          maxLength={120}
                          value={findingTitle}
                          onChange={(event) =>
                            setFindingTitle(event.target.value)
                          }
                          placeholder="Contoh: Router tidak menyala"
                          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />

                      </div>
                      <div>

                        <label

                          htmlFor="finding-type"

                          className="mb-1.5 block text-xs font-semibold text-slate-700"

                        >
                          Jenis temuan
                        </label>

                        <select

                          id="finding-type"

                          value={findingType}

                          onChange={(event) =>

                            setFindingType(event.target.value as FindingType)

                          }

                          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"

                        >

                          {Object.entries(findingTypeLabels).map(

                            ([value, label]) => (

                              <option key={value} value={value}>

                                {label}

                              </option>

                            ),

                          )}

                        </select>

                      </div>

                      <div>
                        <label
                          htmlFor="finding-asset"
                          className="mb-1.5 block text-xs font-semibold text-slate-700"
                        >
                          Aset terkait
                        </label>

                        <select
                          id="finding-asset"
                          value={findingAsset}
                          onChange={(event) =>
                            setFindingAsset(event.target.value)
                          }
                          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="">Tidak terkait aset tertentu</option>
                          {assets.map((asset) => (
                            <option key={asset.id} value={asset.tag}>
                              {asset.name} — {asset.tag}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="finding-description"
                          className="mb-1.5 block text-xs font-semibold text-slate-700"
                        >
                          Deskripsi <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="finding-description"
                          required
                          minLength={5}
                          maxLength={2000}
                          rows={4}
                          value={findingDescription}
                          onChange={(event) =>
                            setFindingDescription(event.target.value)
                          }
                          placeholder="Jelaskan kondisi yang ditemukan dan lokasi detailnya..."
                          className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm leading-5 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                        <p className="mt-1 text-right text-[11px] text-slate-400">
                          {findingDescription.length}/2000
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <label htmlFor="finding-evidence" className="block text-xs font-semibold text-slate-700">
                              Bukti foto <span className="text-red-500">*</span>
                            </label>
                            <p className="mt-1 text-[11px] leading-5 text-slate-500">Minimal 1 foto, maksimal 5 foto. Format gambar, maksimal 10 MB per foto.</p>
                          </div>
                          <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">{findingAttachments.length}/5</span>
                        </div>

                        <input id="finding-evidence" type="file" accept="image/*" multiple onChange={handleFindingFiles} disabled={findingAttachments.length >= 5} className="sr-only" />
                        <label htmlFor="finding-evidence" className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-5 text-center transition ${findingAttachments.length >= 5 ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-50" : "border-blue-200 bg-blue-50/50 hover:border-blue-400 hover:bg-blue-50"}`}>
                          <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm">
                            <ImagePlus size={20} />
                          </div>
                          <span className="text-xs font-semibold text-slate-800">Pilih foto bukti</span>
                          <span className="mt-1 text-[11px] text-slate-500">Foto kerusakan, kondisi aset, atau stok</span>
                        </label>
                        {findingAttachments.length > 0 && (
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {findingAttachments.map((attachment) => (
                              <div key={attachment.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                                <div className="relative">
                                  <img src={attachment.previewUrl} alt={`Preview ${attachment.name}`} className="aspect-square w-full object-cover" />
                                  <button type="button" aria-label={`Hapus ${attachment.name}`} onClick={() => removeFindingAttachment(attachment.id)} className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-slate-950/75 text-white transition hover:bg-red-600">
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                                <div className="p-2">
                                  <p className="truncate text-[11px] font-medium text-slate-700">{attachment.name}</p>
                                  <p className="mt-0.5 text-[10px] text-slate-400">{(attachment.size / (1024 * 1024)).toFixed(2)} MB</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                        <p className="text-xs leading-5 text-amber-900">
                          Mode demo: temuan dan preview foto hanya tersimpan sementara di halaman ini. Tidak ada data atau foto yang dikirim ke backend.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1 rounded-xl"
                          onClick={() => resetFindingForm()}
                        >
                          Batal
                        </Button>
                        <Button type="submit" className="flex-1 rounded-xl">
                          <Plus size={15} />
                          Simpan Temuan
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-500">
                  {filteredFindings.length} temuan
                </p>
                <select
                  aria-label="Filter status temuan"
                  value={findingFilter}
                  onChange={(event) => setFindingFilter(event.target.value)}
                  className="h-9 max-w-[155px] rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:border-blue-400"
                >
                  <option value="ALL">Semua status</option>
                  <option value="OPEN">Terbuka</option>
                  <option value="UNDER_REVIEW">Ditinjau</option>
                  <option value="RESOLVED">Selesai</option>
                  <option value="CLOSED">Ditutup</option>
                  <option value="REJECTED">Ditolak</option>
                </select>
              </div>

              <div className="space-y-3">
                {filteredFindings.map((finding) => (
                  <Card
                    key={finding.id}
                    className="rounded-2xl border-slate-200 shadow-sm"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                          <AlertTriangle size={19} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-[10px] text-slate-400">
                              {finding.id}
                            </span>
                            <StatusBadge status={finding.status} />
                          </div>
                          <h3 className="mt-1.5 text-sm font-semibold text-slate-900">
                            {finding.title}
                          </h3>
                          <p className="mt-1 text-xs text-slate-500">
                            {findingTypeLabels[finding.type]}
                          </p>
                          <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">
                            {finding.description}
                          </p>
                          <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                              <Clock3 size={12} />
                              {finding.createdAt}
                            </span>
                            <button
                              type="button"
                              onClick={() => setSelectedFinding(finding)}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900"
                            >
                              Lihat detail
                              <ArrowRight size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredFindings.length === 0 && (
                  <EmptyState
                    title="Belum ada temuan"
                    description="Coba ubah filter atau buat laporan temuan baru."
                  />
                )}
              </div>
            </>
          )}

          <div className="mt-6 flex items-start gap-2 border-t border-slate-200 pt-4">
            <ShieldAlert
              size={15}
              className="mt-0.5 shrink-0 text-slate-400"
            />
            <p className="text-[11px] leading-5 text-slate-500">
              Mode prototype: data aset, stok, dan temuan merupakan contoh.
              Perubahan belum tersimpan permanen, belum terhubung ke server,
              dan tidak mengubah stok aktual.
            </p>
          </div>
        </>
      )}
    </section>
  )
}