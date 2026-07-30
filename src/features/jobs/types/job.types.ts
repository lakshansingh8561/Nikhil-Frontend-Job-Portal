export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP"
  | "REMOTE";

export type ExperienceLevel =
  | "FRESHER"
  | "ONE_TO_TWO"
  | "THREE_TO_FIVE"
  | "FIVE_PLUS";

export interface CompanyInJob {
  _id: string;
  companyName: string;
  logo?: string;
}

export interface RecruiterInJob {
  _id: string;
  email: string;
}

export interface Job {
  _id: string;
  title: string;
  description: string;
  companyId: CompanyInJob | string;
  recruiterId: RecruiterInJob | string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  skills: string[];
  vacancies: number;
  deadline: string;
  isActive: boolean;
  applicantCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateJobInput {
  title: string;
  description: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  skills: string[];
  vacancies: number;
  deadline: string;
  isActive?: boolean;
}

export type UpdateJobInput = Partial<CreateJobInput>;

export interface JobQuery {
  search?: string;
  location?: string;
  employmentType?: string;
  experienceLevel?: string;
  page?: number;
  limit?: number;
}

export interface JobPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface JobListResponse {
  success: boolean;
  message: string;
  data: {
    jobs: Job[];
    pagination: JobPagination;
  };
}

export interface MyJobsApiResponse {
  success: boolean;
  message: string;
  data: Job[];
}

export interface JobApiResponse {
  success: boolean;
  message: string;
  data: Job;
}
