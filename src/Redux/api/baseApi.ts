import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../app/store";

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: "https://nikhil-backend-job-portal.vercel.app/api/v1/",

    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

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
  ],

  endpoints: () => ({}),
});