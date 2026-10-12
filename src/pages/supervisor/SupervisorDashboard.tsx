
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  ClipboardCheck,
  MapPinned,
  Package,
  Users,
} from "lucide-react"

const stats = [
  {
    label: "Pengajuan Absensi",
    value: "12",
    detail: "Menunggu review",
    icon: ClipboardCheck,
    tone: "bg-amber-50 text-amber-700",
    trend: "Perlu ditinjau",
  },
  {
    label: "EOS Aktif",
    value: "48",
    detail: "Dalam cakupan operasional",
    icon: Users,
    tone: "bg-blue-50 text-blue-700",
    trend: "Data preview",
  },
  {
    label: "Site",
    value: "16",
    detail: "Seluruh site aktif",
    icon: MapPinned,
    tone: "bg-violet-50 text-violet-700",
    trend: "Data preview",
  },
  {
    label: "Inventory Finding",
    value: "7",
    detail: "Belum diselesaikan",
    icon: Package,
    tone: "bg-rose-50 text-rose-700",
    trend: "Perlu ditindaklanjuti",
  },
]

const requests = [
  {
    name: "Akbar",
    site: "Bandung",
    date: "12 Okt 2026",
    type: "Koreksi check-in",
    status: "Menunggu review",
  },
]

const findings = [
  {
    title: "Access Point tidak terhubung",
    site: "Site Bandung",
    status: "OPEN",
    tone: "bg-rose-50 text-rose-700",
  },
  {
    title: "Pemeriksaan inventaris",
    site: "Site Cikarang",
    status: "UNDER_REVIEW",
    tone: "bg-amber-50 text-amber-700",
  },
  {
    title: "Kondisi perangkat perlu dicek",
    site: "Site Jakarta",
    status: "OPEN",
    tone: "bg-rose-50 text-rose-700",
  },
]

function SectionHeading({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: string
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-base font-semibold text-slate-900">
          {title}
        </h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      {action && (
        <button
          type="button"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800"
        >
          {action}
          <ArrowRight className="size-4" />
        </button>
      )}
    </div>
  )
}

export default function SupervisorDashboard() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-blue-700">
            Overview Operasional
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Dashboard Supervisor
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Pantau absensi, penugasan EOS, dan temuan inventaris seluruh site.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5">
            <p className="text-xs text-slate-500">Tanggal operasional</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              12 Oktober 2026
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5">
            <p className="text-xs text-slate-500">Timezone preview</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              WIB · Asia/Jakarta
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const TrendIcon = index === 1 ? ArrowUpRight : ArrowDownRight

          return (
            <article
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100/70"
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

                <div className={`rounded-xl p-3 ${stat.tone}`}>
                  <Icon className="size-5" />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-500">{stat.detail}</p>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                  <TrendIcon className="size-3.5" />
                  {stat.trend}
                </span>
              </div>
            </article>
          )
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
          <SectionHeading
            title="Pengajuan Absensi"
            description="Pengajuan terbaru yang membutuhkan keputusan Supervisor."
            action="Lihat semua"
          />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left">
              <thead>
                <tr className="border-y border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                  <th className="py-3 pr-4 font-medium">EOS</th>
                  <th className="px-4 py-3 font-medium">Site</th>
                  <th className="px-4 py-3 font-medium">Tanggal</th>
                  <th className="px-4 py-3 font-medium">Jenis</th>
                  <th className="py-3 pl-4 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((request) => (
                  <tr
                    key={`${request.name}-${request.date}`}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="py-4 pr-4 text-sm font-medium text-slate-800">
                      {request.name}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {request.site}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {request.date}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {request.type}
                    </td>
                    <td className="py-4 pl-4">
                      <span className="inline-flex whitespace-nowrap rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Contoh tampilan. Belum terhubung ke API.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
          <SectionHeading
            title="Inventory Finding"
            description="Temuan yang perlu dipantau."
            action="Lihat semua"
          />

          <div className="space-y-4">
            {findings.map((finding) => (
              <div
                key={finding.title}
                className="flex items-start gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
              >
                <div className="rounded-lg bg-slate-100 p-2.5 text-slate-600">
                  <Package className="size-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">
                    {finding.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {finding.site}
                  </p>
                  <span
                    className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${finding.tone}`}
                  >
                    {finding.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
        <SectionHeading
          title="Aktivitas Operasional"
          description="Ringkasan area yang dapat ditindaklanjuti."
        />

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4">
            <Activity className="size-5 text-blue-700" />
            <p className="mt-3 text-sm font-semibold text-slate-800">
              Review absensi
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Periksa alasan, bukti pendukung, dan dampak koreksi sebelum
              memberikan keputusan.
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <Users className="size-5 text-violet-700" />
            <p className="mt-3 text-sm font-semibold text-slate-800">
              Assignment EOS
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Pastikan penugasan EOS sesuai site dan tanggal operasional.
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <Package className="size-5 text-rose-700" />
            <p className="mt-3 text-sm font-semibold text-slate-800">
              Tindak lanjut finding
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Pantau temuan sampai ada catatan penyelesaian dan referensi
              perubahan inventaris.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
