export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  currentlyStudying?: boolean;
}

export interface Experience {
  company: string;
  designation: string;
  employmentType: string;
  startDate: string;
  endDate?: string;
  currentlyWorking?: boolean;
  description?: string;
}

export interface JobSeekerUser {
  _id: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface JobSeekerProfile {
  _id: string;
  userId: JobSeekerUser;
  firstName: string;
  lastName: string;
  phone: string;
  headline: string;
  bio?: string;
  currentLocation: string;
  yearsOfExperience: number;
  expectedSalary: number;
  skills: string[];
  education: Education[];
  experience: Experience[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateJobSeekerProfileInput {
  firstName: string;
  lastName: string;
  phone: string;
  headline: string;
  bio?: string;
  currentLocation: string;
  yearsOfExperience: number;
  expectedSalary: number;
  skills: string[];
  education?: Education[];
  experience?: Experience[];
}

export type UpdateJobSeekerProfileInput = Partial<CreateJobSeekerProfileInput>;

export interface ProfileApiResponse {
  success: boolean;
  message: string;
  data: JobSeekerProfile;
}

export interface JobSeekerQuery {
  search?: string;
  location?: string;
  skill?: string;
  page?: number;
  limit?: number;
}

export interface JobSeekerPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface JobSeekerListResponse {
  success: boolean;
  message: string;
  data: {
    profiles: JobSeekerProfile[];
    pagination: JobSeekerPagination;
  };
}