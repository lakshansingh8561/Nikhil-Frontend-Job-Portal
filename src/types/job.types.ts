export interface Company {
  _id: string;
  companyName: string;
  logo?: string;
  location?: string;
  website?: string;
  industry?: string;
}

export interface Job {
  _id: string;
  title: string;
  description: string;
  requirements?: string[];
  skills?: string[];
  companyId: Company | string;
  recruiterId: {
    _id: string;
    email: string;
  } | string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'REMOTE' | string;
  experienceLevel?: 'ENTRY' | 'MID' | 'SENIOR' | 'EXECUTIVE' | string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobQuery {
  search?: string;
  location?: string;
  employmentType?: string;
  experienceLevel?: string;
  page?: number;
  limit?: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface JobsApiResponse {
  success: boolean;
  message: string;
  data: {
    jobs: Job[];
    pagination: Pagination;
  };
}

export interface JobDetailApiResponse {
  success: boolean;
  message: string;
  data: Job;
}
