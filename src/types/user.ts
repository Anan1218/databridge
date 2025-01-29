export interface UserSubscription {
  subscriptionStatus: 'active' | 'canceled' | 'trial' | null;
  subscriptionId?: string;
  customerId?: string;
  trialEnds?: Date;
  plan?: 'trial' | 'monthly' | 'yearly';
}

export interface User {
  uid: string;
  email: string;
  subscription: UserSubscription;
  location: string;
  businessName?: string;
  businessType: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
  workspaces: string[];
  defaultWorkspace?: string;
} 

export interface UserData {
  location: string;
  businessName?: string;
  website?: string;
  createdAt: Date;
  email: string;
  businessType: string;
  dataSources: string[];
  enabledDashboards: string[];
}