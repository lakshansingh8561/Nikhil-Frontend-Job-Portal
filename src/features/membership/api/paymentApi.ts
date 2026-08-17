import { apiSlice } from "../../../Redux/api/apiSlice";
import type {
  CreateOrderResponse,
  VerifyPaymentRequest,
  IPaymentRecord,
  CreatePolarCheckoutResponse,
  CreatePolarCheckoutRequest,
  PolarStatusResponse,
} from "../types/payment.types";

export const paymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPaymentOrder: builder.mutation<CreateOrderResponse, { membershipId: string }>({
      query: (body) => ({
        url: "/payments/create-order",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: CreateOrderResponse }) => response.data,
      invalidatesTags: ["Payment"],
    }),

    verifyPayment: builder.mutation<any, VerifyPaymentRequest>({
      query: (body) => ({
        url: "/payments/verify",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: any }) => response.data,
      invalidatesTags: ["Subscription", "Membership", "Payment", "Job"],
    }),

    createRazorpaySubscription: builder.mutation<
      { subscriptionId: string; keyId: string; amount: number; currency: string },
      { membershipId: string; planKey?: string; billingCycle?: "monthly" | "yearly" }
    >({
      query: (body) => ({
        url: "/payments/razorpay-subscription/create",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: any }) => response.data,
      invalidatesTags: ["Payment"],
    }),

    verifyRazorpaySubscription: builder.mutation<
      any,
      { razorpay_payment_id: string; razorpay_subscription_id: string; razorpay_signature: string }
    >({
      query: (body) => ({
        url: "/payments/razorpay-subscription/verify",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: any }) => response.data,
      invalidatesTags: ["Subscription", "Membership", "Payment", "Job"],
    }),

    createPolarCheckout: builder.mutation<CreatePolarCheckoutResponse, CreatePolarCheckoutRequest>({
      query: (body) => ({
        url: "/payments/polar/create-checkout",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: CreatePolarCheckoutResponse }) => response.data,
      invalidatesTags: ["Payment"],
    }),

    getPolarStatus: builder.query<PolarStatusResponse, string>({
      query: (checkoutId) => `/payments/polar/status/${checkoutId}`,
      transformResponse: (response: { data: PolarStatusResponse }) => response.data,
      providesTags: ["Subscription", "Payment"],
    }),

    getPaymentHistory: builder.query<IPaymentRecord[], void>({
      query: () => "/payments/my",
      transformResponse: (response: { data: IPaymentRecord[] }) => response.data,
      providesTags: ["Payment"],
    }),

    getAdminPayments: builder.query<any, { page?: number; limit?: number; status?: string }>({
      query: (params) => ({
        url: "/admin/payments",
        params,
      }),
      transformResponse: (response: { data: any }) => response.data,
      providesTags: ["Payment", "Admin"],
    }),

    getAdminMembershipStats: builder.query<any, void>({
      query: () => "/admin/membership-stats",
      transformResponse: (response: { data: any }) => response.data,
      providesTags: ["Subscription", "Payment", "Admin"],
    }),
  }),
});

export const {
  useCreatePaymentOrderMutation,
  useVerifyPaymentMutation,
  useCreateRazorpaySubscriptionMutation,
  useVerifyRazorpaySubscriptionMutation,
  useCreatePolarCheckoutMutation,
  useGetPolarStatusQuery,
  useGetPaymentHistoryQuery,
  useGetAdminPaymentsQuery,
  useGetAdminMembershipStatsQuery,
} = paymentApi;
