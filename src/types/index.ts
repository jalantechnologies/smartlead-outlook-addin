export interface SmartleadCampaign {
  id: number;
  name: string;
  status: string;
}

export interface SmartleadLead {
  email: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  [key: string]: any;
}

export interface SmartleadApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface EmailContact {
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
}
