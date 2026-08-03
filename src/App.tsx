import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import CandidatesPage from "./pages/candidates/CandidatesPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicOnlyRoute from "./components/common/PublicOnlyRoute";

// Job Browser Feature Pages (Job Seeker Side)
import BrowseJobs from "./features/jobBrowser/pages/BrowseJobs";
import JobSeekerJobDetails from "./features/jobBrowser/pages/JobDetails";

// Applications Feature Pages
import MyApplications from "./features/applications/pages/MyApplications";
import RecruiterApplications from "./features/applications/pages/RecruiterApplications";

// Job Seeker Feature Layout & Pages
import JobSeekerLayout from "./features/jobSeeker/layout/JobSeekerLayout";
import JobSeekerDashboard from "./features/jobSeeker/pages/Dashboard";
import JobSeekerProfilePage from "./features/jobSeeker/pages/JobSeekerProfilePage";
import JobSeekerSettings from "./features/jobSeeker/pages/Settings";

// Recruiter Feature Layout & Pages
import RecruiterLayout from "./features/recruiter/layout/RecruiterLayout";
import Dashboard from "./features/recruiter/pages/Dashboard";
import Company from "./features/recruiter/pages/Company";
import PostJob from "./features/recruiter/pages/PostJob";
import MyJobs from "./features/recruiter/pages/MyJobs";
import Settings from "./features/recruiter/pages/Settings";
import RecruiterProfile from "./features/recruiter/pages/RecruiterProfile";
import RecruitersDirectory from "./features/recruiter/pages/RecruitersDirectory";

// Jobs Feature Pages (Recruiter Management)
import CreateJob from "./features/jobs/pages/CreateJob";
import EditJob from "./features/jobs/pages/EditJob";
import RecruiterJobDetails from "./features/jobs/pages/JobDetails";

// Admin Feature Layout & Pages
import AdminLayout from "./features/admin/layout/AdminLayout";
import AdminDashboard from "./features/admin/pages/Dashboard";
import AdminUsers from "./features/admin/pages/Users";
import AdminRecruiters from "./features/admin/pages/Recruiters";
import AdminJobs from "./features/admin/pages/Jobs";
import AdminApplications from "./features/admin/pages/Applications";
import AdminSettings from "./features/admin/pages/Settings";

function App() {
  return (
    <Routes>
      {/* Public Auth Routes (Redirects to dashboard if already logged in) */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Main Layout (Public Pages) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<BrowseJobs />} />
        <Route path="/jobs/:id" element={<JobSeekerJobDetails />} />
        <Route path="/candidates" element={<CandidatesPage />} />
        <Route path="/recruiters" element={<RecruitersDirectory />} />
      </Route>

      {/* Protected Job Seeker Dashboard Routes */}
      <Route element={<ProtectedRoute allowedRoles={["JOB_SEEKER"]} />}>
        <Route path="/job-seeker" element={<JobSeekerLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<JobSeekerDashboard />} />
          <Route path="profile" element={<JobSeekerProfilePage />} />
          <Route path="applications" element={<MyApplications />} />
          <Route path="jobs" element={<BrowseJobs />} />
          <Route path="jobs/:id" element={<JobSeekerJobDetails />} />
          <Route path="settings" element={<JobSeekerSettings />} />
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
          <Route path="jobs/:id" element={<RecruiterJobDetails />} />
          <Route path="jobs/:jobId/applications" element={<RecruiterApplications />} />
          <Route path="jobs/edit/:id" element={<EditJob />} />
          <Route path="applications" element={<RecruiterApplications />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<RecruiterProfile />} />
        </Route>
      </Route>

      {/* Protected Admin Routes (Strict RBAC Guard for ADMIN role) */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="recruiters" element={<AdminRecruiters />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="applications" element={<AdminApplications />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;