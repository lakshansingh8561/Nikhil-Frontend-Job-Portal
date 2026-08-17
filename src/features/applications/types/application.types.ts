export type ApplicationStatus =
  | "APPLIED"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "REJECTED"
  | "HIRED";

export interface CompanyInJob {
  _id: string;
  companyName: string;
  logo?: string;
  location?: string;
  website?: string;
}

export interface JobInApplication {
  _id: string;
  title: string;
  location: string;
  companyId?: CompanyInJob | string;
  salaryMin?: number;
  salaryMax?: number;
  employmentType?: string;
  experienceLevel?: string;
}

export interface ApplicantUser {
  _id: string;
  email: string;
}

export interface ApplicantProfile {
  _id: string;
  userId?: ApplicantUser | string;
  firstName: string;
  lastName: string;
  phone?: string;
  headline?: string;
  bio?: string;
  currentLocation?: string;
  yearsOfExperience?: number;
  expectedSalary?: number;
  skills?: string[];
  resume?: string;
}

export interface Application {
  _id: string;
  jobId: JobInApplication | string;
  applicantId?: ApplicantProfile | string;
  userId?: ApplicantUser | string;
  applicantProfile?: {
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
    headline?: string;
  };
  resume: string;
  coverLetter?: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ApplyJobPayload {
  jobId: string;
  resume: string;
  coverLetter?: string;
}

export interface UpdateStatusPayload {
  id: string;
  status: ApplicationStatus;
}

export interface ApplicationApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
