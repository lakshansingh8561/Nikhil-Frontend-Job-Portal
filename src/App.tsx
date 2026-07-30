import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import JobsPage from "./pages/jobs/JobsPage";
import CandidatesPage from "./pages/candidates/CandidatesPage";
import JobSeekerProfilePage from "./features/jobSeeker/pages/JobSeekerProfilePage";
import MyApplicationsPage from "./features/jobSeeker/pages/MyApplicationsPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/candidates" element={<CandidatesPage />} />
        <Route path="/job-seeker/profile" element={<JobSeekerProfilePage />} />
        <Route path="/job-seeker/applications" element={<MyApplicationsPage />} />
      </Route>
    </Routes>
  );
}

export default App;