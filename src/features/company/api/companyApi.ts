import { apiSlice } from "../../../Redux/api/apiSlice";
import type {
  Company,
  CreateCompanyInput,
  UpdateCompanyInput,
  CompanyApiResponse,
} from "../types/company.types";

export const companyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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
  useGetMyCompanyQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
} = companyApi;
