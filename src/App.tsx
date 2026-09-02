import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ForgotPassword from "./pages/auth/ForgotPassword";
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
import { Membership } from "./features/membership/pages/Membership";
import { Pricing } from "./features/membership/pages/Pricing";
import { RecruiterMembership } from "./features/membership/pages/RecruiterMembership";
import PaymentHistoryPage from "./features/membership/pages/PaymentHistoryPage";
import { PolarSuccessPage } from "./features/membership/pages/PolarSuccessPage";
import { PolarCancelPage } from "./features/membership/pages/PolarCancelPage";

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
import AdminMembershipsPage from "./features/admin/pages/Memberships";

// Real-Time Chat Feature Page
import { ChatPage } from "./features/chat";

// Community Feed & Network Pages
import CommunityFeed from "./features/network/pages/CommunityFeed";
import PublicProfile from "./features/network/pages/PublicProfile";
import NetworkDirectory from "./features/network/pages/NetworkDirectory";
import PostDetail from "./features/network/pages/PostDetail";
import MyNetwork from "./features/network/pages/MyNetwork";
import SavedPosts from "./features/network/pages/SavedPosts";

// Blog Feature Pages
import {
  PublicBlogPage,
  BlogDetailsPage,
  MyBlogsPage,
  CreateBlogPage,
  EditBlogPage,
  AdminBlogsPage,
} from "./features/blogs";

import { LocationDeniedBanner } from "./components/common/LocationDeniedBanner";
import ScrollToTopOnRoute from "./components/common/ScrollToTopOnRoute";

function App() {
  return (
    <>
      <ScrollToTopOnRoute />
      <LocationDeniedBanner />
      <Routes>
        {/* Public Auth Routes (Redirects to dashboard if already logged in) */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Main Layout (Public Pages) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<BrowseJobs />} />
          <Route path="/jobs/:id" element={<JobSeekerJobDetails />} />
          <Route path="/candidates" element={<CandidatesPage />} />
          <Route path="/recruiters" element={<RecruitersDirectory />} />
          <Route path="/membership" element={<Pricing />} />
          <Route path="/pricing" element={<Pricing />} />

          {/* Public Blog Routes */}
          <Route path="/blog" element={<PublicBlogPage />} />
          <Route path="/blog/grid" element={<PublicBlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailsPage />} />
        </Route>

        {/* Standalone Payment Result Routes (accessible when logged in) */}
        <Route path="/payment/polar/success" element={<PolarSuccessPage />} />
        <Route path="/payment/polar/cancel" element={<PolarCancelPage />} />

        {/* Protected Job Seeker Dashboard Routes */}
        <Route element={<ProtectedRoute allowedRoles={["JOB_SEEKER"]} />}>
          <Route path="/job-seeker" element={<JobSeekerLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<JobSeekerDashboard />} />
            <Route path="network" element={<CommunityFeed />} />
            <Route path="network/directory" element={<NetworkDirectory />} />
            <Route path="network/connections" element={<MyNetwork />} />
            <Route path="network/saved" element={<SavedPosts />} />
            <Route path="network/post/:postId" element={<PostDetail />} />
            <Route path="network/profile" element={<PublicProfile />} />
            <Route path="network/profile/:userId" element={<PublicProfile />} />
            <Route path="profile" element={<JobSeekerProfilePage />} />
            <Route path="applications" element={<MyApplications />} />
            <Route path="membership" element={<Membership />} />
            <Route path="billing" element={<PaymentHistoryPage />} />
            <Route path="messages" element={<ChatPage />} />
            <Route path="jobs" element={<BrowseJobs />} />
            <Route path="jobs/:id" element={<JobSeekerJobDetails />} />
            <Route path="blogs" element={<MyBlogsPage />} />
            <Route path="blogs/create" element={<CreateBlogPage />} />
            <Route path="blogs/edit/:id" element={<EditBlogPage />} />
            <Route path="settings" element={<JobSeekerSettings />} />
          </Route>
        </Route>

        {/* Protected Recruiter Routes (Strict RBAC Guard for RECRUITER role) */}
        <Route element={<ProtectedRoute allowedRoles={["RECRUITER"]} />}>
          <Route path="/recruiter" element={<RecruiterLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="network" element={<CommunityFeed />} />
            <Route path="network/directory" element={<NetworkDirectory />} />
            <Route path="network/connections" element={<MyNetwork />} />
            <Route path="network/saved" element={<SavedPosts />} />
            <Route path="network/post/:postId" element={<PostDetail />} />
            <Route path="network/profile" element={<PublicProfile />} />
            <Route path="network/profile/:userId" element={<PublicProfile />} />
            <Route path="company" element={<Company />} />
            <Route path="membership" element={<RecruiterMembership />} />
            <Route path="billing" element={<PaymentHistoryPage />} />
            <Route path="post-job" element={<PostJob />} />
            <Route path="my-jobs" element={<MyJobs />} />
            <Route path="jobs" element={<MyJobs />} />
            <Route path="jobs/create" element={<CreateJob />} />
            <Route path="jobs/edit/:id" element={<EditJob />} />
            <Route path="jobs/:jobId/applications" element={<RecruiterApplications />} />
            <Route path="jobs/:id" element={<RecruiterJobDetails />} />
            <Route path="applications" element={<RecruiterApplications />} />
            <Route path="messages" element={<ChatPage />} />
            <Route path="blogs" element={<MyBlogsPage />} />
            <Route path="blogs/create" element={<CreateBlogPage />} />
            <Route path="blogs/edit/:id" element={<EditBlogPage />} />
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
            <Route path="blogs" element={<AdminBlogsPage />} />
            <Route path="blogs/create" element={<CreateBlogPage />} />
            <Route path="blogs/edit/:id" element={<EditBlogPage />} />
            <Route path="memberships" element={<AdminMembershipsPage />} />
            <Route path="payments" element={<PaymentHistoryPage />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;