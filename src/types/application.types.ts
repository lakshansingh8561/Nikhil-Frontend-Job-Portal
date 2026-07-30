import type { Job } from "./job.types";
import type { JobSeekerProfile } from "../features/jobSeeker/types/jobSeeker.types";

export interface Application {
  _id: string;
  jobId: Job;
  applicantId: JobSeekerProfile | string;
  coverLetter?: string;
  resumeUrl?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'SHORTLISTED';
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationApiResponse {
  success: boolean;
  message: string;
  data: Application | Application[];
}
