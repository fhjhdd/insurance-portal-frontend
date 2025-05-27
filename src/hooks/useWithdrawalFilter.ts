
import { useState, useMemo, useCallback } from 'react';
import { Withdrawal } from '@/types';

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected';
type FilterMethod = 'all' | 'uniqueId' | 'crypto';

interface FilteredWithdrawals {
  pending: Withdrawal[];
  processed: Withdrawal[];
}

export const useWithdrawalFilter = (withdrawals: Withdrawal[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState(false);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [methodFilter, setMethodFilter] = useState<FilterMethod>('all');

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setFilterActive(!!value.trim());
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setFilterActive(false);
    setStatusFilter('all');
    setMethodFilter('all');
  }, []);

  const applyFilters = useCallback((withdrawal: Withdrawal): boolean => {
    const matchesSearch = !filterActive || (
      withdrawal.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      withdrawal.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      withdrawal.userId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const matchesStatus = statusFilter === 'all' || withdrawal.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || withdrawal.method === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  }, [filterActive, searchQuery, statusFilter, methodFilter]);

  const filteredWithdrawals = useMemo<FilteredWithdrawals>(() => {
    const filtered = withdrawals.filter(applyFilters);
    
    return {
      pending: filtered.filter(w => w.status === 'pending'),
      processed: filtered.filter(w => w.status !== 'pending')
    };
  }, [withdrawals, applyFilters]);

  return {
    searchQuery,
    setSearchQuery: handleSearch,
    clearSearch,
    filterActive,
    statusFilter,
    setStatusFilter,
    methodFilter,
    setMethodFilter,
    filteredWithdrawals
  };
};
