export interface PayoutLimit {
    id?: number;
    countryCode: string;
    payoutMethod: string;
    minTransaction: number;
    maxTransaction: number;
    createdAt: string;
    updatedAt: string;
  }
  export interface createPayoutLimit{
    
    countryCode: string;
    payoutMethod: string;
    minTransaction: number;
    maxTransaction: number;
   
  }
  export interface PayoutLimitSliceState {
    payoutlimit: PayoutLimit[];
    loading: boolean;
    error: string | null;
}

export interface PayoutLog {
  id: number;
  payoutId: number;
  status: string;
  message?: string;
  createdAt: string;
}
export interface PayoutSliceState{
  payout: Payout[];
  loading: boolean;
  error: string| null
}


export interface Payout {
  id: number;
  userId: number;
  user: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  reference: string;
  createdAt: string;
  updatedAt: string;
  PayoutLog: string[];
}

export interface Limit {
  id: number;
  userId: string;
  countryCode: string;
  method: string;
  type: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface createLimit {
  userId: string;
  countryCode: string;
  method: string;
  type: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}