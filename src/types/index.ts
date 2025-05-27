export interface User {
  _id?: string;
  id: string;
  name: string;
  email: string;
  uniqueId: string;
  referrerId?: string;
  isAdmin?: boolean;
  isVerified: boolean;
  isApproved: boolean;
  isBlocked?: boolean;
  isExpired?: boolean;
  expiryDate?: Date;
  password?: string; // In a real app, this would be stored securely
  createdAt: Date;
  totalEarnings: number;
  totalWithdrawals: number;
  balance: number;
}

export interface Referral {
  id: string;
  referrerId: string;
  refereeId: string;
  level: number;
  createdAt: Date;
}

export interface Commission {
  id: string;
  userId: string;
  refereeId: string;
  amount: number;
  level: number;
  createdAt: Date;
}

export interface Withdrawal {
  id: string;
  _id?:any;
  recipientId?:any;
  userId: string;
  amount: number;
  method: 'uniqueId' | 'crypto';
  address: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  createdAt: Date;
  processedAt?: Date;
  recipientName?:string;
}

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  uniqueId: string;
  isAdmin: boolean;
  isVerified: boolean;
  isApproved: boolean;
  isBlocked?: boolean;
  isExpired?: boolean;
  expiryDate?: Date;
  balance: number; // Added balance property
} | null;

export interface ExpiryOption {
  label: string;
  days: number;
}
