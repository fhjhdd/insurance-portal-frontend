
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu, User } from 'lucide-react';

interface HeaderProps {
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm py-4 px-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {toggleSidebar && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="mr-2 md:hidden"
            >
              <Menu size={20} />
            </Button>
          )}
          <div onClick={() => navigate(user?.isAdmin ? '/admin/dashboard' : '/dashboard')} className="cursor-pointer">
            <h1 className="text-2xl font-bold text-primary">TeamBoost</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {user && (
            <div className="hidden md:flex items-center mr-4">
              <User size={16} className="mr-2" />
              <span className="text-sm font-medium">{user.name}</span>
            </div>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => logout()}
            className="flex items-center"
          >
            <LogOut size={16} className="mr-2" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
