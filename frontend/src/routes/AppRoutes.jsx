import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";

import Dashboard from "../pages/Dashboard";
import Resume from "../pages/Resume";
import Jobs from "../pages/Jobs";
import Applications from "../pages/Applications";
import Interview from "../pages/Interview";
import Progress from "../pages/Progress";
import Settings from "../pages/Settings";
import ProtectedRoute from "../components/ProtectedRoute";
import JobDetails from "../pages/JobDetails";

function AppRoutes() {
  return (
    <Routes>

      {/* ================= PUBLIC PAGES ================= */}

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />


      {/* ================= CAREERAI FEATURE PAGES ================= */}

      {/* Resume Analysis */}
      <Route
        path="/resume"
        element={<Resume />}
      />

      {/* Job Matching */}
      <Route
        path="/jobs"
        element={<Jobs />}
      />

      {/* Interview Preparation */}
      <Route
        path="/interview"
        element={<Interview />}
      />

      {/* Career Growth */}
      <Route
        path="/progress"
        element={<Progress />}
      />


      {/* ================= USER-SPECIFIC PAGES ================= */}

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Applications */}
      <Route
        path="/applications"
        element={
          <ProtectedRoute>
            <Applications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/jobs/:id"
        element={<JobDetails />}
      />
    </Routes>
  );
}

export default AppRoutes;