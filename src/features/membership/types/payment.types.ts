export interface CreateOrderResponse {
  isFree: boolean;
  message: string;
  data?: {
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
    membership: {
      id: string;
      name: string;
      price: number;
      currency: string;
      durationInDays: number;
    };
  };
  subscription?: any;
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface IPaymentRecord {
  _id: string;
  userId: string;
  membershipId?: {
    _id: string;
    name: string;
    role: string;
    price: number;
  };
  subscriptionId?: string;
  amount: number;
  currency: string;
  status: "PENDING" | "AUTHORIZED" | "PROCESSING" | "SUCCESS" | "FAILED" | "CANCELLED" | "REFUNDED";
  provider: "RAZORPAY" | "POLAR" | "STRIPE" | "PAYPAL" | "MANUAL" | string;
  providerPaymentId?: string;
  providerOrderId?: string;
  providerSubscriptionId?: string;
  paymentMethod?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePolarCheckoutResponse {
  checkoutId: string;
  checkoutUrl: string;
  plan: {
    id: string;
    name: string;
    price: number;
    currency: string;
    durationInDays: number;
  };
}

export interface PolarStatusResponse {
  status: string;
  isActivated: boolean;
  subscription?: any;
  payment?: any;
}

export interface CreatePolarCheckoutRequest {
  membershipId: string;
  productId?: string;
  billingCycle?: "monthly" | "yearly" | string;
}
