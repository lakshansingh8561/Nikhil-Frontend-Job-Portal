export interface IMembershipFeature {
  title: string;
  description?: string;
  enabled: boolean;
}

export interface IMembershipPrice {
  billingCycle: "monthly" | "yearly";
  price: number;
  currency: string;
  durationInDays: number;
}

export interface IMembership {
  _id: string;
  id?: string;
  name: string;
  role: string;
  price: number;
  currency: string;
  planId?: string;
  durationInDays: number;
  prices?: IMembershipPrice[];
  description: string;
  features: IMembershipFeature[];
  isPopular: boolean;
  isRecommended: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionStatus = "PENDING" | "ACTIVE" | "CANCELLED" | "EXPIRED" | "PAST_DUE";
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

export interface ISubscription {
  _id: string;
  id?: string;
  userId: string;
  membershipId: IMembership | string;
  planName: string;
  amount: number;
  currency: string;
  billingCycle?: string;
  provider?: string;
  providerSubscriptionId?: string;
  providerCustomerId?: string;
  startDate: string;
  endDate: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  status: SubscriptionStatus;
  paymentStatus: PaymentStatus;
  cancelAtPeriodEnd?: boolean;
  autoRenew?: boolean;
  cancelledAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CurrentSubscriptionResponse {
  hasActiveSubscription: boolean;
  subscription: ISubscription | null;
  plan: IMembership | null;
}

export interface CurrentRecruiterSubscriptionResponse extends CurrentSubscriptionResponse {
  activeJobsCount: number;
  maxActiveJobs: number | "Unlimited";
  canPostJob: boolean;
}
