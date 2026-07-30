export interface StatItem {
  id: string;
  title: string;
  value: number | string;
  change: string;
  isPositive: boolean;
  iconName: "jobs" | "activeJobs" | "applicants" | "shortlisted";
}

export interface DashboardJob {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: "ACTIVE" | "CLOSED" | "DRAFT";
  applicantCount: number;
  postedDate: string;
}

export interface DashboardApplicant {
  id: string;
  candidateName: string;
  candidateAvatar?: string;
  candidateEmail: string;
  jobTitle: string;
  experience: string;
  status: "PENDING" | "SHORTLISTED" | "ACCEPTED" | "REJECTED";
  appliedDate: string;
}
