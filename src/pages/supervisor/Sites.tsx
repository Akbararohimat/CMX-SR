
import { useMemo, useState } from "react"
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock3,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  X,
  Pencil,
  Globe2,
  LocateFixed,
} from "lucide-react"

type Timezone = "Asia/Jakarta" | "Asia/Makassar" | "Asia/Jayapura"

type Site = {
  id: string
  siteCode: string
  schoolName: string
  address: string
  province: string
  latitude: number
  longitude: number
  radius: number
  timezone: Timezone
  isActive: boolean
  networkReady: boolean
  changeReason?: string
}

type SiteForm = Omit<Site, "id" | "networkReady" | "changeReason">

const timezoneOptions: { label: string; value: Timezone }[] = [
  { label: "WIB — Asia/Jakarta", value: "Asia/Jakarta" },
  { label: "WITA — Asia/Makassar", value: "Asia/Makassar" },
  { label: "WIT — Asia/Jayapura", value: "Asia/Jayapura" },
]

const initialSites: Site[] = [
  {
    id: "SITE-001",
    siteCode: "BDG-001",
    schoolName: "Sekolah Rakyat Bandung",
    address: "Jl. Contoh No. 10, Bandung",
    province: "Jawa Barat",
    latitude: -6.9175,
    longitude: 107.6191,
    radius: 100,
    timezone: "Asia/Jakarta",
    isActive: true,
    networkReady: true,
  },
  {
    id: "SITE-002",
    siteCode: "CKR-001",
    schoolName: "Sekolah Rakyat Cikarang",
    address: "Jl. Industri No. 20, Cikarang",
    province: "Jawa Barat",
    latitude: -6.2615,
    longitude: 107.1525,
    radius: 100,
    timezone: "Asia/Jakarta",
    isActive: true,
    networkReady: true,
  },
  {
    id: "SITE-003",
    siteCode: "JKT-001",
    schoolName: "Sekolah Rakyat Jakarta",
    address: "Jl. Merdeka No. 15, Jakarta",
    province: "DKI Jakarta",
    latitude: -6.2088,
    longitude: 106.8456,
    radius: 150,
    timezone: "Asia/Jakarta",
    isActive: true,
    networkReady: true,
  },
  {
    id: "SITE-004",
    siteCode: "DPS-001",
    schoolName: "Sekolah Rakyat Bali",
    address: "Jl. Denpasar No. 8, Denpasar",
    province: "Bali",
    latitude: -8.65,
    longitude: 115.2167,
    radius: 100,
    timezone: "Asia/Makassar",
    isActive: true,
    networkReady: true,
  },
]

const emptyForm: SiteForm = {
  siteCode: "",
  schoolName: "",
  address: "",
  province: "",
  latitude: -6.9175,
  longitude: 107.6191,
  radius: 100,
  timezone: "Asia/Jakarta",
  isActive: false,
}

function timezoneLabel(timezone: Timezone) {
  return (
    timezoneOptions.find((item) => item.value === timezone)?.label ??
    timezone
  )
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
        active
          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
          : "bg-slate-100 text-slate-600 ring-slate-200"
      }`}
    >
      {active ? (
        <CheckCircle2 className="size-3.5" />
      ) : (
        <Clock3 className="size-3.5" />
      )}
      {active ? "Aktif" : "Nonaktif"}
    </span>
  )
}

export default function Sites() {
  const [sites, setSites] = useState(initialSites)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [showForm, setShowForm] = useState(false)
  const [editingSite, setEditingSite] = useState<Site | null>(null)
  const [statusSite, setStatusSite] = useState<Site | null>(null)
  const [statusReason, setStatusReason] = useState("")
  const [form, setForm] = useState<SiteForm>(emptyForm)
  const [reason, setReason] = useState("")
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")

  const activeCount = sites.filter((site) => site.isActive).length
  const inactiveCount = sites.length - activeCount

  const filteredSites = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return sites.filter((site) => {
      const matchesSearch =
        !keyword ||
        site.siteCode.toLowerCase().includes(keyword) ||
        site.schoolName.toLowerCase().includes(keyword) ||
        site.address.toLowerCase().includes(keyword) ||
        site.province.toLowerCase().includes(keyword)

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && site.isActive) ||
        (statusFilter === "INACTIVE" && !site.isActive)

      return matchesSearch && matchesStatus
    })
  }, [sites, search, statusFilter])

  function closeForm() {
    setShowForm(false)
    setEditingSite(null)
    setForm(emptyForm)
    setReason("")
    setError("")
  }

  function openCreateForm() {
    setNotice("")
    setError("")
    setEditingSite(null)
    setForm(emptyForm)
    setReason("")
    setShowForm(true)
  }

  function openEditForm(site: Site) {
    setNotice("")
    setError("")
    setEditingSite(site)
    setForm({
      siteCode: site.siteCode,
      schoolName: site.schoolName,
      address: site.address,
      province: site.province,
      latitude: site.latitude,
      longitude: site.longitude,
      radius: site.radius,
      timezone: site.timezone,
      isActive: site.isActive,
    })
    setReason("")
    setShowForm(true)
  }

  function saveSite() {
    setError("")
    setNotice("")

    const code = form.siteCode.trim().toUpperCase()
    const name = form.schoolName.trim()

    if (!code || !name || !form.address.trim() || !form.province.trim()) {
      setError("Kode, nama sekolah, alamat, dan provinsi wajib diisi.")
      return
    }

    if (
      !Number.isFinite(form.latitude) ||
      form.latitude < -90 ||
      form.latitude > 90
    ) {
      setError("Latitude harus berada di antara -90 dan 90.")
      return
    }

    if (
      !Number.isFinite(form.longitude) ||
      form.longitude < -180 ||
      form.longitude > 180
    ) {
      setError("Longitude harus berada di antara -180 dan 180.")
      return
    }

    if (!Number.isInteger(form.radius) || form.radius <= 0) {
      setError("Radius geofence harus berupa bilangan bulat di atas 0 meter.")
      return
    }

    const duplicateCode = sites.some(
      (site) =>
        site.siteCode.toLowerCase() === code.toLowerCase() &&
        site.id !== editingSite?.id,
    )

    if (duplicateCode) {
      setError("Kode site sudah digunakan. Gunakan kode yang berbeda.")
      return
    }

    if (editingSite) {
      const criticalChange =
        editingSite.latitude !== form.latitude ||
        editingSite.longitude !== form.longitude ||
        editingSite.radius !== form.radius ||
        editingSite.timezone !== form.timezone

      if (criticalChange && !reason.trim()) {
        setError(
          "Alasan wajib diisi jika mengubah koordinat, radius, atau timezone.",
        )
        return
      }

      if (form.isActive && !editingSite.networkReady) {
        setError(
          "Site belum memiliki konfigurasi network link MAIN dan SECONDARY yang lengkap.",
        )
        return
      }

      const confirmed = window.confirm(
        criticalChange
          ? "Perubahan koordinat, radius, atau timezone memengaruhi validasi absensi berikutnya. Lanjutkan?"
          : "Simpan perubahan informasi site ini?",
      )

      if (!confirmed) return

      setSites((current) =>
        current.map((site) =>
          site.id === editingSite.id
            ? {
                ...site,
                ...form,
                siteCode: code,
                schoolName: name,
                changeReason: criticalChange ? reason.trim() : site.changeReason,
              }
            : site,
        ),
      )

      setNotice("Perubahan site tersimpan pada preview lokal.")
    } else {
      const newSite: Site = {
        ...form,
        id: `SITE-${String(Date.now()).slice(-6)}`,
        siteCode: code,
        schoolName: name,
        isActive: false,
        networkReady: false,
      }

      setSites((current) => [newSite, ...current])
      setNotice(
        "Site baru ditambahkan dalam status nonaktif. Lengkapi konfigurasi network link sebelum aktivasi.",
      )
    }

    closeForm()
  }

  function changeStatus() {
    if (!statusSite) return

    if (!statusReason.trim()) {
      setError("Alasan perubahan status wajib diisi.")
      return
    }

    if (!statusSite.isActive && !statusSite.networkReady) {
      setError(
        "Site belum memiliki tepat satu network link MAIN dan satu SECONDARY yang aktif.",
      )
      return
    }

    const nextActive = !statusSite.isActive
    const confirmed = window.confirm(
      nextActive
        ? `Aktifkan ${statusSite.schoolName}?`
        : `Nonaktifkan ${statusSite.schoolName}? Perubahan ini dapat memengaruhi operasional berikutnya.`,
    )

    if (!confirmed) return

    setSites((current) =>
      current.map((site) =>
        site.id === statusSite.id
          ? {
              ...site,
              isActive: nextActive,
              changeReason: statusReason.trim(),
            }
          : site,
      ),
    )

    setStatusSite(null)
    setStatusReason("")
    setError("")
    setNotice(
      `Status site diubah menjadi ${nextActive ? "aktif" : "nonaktif"} pada preview lokal.`,
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
            Master Data
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Master Site
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Kelola identitas sekolah dan pengaturan lokasi operasional EOS.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus className="size-4" />
          Tambah site
        </button>
      </div>

      {notice && (
        <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          <p>{notice}</p>
          <button
            onClick={() => setNotice("")}
            aria-label="Tutup pemberitahuan"
            className="ml-auto rounded p-1 hover:bg-emerald-100"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Total site</p>
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Building2 className="size-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-950">{sites.length}</p>
          <p className="mt-1 text-xs text-slate-500">Seluruh site terdaftar</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Site aktif</p>
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="size-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-950">{activeCount}</p>
          <p className="mt-1 text-xs text-slate-500">Berstatus aktif</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Site nonaktif</p>
            <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Clock3 className="size-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-950">{inactiveCount}</p>
          <p className="mt-1 text-xs text-slate-500">Belum aktif atau dinonaktifkan</p>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Daftar site</h2>
              <p className="mt-1 text-xs text-slate-500">
                Informasi lokasi dan konfigurasi dasar site.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari nama, kode, alamat..."
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="ALL">Semua status</option>
                <option value="ACTIVE">Aktif</option>
                <option value="INACTIVE">Nonaktif</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Site</th>
                <th className="px-5 py-3 font-semibold">Alamat</th>
                <th className="px-5 py-3 font-semibold">Timezone</th>
                <th className="px-5 py-3 font-semibold">Geofence</th>
                <th className="px-5 py-3 font-semibold">Network link</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredSites.map((site) => (
                <tr key={site.id} className="transition hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                        <Building2 className="size-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">
                          {site.schoolName}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {site.siteCode}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="max-w-xs px-5 py-4">
                    <p className="line-clamp-2 text-slate-700">{site.address}</p>
                    <p className="mt-1 text-xs text-slate-500">{site.province}</p>
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-2 text-slate-700">
                      <Globe2 className="size-4 text-slate-400" />
                      {timezoneLabel(site.timezone)}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-700">
                      {site.radius} meter
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {site.latitude.toFixed(5)}, {site.longitude.toFixed(5)}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        site.networkReady
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {site.networkReady ? "MAIN + SECONDARY" : "Belum lengkap"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge active={site.isActive} />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditForm(site)}
                        aria-label={`Edit ${site.schoolName}`}
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={() => {
                          setStatusSite(site)
                          setStatusReason("")
                          setError("")
                          setNotice("")
                        }}
                        className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                          site.isActive
                            ? "border-rose-200 text-rose-700 hover:bg-rose-50"
                            : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        }`}
                      >
                        {site.isActive ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredSites.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center">
                    <Search className="mx-auto size-8 text-slate-300" />
                    <p className="mt-3 font-semibold text-slate-700">
                      Site tidak ditemukan
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
          Menampilkan {filteredSites.length} dari {sites.length} site · Data preview
        </div>
      </section>

      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
        <AlertCircle className="mt-0.5 size-5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">Mode preview frontend</p>
          <p className="mt-1 text-xs leading-5 text-amber-800">
            Data contoh dan perubahan hanya berada di state halaman. Aktivasi
            site operasional membutuhkan tepat satu network link MAIN dan
            satu SECONDARY aktif. Validasi serta audit permanen harus dilakukan
            backend.
          </p>
        </div>
      </div>

      {(showForm || statusSite) && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-5">
          <section className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
            <header className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  {statusSite
                    ? `${statusSite.isActive ? "Nonaktifkan" : "Aktifkan"} site`
                    : editingSite
                      ? "Edit informasi site"
                      : "Tambah site"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {statusSite
                    ? statusSite.schoolName
                    : "Lengkapi identitas dan pengaturan lokasi site."}
                </p>
              </div>
              <button
                onClick={() => {
                  closeForm()
                  setStatusSite(null)
                  setStatusReason("")
                  setError("")
                }}
                aria-label="Tutup form"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="size-5" />
              </button>
            </header>

            <div className="space-y-5 p-5">
              {showForm && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Kode site
                      <input
                        value={form.siteCode}
                        onChange={(event) =>
                          setForm({ ...form, siteCode: event.target.value })
                        }
                        placeholder="Contoh: BDG-002"
                        className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </label>

                    <label className="block text-sm font-medium text-slate-700">
                      Nama sekolah
                      <input
                        value={form.schoolName}
                        onChange={(event) =>
                          setForm({ ...form, schoolName: event.target.value })
                        }
                        placeholder="Nama site atau sekolah"
                        className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </label>
                  </div>

                  <label className="block text-sm font-medium text-slate-700">
                    Alamat
                    <textarea
                      rows={2}
                      value={form.address}
                      onChange={(event) =>
                        setForm({ ...form, address: event.target.value })
                      }
                      placeholder="Alamat lengkap site"
                      className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </label>

                  <label className="block text-sm font-medium text-slate-700">
                    Provinsi
                    <input
                      value={form.province}
                      onChange={(event) =>
                        setForm({ ...form, province: event.target.value })
                      }
                      placeholder="Nama provinsi"
                      className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                    />
                  </label>

                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <LocateFixed className="size-4 text-blue-600" />
                      <h3 className="text-sm font-semibold text-slate-900">
                        Lokasi dan geofence
                      </h3>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block text-sm font-medium text-slate-700">
                        Latitude
                        <input
                          type="number"
                          step="any"
                          value={form.latitude}
                          onChange={(event) =>
                            setForm({
                              ...form,
                              latitude: Number(event.target.value),
                            })
                          }
                          className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                        />
                      </label>

                      <label className="block text-sm font-medium text-slate-700">
                        Longitude
                        <input
                          type="number"
                          step="any"
                          value={form.longitude}
                          onChange={(event) =>
                            setForm({
                              ...form,
                              longitude: Number(event.target.value),
                            })
                          }
                          className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                        />
                      </label>

                      <label className="block text-sm font-medium text-slate-700">
                        Radius absensi (meter)
                        <input
                          type="number"
                          min={1}
                          step={1}
                          value={form.radius}
                          onChange={(event) =>
                            setForm({
                              ...form,
                              radius: Number(event.target.value),
                            })
                          }
                          className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                        />
                      </label>

                      <label className="block text-sm font-medium text-slate-700">
                        Timezone site
                        <select
                          value={form.timezone}
                          onChange={(event) =>
                            setForm({
                              ...form,
                              timezone: event.target.value as Timezone,
                            })
                          }
                          className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
                        >
                          {timezoneOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <p className="mt-3 flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-xs leading-5 text-blue-800">
                      <MapPin className="mt-0.5 size-4 shrink-0" />
                      Koordinat saat ini diisi manual. Integrasi peta untuk
                      memilih marker dan melihat lingkaran radius bisa
                      ditambahkan berikutnya.
                    </p>
                  </div>

                  {editingSite && (
                    <label className="block text-sm font-medium text-slate-700">
                      Alasan perubahan
                      <textarea
                        rows={2}
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        placeholder="Wajib jika mengubah koordinat, radius, atau timezone"
                        className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
                      />
                    </label>
                  )}

                  {!editingSite && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
                      Site baru dibuat dalam status nonaktif. Konfigurasi
                      network link MAIN dan SECONDARY perlu disiapkan sebelum
                      site diaktifkan untuk operasional Daily Report.
                    </div>
                  )}
                </>
              )}

              {statusSite && (
                <>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">Site</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {statusSite.schoolName}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {statusSite.siteCode} · {statusSite.address}
                    </p>
                    <div className="mt-3">
                      <StatusBadge active={statusSite.isActive} />
                    </div>
                  </div>

                  {!statusSite.isActive && !statusSite.networkReady && (
                    <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                      <AlertCircle className="mt-0.5 size-4 shrink-0" />
                      <p>
                        Site belum memiliki network link MAIN dan SECONDARY
                        lengkap. Selesaikan konfigurasi tersebut sebelum
                        mengaktifkan site.
                      </p>
                    </div>
                  )}

                  <label className="block text-sm font-medium text-slate-700">
                    Alasan perubahan status
                    <textarea
                      rows={3}
                      value={statusReason}
                      onChange={(event) => {
                        setStatusReason(event.target.value)
                        setError("")
                      }}
                      placeholder="Tuliskan alasan perubahan status..."
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

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  onClick={() => {
                    closeForm()
                    setStatusSite(null)
                    setStatusReason("")
                    setError("")
                  }}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>

                <button
                  onClick={statusSite ? changeStatus : saveSite}
                  disabled={
                    Boolean(
                      statusSite &&
                        !statusSite.isActive &&
                        !statusSite.networkReady,
                    )
                  }
                  className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                    statusSite
                      ? statusSite.isActive
                        ? "bg-rose-600 hover:bg-rose-700"
                        : "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {statusSite
                    ? statusSite.isActive
                      ? "Konfirmasi nonaktifkan"
                      : "Konfirmasi aktivasi"
                    : editingSite
                      ? "Simpan perubahan"
                      : "Simpan site"}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
