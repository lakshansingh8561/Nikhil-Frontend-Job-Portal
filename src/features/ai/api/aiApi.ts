import { apiSlice } from "../../../Redux/api/apiSlice";

export interface ParsedResumeResponse {
  fullName?: string;
  email?: string;
  phone?: string;
  headline?: string;
  summary?: string;
  skills: string[];
  experience: Array<{
    title: string;
    company: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    fieldOfStudy?: string;
    graduationYear?: string;
  }>;
  certifications?: string[];
  languages?: string[];
}

export interface ATSMatchResponse {
  matchPercentage: number;
  verdict: "Strong Match" | "Good Match" | "Moderate Match" | "Low Match";
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  recommendations: string[];
  atsKeywords: string[];
}

export interface GeneratedJobResponse {
  title: string;
  overview: string;
  responsibilities: string[];
  requirements: string[];
  niceToHaves: string[];
  suggestedSkills: string[];
}

export const aiApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    parseResume: builder.mutation<{ success: boolean; data: ParsedResumeResponse }, FormData | { text: string }>({
      query: (body) => {
        if (body instanceof FormData) {
          return {
            url: "/ai/parse-resume",
            method: "POST",
            body,
            // FormData will have multipart header set automatically if content-type is omitted by fetch
            formData: true,
          };
        }
        return {
          url: "/ai/parse-resume",
          method: "POST",
          body,
        };
      },
    }),

    analyzeMatch: builder.mutation<
      { success: boolean; data: ATSMatchResponse },
      { jobId?: string; jobData?: any; candidateProfile?: any }
    >({
      query: (body) => ({
        url: "/ai/analyze-match",
        method: "POST",
        body,
      }),
    }),

    generateJobDescription: builder.mutation<
      { success: boolean; data: GeneratedJobResponse },
      {
        title: string;
        department?: string;
        jobType?: string;
        workplaceType?: string;
        experienceLevel?: string;
        keySkills?: string | string[];
        companyName?: string;
      }
    >({
      query: (body) => ({
        url: "/ai/generate-job-description",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useParseResumeMutation,
  useAnalyzeMatchMutation,
  useGenerateJobDescriptionMutation,
} = aiApi;
