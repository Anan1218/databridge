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
} 

// I don't need googlemaps, yelpUrl
// these can be in an array or our DataSources tab.
// I should also have an array of enabled dashboards to display
export interface UserData {
  location: string;
  businessName?: string;
  website?: string;
  createdAt: Date;
  email: string;
  businessType: string;
}