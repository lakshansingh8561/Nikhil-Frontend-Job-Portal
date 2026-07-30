import { z } from "zod";

export const jobSchema = z.object({
  title: z
    .string()
    .min(3, "Job title must be at least 3 characters")
    .max(100, "Job title must not exceed 100 characters"),

  description: z
    .string()
    .min(20, "Job description must be at least 20 characters"),

  location: z.string().min(2, "Location is required"),

  salaryMin: z.number().min(0, "Minimum salary cannot be negative"),

  salaryMax: z.number().min(0, "Maximum salary cannot be negative"),

  employmentType: z.enum([
    "FULL_TIME",
    "PART_TIME",
    "CONTRACT",
    "INTERNSHIP",
    "REMOTE",
  ]),

  experienceLevel: z.enum([
    "FRESHER",
    "ONE_TO_TWO",
    "THREE_TO_FIVE",
    "FIVE_PLUS",
  ]),

  skills: z.array(z.string()).min(1, "Select at least one required skill"),

  vacancies: z.number().min(1, "Vacancies must be at least 1"),

  deadline: z.string().min(1, "Application deadline is required"),

  isActive: z.boolean(),
});

export type JobFormData = z.infer<typeof jobSchema>;
