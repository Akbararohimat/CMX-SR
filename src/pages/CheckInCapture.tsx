import { useEffect, useRef, useState } from "react"
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Clock3,
  ImagePlus,
  Loader2,
  MapPin,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react"
import { useNavigate } from "react-router"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type LocationStatus =
  | "idle"
  | "checking"
  | "success"
  | "inaccurate"
  | "denied"
  | "error"

type CameraStatus =
  | "idle"
  | "starting"
  | "ready"
  | "denied"
  | "error"

function CheckInCapture() {
  const navigate = useNavigate()

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [locationStatus, setLocationStatus] =
    useState<LocationStatus>("idle")

  const [cameraStatus, setCameraStatus] =
    useState<CameraStatus>("idle")

  const [location, setLocation] = useState<{
    latitude: number
    longitude: number
    accuracy: number
  } | null>(null)

  const [selfie, setSelfie] = useState<string | null>(null)

  const [locationError, setLocationError] = useState("")
  const [cameraError, setCameraError] = useState("")

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop()
      })

      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.srcObject = null
    }
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  function checkLocation() {
    setLocationStatus("checking")
    setLocationError("")

    if (!navigator.geolocation) {
      setLocationStatus("error")
      setLocationError(
        "Perangkat atau browser tidak mendukung layanan lokasi.",
      )
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const accuracy = position.coords.accuracy

        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy,
        })

        if (accuracy <= 50) {
          setLocationStatus("success")
          setLocationError("")
        } else {
          setLocationStatus("inaccurate")
          setLocationError(
            `Akurasi lokasi masih ${Math.round(
              accuracy,
            )} meter. Untuk validasi check-in sebenarnya, lokasi akan diperiksa oleh server.`,
          )
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationStatus("denied")
          setLocationError(
            "Izin lokasi ditolak. Aktifkan akses lokasi untuk mendapatkan bukti lokasi.",
          )
          return
        }

        if (error.code === error.TIMEOUT) {
          setLocationStatus("error")
          setLocationError(
            "Pengambilan lokasi membutuhkan waktu terlalu lama. Pastikan GPS aktif lalu coba lagi.",
          )
          return
        }

        setLocationStatus("error")
        setLocationError(
          "Lokasi belum dapat diperoleh. Pastikan GPS perangkat aktif lalu coba lagi.",
        )
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000,
      },
    )
  }

  async function startCamera() {
    setCameraStatus("starting")
    setCameraError("")

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraStatus("error")
      setCameraError(
        "Browser ini tidak mendukung akses kamera langsung.",
      )
      return
    }

    try {
      stopCamera()

      let stream: MediaStream

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        })
      } catch (firstError) {
        console.warn(
          "Percobaan kamera pertama gagal:",
          firstError,
        )

        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: {
              ideal: "user",
            },
          },
          audio: false,
        })
      }

      streamRef.current = stream

      const video = videoRef.current

      if (!video) {
        stopCamera()
        throw new Error("Elemen video belum tersedia.")
      }

      video.srcObject = stream
      video.muted = true
      video.autoplay = true
      video.playsInline = true

      await new Promise<void>((resolve, reject) => {
        const timeout = window.setTimeout(() => {
          reject(new Error("Timeout menunggu kamera."))
        }, 8000)

        const handleLoadedMetadata = () => {
          window.clearTimeout(timeout)

          video.removeEventListener(
            "loadedmetadata",
            handleLoadedMetadata,
          )

          resolve()
        }

        video.addEventListener(
          "loadedmetadata",
          handleLoadedMetadata,
        )

        if (
          video.readyState >=
          HTMLMediaElement.HAVE_METADATA
        ) {
          window.clearTimeout(timeout)

          video.removeEventListener(
            "loadedmetadata",
            handleLoadedMetadata,
          )

          resolve()
        }
      })

      await video.play()

      await new Promise<void>((resolve, reject) => {
        const startedAt = Date.now()

        const checkFrame = () => {
          if (
            video.videoWidth > 0 &&
            video.videoHeight > 0
          ) {
            resolve()
            return
          }

          if (Date.now() - startedAt > 8000) {
            reject(
              new Error(
                "Kamera aktif tetapi tidak menghasilkan frame video.",
              ),
            )
            return
          }

          requestAnimationFrame(checkFrame)
        }

        checkFrame()
      })

      setCameraStatus("ready")
      setCameraError("")
    } catch (error) {
      console.error(
        "Gagal membuka kamera:",
        error,
      )

      stopCamera()

      let message =
        "Kamera tidak dapat menampilkan preview."

      if (error instanceof DOMException) {
        switch (error.name) {
          case "NotAllowedError":
            message =
              "Browser menolak akses kamera. Pastikan permission kamera untuk localhost sudah Allow."
            break

          case "NotFoundError":
            message =
              "Tidak ditemukan kamera pada perangkat ini."
            break

          case "NotReadableError":
            message =
              "Kamera sedang digunakan aplikasi lain. Tutup aplikasi seperti Camera, Teams, Zoom, Discord, atau browser lain lalu coba lagi."
            break

          case "OverconstrainedError":
            message =
              "Konfigurasi kamera tidak didukung oleh perangkat."
            break

          case "AbortError":
            message =
              "Browser menghentikan proses akses kamera. Coba tutup dan buka kembali halaman."
            break

          case "SecurityError":
            message =
              "Browser memblokir akses kamera karena konteks keamanan halaman."
            break

          default:
            message =
              `Kamera gagal digunakan (${error.name}).`
        }
      } else if (error instanceof Error) {
        message = error.message
      }

      setCameraStatus("error")
      setCameraError(message)
    }
  }

  function openCameraFallback() {
    fileInputRef.current?.click()
  }

  function handleFallbackCapture(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const imageUrl = URL.createObjectURL(file)

    setSelfie(imageUrl)
    setCameraStatus("ready")
    setCameraError("")

    event.target.value = ""
  }

  function captureSelfie() {
    const video = videoRef.current

    if (!video || cameraStatus !== "ready") {
      return
    }

    if (
      video.readyState <
        HTMLMediaElement.HAVE_CURRENT_DATA ||
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      setCameraError(
        "Preview kamera belum siap. Tunggu sebentar lalu coba lagi.",
      )
      return
    }

    const canvas = document.createElement("canvas")

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const context = canvas.getContext("2d")

    if (!context) {
      setCameraError(
        "Selfie tidak dapat diproses. Silakan coba lagi.",
      )
      return
    }

    context.save()

    context.translate(canvas.width, 0)
    context.scale(-1, 1)

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height,
    )

    context.restore()

    const image = canvas.toDataURL(
      "image/jpeg",
      0.9,
    )

    setSelfie(image)

    stopCamera()

    setCameraStatus("ready")
    setCameraError("")
  }

  function retakeSelfie() {
    setSelfie(null)
    setCameraError("")
    startCamera()
  }

  const locationReady =
    locationStatus === "success"

  const selfieReady = Boolean(selfie)

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="mx-auto w-full max-w-md px-5 pb-8 pt-5">
        <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              stopCamera()
              navigate("/check-in")
            }}
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
              Verifikasi Check-in
            </h1>
          </div>
        </header>

        <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-amber-600" />

            <div>
              <p className="text-sm font-semibold text-amber-800">
                Mode Development
              </p>

              <p className="mt-1 text-xs leading-5 text-amber-700">
                Kamera dapat digunakan untuk pengujian
                meskipun lokasi perangkat belum sesuai
                dengan site. Validasi radius sebenarnya
                dilakukan oleh server.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-7">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">
              Bukti Kehadiran
            </p>

            <p className="text-xs font-medium text-slate-400">
              Langkah 1 dari 2
            </p>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full bg-[#2563eb] transition-all ${
                selfieReady
                  ? "w-full"
                  : locationReady
                    ? "w-1/2"
                    : "w-1/4"
              }`}
            />
          </div>
        </div>

        <Card className="mt-6 rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <MapPin className="size-4 text-blue-600" />
                Lokasi Terkini
              </CardTitle>

              {locationReady && (
                <Badge className="border-0 bg-emerald-50 text-emerald-600 hover:bg-emerald-50">
                  Akurasi OK
                </Badge>
              )}

              {locationStatus === "inaccurate" && (
                <Badge className="border-0 bg-amber-50 text-amber-600 hover:bg-amber-50">
                  Kurang Akurat
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {!location &&
              locationStatus === "idle" && (
                <div>
                  <p className="text-xs leading-5 text-slate-500">
                    Aplikasi akan mengambil lokasi
                    terkini dengan akurasi tinggi untuk
                    proses verifikasi.
                  </p>

                  <Button
                    type="button"
                    onClick={checkLocation}
                    className="mt-4 h-11 w-full rounded-xl bg-[#2563eb] text-sm font-semibold hover:bg-[#1d4ed8]"
                  >
                    <MapPin className="mr-2 size-4" />
                    Verifikasi Lokasi
                  </Button>
                </div>
              )}

            {locationStatus === "checking" && (
              <div className="flex items-center gap-3 rounded-xl bg-blue-50 p-4">
                <Loader2 className="size-5 animate-spin text-blue-600" />

                <div>
                  <p className="text-sm font-semibold text-blue-800">
                    Memeriksa lokasi...
                  </p>

                  <p className="mt-0.5 text-xs text-blue-600">
                    Pastikan GPS perangkat aktif.
                  </p>
                </div>
              </div>
            )}

            {location && (
              <div className="space-y-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">
                    Akurasi GPS
                  </p>

                  <p
                    className={`mt-1 text-lg font-bold ${
                      location.accuracy <= 50
                        ? "text-emerald-600"
                        : "text-amber-600"
                    }`}
                  >
                    ±{Math.round(location.accuracy)} meter
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-slate-100 bg-white p-3">
                    <p className="text-slate-400">
                      Latitude
                    </p>

                    <p className="mt-1 truncate font-medium text-slate-700">
                      {location.latitude.toFixed(6)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-white p-3">
                    <p className="text-slate-400">
                      Longitude
                    </p>

                    <p className="mt-1 truncate font-medium text-slate-700">
                      {location.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>

                {locationStatus === "inaccurate" && (
                  <div className="rounded-xl border border-amber-100 bg-amber-50 p-3">
                    <p className="text-xs leading-5 text-amber-700">
                      {locationError}
                    </p>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={checkLocation}
                      className="mt-3 h-9 rounded-lg border-amber-200 bg-white text-xs text-amber-700 hover:bg-amber-50"
                    >
                      <RefreshCw className="mr-2 size-3.5" />
                      Coba Lagi
                    </Button>
                  </div>
                )}

                {locationStatus === "success" && (
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                    <div className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />

                      <p className="text-xs leading-5 text-emerald-700">
                        Lokasi berhasil diperoleh.
                        Radius site akan divalidasi oleh
                        server pada proses check-in
                        sebenarnya.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {(locationStatus === "denied" ||
              locationStatus === "error") && (
              <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                <div className="flex gap-3">
                  <XCircle className="mt-0.5 size-5 shrink-0 text-red-500" />

                  <div>
                    <p className="text-sm font-semibold text-red-700">
                      Lokasi belum tersedia
                    </p>

                    <p className="mt-1 text-xs leading-5 text-red-600">
                      {locationError}
                    </p>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={checkLocation}
                      className="mt-3 h-9 rounded-lg border-red-200 bg-white text-xs text-red-600 hover:bg-red-50"
                    >
                      <RefreshCw className="mr-2 size-3.5" />
                      Coba Lagi
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-5 rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Camera className="size-4 text-violet-600" />
                Selfie Kehadiran
              </CardTitle>

              {selfieReady && (
                <Badge className="border-0 bg-emerald-50 text-emerald-600 hover:bg-emerald-50">
                  Siap
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {!selfie &&
              cameraStatus === "idle" && (
                <>
                  <div className="rounded-xl bg-violet-50 p-4">
                    <p className="text-xs leading-5 text-violet-700">
                      Gunakan kamera depan untuk mengambil
                      satu selfie sebagai bukti kehadiran.
                    </p>
                  </div>

                  <Button
                    type="button"
                    onClick={startCamera}
                    className="mt-4 h-11 w-full rounded-xl bg-[#071b49] text-sm font-semibold text-white hover:bg-[#10265a]"
                  >
                    <Camera className="mr-2 size-4" />
                    Buka Kamera
                  </Button>
                </>
              )}

            {(cameraStatus === "starting" ||
              cameraStatus === "ready") &&
              !selfie && (
                <div>
                  <div className="relative overflow-hidden rounded-2xl bg-slate-900">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="aspect-[3/4] w-full object-cover"
                      style={{
                        transform: "scaleX(-1)",
                      }}
                    />

                    {cameraStatus === "starting" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90">
                        <div className="text-center">
                          <Loader2 className="mx-auto size-7 animate-spin text-white" />

                          <p className="mt-3 text-sm font-medium text-white">
                            Membuka kamera...
                          </p>

                          <p className="mt-1 text-xs text-white/60">
                            Izinkan akses kamera jika diminta.
                          </p>
                        </div>
                      </div>
                    )}

                    {cameraStatus === "ready" && (
                      <div className="pointer-events-none absolute inset-0">
                        <div className="absolute inset-x-8 top-8 bottom-8 rounded-[32px] border-2 border-white/60" />

                        <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-sm">
                          <p className="text-[11px] font-medium text-white">
                            Posisikan wajah di tengah
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {cameraStatus === "ready" && (
                    <Button
                      type="button"
                      onClick={captureSelfie}
                      className="mt-4 h-11 w-full rounded-xl bg-[#2563eb] text-sm font-semibold hover:bg-[#1d4ed8]"
                    >
                      <Camera className="mr-2 size-4" />
                      Ambil Selfie
                    </Button>
                  )}
                </div>
              )}

            {selfie && (
              <div>
                <div className="overflow-hidden rounded-2xl bg-slate-100">
                  <img
                    src={selfie}
                    alt="Preview selfie check-in"
                    className="aspect-[3/4] w-full object-cover"
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={retakeSelfie}
                  className="mt-4 h-11 w-full rounded-xl"
                >
                  <RefreshCw className="mr-2 size-4" />
                  Ambil Ulang
                </Button>
              </div>
            )}

            {(cameraStatus === "denied" ||
              cameraStatus === "error") && (
              <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4">
                <div className="flex gap-3">
                  <XCircle className="mt-0.5 size-5 shrink-0 text-red-500" />

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-red-700">
                      Kamera langsung belum tersedia
                    </p>

                    <p className="mt-1 text-xs leading-5 text-red-600">
                      {cameraError}
                    </p>

                    <div className="mt-3 flex flex-col gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={startCamera}
                        className="h-9 rounded-lg border-red-200 bg-white text-xs text-red-600 hover:bg-red-50"
                      >
                        <RefreshCw className="mr-2 size-3.5" />
                        Coba Kamera Lagi
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={openCameraFallback}
                        className="h-9 rounded-lg border-slate-200 bg-white text-xs text-slate-600"
                      >
                        <ImagePlus className="mr-2 size-3.5" />
                        Gunakan Kamera Perangkat
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="user"
              className="hidden"
              onChange={handleFallbackCapture}
            />

            {!selfie &&
              cameraStatus === "idle" && (
                <button
                  type="button"
                  onClick={openCameraFallback}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                >
                  <ImagePlus className="size-4" />
                  Gunakan Kamera Perangkat
                </button>
              )}
          </CardContent>
        </Card>

        <Card className="mt-5 rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-800">
              Status Bukti
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-9 items-center justify-center rounded-lg ${
                    location
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <MapPin className="size-4" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    Lokasi
                  </p>

                  <p className="text-[11px] text-slate-400">
                    {location
                      ? `Akurasi ±${Math.round(
                          location.accuracy,
                        )} m`
                      : "Belum diperoleh"}
                  </p>
                </div>
              </div>

              {location ? (
                <CheckCircle2 className="size-4 text-emerald-500" />
              ) : (
                <Clock3 className="size-4 text-slate-300" />
              )}
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-9 items-center justify-center rounded-lg ${
                    selfieReady
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <Camera className="size-4" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    Selfie
                  </p>

                  <p className="text-[11px] text-slate-400">
                    {selfieReady
                      ? "Bukti tersedia"
                      : "Belum diambil"}
                  </p>
                </div>
              </div>

              {selfieReady ? (
                <CheckCircle2 className="size-4 text-emerald-500" />
              ) : (
                <Clock3 className="size-4 text-slate-300" />
              )}
            </div>
          </CardContent>
        </Card>

        {location && selfieReady && (
          <div className="mt-6">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />

                <div>
                  <p className="text-sm font-semibold text-emerald-800">
                    Bukti check-in siap
                  </p>

                  <p className="mt-1 text-xs leading-5 text-emerald-700">
                    Lokasi dan selfie sudah tersedia.
                    Selanjutnya bukti akan direview sebelum
                    dikirim ke server.
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="button"
              className="mt-4 h-12 w-full rounded-xl bg-[#2563eb] text-sm font-semibold hover:bg-[#1d4ed8]"
              onClick={() => {
                navigate("/check-in/review", {
                  state: {
                    selfie,
                    latitude: location?.latitude,
                    longitude: location?.longitude,
                    accuracy: location?.accuracy,
                  },
                })
              }}
            >
              <ShieldCheck className="mr-2 size-4" />
              Lanjut ke Review
            </Button>
          </div>
        )}

        <div className="mt-6 flex items-start gap-2 px-1">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-slate-400" />

          <p className="text-[11px] leading-5 text-slate-400">
            Data lokasi dan selfie digunakan sebagai bukti
            kehadiran dan akan divalidasi oleh sistem.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CheckInCapture