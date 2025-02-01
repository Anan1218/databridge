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
  firstName: string;
  lastName: string;
  subscription: UserSubscription;
  location: string;
  businessName: string;
  businessType: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
  workspaces: string[];
  defaultWorkspace?: string;
  receiveUpdates: boolean;
  dataSources: string[];
}

export interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  location: string;
  businessName: string;
  businessType: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
  dataSources: string[];
  receiveUpdates: boolean;
}