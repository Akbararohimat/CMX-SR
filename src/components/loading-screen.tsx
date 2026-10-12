import { useEffect } from "react"

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({
  onComplete,
}: LoadingScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 1800)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8fafc]">
      <div className="pointer-events-none absolute -left-20 top-10 size-72 rounded-full bg-blue-400/15 blur-3xl" />

      <div className="pointer-events-none absolute -right-20 top-0 size-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="pointer-events-none absolute bottom-[-100px] left-[20%] size-72 rounded-full bg-yellow-300/15 blur-3xl" />

      <div className="pointer-events-none absolute bottom-10 right-[5%] size-72 rounded-full bg-blue-300/10 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative flex size-32 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full border border-blue-300/30" />

          <div className="absolute inset-3 rounded-full bg-blue-100/40 blur-xl" />

          <img
            src="/cmx-logo.png"
            alt="CMX"
            className="relative z-10 size-24 object-contain"
          />
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-[#071b49]">
          CMX
        </h1>

        <p className="mt-1 text-lg font-semibold text-[#071b49]">
          Sekolah Rakyat
        </p>

        <p className="mt-1 text-sm text-blue-500">
          EOS Operations Platform
        </p>

        <div className="mt-8 flex items-center gap-2">
          <span className="size-2 animate-pulse rounded-full bg-blue-600" />

          <span
            className="size-2 animate-pulse rounded-full bg-blue-500"
            style={{ animationDelay: "150ms" }}
          />

          <span
            className="size-2 animate-pulse rounded-full bg-blue-400"
            style={{ animationDelay: "300ms" }}
          />
        </div>

        <p className="mt-4 text-sm font-medium text-slate-400">
          Memuat aplikasi...
        </p>
      </div>
    </main>
  )
}