import { User, Referral, Commission, Withdrawal } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@refferx.com',
    uniqueId: 'ADMIN001',
    isVerified: true,
    isApproved: true,
    createdAt: new Date('2023-01-01'),
    totalEarnings: 0,
    totalWithdrawals: 0,
    balance: 0
  },
  {
    id: '2',
    name: 'Demo User',
    email: 'user@refferx.com',
    uniqueId: 'USER001',
    referrerId: 'ADMIN001',
    isVerified: true,
    isApproved: true,
    createdAt: new Date('2023-02-15'),
    totalEarnings: 97.5,
    totalWithdrawals: 50,
    balance: 47.5
  },
  {
    id: '3',
    name: 'John Smith',
    email: 'john@example.com',
    uniqueId: 'USER002',
    referrerId: 'USER001',
    isVerified: true,
    isApproved: true,
    createdAt: new Date('2023-03-20'),
    totalEarnings: 30,
    totalWithdrawals: 0,
    balance: 30
  },
  {
    id: '4',
    name: 'Alice Wonder',
    email: 'alice@example.com',
    uniqueId: 'USER003',
    referrerId: 'USER002',
    isVerified: true,
    isApproved: true,
    createdAt: new Date('2023-04-10'),
    totalEarnings: 9,
    totalWithdrawals: 0,
    balance: 9
  },
  {
    id: '5',
    name: 'Robert Johnson',
    email: 'robert@example.com',
    uniqueId: 'USER004',
    referrerId: 'USER001',
    isVerified: true,
    isApproved: false,
    createdAt: new Date('2023-04-25'),
    totalEarnings: 0,
    totalWithdrawals: 0,
    balance: 0
  }
];

export const mockReferrals: Referral[] = [
  {
    id: '1',
    referrerId: 'ADMIN001',
    refereeId: 'USER001',
    level: 1,
    createdAt: new Date('2023-02-15')
  },
  {
    id: '2',
    referrerId: 'USER001',
    refereeId: 'USER002',
    level: 1,
    createdAt: new Date('2023-03-20')
  },
  {
    id: '3',
    referrerId: 'USER002',
    refereeId: 'USER003',
    level: 1,
    createdAt: new Date('2023-04-10')
  },
  {
    id: '4',
    referrerId: 'USER001',
    refereeId: 'USER004',
    level: 1,
    createdAt: new Date('2023-04-25')
  },
  {
    id: '5',
    referrerId: 'ADMIN001',
    refereeId: 'USER002',
    level: 2,
    createdAt: new Date('2023-03-20')
  },
  {
    id: '6',
    referrerId: 'ADMIN001',
    refereeId: 'USER003',
    level: 3,
    createdAt: new Date('2023-04-10')
  },
  {
    id: '7',
    referrerId: 'ADMIN001',
    refereeId: 'USER004',
    level: 2,
    createdAt: new Date('2023-04-25')
  }
];

export const mockCommissions: Commission[] = [
  {
    id: '1',
    userId: '2',
    refereeId: '3',
    amount: 9,
    level: 1,
    createdAt: new Date('2023-03-20')
  },
  {
    id: '2',
    userId: '3',
    refereeId: '4',
    amount: 9,
    level: 1,
    createdAt: new Date('2023-04-10')
  },
  {
    id: '3',
    userId: '2',
    refereeId: '4',
    amount: 0.9,
    level: 2,
    createdAt: new Date('2023-04-10')
  },
  {
    id: '4',
    userId: '1',
    refereeId: '4',
    amount: 0.75,
    level: 3,
    createdAt: new Date('2023-04-10')
  }
];

export const mockWithdrawals: Withdrawal[] = [
  {
    id: '1',
    userId: '2',
    amount: 50,
    method: 'uniqueId',
    address: 'USER001',
    status: 'approved',
    createdAt: new Date('2023-05-15'),
    processedAt: new Date('2023-05-16')
  },
  {
    id: '2',
    userId: '3',
    amount: 20,
    method: 'crypto',
    address: 'TL9iuBF7JEXgPnCB6XecPyPPpsRgxmrHw8',
    status: 'pending',
    createdAt: new Date('2023-05-20')
  }
];
