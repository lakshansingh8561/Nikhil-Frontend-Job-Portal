import { apiSlice } from "../../../Redux/api/apiSlice";
import type {
  Job,
  JobQuery,
  JobsApiResponse,
  JobDetailApiResponse,
  Pagination,
} from "../../../types/job.types";

export const jobsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query<
      { jobs: Job[]; pagination: Pagination },
      JobQuery | void
    >({
      query: (params) => ({
        url: "/jobs",
        params: params || {},
      }),
      transformResponse: (response: JobsApiResponse) => response.data,
      providesTags: ["Job"],
    }),

    getJobById: builder.query<Job, string>({
      query: (id) => `/jobs/${id}`,
      transformResponse: (response: JobDetailApiResponse) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Job", id }],
    }),
  }),
});

export const { useGetJobsQuery, useGetJobByIdQuery } = jobsApi;
