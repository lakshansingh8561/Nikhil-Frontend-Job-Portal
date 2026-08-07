import type { ApplicationStatus } from "../../applications/types/application.types";

export type UserRole = "JOB_SEEKER" | "RECRUITER" | "ADMIN";
export type UserStatus = "ACTIVE" | "BLOCKED";

export interface AdminUser {
  _id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  membership?: {
    planName: string;
    status: string;
    remainingDays: number;
    endDate?: string | null;
  };
}

export interface AdminRecruiter {
  _id: string;
  user: {
    _id: string;
    email: string;
    status: UserStatus;
    createdAt: string;
  };
  company?: {
    _id: string;
    companyName: string;
    logo?: string;
  };
  jobsCount: number;
}

export interface AdminCompany {
  _id: string;
  companyName: string;
  logo?: string;
  description?: string;
  website?: string;
  location?: string;
  createdAt?: string;
}

export interface AdminJob {
  _id: string;
  title: string;
  companyId:
    | string
    | {
        _id: string;
        companyName: string;
        logo?: string;
      };
  userId?:
    | string
    | {
        _id: string;
        email: string;
      };
  recruiterId?:
    | string
    | {
        _id: string;
        email: string;
      };
  employmentType: string;
  experienceLevel: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  vacancies?: number;
  isActive?: boolean;
  createdAt: string;
}

export interface AdminApplicantProfile {
  _id: string;
  firstName?: string;
  lastName?: string;
  headline?: string;
  userId?: {
    _id: string;
    email: string;
  };
}

export interface AdminApplication {
  _id: string;
  jobId:
    | string
    | {
        _id: string;
        title: string;
        companyId?:
          | string
          | {
              _id: string;
              companyName: string;
              logo?: string;
            };
      };
  userId?: string | AdminApplicantProfile;
  applicantId?: string | AdminApplicantProfile;
  resume: string;
  coverLetter?: string;
  status: ApplicationStatus;
  createdAt: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalRecruiters: number;
  totalJobSeekers: number;
  totalCompanies: number;
  totalJobs: number;
  totalApplications: number;
  recentUsers?: AdminUser[];
  recentRecruiters?: AdminUser[];
  recentJobs?: AdminJob[];
  recentApplications?: AdminApplication[];
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
}

export interface JobQueryParams {
  page?: number;
  limit?: number;
  employmentType?: string;
  search?: string;
}

export interface ApplicationQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export interface AdminApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
