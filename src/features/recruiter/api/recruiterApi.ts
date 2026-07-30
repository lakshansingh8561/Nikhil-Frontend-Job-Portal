import { apiSlice } from "../../../Redux/api/apiSlice";
import type {
  RecruiterProfile,
  CreateRecruiterProfileInput,
  UpdateRecruiterProfileInput,
  RecruiterApiResponse,
  RecruiterQuery,
  RecruiterListResponse,
  RecruiterPagination,
} from "../types/recruiter.types";

export const recruiterApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRecruiterProfile: builder.query<RecruiterProfile, void>({
      query: () => "/recruiter/profile",
      transformResponse: (response: RecruiterApiResponse) => response.data,
      providesTags: ["Recruiter"],
    }),

    getAllRecruiters: builder.query<
      { recruiters: RecruiterProfile[]; pagination: RecruiterPagination },
      RecruiterQuery | void
    >({
      query: (params) => ({
        url: "/recruiter/all",
        params: params || {},
      }),
      transformResponse: (response: RecruiterListResponse) => response.data,
      providesTags: ["Recruiter"],
    }),

    createRecruiterProfile: builder.mutation<
      RecruiterProfile,
      CreateRecruiterProfileInput
    >({
      query: (body) => ({
        url: "/recruiter/profile",
        method: "POST",
        body,
      }),
      transformResponse: (response: RecruiterApiResponse) => response.data,
      invalidatesTags: ["Recruiter"],
    }),

    updateRecruiterProfile: builder.mutation<
      RecruiterProfile,
      UpdateRecruiterProfileInput
    >({
      query: (body) => ({
        url: "/recruiter/profile",
        method: "PUT",
        body,
      }),
      transformResponse: (response: RecruiterApiResponse) => response.data,
      invalidatesTags: ["Recruiter"],
    }),
  }),
});

export const {
  useGetRecruiterProfileQuery,
  useGetAllRecruitersQuery,
  useCreateRecruiterProfileMutation,
  useUpdateRecruiterProfileMutation,
} = recruiterApi;
