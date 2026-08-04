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
  location?: string;
  website?: string;
  companySize?: string;
  description?: string;
}

export interface RecruiterInJob {
  _id: string;
  email: string;
  fullName?: string;
}

export interface JobBrowserItem {
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

export interface JobQueryParams {
  search?: string;
  location?: string;
  employmentType?: string;
  experienceLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
  recruiterId?: string;
  companyId?: string;
  page?: number;
  limit?: number;
}

export interface JobBrowserPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface JobListResponse {
  success: boolean;
  message: string;
  data: {
    jobs: JobBrowserItem[];
    pagination: JobBrowserPagination;
  };
}

export interface JobDetailsResponse {
  success: boolean;
  message: string;
  data: JobBrowserItem;
}
