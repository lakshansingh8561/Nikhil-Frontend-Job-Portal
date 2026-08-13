import { apiSlice } from "../../../Redux/api/apiSlice";
import type {
  IMembership,
  ISubscription,
  CurrentSubscriptionResponse,
  CurrentRecruiterSubscriptionResponse,
} from "../types/membership.types";

export const membershipApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Job Seeker Endpoints
    getMemberships: builder.query<IMembership[], void>({
      query: () => "/memberships",
      transformResponse: (response: { data: IMembership[] }) => response.data,
      providesTags: ["Membership"],
    }),

    getCurrentSubscription: builder.query<CurrentSubscriptionResponse, void>({
      query: () => "/memberships/current",
      transformResponse: (response: { data: CurrentSubscriptionResponse }) =>
        response.data,
      providesTags: ["Subscription"],
    }),

    subscribe: builder.mutation<ISubscription, { membershipId: string }>({
      query: (body) => ({
        url: "/memberships/subscribe",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: ISubscription }) => response.data,
      invalidatesTags: ["Subscription", "Membership"],
    }),

    cancelSubscription: builder.mutation<
      ISubscription,
      { reason?: string } | void
    >({
      query: (body) => ({
        url: "/memberships/cancel",
        method: "POST",
        body: body || {},
      }),
      transformResponse: (response: { data: ISubscription }) => response.data,
      invalidatesTags: ["Subscription"],
    }),

    getSubscriptionHistory: builder.query<ISubscription[], void>({
      query: () => "/memberships/history",
      transformResponse: (response: { data: ISubscription[] }) => response.data,
      providesTags: ["Subscription"],
    }),

    // Recruiter Endpoints
    getRecruiterPlans: builder.query<IMembership[], void>({
      query: () => "/memberships/recruiter",
      transformResponse: (response: { data: IMembership[] }) => response.data,
      providesTags: ["Membership"],
    }),

    getCurrentRecruiterPlan: builder.query<
      CurrentRecruiterSubscriptionResponse,
      void
    >({
      query: () => "/memberships/recruiter/current",
      transformResponse: (response: {
        data: CurrentRecruiterSubscriptionResponse;
      }) => response.data,
      providesTags: ["Subscription", "Job"],
    }),

    subscribeRecruiter: builder.mutation<
      ISubscription,
      { membershipId: string }
    >({
      query: (body) => ({
        url: "/memberships/recruiter/subscribe",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: ISubscription }) => response.data,
      invalidatesTags: ["Subscription", "Membership", "Job"],
    }),

    cancelRecruiterMembership: builder.mutation<
      ISubscription,
      { reason?: string } | void
    >({
      query: (body) => ({
        url: "/memberships/recruiter/cancel",
        method: "POST",
        body: body || {},
      }),
      transformResponse: (response: { data: ISubscription }) => response.data,
      invalidatesTags: ["Subscription"],
    }),

    getRecruiterHistory: builder.query<ISubscription[], void>({
      query: () => "/memberships/recruiter/history",
      transformResponse: (response: { data: ISubscription[] }) => response.data,
      providesTags: ["Subscription"],
    }),

    reactivateAutopay: builder.mutation<any, void>({
      query: () => ({
        url: "/payments/reactivate-autopay",
        method: "POST",
      }),
      transformResponse: (response: { data: any }) => response.data,
      invalidatesTags: ["Subscription", "Membership", "Payment", "Job"],
    }),
  }),
});

export const {
  useGetMembershipsQuery,
  useGetCurrentSubscriptionQuery,
  useSubscribeMutation,
  useCancelSubscriptionMutation,
  useGetSubscriptionHistoryQuery,
  useGetRecruiterPlansQuery,
  useGetCurrentRecruiterPlanQuery,
  useSubscribeRecruiterMutation,
  useCancelRecruiterMembershipMutation,
  useGetRecruiterHistoryQuery,
  useReactivateAutopayMutation,
} = membershipApi;
