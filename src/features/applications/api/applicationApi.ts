import { apiSlice } from "../../../Redux/api/apiSlice";
import type {
  Application,
  ApplyJobPayload,
  UpdateStatusPayload,
  ApplicationApiResponse,
} from "../types/application.types";

export const applicationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    applyJob: builder.mutation<Application, ApplyJobPayload>({
      query: ({ jobId, resume, coverLetter }) => ({
        url: `/applications/jobs/${jobId}/apply`,
        method: "POST",
        body: { resume, coverLetter },
      }),
      transformResponse: (response: ApplicationApiResponse<Application>) =>
        response.data,
      invalidatesTags: ["Application"],
    }),

    getMyApplications: builder.query<Application[], void>({
      query: () => "/applications/my",
      transformResponse: (response: ApplicationApiResponse<Application[]>) =>
        response.data,
      providesTags: ["Application"],
    }),

    getApplicationsForJob: builder.query<Application[], string>({
      query: (jobId) => `/applications/jobs/${jobId}`,
      transformResponse: (response: ApplicationApiResponse<Application[]>) =>
        response.data,
      providesTags: (_result, _error, jobId) => [
        { type: "Application", id: jobId },
      ],
    }),

    getRecruiterAllApplications: builder.query<Application[], void>({
      query: () => "/applications/recruiter/all",
      transformResponse: (response: ApplicationApiResponse<Application[]>) =>
        response.data,
      providesTags: ["Application"],
    }),

    updateStatus: builder.mutation<Application, UpdateStatusPayload>({
      query: ({ id, status }) => ({
        url: `/applications/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      transformResponse: (response: ApplicationApiResponse<Application>) =>
        response.data,
      invalidatesTags: ["Application"],
    }),
  }),
});

export const {
  useApplyJobMutation,
  useGetMyApplicationsQuery,
  useGetApplicationsForJobQuery,
  useGetRecruiterAllApplicationsQuery,
  useUpdateStatusMutation,
} = applicationApi;
