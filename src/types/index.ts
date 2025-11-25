export type UserRole = 'donor' | 'admin';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  stripeCustomerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Orphan {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  location: string;
  story: string;
  photoUrl: string;
  categoryId: string;
  monthlySupport: number;
  currentDonors: number;
  status: 'active' | 'sponsored' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  createdAt: string;
}

export interface Donation {
  id: string;
  donorId: string;
  orphanId: string;
  amount: number;
  currency: string;
  type: 'one-time' | 'recurring';
  status: 'active' | 'cancelled' | 'completed';
  stripeSubscriptionId?: string;
  stripePaymentIntentId?: string;
  nextPaymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrphanUpdate {
  id: string;
  orphanId: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalDonors: number;
  totalOrphans: number;
  totalDonations: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
}
