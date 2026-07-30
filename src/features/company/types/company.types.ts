export interface CompanyOwner {
  _id: string;
  email: string;
  role: string;
}

export interface Company {
  _id: string;
  ownerId?: CompanyOwner | string;
  companyName: string;
  tagline?: string;
  description?: string;
  mission?: string;
  vision?: string;
  industry: string;
  companySize: string;
  website?: string;
  email?: string;
  phone?: string;
  logo?: string;
  coverImage?: string;
  foundedYear?: number;
  headquarters?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  linkedin?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  github?: string;
  youtube?: string;
  officeImages?: string[];
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCompanyInput {
  companyName: string;
  tagline?: string;
  description?: string;
  mission?: string;
  vision?: string;
  industry: string;
  companySize: string;
  website?: string;
  email?: string;
  phone?: string;
  logo?: string;
  coverImage?: string;
  foundedYear?: number;
  headquarters?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  linkedin?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  github?: string;
  youtube?: string;
  officeImages?: string[];
}

export type UpdateCompanyInput = Partial<CreateCompanyInput>;

export interface CompanyApiResponse {
  success: boolean;
  message: string;
  data: Company;
}
