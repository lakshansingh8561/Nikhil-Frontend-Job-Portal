import { apiSlice } from "../../../Redux/api/apiSlice";
import type {
  JobSeekerProfile,
  CreateJobSeekerProfileInput,
  UpdateJobSeekerProfileInput,
  ProfileApiResponse,
  JobSeekerQuery,
  JobSeekerListResponse,
  JobSeekerPagination,
} from "../types/jobSeeker.types";

export const jobSeekerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<JobSeekerProfile, void>({
      query: () => "/job-seeker/profile",
      transformResponse: (response: ProfileApiResponse) => response.data,
      providesTags: ["JobSeeker"],
    }),

    getAllJobSeekers: builder.query<
      { profiles: JobSeekerProfile[]; pagination: JobSeekerPagination },
      JobSeekerQuery | void
    >({
      query: (params) => ({
        url: "/job-seeker/all",
        params: params || {},
      }),
      transformResponse: (response: JobSeekerListResponse) => response.data,
      providesTags: ["JobSeeker"],
    }),

    getJobSeekerById: builder.query<JobSeekerProfile, string>({
      query: (id) => `/job-seeker/profile/${id}`,
      transformResponse: (response: ProfileApiResponse) => response.data,
      providesTags: (_result, _error, id) => [{ type: "JobSeeker", id }],
    }),

    createProfile: builder.mutation<JobSeekerProfile, CreateJobSeekerProfileInput>({
      query: (body) => ({
        url: "/job-seeker/profile",
        method: "POST",
        body,
      }),
      transformResponse: (response: ProfileApiResponse) => response.data,
      invalidatesTags: ["JobSeeker"],
    }),

    updateProfile: builder.mutation<JobSeekerProfile, UpdateJobSeekerProfileInput>({
      query: (body) => ({
        url: "/job-seeker/profile",
        method: "PUT",
        body,
      }),
      transformResponse: (response: ProfileApiResponse) => response.data,
      invalidatesTags: ["JobSeeker"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useGetAllJobSeekersQuery,
  useGetJobSeekerByIdQuery,
  useCreateProfileMutation,
  useUpdateProfileMutation,
} = jobSeekerApi;
