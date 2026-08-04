import { apiSlice } from "../../../Redux/api/apiSlice";
import type {
  JobBrowserItem,
  JobQueryParams,
  JobListResponse,
  JobDetailsResponse,
  JobBrowserPagination,
} from "../types/jobBrowser.types";

export const jobBrowserApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query<
      { jobs: JobBrowserItem[]; pagination: JobBrowserPagination },
      JobQueryParams | void
    >({
      query: (params) => {
        const queryParams: Record<string, any> = {};
        if (params) {
          if (params.search) queryParams.search = params.search;
          if (params.location) queryParams.location = params.location;
          if (params.employmentType) queryParams.employmentType = params.employmentType;
          if (params.experienceLevel) queryParams.experienceLevel = params.experienceLevel;
          if (params.salaryMin) queryParams.salaryMin = params.salaryMin;
          if (params.salaryMax) queryParams.salaryMax = params.salaryMax;
          if (params.skills && params.skills.length > 0) {
            queryParams.skills = params.skills.join(",");
          }
          if (params.recruiterId) queryParams.recruiterId = params.recruiterId;
          if (params.companyId) queryParams.companyId = params.companyId;
          if (params.page) queryParams.page = params.page;
          if (params.limit) queryParams.limit = params.limit;
        }

        return {
          url: "/jobs",
          params: queryParams,
        };
      },
      transformResponse: (response: JobListResponse) => response.data,
      providesTags: ["Job"],
    }),

    getJobById: builder.query<JobBrowserItem, string>({
      query: (id) => `/jobs/${id}`,
      transformResponse: (response: JobDetailsResponse) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Job", id }],
    }),
  }),
});

export const { useGetJobsQuery, useGetJobByIdQuery } = jobBrowserApi;
