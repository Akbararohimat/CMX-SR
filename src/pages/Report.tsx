
import { useMemo, useState, type ChangeEvent } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  FileText,
  LockKeyhole,
  Paperclip,
  Save,
  Send,
  ShieldAlert,
  X,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type SectionId = "general" | "router" | "ap" | "infrastructure" | "connectivity"
type ReportStatus = "Draft" | "Submitted"

type Evidence = {
  name: string
  size: number
}

type ReportForm = {
  site: string
  date: string
  personnel: string
  activity: string
  generalNotes: string

  uptime: string
  cpu: string
  ram: string
  anomaly: string
  anomalyNotes: string

  apMonitoring: string
  apOffline: string
  cloudDocumentation: string
  cloudNotes: string

  electricity: string
  temperature: string
  environment: string
  electricityNotes: string
  environmentNotes: string

  mainTrafficStatus: string
  mainAvgIn: string
  mainPeakIn: string
  mainAvgOut: string
  mainPeakOut: string
  mainTrafficUnit: string
  mainSource: string
  mainTrafficNotes: string

  secondaryTrafficStatus: string
  secondaryAvgIn: string
  secondaryPeakIn: string
  secondaryAvgOut: string
  secondaryPeakOut: string
  secondaryTrafficUnit: string
  secondarySource: string
  secondaryTrafficNotes: string

  mainSpeedStatus: string
  mainDownload: string
  mainUpload: string
  mainSpeedUnit: string
  mainLatency: string
  mainJitter: string
  mainPacketLoss: string
  mainServer: string
  mainRoute: string
  mainSpeedNotes: string

  secondarySpeedStatus: string
  secondaryDownload: string
  secondaryUpload: string
  secondarySpeedUnit: string
  secondaryLatency: string
  secondaryJitter: string
  secondaryPacketLoss: string
  secondaryServer: string
  secondaryRoute: string
  secondarySpeedNotes: string
}

type DailyReport = {
  id: string
  status: ReportStatus
  createdAt: string
  form: ReportForm
  evidence: Record<SectionId, Evidence[]>
}

const sections: { id: SectionId; title: string; shortTitle: string; description: string }[] = [
  {
    id: "general",
    title: "Info Umum",
    shortTitle: "Info Umum",
    description: "Identitas laporan dan aktivitas operasional.",
  },
  {
    id: "router",
    title: "Router & Firewall",
    shortTitle: "Router",
    description: "Uptime, utilisasi resource, dan log anomali.",
  },
  {
    id: "ap",
    title: "Access Point",
    shortTitle: "Access Point",
    description: "Monitoring AP dan dokumentasi cloud.",
  },
  {
    id: "infrastructure",
    title: "Infrastruktur & Lingkungan",
    shortTitle: "Infrastruktur",
    description: "Kelistrikan, suhu, dan kondisi lingkungan.",
  },
  {
    id: "connectivity",
    title: "Konektivitas",
    shortTitle: "Konektivitas",
    description: "Traffic serta speedtest Main dan Secondary Link.",
  },
]

const emptyForm: ReportForm = {
  site: "SR-JBR-BDG-001",
  date: new Date().toLocaleDateString("en-CA"),
  personnel: "",
  activity: "",
  generalNotes: "",

  uptime: "",
  cpu: "",
  ram: "",
  anomaly: "NORMAL",
  anomalyNotes: "",

  apMonitoring: "UNKNOWN",
  apOffline: "",
  cloudDocumentation: "LENGKAP",
  cloudNotes: "",

  electricity: "NOT_CHECKED",
  temperature: "",
  environment: "NOT_CHECKED",
  electricityNotes: "",
  environmentNotes: "",

  mainTrafficStatus: "AVAILABLE",
  mainAvgIn: "",
  mainPeakIn: "",
  mainAvgOut: "",
  mainPeakOut: "",
  mainTrafficUnit: "MBPS",
  mainSource: "",
  mainTrafficNotes: "",

  secondaryTrafficStatus: "AVAILABLE",
  secondaryAvgIn: "",
  secondaryPeakIn: "",
  secondaryAvgOut: "",
  secondaryPeakOut: "",
  secondaryTrafficUnit: "MBPS",
  secondarySource: "",
  secondaryTrafficNotes: "",

  mainSpeedStatus: "SUCCESS",
  mainDownload: "",
  mainUpload: "",
  mainSpeedUnit: "MBPS",
  mainLatency: "",
  mainJitter: "",
  mainPacketLoss: "",
  mainServer: "",
  mainRoute: "TESTED_VIA_MAIN_LINK",
  mainSpeedNotes: "",

  secondarySpeedStatus: "SUCCESS",
  secondaryDownload: "",
  secondaryUpload: "",
  secondarySpeedUnit: "MBPS",
  secondaryLatency: "",
  secondaryJitter: "",
  secondaryPacketLoss: "",
  secondaryServer: "",
  secondaryRoute: "TESTED_VIA_SECONDARY_LINK",
  secondarySpeedNotes: "",
}

const emptyEvidence = (): Record<SectionId, Evidence[]> => ({
  general: [],
  router: [],
  ap: [],
  infrastructure: [],
  connectivity: [],
})

const statusStyles: Record<ReportStatus, string> = {
  Draft: "bg-slate-100 text-slate-600",
  Submitted: "bg-blue-50 text-blue-700",
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  min,
  max,
  step,
  error,
  help,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  required?: boolean
  min?: number
  max?: number
  step?: number | "any"
  error?: string
  help?: string
}) {
  return (
    <div className="min-w-0">
      <label className="mb-2 block text-xs font-semibold text-slate-700">
        {label}{required ? " *" : ""}
      </label>
      <input
        type={type}
        value={value}
        required={required}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`h-11 w-full rounded-xl border bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
          error ? "border-red-400" : "border-slate-200"
        }`}
      />
      {help && <p className="mt-1 text-[11px] leading-5 text-slate-400">{help}</p>}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  maxLength = 500,
  error,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  maxLength?: number
  error?: string
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-700">
        {label}{required ? " *" : ""}
      </label>
      <textarea
        value={value}
        maxLength={maxLength}
        rows={3}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`w-full resize-y rounded-xl border bg-white px-3 py-3 text-sm leading-6 text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
          error ? "border-red-400" : "border-slate-200"
        }`}
      />
      <div className="mt-1 flex items-start justify-between gap-2">
        {error ? <p className="text-xs text-red-500">{error}</p> : <span />}
        <span className="shrink-0 text-[10px] text-slate-400">
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
  required = false,
  help,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { label: string; value: string }[]
  required?: boolean
  help?: string
}) {
  return (
    <div className="min-w-0">
      <label className="mb-2 block text-xs font-semibold text-slate-700">
        {label}{required ? " *" : ""}
      </label>
      <select
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {help && <p className="mt-1 text-[11px] leading-5 text-slate-400">{help}</p>}
    </div>
  )
}

function SectionHeading({
  number,
  title,
  description,
}: {
  number: number
  title: string
  description: string
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-700">
          {number}
        </div>
        <div>
          <h2 className="text-base font-bold text-[#071b49]">{title}</h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
        </div>
      </div>
    </div>
  )
}

function EvidenceUpload({
  files,
  onChange,
  required,
  totalReportFiles,
}: {
  files: Evidence[]
  onChange: (files: Evidence[]) => void
  required: boolean
  totalReportFiles: number
}) {
  const [uploadError, setUploadError] = useState("")

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? [])
    const next = [...files]
    const maxFileSize = 10 * 1024 * 1024
    let addedCount = 0
    const messages: string[] = []

    for (const file of selected) {
      const supported =
        file.type.startsWith("image/") ||
        file.type === "application/pdf" ||
        /\.(png|jpe?g|webp|gif|pdf|heic|heif)$/i.test(file.name)

      if (!supported) {
        messages.push(`${file.name}: format tidak didukung. Gunakan gambar atau PDF.`)
        continue
      }

      if (file.size > maxFileSize) {
        messages.push(`${file.name}: ukuran file melebihi 10 MB.`)
        continue
      }

      const duplicate = next.some(
        (item) => item.name === file.name && item.size === file.size,
      )

      if (duplicate) {
        messages.push(`${file.name}: file sudah ditambahkan pada section ini.`)
        continue
      }

      if (next.length >= 5) {
        messages.push("Batas 5 file per section sudah tercapai.")
        break
      }

      if (totalReportFiles + addedCount >= 10) {
        messages.push("Batas 10 file untuk satu laporan sudah tercapai.")
        break
      }

      next.push({ name: file.name, size: file.size })
      addedCount += 1
    }

    if (addedCount > 0) onChange(next)
    setUploadError(messages.join(" "))
    event.target.value = ""
  }

  const limitReached = files.length >= 5 || totalReportFiles >= 10

  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-4">
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
          <Paperclip className="size-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold text-slate-800">
              Evidence {required ? "*" : "(opsional)"}
            </p>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
              {files.length}/5 file
            </span>
          </div>

          <p className="mt-1 text-[11px] leading-5 text-slate-500">
            {required
              ? "Minimal 1 file diperlukan untuk section ini."
              : "Lampiran tambahan, tidak wajib."}{" "}
            Format gambar atau PDF, maksimal 10 MB per file.
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            Total laporan: {totalReportFiles}/10 file
          </p>

          <label
            className={`mt-3 inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 ${
              limitReached
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer hover:bg-slate-50"
            }`}
          >
            Pilih file
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              className="sr-only"
              disabled={limitReached}
              onChange={handleFiles}
            />
          </label>
        </div>
      </div>

      {uploadError && (
        <div
          role="alert"
          aria-live="polite"
          className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-700"
        >
          {uploadError}
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${file.size}-${index}`}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5"
            >
              <FileText className="size-4 shrink-0 text-blue-600" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-slate-700">
                  {file.name}
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB · Metadata demo, belum diunggah ke server
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onChange(files.filter((_, i) => i !== index))
                  setUploadError("")
                }}
                aria-label={`Hapus ${file.name}`}
                className="flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function App() {
  const [form, setForm] = useState<ReportForm>({ ...emptyForm })
  const [evidence, setEvidence] = useState(emptyEvidence())
  const [currentSection, setCurrentSection] = useState<SectionId>("general")
  const [reports, setReports] = useState<DailyReport[]>([])
  const [view, setView] = useState<"form" | "review" | "history" | "detail">("form")
  const [selectedReport, setSelectedReport] = useState<DailyReport | null>(null)
  const [notice, setNotice] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const currentIndex = sections.findIndex((section) => section.id === currentSection)
  const activeReport = selectedReport

  const submittedCount = useMemo(
    () => reports.filter((report) => report.status === "Submitted").length,
    [reports],
  )

  function update<K extends keyof ReportForm>(key: K, value: ReportForm[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => {
      if (!current[key as string]) return current
      const next = { ...current }
      delete next[key as string]
      return next
    })
  }

  function updateEvidence(section: SectionId, files: Evidence[]) {
    setEvidence((current) => ({ ...current, [section]: files }))
    setErrors((current) => {
      const next = { ...current }
      delete next[`evidence.${section}`]
      return next
    })
  }
  function validateSection(section: SectionId): boolean {
    const next: Record<string, string> = {}

    if (section === "general") {
      if (!form.site) next.site = "Site wajib dipilih."
      if (!form.date) next.date = "Tanggal wajib diisi."
      if (form.date > new Date().toLocaleDateString("en-CA")) {
        next.date = "Tanggal tidak boleh di masa depan."
      }
      if (!form.personnel.trim()) next.personnel = "Tim/personel wajib diisi."
      if (form.activity.trim().length < 3) {
        next.activity = "Kegiatan wajib diisi minimal 3 karakter."
      }
    }

    if (section === "router") {
      if (form.uptime.trim() === "") next.uptime = "Uptime wajib diisi."
      if (form.cpu === "" || Number(form.cpu) < 0 || Number(form.cpu) > 100) {
        next.cpu = "Masukkan persentase CPU antara 0–100."
      }
      if (form.ram === "" || Number(form.ram) < 0 || Number(form.ram) > 100) {
        next.ram = "Masukkan persentase RAM antara 0–100."
      }
      if (form.anomaly === "MINOR" && !form.anomalyNotes.trim()) {
        next.anomalyNotes = "Catatan anomali minor wajib diisi."
      }
      if (["MAJOR", "NOT_CHECKED"].includes(form.anomaly) && !form.anomalyNotes.trim()) {
        next.anomalyNotes = "Alasan/catatan wajib diisi."
      }
      if (form.anomaly === "MAJOR" && evidence.router.length === 0) {
        next["evidence.router"] = "Anomali major membutuhkan evidence."
      }
      if (evidence.router.length === 0) {
        next["evidence.router"] = "Bagian Router & Firewall membutuhkan minimal 1 evidence."
      }
    }

    if (section === "ap") {
      if (form.apMonitoring === "UNKNOWN" && !form.cloudNotes.trim()) {
        next.cloudNotes = "Alasan status unknown wajib diisi."
      }
      if (form.apMonitoring === "NORMAL" && form.apOffline !== "0") {
        next.apOffline = "Status NORMAL mengharuskan jumlah AP offline = 0."
      }
      if (["WARNING", "DOWN"].includes(form.apMonitoring) &&
          (form.apOffline === "" || Number(form.apOffline) < 1)) {
        next.apOffline = "Status WARNING/DOWN mengharuskan minimal 1 AP offline."
      }
      if (form.apMonitoring !== "UNKNOWN" &&
          (form.apOffline === "" || Number(form.apOffline) < 0 ||
          !Number.isInteger(Number(form.apOffline)))) {
        next.apOffline = "Masukkan jumlah AP offline berupa bilangan bulat 0 atau lebih."
      }
      if (form.cloudDocumentation !== "LENGKAP" && !form.cloudNotes.trim()) {
        next.cloudNotes = "Catatan wajib untuk dokumentasi yang belum lengkap atau bermasalah."
      }
      if (evidence.ap.length === 0) {
        next["evidence.ap"] = "Bagian Access Point membutuhkan minimal 1 evidence."
      }
    }

    if (section === "infrastructure") {
      if (form.temperature === "" || Number(form.temperature) < -20 || Number(form.temperature) > 80) {
        next.temperature = "Suhu wajib diisi dengan rentang -20 sampai 80 °C."
      }
      if (form.electricity !== "NORMAL" && !form.electricityNotes.trim()) {
        next.electricityNotes = "Catatan/alasan kondisi kelistrikan wajib diisi."
      }
      if (["UNSTABLE", "OUTAGE", "BACKUP_ACTIVE"].includes(form.electricity) &&
          evidence.infrastructure.length === 0) {
        next["evidence.infrastructure"] = "Kondisi kelistrikan ini membutuhkan evidence."
      }
      if (form.environment !== "GOOD" && !form.environmentNotes.trim()) {
        next.environmentNotes = "Catatan/alasan kondisi lingkungan wajib diisi."
      }
      if (form.environment === "UNFIT" && evidence.infrastructure.length === 0) {
        next["evidence.infrastructure"] = "Kondisi lingkungan UNFIT membutuhkan evidence."
      }
      if (evidence.infrastructure.length === 0) {
        next["evidence.infrastructure"] = "Bagian Infrastruktur membutuhkan minimal 1 evidence."
      }
    }

    if (section === "connectivity") {
      const traffic = [
        {
          prefix: "main",
          status: form.mainTrafficStatus,
          avgIn: form.mainAvgIn,
          peakIn: form.mainPeakIn,
          avgOut: form.mainAvgOut,
          peakOut: form.mainPeakOut,
          source: form.mainSource,
          notes: form.mainTrafficNotes,
        },
        {
          prefix: "secondary",
          status: form.secondaryTrafficStatus,
          avgIn: form.secondaryAvgIn,
          peakIn: form.secondaryPeakIn,
          avgOut: form.secondaryAvgOut,
          peakOut: form.secondaryPeakOut,
          source: form.secondarySource,
          notes: form.secondaryTrafficNotes,
        },
      ]

      for (const link of traffic) {
        if (link.status === "AVAILABLE") {
          for (const [suffix, value] of [
            ["Avg Inbound", link.avgIn],
            ["Peak Inbound", link.peakIn],
            ["Avg Outbound", link.avgOut],
            ["Peak Outbound", link.peakOut],
          ]) {
            if (value === "" || Number(value) < 0) {
              next[`${link.prefix}${suffix.replaceAll(" ", "")}`] =
                `${suffix} ${link.prefix} wajib berupa angka 0 atau lebih.`
            }
          }
          if (!link.source.trim()) {
            next[`${link.prefix}Source`] = "Sumber monitoring wajib diisi."
          }
        } else if (!link.notes.trim()) {
          next[`${link.prefix}TrafficNotes`] = "Alasan status link wajib diisi."
        }

        if (link.status === "DOWN" && evidence.connectivity.length === 0) {
          next["evidence.connectivity"] = "Status link DOWN membutuhkan evidence."
        }
      }

      const speeds = [
        {
          prefix: "main",
          status: form.mainSpeedStatus,
          download: form.mainDownload,
          upload: form.mainUpload,
          latency: form.mainLatency,
          jitter: form.mainJitter,
          notes: form.mainSpeedNotes,
        },
        {
          prefix: "secondary",
          status: form.secondarySpeedStatus,
          download: form.secondaryDownload,
          upload: form.secondaryUpload,
          latency: form.secondaryLatency,
          jitter: form.secondaryJitter,
          notes: form.secondarySpeedNotes,
        },
      ]

      for (const speed of speeds) {
        if (speed.status === "SUCCESS") {
          if (speed.download === "" || Number(speed.download) < 0) {
            next[`${speed.prefix}Download`] = "Download wajib berupa angka 0 atau lebih."
          }
          if (speed.upload === "" || Number(speed.upload) < 0) {
            next[`${speed.prefix}Upload`] = "Upload wajib berupa angka 0 atau lebih."
          }
          if (speed.latency === "" || Number(speed.latency) < 0) {
            next[`${speed.prefix}Latency`] = "Latency wajib diisi."
          }
          if (speed.jitter === "" || Number(speed.jitter) < 0) {
            next[`${speed.prefix}Jitter`] = "Jitter wajib diisi."
          }
          if (evidence.connectivity.length === 0) {
            next["evidence.connectivity"] =
              "Speedtest sukses membutuhkan evidence screenshot."
          }
        } else if (!speed.notes.trim()) {
          next[`${speed.prefix}SpeedNotes`] = "Alasan failed/not tested wajib diisi."
        }
      }

      if (evidence.connectivity.length === 0) {
        next["evidence.connectivity"] =
          "Bagian Konektivitas membutuhkan minimal 1 evidence."
      }
    }

    setErrors((current) => {
      const remaining = { ...current }
      for (const key of Object.keys(remaining)) {
        if (
          key === section ||
          key.startsWith(`${section}.`) ||
          (section === "router" && ["uptime", "cpu", "ram", "anomalyNotes"].includes(key)) ||
          (section === "ap" && ["apOffline", "cloudNotes"].includes(key)) ||
          (section === "infrastructure" &&
            ["temperature", "electricityNotes", "environmentNotes"].includes(key)) ||
          (section === "connectivity" &&
            /^(main|secondary)/.test(key))
        ) {
          delete remaining[key]
        }
      }
      return { ...remaining, ...next }
    })

    return Object.keys(next).length === 0
  }

  function validateAll(): boolean {
    const result = sections.map((section) => validateSection(section.id))
    return result.every(Boolean)
  }

  function goNext() {
    setNotice("")
    if (!validateSection(currentSection)) {
      setNotice("Masih ada bagian yang perlu diperbaiki. Periksa pesan merah pada form.")
      return
    }

    if (currentIndex < sections.length - 1) {
      setCurrentSection(sections[currentIndex + 1].id)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      setView("review")
      setNotice("")
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  function goBackSection() {
    if (currentIndex > 0) {
      setCurrentSection(sections[currentIndex - 1].id)
      setNotice("")
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  function saveDraft() {
    if (!form.date || !form.site) {
      setNotice("Tanggal dan site harus diisi sebelum menyimpan draft.")
      return
    }

    const report: DailyReport = {
      id: `DR-DEMO-${Date.now()}`,
      status: "Draft",
      createdAt: new Date().toLocaleString("id-ID"),
      form: { ...form },
      evidence: { ...evidence },
    }

    setReports((current) => [report, ...current])
    setSelectedReport(report)
    setView("detail")
    setNotice("Draft ditambahkan ke sesi prototype ini. Data belum tersimpan permanen atau dikirim ke server.")
  }

  function submitReport() {
    setNotice("")
    if (!validateAll()) {
      setView("form")
      const firstInvalid = sections.find((section) => {
        return !validateSection(section.id)
      })
      if (firstInvalid) setCurrentSection(firstInvalid.id)
      setNotice("Laporan belum lengkap. Periksa bagian yang ditandai.")
      return
    }

    const report: DailyReport = {
      id: `DR-DEMO-${Date.now()}`,
      status: "Submitted",
      createdAt: new Date().toLocaleString("id-ID"),
      form: { ...form },
      evidence: { ...evidence },
    }

    setReports((current) => [report, ...current])
    setSelectedReport(report)
    setView("detail")
    setNotice(
      "Simulasi submit selesai. Status ini hanya berlaku di prototype dan belum menjadi laporan resmi di server.",
    )
  }

  function startNewReport() {
    setForm({ ...emptyForm })
    setEvidence(emptyEvidence())
    setErrors({})
    setCurrentSection("general")
    setSelectedReport(null)
    setNotice("")
    setView("form")
  }

  function openReport(report: DailyReport) {
    setSelectedReport(report)
    setNotice("")
    setView("detail")
  }

  function backToForm() {
    if (activeReport) {
      setForm({ ...activeReport.form })
      setEvidence({ ...activeReport.evidence })
    }
    setView("form")
    setNotice("")
  }

  function renderEvidence(section: SectionId, required: boolean) {
    const totalReportFiles = Object.values(evidence).reduce(
      (total, sectionFiles) => total + sectionFiles.length,
      0,
    )

    return (
      <EvidenceUpload
        files={evidence[section]}
        required={required}
        totalReportFiles={totalReportFiles}
        onChange={(files) => updateEvidence(section, files)}
      />
    )
  }

  function renderTraffic(
    link: "main" | "secondary",
    title: string,
  ) {
    const isMain = link === "main"
    const statusKey = isMain ? "mainTrafficStatus" : "secondaryTrafficStatus"
    const avgInKey = isMain ? "mainAvgIn" : "secondaryAvgIn"
    const peakInKey = isMain ? "mainPeakIn" : "secondaryPeakIn"
    const avgOutKey = isMain ? "mainAvgOut" : "secondaryAvgOut"
    const peakOutKey = isMain ? "mainPeakOut" : "secondaryPeakOut"
    const unitKey = isMain ? "mainTrafficUnit" : "secondaryTrafficUnit"
    const sourceKey = isMain ? "mainSource" : "secondarySource"
    const notesKey = isMain ? "mainTrafficNotes" : "secondaryTrafficNotes"

    return (
      <div className="rounded-2xl border border-slate-200 p-4">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-[#071b49]">{title}</h3>
          <Badge className="border-0 bg-slate-100 text-slate-600">
            08.00–17.00
          </Badge>
        </div>

        <div className="space-y-4">
          <SelectField
            label="Status link"
            value={form[statusKey]}
            onChange={(value) => update(statusKey, value)}
            options={[
              { label: "Available", value: "AVAILABLE" },
              { label: "Down", value: "DOWN" },
              { label: "Not checked", value: "NOT_CHECKED" },
            ]}
            required
          />

          {form[statusKey] === "AVAILABLE" ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Avg Inbound"
                  value={form[avgInKey]}
                  onChange={(value) => update(avgInKey, value)}
                  type="number"
                  min={0}
                  step="any"
                  required
                  error={errors[`${link}AvgInbound`]}
                />
                <Field
                  label="Peak Inbound"
                  value={form[peakInKey]}
                  onChange={(value) => update(peakInKey, value)}
                  type="number"
                  min={0}
                  step="any"
                  required
                  error={errors[`${link}PeakInbound`]}
                />
                <Field
                  label="Avg Outbound"
                  value={form[avgOutKey]}
                  onChange={(value) => update(avgOutKey, value)}
                  type="number"
                  min={0}
                  step="any"
                  required
                  error={errors[`${link}AvgOutbound`]}
                />
                <Field
                  label="Peak Outbound"
                  value={form[peakOutKey]}
                  onChange={(value) => update(peakOutKey, value)}
                  type="number"
                  min={0}
                  step="any"
                  required
                  error={errors[`${link}PeakOutbound`]}
                />
              </div>

              <SelectField
                label="Satuan throughput"
                value={form[unitKey]}
                onChange={(value) => update(unitKey, value)}
                options={[
                  { label: "Kbps", value: "KBPS" },
                  { label: "Mbps", value: "MBPS" },
                ]}
                required
                help="Satuan dibatasi ke Kbps atau Mbps."
              />

              <Field
                label="Sumber dashboard / monitoring"
                value={form[sourceKey]}
                onChange={(value) => update(sourceKey, value)}
                placeholder="Contoh: Dashboard router"
                required
                error={errors[`${link}Source`]}
              />
            </>
          ) : (
            <TextArea
              label="Catatan / alasan"
              value={form[notesKey]}
              onChange={(value) => update(notesKey, value)}
              placeholder="Jelaskan kondisi link atau alasan belum diperiksa..."
              required
              error={errors[`${link}TrafficNotes`]}
            />
          )}

          {form[statusKey] === "AVAILABLE" && (
            <TextArea
              label="Catatan tambahan"
              value={form[notesKey]}
              onChange={(value) => update(notesKey, value)}
              placeholder="Catatan tambahan jika diperlukan..."
            />
          )}
        </div>
      </div>
    )
  }

  function renderSpeedtest(
    link: "main" | "secondary",
    title: string,
  ) {
    const isMain = link === "main"
    const statusKey = isMain ? "mainSpeedStatus" : "secondarySpeedStatus"
    const downloadKey = isMain ? "mainDownload" : "secondaryDownload"
    const uploadKey = isMain ? "mainUpload" : "secondaryUpload"
    const unitKey = isMain ? "mainSpeedUnit" : "secondarySpeedUnit"
    const latencyKey = isMain ? "mainLatency" : "secondaryLatency"
    const jitterKey = isMain ? "mainJitter" : "secondaryJitter"
    const packetLossKey = isMain ? "mainPacketLoss" : "secondaryPacketLoss"
    const serverKey = isMain ? "mainServer" : "secondaryServer"
    const routeKey = isMain ? "mainRoute" : "secondaryRoute"
    const notesKey = isMain ? "mainSpeedNotes" : "secondarySpeedNotes"

    return (
      <div className="rounded-2xl border border-slate-200 p-4">
        <h3 className="mb-4 text-sm font-bold text-[#071b49]">{title}</h3>

        <div className="space-y-4">
          <SelectField
            label="Status speedtest"
            value={form[statusKey]}
            onChange={(value) => update(statusKey, value)}
            options={[
              { label: "Success", value: "SUCCESS" },
              { label: "Failed", value: "FAILED" },
              { label: "Not tested", value: "NOT_TESTED" },
            ]}
            required
          />

          {form[statusKey] === "SUCCESS" ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Download"
                  value={form[downloadKey]}
                  onChange={(value) => update(downloadKey, value)}
                  type="number"
                  min={0}
                  step="any"
                  required
                  error={errors[`${link}Download`]}
                />
                <Field
                  label="Upload"
                  value={form[uploadKey]}
                  onChange={(value) => update(uploadKey, value)}
                  type="number"
                  min={0}
                  step="any"
                  required
                  error={errors[`${link}Upload`]}
                />
              </div>

              <SelectField
                label="Satuan throughput"
                value={form[unitKey]}
                onChange={(value) => update(unitKey, value)}
                options={[
                  { label: "Mbps", value: "MBPS" },
                  { label: "Kbps", value: "KBPS" },
                ]}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Latency (ms)"
                  value={form[latencyKey]}
                  onChange={(value) => update(latencyKey, value)}
                  type="number"
                  min={0}
                  step="any"
                  required
                  error={errors[`${link}Latency`]}
                />
                <Field
                  label="Jitter (ms)"
                  value={form[jitterKey]}
                  onChange={(value) => update(jitterKey, value)}
                  type="number"
                  min={0}
                  step="any"
                  required
                  error={errors[`${link}Jitter`]}
                />
              </div>

              <Field
                label="Packet loss (%)"
                value={form[packetLossKey]}
                onChange={(value) => update(packetLossKey, value)}
                type="number"
                min={0}
                max={100}
                step="any"
                help="Opsional. Nilai antara 0–100."
              />

              <Field
                label="Nama server speedtest"
                value={form[serverKey]}
                onChange={(value) => update(serverKey, value)}
                placeholder="Opsional"
              />

              <SelectField
                label="Deklarasi rute pengujian"
                value={form[routeKey]}
                onChange={(value) => update(routeKey, value)}
                options={[
                  { label: "Tested via Main Link", value: "TESTED_VIA_MAIN_LINK" },
                  { label: "Tested via Secondary Link", value: "TESTED_VIA_SECONDARY_LINK" },
                ]}
                required
                help="Deklarasi rute tidak membuktikan jalur aktual secara otomatis."
              />
            </>
          ) : (
            <TextArea
              label="Alasan gagal / tidak dites"
              value={form[notesKey]}
              onChange={(value) => update(notesKey, value)}
              placeholder="Contoh: Link down, pengujian tidak dapat dilakukan..."
              required
              error={errors[`${link}SpeedNotes`]}
            />
          )}

          {form[statusKey] === "SUCCESS" && (
            <TextArea
              label="Catatan tambahan"
              value={form[notesKey]}
              onChange={(value) => update(notesKey, value)}
              placeholder="Catatan tambahan jika diperlukan..."
            />
          )}
        </div>
      </div>
    )
  }

  function renderSection() {
    if (view === "detail" && selectedReport) {
      return (
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-slate-400">{selectedReport.id}</p>
                <h2 className="mt-1 text-lg font-bold text-[#071b49]">
                  Detail Daily Report
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Dibuat {selectedReport.createdAt}
                </p>
              </div>
              <Badge className={`border-0 ${statusStyles[selectedReport.status]}`}>
                {selectedReport.status}
              </Badge>
            </div>

            <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 p-3">
              <p className="text-xs leading-5 text-amber-800">
                {selectedReport.status === "Submitted"
                  ? "Status submitted ini hanya simulasi frontend. Server belum menerima atau mengonfirmasi laporan."
                  : "Draft hanya tersimpan sementara selama sesi halaman ini berlangsung."}
              </p>
            </div>

            {sections.map((section, index) => (
              <div key={section.id} className="mt-6 border-t border-slate-100 pt-5">
                <h3 className="text-sm font-bold text-[#071b49]">
                  {index + 1}. {section.title}
                </h3>

                <div className="mt-3 space-y-3">
                  {section.id === "general" && (
                    <>
                      <DetailRow label="Site" value={selectedReport.form.site} />
                      <DetailRow label="Tanggal" value={selectedReport.form.date} />
                      <DetailRow label="Tim/personel" value={selectedReport.form.personnel} />
                      <DetailRow label="Kegiatan" value={selectedReport.form.activity} />
                      <DetailRow label="Catatan tambahan" value={selectedReport.form.generalNotes} />
                    </>
                  )}
                  {section.id === "router" && (
                    <>
                      <DetailRow label="Uptime" value={selectedReport.form.uptime} />
                      <DetailRow label="CPU" value={`${selectedReport.form.cpu}%`} />
                      <DetailRow label="RAM" value={`${selectedReport.form.ram}%`} />
                      <DetailRow label="Log anomali" value={selectedReport.form.anomaly} />
                      <DetailRow label="Catatan anomali" value={selectedReport.form.anomalyNotes} />
                    </>
                  )}
                  {section.id === "ap" && (
                    <>
                      <DetailRow label="Monitoring AP" value={selectedReport.form.apMonitoring} />
                      <DetailRow label="AP offline" value={selectedReport.form.apOffline} />
                      <DetailRow label="Dokumentasi cloud" value={selectedReport.form.cloudDocumentation} />
                      <DetailRow label="Catatan" value={selectedReport.form.cloudNotes} />
                    </>
                  )}
                  {section.id === "infrastructure" && (
                    <>
                      <DetailRow label="Kelistrikan" value={selectedReport.form.electricity} />
                      <DetailRow label="Suhu ruang server" value={`${selectedReport.form.temperature} °C`} />
                      <DetailRow label="Kondisi lingkungan" value={selectedReport.form.environment} />
                      <DetailRow label="Catatan kelistrikan" value={selectedReport.form.electricityNotes} />
                      <DetailRow label="Catatan lingkungan" value={selectedReport.form.environmentNotes} />
                    </>
                  )}
                  {section.id === "connectivity" && (
                    <>
                      <DetailRow label="Main Link traffic" value={selectedReport.form.mainTrafficStatus} />
                      <DetailRow label="Secondary Link traffic" value={selectedReport.form.secondaryTrafficStatus} />
                      <DetailRow label="Main Link speedtest" value={selectedReport.form.mainSpeedStatus} />
                      <DetailRow label="Secondary Link speedtest" value={selectedReport.form.secondarySpeedStatus} />
                    </>
                  )}
                  <div>
                    <p className="text-[11px] font-medium text-slate-500">Lampiran yang dipilih</p>
                    {selectedReport.evidence[section.id].length > 0 ? (
                      <ul className="mt-1 space-y-1">
                        {selectedReport.evidence[section.id].map((file, i) => (
                          <li key={`${file.name}-${i}`} className="break-all text-xs text-slate-700">
                            {file.name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1 text-xs text-slate-400">Tidak ada lampiran.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              onClick={() => {
                setSelectedReport(null)
                setView("history")
                setNotice("")
              }}
              variant="outline"
              className="mt-6 h-11 w-full rounded-xl"
            >
              Kembali ke riwayat
            </Button>
          </CardContent>
        </Card>
      )
    }

    if (view === "review") {
      return (
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <ClipboardCheck className="size-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#071b49]">Review laporan</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Periksa ringkasan sebelum simulasi submit.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 p-3">
              <p className="text-xs leading-5 text-amber-800">
                Submit pada prototype ini belum mengunggah file atau menyimpan laporan ke server.
                Status resmi baru bisa diberikan setelah backend mengonfirmasi.
              </p>
            </div>

            {sections.map((section, index) => (
              <button
                type="button"
                key={section.id}
                onClick={() => {
                  setCurrentSection(section.id)
                  setView("form")
                  setNotice("")
                }}
                className="mt-3 flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left hover:border-blue-200"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Check className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-800">
                    {index + 1}. {section.title}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {evidence[section.id].length} lampiran dipilih
                  </p>
                </div>
                <ChevronRight className="size-4 text-slate-400" />
              </button>
            ))}

            <div className="mt-5 rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-700">Info Umum</p>
              <div className="mt-3 space-y-3">
                <DetailRow label="Site" value={form.site} />
                <DetailRow label="Tanggal" value={form.date} />
                <DetailRow label="Tim/personel" value={form.personnel} />
                <DetailRow label="Kegiatan" value={form.activity} />
              </div>
            </div>

            <Button
              type="button"
              onClick={submitReport}
              className="mt-5 h-11 w-full rounded-xl bg-[#2563eb] font-semibold hover:bg-[#1d4ed8]"
            >
              <Send className="mr-2 size-4" />
              Submit Prototype
            </Button>

            <p className="mt-3 text-center text-[11px] leading-5 text-slate-400">
              Backend belum terhubung. Ini belum merupakan submit resmi.
            </p>
          </CardContent>
        </Card>
      )
    }

    if (view === "history") {
      return (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#071b49]">Riwayat laporan</h2>
              <p className="mt-1 text-xs text-slate-500">
                {reports.length} laporan pada sesi prototype ini
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={startNewReport}
              className="rounded-xl bg-[#2563eb]"
            >
              Laporan baru
            </Button>
          </div>

          {reports.length === 0 ? (
            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardContent className="flex flex-col items-center px-5 py-10 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <FileText className="size-6" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-[#071b49]">Belum ada laporan</h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Laporan yang dibuat dalam sesi ini akan muncul di sini.
                </p>
                <Button
                  type="button"
                  onClick={startNewReport}
                  className="mt-4 rounded-xl bg-[#2563eb]"
                >
                  Buat laporan
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <button
                  type="button"
                  key={report.id}
                  onClick={() => openReport(report)}
                  className="w-full text-left"
                >
                  <Card className="rounded-2xl border-slate-200 shadow-sm transition hover:border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[11px] text-slate-400">{report.id}</p>
                          <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-[#071b49]">
                            {report.form.activity || "Daily Report"}
                          </h3>
                          <p className="mt-2 text-xs text-slate-500">
                            {report.form.site} · {report.form.date}
                          </p>
                        </div>
                        <Badge className={`shrink-0 border-0 ${statusStyles[report.status]}`}>
                          {report.status}
                        </Badge>
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                        <span className="text-[11px] text-slate-400">{report.createdAt}</span>
                        <span className="flex items-center gap-1 text-xs font-semibold text-blue-600">
                          Detail <ArrowRight className="size-3.5" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </button>
              ))}
            </div>
          )}

          <p className="mt-5 text-[11px] leading-5 text-slate-400">
            Riwayat ini hanya tersedia selama state halaman masih aktif. Belum tersimpan permanen.
          </p>
        </div>
      )
    }

    return (
      <>
        {currentSection === "general" && (
          <>
            <SectionHeading number={1} title="Info Umum" description={sections[0].description} />
            <div className="space-y-4">
              <SelectField
                label="Site"
                value={form.site}
                onChange={(value) => update("site", value)}
                required
                options={[
                  { label: "SR-JBR-BDG-001 · Sekolah Rakyat Bandung", value: "SR-JBR-BDG-001" },
                  { label: "SR-JBR-BDG-002 · Sekolah Rakyat Cimahi", value: "SR-JBR-BDG-002" },
                  { label: "SR-JKT-TMR-001 · Sekolah Rakyat Jakarta Timur", value: "SR-JKT-TMR-001" },
                ]}
              />
              {errors.site && <p className="text-xs text-red-500">{errors.site}</p>}

              <Field
                label="Tanggal"
                type="date"
                value={form.date}
                onChange={(value) => update("date", value)}
                required
                error={errors.date}
              />

              <Field
                label="Tim/personel"
                value={form.personnel}
                onChange={(value) => update("personnel", value)}
                placeholder="Nama EOS atau personel bertugas"
                required
                error={errors.personnel}
              />

              <TextArea
                label="Kegiatan"
                value={form.activity}
                onChange={(value) => update("activity", value)}
                placeholder="Contoh: Monitoring dan maintenance jaringan..."
                required
                error={errors.activity}
              />

              <TextArea
                label="Catatan tambahan"
                value={form.generalNotes}
                onChange={(value) => update("generalNotes", value)}
                placeholder="Catatan operasional tambahan..."
              />

              {renderEvidence("general", false)}
            </div>
          </>
        )}

        {currentSection === "router" && (
          <>
            <SectionHeading number={2} title="Router & Firewall" description={sections[1].description} />
            <div className="space-y-4">
              <Field
                label="Uptime"
                value={form.uptime}
                onChange={(value) => update("uptime", value)}
                placeholder="Contoh: 12d 04h 30m"
                required
                error={errors.uptime}
              />

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Utilisasi CPU (%)"
                  type="number"
                  min={0}
                  max={100}
                  step="any"
                  value={form.cpu}
                  onChange={(value) => update("cpu", value)}
                  required
                  error={errors.cpu}
                />
                <Field
                  label="Utilisasi RAM (%)"
                  type="number"
                  min={0}
                  max={100}
                  step="any"
                  value={form.ram}
                  onChange={(value) => update("ram", value)}
                  required
                  error={errors.ram}
                />
              </div>

              <SelectField
                label="Log anomali"
                value={form.anomaly}
                onChange={(value) => update("anomaly", value)}
                required
                options={[
                  { label: "Normal", value: "NORMAL" },
                  { label: "Minor", value: "MINOR" },
                  { label: "Major", value: "MAJOR" },
                  { label: "Not checked", value: "NOT_CHECKED" },
                ]}
              />

              {form.anomaly !== "NORMAL" && (
                <TextArea
                  label="Catatan / alasan anomali"
                  value={form.anomalyNotes}
                  onChange={(value) => update("anomalyNotes", value)}
                  placeholder="Jelaskan anomali atau alasan tidak diperiksa..."
                  required
                  error={errors.anomalyNotes}
                />
              )}

              {renderEvidence("router", true)}
              {errors["evidence.router"] && (
                <p className="text-xs text-red-500">{errors["evidence.router"]}</p>
              )}
            </div>
          </>
        )}

        {currentSection === "ap" && (
          <>
            <SectionHeading number={3} title="Access Point" description={sections[2].description} />
            <div className="space-y-4">
              <SelectField
                label="Status monitoring AP"
                value={form.apMonitoring}
                onChange={(value) => update("apMonitoring", value)}
                required
                options={[
                  { label: "Normal", value: "NORMAL" },
                  { label: "Warning", value: "WARNING" },
                  { label: "Down", value: "DOWN" },
                  { label: "Unknown / not checked", value: "UNKNOWN" },
                ]}
              />

              <Field
                label="Jumlah AP offline"
                type="number"
                min={0}
                step={1}
                value={form.apOffline}
                onChange={(value) => update("apOffline", value)}
                required={form.apMonitoring !== "UNKNOWN"}
                error={errors.apOffline}
                help="Nilai 0 adalah input valid bila seluruh AP online."
              />

              <SelectField
                label="Dokumentasi AP di Cloud"
                value={form.cloudDocumentation}
                onChange={(value) => update("cloudDocumentation", value)}
                required
                options={[
                  { label: "Lengkap", value: "LENGKAP" },
                  { label: "Belum lengkap", value: "BELUM_LENGKAP" },
                  { label: "Ada kendala", value: "ADA_KENDALA" },
                ]}
              />

              {form.cloudDocumentation !== "LENGKAP" ||
              form.apMonitoring === "UNKNOWN" ? (
                <TextArea
                  label="Catatan / alasan"
                  value={form.cloudNotes}
                  onChange={(value) => update("cloudNotes", value)}
                  placeholder="Jelaskan status dokumentasi atau alasan unknown..."
                  required
                  error={errors.cloudNotes}
                />
              ) : (
                <TextArea
                  label="Catatan tambahan"
                  value={form.cloudNotes}
                  onChange={(value) => update("cloudNotes", value)}
                  placeholder="Catatan tambahan jika diperlukan..."
                />
              )}

              {renderEvidence("ap", true)}
              {errors["evidence.ap"] && (
                <p className="text-xs text-red-500">{errors["evidence.ap"]}</p>
              )}
            </div>
          </>
        )}

        {currentSection === "infrastructure" && (
          <>
            <SectionHeading number={4} title="Infrastruktur & Lingkungan" description={sections[3].description} />
            <div className="space-y-4">
              <SelectField
                label="Pengecekan kelistrikan"
                value={form.electricity}
                onChange={(value) => update("electricity", value)}
                required
                options={[
                  { label: "Normal", value: "NORMAL" },
                  { label: "Unstable", value: "UNSTABLE" },
                  { label: "Outage", value: "OUTAGE" },
                  { label: "Backup active", value: "BACKUP_ACTIVE" },
                  { label: "Not checked", value: "NOT_CHECKED" },
                ]}
              />

              {form.electricity !== "NORMAL" && (
                <TextArea
                  label="Catatan / alasan kelistrikan"
                  value={form.electricityNotes}
                  onChange={(value) => update("electricityNotes", value)}
                  placeholder="Jelaskan kondisi atau alasan tidak diperiksa..."
                  required
                  error={errors.electricityNotes}
                />
              )}

              <Field
                label="Suhu ruang server (°C)"
                type="number"
                min={-20}
                max={80}
                step={0.1}
                value={form.temperature}
                onChange={(value) => update("temperature", value)}
                placeholder="Contoh: 24.5"
                required
                error={errors.temperature}
                help="Wajib diisi. Rentang -20,0 sampai 80,0 °C."
              />

              <SelectField
                label="Kondisi lingkungan"
                value={form.environment}
                onChange={(value) => update("environment", value)}
                required
                options={[
                  { label: "Good", value: "GOOD" },
                  { label: "Attention", value: "ATTENTION" },
                  { label: "Unfit", value: "UNFIT" },
                  { label: "Not checked", value: "NOT_CHECKED" },
                ]}
              />

              {form.environment !== "GOOD" && (
                <TextArea
                  label="Catatan / alasan kondisi lingkungan"
                  value={form.environmentNotes}
                  onChange={(value) => update("environmentNotes", value)}
                  placeholder="Jelaskan kondisi lingkungan..."
                  required
                  error={errors.environmentNotes}
                />
              )}

              {renderEvidence("infrastructure", true)}
              {errors["evidence.infrastructure"] && (
                <p className="text-xs text-red-500">{errors["evidence.infrastructure"]}</p>
              )}
            </div>
          </>
        )}

        {currentSection === "connectivity" && (
          <>
            <SectionHeading number={5} title="Konektivitas" description={sections[4].description} />

            <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 p-3">
              <p className="text-xs font-semibold text-blue-800">Window pengukuran 08.00–17.00</p>
              <p className="mt-1 text-[11px] leading-5 text-blue-700">
                Site-local. Isi traffic untuk kedua link dan lakukan speedtest secara terpisah.
                Jika link down, status pengujian tetap harus dicatat dengan alasan.
              </p>
            </div>

            <div className="space-y-4">
              {renderTraffic("main", "Utilisasi Main Link")}
              {renderTraffic("secondary", "Utilisasi Secondary Link")}
              {renderSpeedtest("main", "Connection Test — Main Link")}
              {renderSpeedtest("secondary", "Connection Test — Secondary Link")}

              {renderEvidence("connectivity", true)}
              {errors["evidence.connectivity"] && (
                <p className="text-xs text-red-500">{errors["evidence.connectivity"]}</p>
              )}
            </div>
          </>
        )}
      </>
    )
  }

  if (view === "detail" && selectedReport) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <div className="mx-auto max-w-md px-5 pb-10 pt-5">
          <button
            type="button"
            onClick={() => {
              setView("history")
              setSelectedReport(null)
              setNotice("")
            }}
            className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-500"
          >
            <ArrowLeft className="size-4" /> Riwayat laporan
          </button>
          {renderSection()}
          {notice && <p className="mt-4 text-xs leading-5 text-blue-700">{notice}</p>}
          <Button
            type="button"
            onClick={startNewReport}
            className="mt-4 h-11 w-full rounded-xl bg-[#2563eb]"
          >
            Buat laporan baru
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="mx-auto w-full max-w-md px-5 pb-8 pt-5">
        <header className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-blue-600">EOS Operations</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#071b49]">
              Daily Report
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Laporan operasional harian
            </p>
          </div>
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <ClipboardCheck className="size-5" />
          </div>
        </header>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-3">
              <FileText className="size-4 text-blue-600" />
              <p className="mt-3 text-xl font-bold text-[#071b49]">{reports.length}</p>
              <p className="mt-1 text-[10px] leading-4 text-slate-500">Total sesi</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-3">
              <Send className="size-4 text-blue-600" />
              <p className="mt-3 text-xl font-bold text-[#071b49]">{submittedCount}</p>
              <p className="mt-1 text-[10px] leading-4 text-slate-500">Submitted demo</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-3">
              <Clock3 className="size-4 text-amber-500" />
              <p className="mt-3 text-xl font-bold text-[#071b49]">
                {reports.filter((report) => report.status === "Draft").length}
              </p>
              <p className="mt-1 text-[10px] leading-4 text-slate-500">Draft sesi</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-5 grid grid-cols-2 rounded-xl bg-slate-200/70 p-1">
          <button
            type="button"
            onClick={() => {
              setView("form")
              setSelectedReport(null)
              setNotice("")
            }}
            className={`rounded-lg px-3 py-2.5 text-sm font-semibold ${
              view === "form" || view === "review"
                ? "bg-white text-[#071b49] shadow-sm"
                : "text-slate-500"
            }`}
          >
            Form laporan
          </button>
          <button
            type="button"
            onClick={() => {
              setView("history")
              setSelectedReport(null)
              setNotice("")
            }}
            className={`rounded-lg px-3 py-2.5 text-sm font-semibold ${
              view === "history"
                ? "bg-white text-[#071b49] shadow-sm"
                : "text-slate-500"
            }`}
          >
            Riwayat
          </button>
        </div>

        {notice && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3">
            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-blue-600" />
            <p className="flex-1 text-xs leading-5 text-blue-800">{notice}</p>
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Tutup notifikasi"
              className="text-blue-500"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        {view === "history" ? (
          <div className="mt-5">{renderSection()}</div>
        ) : (
          <>
            <Card className="mt-5 rounded-2xl border-slate-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-500">Progress laporan</p>
                    <p className="mt-1 text-sm font-bold text-[#071b49]">
                      {view === "review" ? "Review akhir" : `${currentIndex + 1} / 5 bagian selesai`}
                    </p>
                  </div>
                  <Badge className="border-0 bg-blue-50 text-blue-700">
                    {view === "review" ? "Review" : "Draft"}
                  </Badge>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#2563eb] transition-all"
                    style={{ width: `${view === "review" ? 100 : ((currentIndex + 1) / 5) * 100}%` }}
                  />
                </div>

                <div className="mt-4 space-y-1">
                  {sections.map((section, index) => {
                    const active = currentSection === section.id && view === "form"
                    const done = index < currentIndex || view === "review"

                    return (
                      <button
                        type="button"
                        key={section.id}
                        onClick={() => {
                          if (view === "review") return
                          setCurrentSection(section.id)
                          setNotice("")
                        }}
                        disabled={view === "review"}
                        className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition ${
                          active ? "bg-blue-50" : "hover:bg-slate-50"
                        }`}
                      >
                        <div
                          className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            done
                              ? "bg-emerald-100 text-emerald-700"
                              : active
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {done ? <Check className="size-3.5" /> : index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs font-semibold ${active ? "text-blue-800" : "text-slate-700"}`}>
                            {section.title}
                          </p>
                          <p className="mt-0.5 text-[10px] text-slate-400">
                            {section.description}
                          </p>
                        </div>
                        {active && <ChevronRight className="size-4 text-blue-600" />}
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4 rounded-2xl border-slate-200 shadow-sm">
              <CardContent className="p-5">
                {renderSection()}
              </CardContent>
            </Card>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (view === "review") {
                    backToForm()
                  } else if (currentIndex > 0) {
                    goBackSection()
                  } else {
                    setView("history")
                    setNotice("")
                  }
                }}
                className="h-11 rounded-xl border-slate-200 bg-white"
              >
                <ArrowLeft className="mr-2 size-4" />
                {view === "review" ? "Edit laporan" : currentIndex > 0 ? "Sebelumnya" : "Riwayat"}
              </Button>

              <Button
                type="button"
                onClick={() => {
                  if (view === "review") {
                    submitReport()
                  } else {
                    goNext()
                  }
                }}
                className="h-11 rounded-xl bg-[#2563eb] font-semibold hover:bg-[#1d4ed8]"
              >
                {view === "review" ? (
                  <>
                    <Send className="mr-2 size-4" />
                    Submit demo
                  </>
                ) : currentIndex === sections.length - 1 ? (
                  <>
                    Review
                    <ArrowRight className="ml-2 size-4" />
                  </>
                ) : (
                  <>
                    Lanjut
                    <ArrowRight className="ml-2 size-4" />
                  </>
                )}
              </Button>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={saveDraft}
              className="mt-3 h-11 w-full rounded-xl border-slate-200 bg-white font-semibold"
            >
              <Save className="mr-2 size-4" />
              Simpan Draft (Prototype)
            </Button>

            <div className="mt-5 flex items-start gap-2 px-1">
              <LockKeyhole className="mt-0.5 size-3.5 shrink-0 text-slate-400" />
              <p className="text-[11px] leading-5 text-slate-400">
                Prototype UI: lampiran belum diunggah, draft belum tersimpan permanen, dan
                status resmi harus dikonfirmasi backend. Jangan gunakan data demo sebagai laporan operasional.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-slate-500">{label}</p>
      <p className="mt-1 break-words whitespace-pre-wrap text-sm text-slate-800">
        {value || "-"}
      </p>
    </div>
  )
}

export default App