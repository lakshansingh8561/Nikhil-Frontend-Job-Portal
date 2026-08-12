export interface RecruiterUser {
  _id: string;
  email: string;
  role: string;
  createdAt?: string;
}

export interface Company {
  _id: string;
  companyName: string;
  name?: string;
  logo?: string;
  location?: string;
  website?: string;
  industry?: string;
  openJobsCount?: number;
  rating?: number;
  reviewsCount?: number;
}

export interface RecruiterProfile {
  _id: string;
  userId: RecruiterUser;
  firstName: string;
  lastName: string;
  phone: string;
  designation: string;
  currentCompany?: string;
  companyName?: string;
  experience?: number;
  currentLocation?: string;
  headline?: string;
  bio?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  profilePicture?: string;
  companyId?: Company | string;
  openJobsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRecruiterProfileInput {
  firstName: string;
  lastName: string;
  phone: string;
  designation: string;
  currentCompany?: string;
  experience?: number;
  currentLocation?: string;
  headline?: string;
  bio?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  profilePicture?: string;
}

export type UpdateRecruiterProfileInput = Partial<CreateRecruiterProfileInput>;

export interface RecruiterApiResponse {
  success: boolean;
  message: string;
  data: RecruiterProfile;
}

export interface RecruiterQuery {
  search?: string;
  location?: string;
  letter?: string;
  industry?: string;
  salaryRange?: string;
  position?: string;
  experience?: string;
  workplace?: string;
  postedDate?: string;
  type?: string;
  page?: number;
  limit?: number;
}

export interface RecruiterPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface RecruiterListResponse {
  success: boolean;
  message: string;
  data: {
    recruiters: RecruiterProfile[];
    pagination: RecruiterPagination;
  };
}
