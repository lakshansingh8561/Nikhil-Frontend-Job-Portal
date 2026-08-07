import { apiSlice } from "../../../Redux/api/apiSlice";
import type {
  Job,
  CreateJobInput,
  UpdateJobInput,
  JobQuery,
  JobListResponse,
  MyJobsApiResponse,
  JobApiResponse,
  JobPagination,
} from "../types/job.types";

export const jobsApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getJobs: builder.query<
      { jobs: Job[]; pagination: JobPagination },
      JobQuery | void
    >({
      query: (params) => ({
        url: "/jobs",
        params: params || {},
      }),
      transformResponse: (response: JobListResponse) => response.data,
      providesTags: (result) =>
        result?.jobs
          ? [
              ...result.jobs.map(({ _id }) => ({ type: "Job" as const, id: _id })),
              { type: "Job" as const, id: "LIST" },
            ]
          : [{ type: "Job" as const, id: "LIST" }],
    }),

    getRecruiterJobs: builder.query<Job[], void>({
      query: () => "/jobs/my/jobs",
      transformResponse: (response: MyJobsApiResponse) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Job" as const, id: _id })),
              { type: "Job" as const, id: "LIST" },
            ]
          : [{ type: "Job" as const, id: "LIST" }],
    }),

    getJobById: builder.query<Job, string>({
      query: (id) => `/jobs/${id}`,
      transformResponse: (response: JobApiResponse) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Job", id }],
    }),

    createJob: builder.mutation<Job, CreateJobInput>({
      query: (body) => ({
        url: "/jobs",
        method: "POST",
        body,
      }),
      transformResponse: (response: JobApiResponse) => response.data,
      invalidatesTags: [{ type: "Job", id: "LIST" }, "Job"],
    }),

    updateJob: builder.mutation<Job, { id: string; body: UpdateJobInput }>({
      query: ({ id, body }) => ({
        url: `/jobs/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: JobApiResponse) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Job", id: "LIST" },
        { type: "Job", id },
        "Job",
      ],
    }),

    deleteJob: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Job", id: "LIST" }, "Job"],
    }),
  }),
});

export const {
  useGetJobsQuery,
  useGetRecruiterJobsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} = jobsApi;
