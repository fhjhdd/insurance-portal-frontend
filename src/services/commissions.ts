
import { Commission } from '@/types';
import { mockCommissions } from './mockData';

export const getCommissionsByUserId = async (userId: string): Promise<Commission[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const commissions = mockCommissions.filter(c => c.userId === userId);
      resolve(commissions);
    }, 500);
  });
};

export const getCommissionStats = async (userId: string): Promise<{ [key: string]: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const commissions = mockCommissions.filter(c => c.userId === userId);
      
      // Initialize all levels
      const stats = {
        level1: 0,
        level2: 0,
        level3: 0,
        level4: 0,
        level5: 0,
        total: 0
      };

      // Calculate commission for each level
      commissions.forEach(commission => {
        switch (commission.level) {
          case 1:
            stats.level1 += commission.amount;
            break;
          case 2:
            stats.level2 += commission.amount;
            break;
          case 3:
            stats.level3 += commission.amount;
            break;
          case 4:
            stats.level4 += commission.amount;
            break;
          case 5:
            stats.level5 += commission.amount;
            break;
        }
      });

      // Calculate total
      stats.total = stats.level1 + stats.level2 + stats.level3 + stats.level4 + stats.level5;
      
      resolve(stats);
    }, 500);
  });
};

// Commission rates
export const COMMISSION_RATES = {
  level1: 0.09, // 9%
  level2: 0.009, // 0.9%
  level3: 0.0075, // 0.75%
  level4: 0.005, // 0.5%
  level5: 0.0025 // 0.25%
};

// Calculate commission amount based on level and base amount
export const calculateCommissionForLevel = (level: number, baseAmount: number): number => {
  const rate = COMMISSION_RATES[`level${level}` as keyof typeof COMMISSION_RATES] || 0;
  return baseAmount * rate;
};
