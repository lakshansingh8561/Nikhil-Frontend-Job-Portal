import { apiSlice } from "../../../Redux/api/apiSlice";
import type {
  AdminDashboardStats,
  AdminUser,
  AdminJob,
  AdminApplication,
  AdminApiResponse,
  PaginatedResponse,
  UserQueryParams,
  JobQueryParams,
  ApplicationQueryParams,
} from "../types/admin.types";

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<AdminDashboardStats, void>({
      query: () => "/admin/dashboard",
      transformResponse: (response: AdminApiResponse<AdminDashboardStats>) =>
        response.data,
      providesTags: ["Admin"],
    }),

    getAllUsers: builder.query<
      PaginatedResponse<AdminUser>,
      UserQueryParams | void
    >({
      query: (params) => ({
        url: "/admin/users",
        params: params || {},
      }),
      transformResponse: (
        response: AdminApiResponse<PaginatedResponse<AdminUser>>
      ) => response.data,
      providesTags: ["Admin", "Auth"],
    }),

    getUserById: builder.query<AdminUser, string>({
      query: (id) => `/admin/users/${id}`,
      transformResponse: (response: AdminApiResponse<AdminUser>) =>
        response.data,
      providesTags: ["Admin"],
    }),

    blockUser: builder.mutation<AdminUser, string>({
      query: (id) => ({
        url: `/admin/users/${id}/block`,
        method: "PATCH",
      }),
      transformResponse: (response: AdminApiResponse<AdminUser>) =>
        response.data,
      invalidatesTags: ["Admin", "Auth"],
    }),

    unblockUser: builder.mutation<AdminUser, string>({
      query: (id) => ({
        url: `/admin/users/${id}/unblock`,
        method: "PATCH",
      }),
      transformResponse: (response: AdminApiResponse<AdminUser>) =>
        response.data,
      invalidatesTags: ["Admin", "Auth"],
    }),

    getAllAdminJobs: builder.query<
      PaginatedResponse<AdminJob>,
      JobQueryParams | void
    >({
      query: (params) => ({
        url: "/admin/jobs",
        params: params || {},
      }),
      transformResponse: (
        response: AdminApiResponse<PaginatedResponse<AdminJob>>
      ) => response.data,
      providesTags: ["Admin", "Job"],
    }),

    deleteAdminJob: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/jobs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Admin", "Job"],
    }),

    getAllAdminApplications: builder.query<
      PaginatedResponse<AdminApplication>,
      ApplicationQueryParams | void
    >({
      query: (params) => ({
        url: "/admin/applications",
        params: params || {},
      }),
      transformResponse: (
        response: AdminApiResponse<PaginatedResponse<AdminApplication>>
      ) => response.data,
      providesTags: ["Admin", "Application"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useBlockUserMutation,
  useUnblockUserMutation,
  useGetAllAdminJobsQuery,
  useDeleteAdminJobMutation,
  useGetAllAdminApplicationsQuery,
} = adminApi;
