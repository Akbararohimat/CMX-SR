import {
    ArrowLeft,
    Camera,
    CheckCircle2,
    Clock3,
    MapPin,
    ShieldCheck,
} from "lucide-react"
import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

function CheckIn() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <div className="mx-auto w-full max-w-md px-5 pb-8 pt-5">
                <header className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => navigate("/home")}
                      className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
                      aria-label="Kembali">
                        <ArrowLeft className="size-5" />
                      </button>

                      <div>
                        <p className="text-xs font-medium text-blue-600">
                            EOS Operations
                        </p>
                        <h1 className="text-lg font-bold text-[#071b49]">
                            Check-In
                        </h1>
                      </div>
                </header>

                <section className="mt-8">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <ShieldCheck className="size-6" />
                    </div>
                    <h2 className="mt-5 text-2xl font-bold tracking-tight text-[#071b49]">
                        Check-In Kehadiran
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Sebelum Melanjutkan, Pastikan Kamu Berada Di Lokasi
                        Site yang Telah Ditentukan.
                    </p>
                </section>

                <Card className="mt-6 rounded-2xl border-slate-200 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold text-slate-800">
                            Informasi Check-In
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <MapPin className="size-5" />
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs text-slate-400">
                                    Site
                                </p>

                                <p className="mt-1 text-sm font-semibold text-slate-800">
                                    Sekolah Rakyat Bandung
                                </p>
                                <p className="mt-1 text-xs text-slate-400">
                                    Lokasi Akan Diverifikasi Saat Proses Check-In.
                                </p>
                            </div>
                        </div>

                        <div className="h-px bg-slate-100" />
                        <div className="flex items-start gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                <Clock3 className="size-5" />
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">
                                    Window Check-In
                                </p>
                                <p className="mt-1 text-sm font-semibold text-slate-800">
                                    05.00-11.00 WIB
                                </p>
                                <p className="mt-1 text-xs leading-5 text-slate-400">
                                    08.00 Tepat Waktu · Setelah 08.01
                                    Dihitung Terlambat.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <section className="mt-7">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                            Yang Dibutuhkan
                        </p>
                        <h2 className="mt-1 text-lg font-bold text-[#071b49]">
                            Bukti Check-In
                        </h2>
                    </div>
                    
                    <div className="mt-4 space-y-3">
                        
                        <Card className="rounded-2xl border-slate-200 shadow-sm">
                            <CardContent className="flex items-start gap-4 p-4">
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <MapPin className="size-5" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="text-sm font-semibold text-slate-800">
                                            Lokasi Terkini
                                        </h3>

                                        <CheckCircle2 className="size-4 text-slate-300" />
                                    </div>

                                    <p className="mt-1 text-xs leading-5 text-slate-400">
                                        Lokasi Perangkat Digunakan Untuk
                                        Memverifikasi Bahwa Kamu Berada Dalam Radius Site.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border-slate-200 shadow-sm">
                            <CardContent className="flex items-start gap-4 p-4">
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                    <Camera className="size-5" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="text-sm font-semibold text-slate-800">
                                            Selfie Kehadiran
                                        </h3>
                                        
                                        <CheckCircle2 className="size-4 text-slate-300" />
                                    </div>

                                    <p className="mt-1 text-xs leading-5 text-slate-400">
                                        Selfie Melalui Kamera Depan Sebagai Bukti
                                        Kehadiran Di Site.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border-slate-200 shadow-sm">
                            <CardContent className="flex items-start gap-4 p-4">
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                    <Clock3 className="size-5" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="text-sm font-semibold text-slate-800">
                                            Waktu Server
                                        </h3>

                                        <CheckCircle2 className="size-4 text-slate-300" />
                                    </div>
                                    <p className="mt-1 text-xs leading-5 text-slate-400">
                                        Waktu Absensi Resmi Mengikuti Waktu Server,
                                        Bukan Waktu Perangkat.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3.5">
                    <div className="flex gap-3">
                        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-blue-600" />
                        <p className="text-xs leading-5 text-blue-700">
                            Dengan Melanjutkan, Aplikasi akan meminta izin
                            untuk mengakses lokasi dan kamera perangkat.
                        </p>
                    </div>
                </div>

                <div className="mt-7">
                    <Button
                      onClick={() => navigate("/check-in/capture")}
                      className="h-12 w-full rounded-xl bg-[#2563eb] text-sm font-semibold text-white shadow-sm hover:bg-[#1d4ed8]">
                        <ShieldCheck className="mr-2 size-4" />
                        Mulai Check-In
                      </Button>
                      <p className="mt-3 text-center text-[11px] leading-5 text-slate-400">
                        Pastikan koneksi internet aktif sebelum memulai.
                      </p>
                </div>
            </div>
        </div>
    )
}

export default CheckIn