
import { useState, useMemo } from 'react';
import { User } from '@/types';

export const useUserFilter = (users: User[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.uniqueId.toLowerCase().includes(query)
    );
    
    const pending = filtered.filter(user => !user.isApproved && !user.isExpired);
    const approved = filtered.filter(user => user.isApproved && !user.isExpired);
    const expired = filtered.filter(user => user.isExpired === true);
    
    return { all: filtered, pending, approved, expired };
  }, [users, searchQuery]);
  
  return { searchQuery, setSearchQuery, filteredUsers };
};
