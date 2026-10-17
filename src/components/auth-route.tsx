
import { Navigate, Outlet } from "react-router"

const isDevelopmentMode =
  import.meta.env.DEV &&
  import.meta.env.VITE_EOS_DEV_MODE === "true"

export function AuthRoute() {
  console.log("DEV:", import.meta.env.DEV)
  console.log("EOS DEV MODE:", import.meta.env.VITE_EOS_DEV_MODE)
  if (isDevelopmentMode) {
    return <Outlet />
  }

  return <Navigate to="/login" replace />
}
