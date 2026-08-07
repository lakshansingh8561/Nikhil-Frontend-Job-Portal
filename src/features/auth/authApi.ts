import { apiSlice } from "../../Redux/api/apiSlice";

import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "../../types/auth.types";

interface ApiResponseWrapper<T> {
  success: boolean;
  message: string;
  data: T;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponseWrapper<AuthResponse>) =>
        response.data,
      invalidatesTags: ["Auth"],
    }),

    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponseWrapper<AuthResponse>) =>
        response.data,
      invalidatesTags: ["Auth"],
    }),

    googleLogin: builder.mutation<AuthResponse, { credential: string; role?: string }>({
      query: (body) => ({
        url: "/auth/google",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponseWrapper<AuthResponse>) =>
        response.data,
      invalidatesTags: ["Auth"],
    }),

    me: builder.query<User, void>({
      query: () => ({
        url: "/auth/me",
      }),
      transformResponse: (response: ApiResponseWrapper<User>) =>
        response.data,
      providesTags: ["Auth"],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    changePassword: builder.mutation<
      { message: string },
      { currentPassword?: string; newPassword?: string }
    >({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponseWrapper<{ message: string }>) =>
        response.data,
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGoogleLoginMutation,
  useMeQuery,
  useLogoutMutation,
  useChangePasswordMutation,
} = authApi;