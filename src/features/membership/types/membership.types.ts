export interface IMembershipFeature {
  title: string;
  description?: string;
  enabled: boolean;
}

export interface IMembership {
  _id: string;
  id?: string;
  name: string;
  role: string;
  price: number;
  currency: string;
  durationInDays: number;
  description: string;
  features: IMembershipFeature[];
  isPopular: boolean;
  isRecommended: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionStatus = "ACTIVE" | "EXPIRED" | "CANCELLED" | "PENDING";
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface ISubscription {
  _id: string;
  id?: string;
  userId: string;
  membershipId: IMembership | string;
  planName: string;
  amount: number;
  currency: string;
  startDate: string;
  endDate: string;
  status: SubscriptionStatus;
  paymentStatus: PaymentStatus;
  autoRenew: boolean;
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
