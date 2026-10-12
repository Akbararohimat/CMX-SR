import { useEffect } from "react"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({
  onComplete,
}: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 2200)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#071b49]">
      <div className="pointer-events-none absolute -left-24 top-20 size-72 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="pointer-events-none absolute -right-24 bottom-10 size-80 rounded-full bg-blue-400/15 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-40 rotate-[-28deg] rounded-3xl bg-blue-600/40" />

      <div className="pointer-events-none absolute -bottom-24 left-28 h-52 w-44 rotate-[-28deg] rounded-3xl bg-blue-700/50" />

      <div className="relative z-10 flex max-w-xs flex-col items-center px-6 text-center">
        <img
          src="/cmx-logo.png"
          alt="CMX"
          className="h-28 w-28 object-contain"
        />

        <h1 className="mt-7 text-4xl font-bold tracking-tight text-white">
          CMX
        </h1>

        <p className="mt-1 text-xl font-semibold text-white">
          Sekolah Rakyat
        </p>

        <p className="mt-2 text-sm font-medium tracking-wide text-blue-200">
          EOS Operations Platform
        </p>

        <p className="mt-16 max-w-[240px] text-sm leading-6 text-blue-100/80">
          Bersama memastikan infrastruktur pendidikan
          berjalan optimal.
        </p>

        <div className="mt-10 h-1 w-16 overflow-hidden rounded-full bg-white/20">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-400" />
        </div>
      </div>
    </main>
  )
}