import { apiSlice } from "../../../Redux/api/apiSlice";
import type {
  Company,
  CreateCompanyInput,
  UpdateCompanyInput,
  CompanyApiResponse,
} from "../types/company.types";

export interface TopCompanyItem {
  _id: string;
  name: string;
  slug?: string;
  logo?: string;
  industry?: string;
  location?: string;
  openJobsCount: number;
  rating?: number;
  reviewsCount?: number;
  brandColor?: string;
}

export const companyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTopCompanies: builder.query<TopCompanyItem[], { limit?: number } | void>({
      query: (params) => ({
        url: "/company/top",
        params: params || { limit: 10 },
      }),
      transformResponse: (response: { success: boolean; data: TopCompanyItem[] }) => response.data,
      providesTags: ["Company"],
    }),

    getMyCompany: builder.query<Company, void>({
      query: () => "/company",
      transformResponse: (response: CompanyApiResponse) => response.data,
      providesTags: ["Company"],
    }),

    createCompany: builder.mutation<Company, CreateCompanyInput>({
      query: (body) => ({
        url: "/company",
        method: "POST",
        body,
      }),
      transformResponse: (response: CompanyApiResponse) => response.data,
      invalidatesTags: ["Company"],
    }),

    updateCompany: builder.mutation<Company, UpdateCompanyInput>({
      query: (body) => ({
        url: "/company",
        method: "PUT",
        body,
      }),
      transformResponse: (response: CompanyApiResponse) => response.data,
      invalidatesTags: ["Company"],
    }),
  }),
});

export const {
  useGetTopCompaniesQuery,
  useGetMyCompanyQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
} = companyApi;

