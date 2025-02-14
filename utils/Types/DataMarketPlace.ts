export interface Dataset {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  country: string;
  city?: string;
}

export interface DatasetSliceState {
  data: Dataset[];
  loading: boolean;
  error: string | null;
}

export interface DatasetCategory {
  id: string;
  name: string;
}

export interface CreateDataset {
  name: string;
  description: string;
  category: string;
  price: number;
  country: string;
  city?: string;
}

export interface SubscriptionPlan {
  subscriptionType: any;
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  datasets: number[];
}

export interface CreateSubscriptionPlan {
  name: string;
  description: string;
  subscriptionType: string;
  price: number;
  selectedDatasets: number[];
}

export interface Subscription {
  id: number;
  name: string;
  price: number;
  subscriptionDate: string;
  isExpired: boolean;
  researcher?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  subscriptionPlan?: {
    id: number;
    name: string;
    price: number;
    description: string;
    datasets: number[];
    selectedDatasets?: number[];
  };
}
export interface SubscribePlan {
  id: number;
  name: string;
  description: string;
  price: number;
  subscriptionType: string;
}

interface Quotation {
  id: number;
  customDatasetId: number;
  price: number;
  status: string;
  paymentId: number;
}
export interface CustomDataset {
  id: number;
  name: string;
  description: string;
  category: string;
  country: string;
  city?: string;
  quotation?: Quotation;
}

export interface CustomDatasetFormData {
  name: string;
  description: string;
  category: string;
  country: string;
  city?: string;
  quotationId?: number;
  quotation?: Quotation;
}


export interface CreateQuotation {
  customDatasetId: number;
  price: number;
}
export interface CreateQuotation {
  customDataSetId: number;
  price: number;
}
