import { useState } from "react"
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Clock3,
  MapPin,
  ShieldAlert,
} from "lucide-react"
import { useLocation, useNavigate } from "react-router"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type CheckInEvidence = {
  selfie?: string
  latitude?: number
  longitude?: number
  accuracy?: number
}

function CheckInReview() {
  const navigate = useNavigate()
  const routerLocation = useLocation()

  const state = routerLocation.state as CheckInEvidence | null

  const [notice, setNotice] = useState("")

  const selfie = state?.selfie ?? null
  const latitude = state?.latitude ?? null
  const longitude = state?.longitude ?? null
  const accuracy = state?.accuracy ?? null

  const hasLocation =
    typeof latitude === "number" &&
    Number.isFinite(latitude) &&
    typeof longitude === "number" &&
    Number.isFinite(longitude)

  const hasSelfie =
    typeof selfie === "string" && selfie.length > 0

  const evidenceReady = hasSelfie && hasLocation

  const deviceNow = new Date()

  const timeText = deviceNow.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  const dateText = deviceNow.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  function handleSubmit() {
    if (!evidenceReady) {
      setNotice(
        "Bukti belum lengkap. Ambil selfie dan dapatkan lokasi terlebih dahulu.",
      )
      return
    }

    setNotice(
      "Check-in belum dikirim. Layanan API absensi belum terhubung. Bukti ini masih berada di sesi browser dan belum tercatat sebagai kehadiran resmi.",
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="mx-auto w-full max-w-md px-5 pb-8 pt-5">
        <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
            aria-label="Kembali"
          >
            <ArrowLeft className="size-5" />
          </button>

          <div>
            <p className="text-xs font-medium text-blue-600">
              EOS Operations
            </p>

            <h1 className="text-lg font-bold text-[#071b49]">
              Review Check-in
            </h1>
          </div>
        </header>

        <div className="mt-6">
          <p className="text-sm font-semibold text-slate-800">
            Periksa bukti kehadiran
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Periksa selfie dan informasi lokasi sebelum melanjutkan.
            Bukti yang tersedia belum berarti absensi sudah tercatat.
          </p>
        </div>

        <Card className="mt-5 overflow-hidden rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Camera className="size-4 text-violet-600" />
                Selfie Kehadiran
              </CardTitle>

              <Badge
                variant="outline"
                className={
                  hasSelfie
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-slate-50 text-slate-500"
                }
              >
                {hasSelfie ? "Tersedia" : "Belum tersedia"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            {hasSelfie ? (
              <div className="overflow-hidden rounded-2xl bg-slate-100">
                <img
                  src={selfie}
                  alt="Bukti selfie check-in"
                  className="aspect-[3/4] w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex aspect-[3/4] items-center justify-center rounded-2xl bg-slate-100">
                <div className="px-5 text-center">
                  <Camera className="mx-auto size-8 text-slate-300" />

                  <p className="mt-2 text-sm font-medium text-slate-500">
                    Selfie belum tersedia
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Kembali ke proses pengambilan bukti untuk mengambil
                    selfie.
                  </p>
                </div>
              </div>
            )}

            {!hasSelfie && (
              <Button
                type="button"
                onClick={() => navigate("/check-in/capture")}
                className="mt-3 w-full rounded-xl"
              >
                <Camera className="mr-2 size-4" />
                Ambil Selfie
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="mt-5 rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-800">
              Detail Bukti
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                <MapPin className="size-4 text-blue-600" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-400">
                  Koordinat Lokasi
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {hasLocation
                    ? "Lokasi berhasil diperoleh"
                    : "Lokasi belum tersedia"}
                </p>
              </div>

              <Badge
                variant="outline"
                className={
                  hasLocation
                    ? "border-blue-200 text-blue-700"
                    : "border-slate-200 text-slate-500"
                }
              >
                {hasLocation ? "Tersedia" : "Kosong"}
              </Badge>
            </div>

            <div className="h-px bg-slate-100" />

            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                <Clock3 className="size-4 text-blue-600" />
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Waktu Perangkat
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {timeText}
                </p>

                <p className="mt-0.5 text-[11px] text-slate-400">
                  {dateText}
                </p>

                <p className="mt-1 text-[11px] leading-4 text-amber-700">
                  Waktu ini berasal dari perangkat, bukan waktu resmi
                  server.
                </p>
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                <MapPin className="size-4 text-blue-600" />
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Akurasi GPS
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {typeof accuracy === "number" &&
                  Number.isFinite(accuracy)
                    ? `±${Math.round(accuracy)} meter`
                    : "Belum tersedia"}
                </p>

                <p className="mt-0.5 text-[11px] text-slate-400">
                  Belum divalidasi oleh server.
                </p>
              </div>
            </div>

            {hasLocation && (
              <>
                <div className="h-px bg-slate-100" />

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[11px] text-slate-400">
                      Latitude
                    </p>

                    <p className="mt-1 break-all text-xs font-medium text-slate-700">
                      {latitude.toFixed(6)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[11px] text-slate-400">
                      Longitude
                    </p>

                    <p className="mt-1 break-all text-xs font-medium text-slate-700">
                      {longitude.toFixed(6)}
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div
          className={`mt-5 rounded-2xl border p-4 ${
            evidenceReady
              ? "border-blue-100 bg-blue-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <div className="flex gap-3">
            {evidenceReady ? (
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-blue-600" />
            ) : (
              <ShieldAlert className="mt-0.5 size-5 shrink-0 text-amber-600" />
            )}

            <div>
              <p
                className={`text-sm font-semibold ${
                  evidenceReady ? "text-blue-800" : "text-amber-800"
                }`}
              >
                {evidenceReady
                  ? "Bukti tersedia di perangkat"
                  : "Bukti belum lengkap"}
              </p>

              <p
                className={`mt-1 text-xs leading-5 ${
                  evidenceReady ? "text-blue-700" : "text-amber-700"
                }`}
              >
                {evidenceReady
                  ? "Selfie dan koordinat tersedia untuk proses integrasi. Validasi site, radius GPS, waktu, dan penyimpanan absensi tetap harus dilakukan oleh backend."
                  : "Lengkapi selfie dan lokasi sebelum melanjutkan proses check-in."}
              </p>
            </div>
          </div>
        </div>

        {notice && (
          <div
            role="status"
            aria-live="polite"
            className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800"
          >
            {notice}
          </div>
        )}

        <Button
          type="button"
          disabled={!evidenceReady}
          onClick={handleSubmit}
          className="mt-5 h-12 w-full rounded-xl bg-[#2563eb] text-sm font-semibold hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Lanjutkan Check-in
        </Button>

        <p className="mt-3 px-3 text-center text-[11px] leading-5 text-slate-400">
          Belum terhubung ke API absensi. Menekan tombol tidak akan
          mengirim atau mencatat kehadiran.
        </p>
      </div>
    </div>
  )
}

export default CheckInReview