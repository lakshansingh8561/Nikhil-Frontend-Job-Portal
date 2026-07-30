export * from "../features/jobs/types/job.types";

export interface Company {
  _id: string;
  companyName: string;
  logo?: string;
  location?: string;
  website?: string;
  industry?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
