
import { useState } from "react"
import { useNavigate } from "react-router"
import {
  Eye,
  EyeOff,
  LockKeyhole,
  UserRound,
  ShieldAlert,
  Code2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const isDevelopmentMode =
  import.meta.env.DEV &&
  import.meta.env.VITE_EOS_DEV_MODE === "true"

function Login() {
  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  function handleDevelopmentLogin() {
    if (!isDevelopmentMode) return

    navigate("/home", { replace: true })
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8fafc]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-20 size-72 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute -right-20 top-10 size-80 rounded-full bg-red-400/15 blur-3xl" />
        <div className="absolute bottom-[-100px] left-[25%] size-72 rounded-full bg-yellow-300/20 blur-3xl" />
        <div className="absolute bottom-10 right-[10%] size-80 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute left-[12%] top-[55%] size-32 rounded-full bg-red-300/10 blur-2xl" />
        <div className="absolute right-[25%] top-[20%] size-24 rounded-full bg-yellow-300/10 blur-2xl" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10">
        <div className="w-full max-w-[420px]">
          <div className="mb-8 text-center">
            <img
              src="/cmx-logo.png"
              alt="CMX"
              className="mx-auto size-16 object-contain"
            />

            <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
              Selamat Datang di CMX
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Masuk ke EOS Operations Platform
            </p>
          </div>

          <div className="rounded-2xl border border-white/70 bg-white/90 p-6 shadow-[0_8px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8">
            <form
              onSubmit={(event) => event.preventDefault()}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Username
                </label>

                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3.5 top-1/2 z-10 size-[18px] -translate-y-1/2 text-slate-400" />

                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(event) =>
                      setUsername(event.target.value)
                    }
                    placeholder="Masukkan username"
                    autoComplete="username"
                    disabled
                    className="h-11 rounded-xl border-slate-200 bg-white/80 pl-11 text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 z-10 size-[18px] -translate-y-1/2 text-slate-400" />

                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Menunggu integrasi backend"
                    autoComplete="current-password"
                    disabled
                    className="h-11 rounded-xl border-slate-200 bg-white/80 pl-11 pr-11 text-sm"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                    disabled
                    aria-label={
                      showPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                    className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400"
                  >
                    {showPassword ? (
                      <EyeOff className="size-[18px]" />
                    ) : (
                      <Eye className="size-[18px]" />
                    )}
                  </button>
                </div>
              </div>

              {isDevelopmentMode ? (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-3.5">
                  <div className="flex items-start gap-2.5">
                    <Code2 className="mt-0.5 size-5 shrink-0 text-blue-700" />

                    <div>
                      <p className="text-sm font-semibold text-blue-900">
                        Development Mode Aktif
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5">
                  <div className="flex items-start gap-2.5">
                    <ShieldAlert className="mt-0.5 size-5 shrink-0 text-amber-700" />

                    <div>
                      <p className="text-sm font-semibold text-amber-900">
                        Login Belum Tersedia
                      </p>

                      <p className="mt-1 text-xs leading-5 text-amber-800">
                        Autentikasi menunggu integrasi API backend.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="button"
                onClick={handleDevelopmentLogin}
                disabled={!isDevelopmentMode}
                className="h-11 w-full rounded-xl bg-[#2563eb] text-sm font-semibold text-white shadow-sm hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDevelopmentMode
                  ? "Masuk sebagai Pengembang"
                  : "Masuk"}
              </Button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            CMX · EOS Operations Platform
          </p>
        </div>
      </div>
    </main>
  )
}

export default Login
