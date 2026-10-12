import { useCallback, useState } from "react"
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router"

import { AuthRoute } from "@/components/auth-route"
import { LoadingScreen } from "@/components/loading-screen"
import { SplashScreen } from "@/components/splash-screen"
import { AppShell } from "@/layouts/app-shell"
import { BackofficeShell } from "./layouts/backoffice-shell"

import Home from "@/pages/Home"
import Report from "@/pages/Report"
import Inventory from "@/pages/Inventory"
import More from "@/pages/More"
import Login from "@/pages/Login"
import CheckIn from "./pages/CheckIn"
import CheckInCapture from "@/pages/CheckInCapture"
import CheckInReview from "@/pages/CheckInReview"
import ClockOut from "@/pages/ClockOut"
import SupervisorDashboard from "./pages/supervisor/SupervisorDashboard"
import AttendanceRequests from "./pages/supervisor/AttendanceRequest"
import Assignments from "./pages/supervisor/Assignments"
import Sites from "./pages/supervisor/Sites"

function App() {
  const [stage, setStage] = useState<"splash" | "loading" | "app">(
    "splash",
  )

  const handleSplashComplete = useCallback(() => {
    setStage("loading")
  }, [])

  const handleLoadingComplete = useCallback(() => {
    setStage("app")
  }, [])

  if (stage === "splash") {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  if (stage === "loading") {
    return <LoadingScreen onComplete={handleLoadingComplete} />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AuthRoute />}>
          <Route element={<AppShell />}>
            <Route path="/home" element={<Home />} />
            <Route path="/report" element={<Report />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/more" element={<More />} />
            <Route path="/check-in" element={<CheckIn />} />
            <Route path="/check-in/capture" element={<CheckInCapture />} />
            <Route path="/check-in/review" element={<CheckInReview />} />
            <Route path="/clock-out" element={<ClockOut />} />
          </Route>
          <Route element={<BackofficeShell />}>
            <Route path="/supervisor" element={<SupervisorDashboard />} />
            <Route path="/supervisor/attendance-requests" element={<AttendanceRequests />} />
            <Route path="/supervisor/assignments" element={<Assignments />} />
            <Route path="/supervisor/sites" element={<Sites />} />
          </Route>
        </Route>
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App