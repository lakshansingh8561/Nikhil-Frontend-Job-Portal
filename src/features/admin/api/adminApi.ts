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

    // Admin Membership Management
    getAllAdminMemberships: builder.query<any[], void>({
      query: () => "/memberships/admin/all",
      transformResponse: (response: { data: any[] }) => response.data,
      providesTags: ["Membership", "Admin"],
    }),

    createMembershipPlan: builder.mutation<any, Partial<any>>({
      query: (body) => ({
        url: "/memberships/admin",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: any }) => response.data,
      invalidatesTags: ["Membership", "Admin"],
    }),

    updateMembershipPlan: builder.mutation<any, { id: string } & Partial<any>>({
      query: ({ id, ...body }) => ({
        url: `/memberships/admin/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: { data: any }) => response.data,
      invalidatesTags: ["Membership", "Admin"],
    }),

    toggleMembershipStatus: builder.mutation<any, string>({
      query: (id) => ({
        url: `/memberships/admin/${id}/toggle-status`,
        method: "PATCH",
      }),
      transformResponse: (response: { data: any }) => response.data,
      invalidatesTags: ["Membership", "Admin"],
    }),

    deleteMembershipPlan: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/memberships/admin/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: { data: { message: string } }) => response.data,
      invalidatesTags: ["Membership", "Admin"],
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
  useGetAllAdminMembershipsQuery,
  useCreateMembershipPlanMutation,
  useUpdateMembershipPlanMutation,
  useToggleMembershipStatusMutation,
  useDeleteMembershipPlanMutation,
} = adminApi;
