import { z } from "zod";

export const companySchema = z.object({
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must not exceed 100 characters"),

  tagline: z.string().optional(),

  description: z.string().optional(),

  mission: z.string().optional(),

  vision: z.string().optional(),

  industry: z.string().min(2, "Industry is required"),

  companySize: z.string().min(1, "Company size is required"),

  website: z.string().optional(),

  email: z.string().optional(),

  phone: z.string().optional(),

  logo: z.string().optional(),

  coverImage: z.string().optional(),

  foundedYear: z.number().optional(),

  headquarters: z.string().optional(),

  address: z.string().optional(),

  city: z.string().optional(),

  state: z.string().optional(),

  country: z.string().optional(),

  linkedin: z.string().optional(),

  facebook: z.string().optional(),

  twitter: z.string().optional(),

  instagram: z.string().optional(),

  github: z.string().optional(),

  youtube: z.string().optional(),

  officeImages: z.array(z.string()).optional(),
});

export type CompanyFormData = z.infer<typeof companySchema>;
