import { apiSlice } from "../../../Redux/api/apiSlice";
import type { Application, ApplicationApiResponse } from "../../../types/application.types";

export const applicationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    applyJob: builder.mutation<
      Application,
      { jobId: string; coverLetter?: string; resumeUrl?: string }
    >({
      query: ({ jobId, ...body }) => ({
        url: `/applications/jobs/${jobId}/apply`,
        method: "POST",
        body,
      }),
      transformResponse: (response: ApplicationApiResponse) =>
        response.data as Application,
      invalidatesTags: ["Application", "Job"],
    }),

    getMyApplications: builder.query<Application[], void>({
      query: () => "/applications/my",
      transformResponse: (response: ApplicationApiResponse) =>
        (response.data as Application[]) || [],
      providesTags: ["Application"],
    }),
  }),
});

export const { useApplyJobMutation, useGetMyApplicationsQuery } = applicationsApi;
