import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { RootState } from "../../app/store";
import { setCredentials, logout } from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_BASE_URL}/api/v1`,

  prepareHeaders: (headers, { getState }) => {
    const token =
      (getState() as RootState).auth.accessToken ||
      localStorage.getItem("jobbox_accessToken");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    headers.set("Content-Type", "application/json");

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken =
      (api.getState() as RootState).auth.refreshToken ||
      localStorage.getItem("jobbox_refreshToken");

    // Avoid infinite loop if refresh-token request itself returned 401
    const isRefreshReq =
      typeof args === "object" && args.url && args.url.includes("/auth/refresh-token");

    if (refreshToken && !isRefreshReq) {
      const refreshResult: any = await baseQuery(
        {
          url: "/auth/refresh-token",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data && refreshResult.data.data) {
        const { user, accessToken, refreshToken: newRefreshToken } = refreshResult.data.data;
        api.dispatch(
          setCredentials({
            user,
            accessToken,
            refreshToken: newRefreshToken || refreshToken,
          })
        );
        // Retry the original query with the new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  refetchOnMountOrArgChange: true,
  tagTypes: [
    "Auth",
    "JobSeeker",
    "Recruiter",
    "Company",
    "Job",
    "Application",
    "Admin",
    "Notification",
    "Chat",
    "Membership",
    "Subscription",
    "Payment",
    "Posts",
    "Network",
  ],
  endpoints: () => ({}),
});