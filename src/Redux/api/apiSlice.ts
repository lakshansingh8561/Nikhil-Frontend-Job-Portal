import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../app/store";

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
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
  }),

  tagTypes: [
    "Auth",
    "JobSeeker",
    "Recruiter",
    "Company",
    "Job",
    "Application",
    "Admin",
    "Notification",
  ],

  endpoints: () => ({}),
});