import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import JobsPage from "./pages/jobs/JobsPage";
import CandidatesPage from "./pages/candidates/CandidatesPage";
import JobSeekerProfilePage from "./features/jobSeeker/pages/JobSeekerProfilePage";
import MyApplicationsPage from "./features/jobSeeker/pages/MyApplicationsPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicOnlyRoute from "./components/common/PublicOnlyRoute";

// Recruiter Feature Layout & Pages
import RecruiterLayout from "./features/recruiter/layout/RecruiterLayout";
import Dashboard from "./features/recruiter/pages/Dashboard";
import Company from "./features/recruiter/pages/Company";
import PostJob from "./features/recruiter/pages/PostJob";
import MyJobs from "./features/recruiter/pages/MyJobs";
import Applications from "./features/recruiter/pages/Applications";
import Settings from "./features/recruiter/pages/Settings";
import RecruiterProfile from "./features/recruiter/pages/RecruiterProfile";
import RecruitersDirectory from "./features/recruiter/pages/RecruitersDirectory";

// Jobs Feature Pages
import CreateJob from "./features/jobs/pages/CreateJob";
import EditJob from "./features/jobs/pages/EditJob";
import JobDetails from "./features/jobs/pages/JobDetails";

function App() {
  return (
    <Routes>
      {/* Public Auth Routes (Redirects to dashboard if already logged in) */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Main Layout (Recruiters are automatically redirected back to /recruiter/dashboard) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/candidates" element={<CandidatesPage />} />
        <Route path="/recruiters" element={<RecruitersDirectory />} />

        {/* Protected Job Seeker Routes */}
        <Route element={<ProtectedRoute allowedRoles={["JOB_SEEKER"]} />}>
          <Route path="/job-seeker/profile" element={<JobSeekerProfilePage />} />
          <Route path="/job-seeker/applications" element={<MyApplicationsPage />} />
        </Route>
      </Route>

      {/* Protected Recruiter Routes (Strict RBAC Guard for RECRUITER role) */}
      <Route element={<ProtectedRoute allowedRoles={["RECRUITER"]} />}>
        <Route path="/recruiter" element={<RecruiterLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="company" element={<Company />} />
          <Route path="post-job" element={<PostJob />} />
          <Route path="my-jobs" element={<MyJobs />} />
          <Route path="jobs" element={<MyJobs />} />
          <Route path="jobs/create" element={<CreateJob />} />
          <Route path="jobs/:id" element={<JobDetails />} />
          <Route path="jobs/edit/:id" element={<EditJob />} />
          <Route path="applications" element={<Applications />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<RecruiterProfile />} />
        </Route>
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;