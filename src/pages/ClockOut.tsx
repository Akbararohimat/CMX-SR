
import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router"
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  MapPin,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Video,
  XCircle,
} from "lucide-react"

type LocationStatus =
  | "idle"
  | "checking"
  | "success"
  | "denied"
  | "error"

type CameraStatus =
  | "idle"
  | "starting"
  | "ready"
  | "denied"
  | "error"

type Notice = {
  type: "success" | "error" | "info"
  message: string
}

type LocationEvidence = {
  latitude: number
  longitude: number
  accuracy: number
  capturedAt: string
}

export default function ClockOut() {
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [locationStatus, setLocationStatus] =
    useState<LocationStatus>("idle")
  const [cameraStatus, setCameraStatus] =
    useState<CameraStatus>("idle")
  const [location, setLocation] =
    useState<LocationEvidence | null>(null)
  const [selfie, setSelfie] = useState<string | null>(null)
  const [notice, setNotice] = useState<Notice | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const stopCamera = useCallback(() => {
    const stream = streamRef.current

    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    const videoElement = videoRef.current

    if (videoElement) {
      videoElement.pause()
      videoElement.srcObject = null
    }
  }, [])

  useEffect(() => {
    return () => {
      const stream = streamRef.current

      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const videoElement = videoRef.current
    const stream = streamRef.current

    if (
      !videoElement ||
      !stream ||
      cameraStatus !== "ready" ||
      selfie
    ) {
      return
    }

    videoElement.srcObject = stream

    videoElement.play().catch(() => {
      setCameraStatus("error")
      setNotice({
        type: "error",
        message: "Kamera tidak dapat menampilkan pratinjau.",
      })
    })
  }, [cameraStatus, selfie])

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus("error")
      setNotice({
        type: "error",
        message: "Browser ini tidak mendukung akses lokasi.",
      })
      return
    }

    setLocationStatus("checking")
    setNotice(null)
    setLocation(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          capturedAt: new Date(position.timestamp).toISOString(),
        })

        setLocationStatus("success")
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationStatus("denied")
          setNotice({
            type: "error",
            message:
              "Izin lokasi ditolak. Aktifkan izin lokasi browser lalu coba lagi.",
          })
          return
        }

        setLocationStatus("error")
        setNotice({
          type: "error",
          message:
            error.code === error.TIMEOUT
              ? "Lokasi membutuhkan waktu terlalu lama. Coba lagi di area dengan sinyal GPS yang lebih baik."
              : "Lokasi belum berhasil didapatkan. Periksa pengaturan lokasi perangkat lalu coba lagi.",
        })
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 20000,
      },
    )
  }, [])

  const startCamera = useCallback(async () => {
    setNotice(null)
    setSelfie(null)
    stopCamera()
    setCameraStatus("starting")

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraStatus("error")
      setNotice({
        type: "error",
        message:
          "Browser tidak mendukung kamera. Buka aplikasi melalui HTTPS atau localhost.",
      })
      return
    }

    try {
      let stream: MediaStream

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        })
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: true,
        })
      }

      streamRef.current = stream
      setCameraStatus("ready")
    } catch (error) {
      const cameraError = error as DOMException

      if (
        cameraError.name === "NotAllowedError" ||
        cameraError.name === "PermissionDeniedError"
      ) {
        setCameraStatus("denied")
        setNotice({
          type: "error",
          message:
            "Izin kamera ditolak. Izinkan akses kamera di pengaturan browser.",
        })
      } else {
        setCameraStatus("error")
        setNotice({
          type: "error",
          message:
            "Kamera tidak dapat dibuka. Pastikan kamera tidak sedang digunakan aplikasi lain.",
        })
      }
    }
  }, [stopCamera])

  const captureSelfie = useCallback(() => {
    const videoElement = videoRef.current

    if (
      !videoElement ||
      videoElement.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
      videoElement.videoWidth === 0 ||
      videoElement.videoHeight === 0
    ) {
      setNotice({
        type: "error",
        message: "Kamera belum siap. Tunggu pratinjau muncul lalu coba lagi.",
      })
      return
    }

    const canvas = document.createElement("canvas")
    canvas.width = videoElement.videoWidth
    canvas.height = videoElement.videoHeight

    const context = canvas.getContext("2d")

    if (!context) {
      setNotice({
        type: "error",
        message: "Foto tidak dapat diproses. Silakan coba lagi.",
      })
      return
    }

    context.translate(canvas.width, 0)
    context.scale(-1, 1)
    context.drawImage(
      videoElement,
      0,
      0,
      canvas.width,
      canvas.height,
    )

    const image = canvas.toDataURL("image/jpeg", 0.9)

    setSelfie(image)
    stopCamera()
    setCameraStatus("idle")
    setNotice(null)
  }, [stopCamera])

  const retakeSelfie = useCallback(() => {
    setSelfie(null)
    void startCamera()
  }, [startCamera])

  const handleSubmit = useCallback(() => {
    if (!location) {
      setNotice({
        type: "error",
        message: "Ambil lokasi terkini terlebih dahulu.",
      })
      return
    }

    if (!selfie) {
      setNotice({
        type: "error",
        message: "Ambil foto selfie sebelum melanjutkan.",
      })
      return
    }

    setIsChecking(true)
    setNotice({
      type: "info",
      message:
        "Bukti lokasi dan selfie sudah tersedia di perangkat. API backend belum terhubung, jadi Clock Out belum dikirim atau disimpan sebagai absensi resmi.",
    })
    setIsChecking(false)
  }, [location, selfie])

  const formatCoordinates = (value: number) => value.toFixed(6)

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Kembali"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Clock Out
            </h1>
            <p className="text-sm text-slate-500">
              Persiapan bukti kepulangan
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-2xl flex-col gap-5 px-4 py-5">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <Clock3 size={24} />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-slate-900">
                Persiapan Clock Out
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Siapkan lokasi GPS terkini dan foto selfie sebagai bukti.
                Waktu, validasi lokasi, dan pencatatan absensi resmi harus
                diproses oleh backend.
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-5 text-amber-900">
            <ShieldAlert size={19} className="mt-0.5 shrink-0" />
            <p>
              Pengambilan bukti di halaman ini belum mengirim absensi ke
              server. Clock Out resmi belum tercatat.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <MapPin size={21} />
            </div>

            <div className="flex-1">
              <h2 className="font-semibold text-slate-900">
                Lokasi GPS
              </h2>
              <p className="text-sm text-slate-500">
                Ambil lokasi terbaru dari perangkat
              </p>
            </div>

            {locationStatus === "success" && (
              <CheckCircle2
                size={21}
                className="shrink-0 text-emerald-600"
              />
            )}
          </div>

          {location && (
            <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Latitude</span>
                <span className="break-all text-right font-medium text-slate-800">
                  {formatCoordinates(location.latitude)}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Longitude</span>
                <span className="break-all text-right font-medium text-slate-800">
                  {formatCoordinates(location.longitude)}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Akurasi GPS</span>
                <span className="text-right font-medium text-slate-800">
                  ±{Math.round(location.accuracy)} meter
                </span>
              </div>

              <div className="border-t border-slate-200 pt-2 text-xs leading-5 text-slate-500">
                Waktu pengambilan GPS:{" "}
                {new Date(location.capturedAt).toLocaleString("id-ID")}
              </div>
            </div>
          )}

          {locationStatus === "checking" && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-blue-50 p-3 text-sm text-blue-800">
              <LoaderCircle size={18} className="animate-spin" />
              Sedang mengambil lokasi GPS...
            </div>
          )}

          {locationStatus === "denied" && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              <XCircle size={18} />
              Izin lokasi belum diberikan.
            </div>
          )}

          {locationStatus === "error" && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              <XCircle size={18} />
              Lokasi belum berhasil didapatkan.
            </div>
          )}

          <button
            type="button"
            onClick={getLocation}
            disabled={locationStatus === "checking"}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {locationStatus === "checking" ? (
              <LoaderCircle size={19} className="animate-spin" />
            ) : (
              <MapPin size={19} />
            )}
            {location
              ? "Ambil Ulang Lokasi"
              : locationStatus === "checking"
                ? "Mengambil Lokasi..."
                : "Ambil Lokasi"}
          </button>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
              <Camera size={21} />
            </div>

            <div className="flex-1">
              <h2 className="font-semibold text-slate-900">
                Foto Selfie
              </h2>
              <p className="text-sm text-slate-500">
                Gunakan kamera langsung
              </p>
            </div>

            {selfie && (
              <CheckCircle2
                size={21}
                className="shrink-0 text-emerald-600"
              />
            )}
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl bg-slate-950">
            {selfie ? (
              <img
                src={selfie}
                alt="Pratinjau foto selfie Clock Out"
                className="aspect-[4/3] w-full object-cover"
              />
            ) : cameraStatus === "ready" ||
              cameraStatus === "starting" ? (
              <div className="relative aspect-[4/3]">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full scale-x-[-1] object-cover"
                />

                {cameraStatus === "starting" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950 text-sm text-white">
                    <LoaderCircle
                      size={28}
                      className="animate-spin"
                    />
                    Membuka kamera...
                  </div>
                )}

                {cameraStatus === "ready" && (
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 rounded-lg bg-black/50 px-3 py-2 text-xs text-white">
                    <Video size={15} />
                    Posisikan wajah di tengah kamera
                  </div>
                )}
              </div>
            ) : (
              <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 px-6 text-center text-white">
                <Camera size={38} className="text-slate-400" />
                <p className="text-sm text-slate-300">
                  {cameraStatus === "denied"
                    ? "Izin kamera ditolak. Periksa izin kamera browser."
                    : cameraStatus === "error"
                      ? "Kamera belum tersedia. Pastikan perangkat memiliki kamera dan tidak sedang digunakan aplikasi lain."
                      : "Buka kamera untuk mengambil foto selfie."}
                </p>
              </div>
            )}
          </div>

          {selfie ? (
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={retakeSelfie}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <RotateCcw size={18} />
                Foto Ulang
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelfie(null)
                  setCameraStatus("idle")
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 font-semibold text-red-600 transition hover:bg-red-50"
              >
                <XCircle size={18} />
                Hapus
              </button>
            </div>
          ) : cameraStatus === "ready" ? (
            <button
              type="button"
              onClick={captureSelfie}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-3 font-semibold text-white transition hover:bg-violet-800"
            >
              <Camera size={19} />
              Ambil Foto
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void startCamera()}
              disabled={cameraStatus === "starting"}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-3 font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cameraStatus === "starting" ? (
                <LoaderCircle size={19} className="animate-spin" />
              ) : (
                <Camera size={19} />
              )}
              {cameraStatus === "starting"
                ? "Membuka Kamera..."
                : "Buka Kamera"}
            </button>
          )}
        </section>

        {notice && (
          <div
            role="status"
            className={`flex items-start gap-3 rounded-xl border p-4 text-sm leading-6 ${
              notice.type === "error"
                ? "border-red-200 bg-red-50 text-red-800"
                : notice.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-blue-200 bg-blue-50 text-blue-800"
            }`}
          >
            {notice.type === "error" ? (
              <XCircle size={20} className="mt-0.5 shrink-0" />
            ) : notice.type === "success" ? (
              <CheckCircle2
                size={20}
                className="mt-0.5 shrink-0"
              />
            ) : (
              <ShieldAlert size={20} className="mt-0.5 shrink-0" />
            )}
            <p>{notice.message}</p>
          </div>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck
              size={22}
              className="mt-0.5 shrink-0 text-slate-600"
            />

            <div>
              <h2 className="font-semibold text-slate-900">
                Periksa Bukti
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Pastikan lokasi dan foto tersedia sebelum integrasi
                backend. Validasi radius lokasi, jadwal Clock Out, status
                Daily Report, serta penyimpanan bukti harus dilakukan oleh
                server.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-slate-600">Lokasi GPS</span>
              <span
                className={
                  location
                    ? "font-semibold text-emerald-700"
                    : "font-semibold text-slate-500"
                }
              >
                {location ? "Tersedia di perangkat" : "Belum tersedia"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-slate-600">Foto selfie</span>
              <span
                className={
                  selfie
                    ? "font-semibold text-emerald-700"
                    : "font-semibold text-slate-500"
                }
              >
                {selfie ? "Tersedia di perangkat" : "Belum tersedia"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isChecking || !location || !selfie}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3.5 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <ShieldCheck size={19} />
            Periksa Kesiapan Pengiriman
          </button>

          <p className="mt-3 text-center text-xs leading-5 text-slate-500">
            Tombol ini hanya memeriksa kelengkapan bukti di frontend.
            Belum membuat catatan Clock Out resmi.
          </p>
        </section>
      </main>
    </div>
  )
}
