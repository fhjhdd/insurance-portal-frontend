
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Settings, 
  PieChart, 
  User, 
  Wallet
} from 'lucide-react';

interface SidebarProps {
  isAdmin?: boolean;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isAdmin = false, isOpen, setIsOpen }) => {
  const location = useLocation();
  
  const adminLinks = [
    { 
      name: 'Dashboard', 
      path: '/admin/dashboard', 
      icon: <LayoutDashboard size={20} /> 
    },
    { 
      name: 'Users', 
      path: '/admin/users', 
      icon: <Users size={20} /> 
    },
    { 
      name: 'Team Tracking', 
      path: '/admin/referrals', 
      icon: <PieChart size={20} /> 
    },
    { 
      name: 'Withdrawals', 
      path: '/admin/withdrawals', 
      icon: <CreditCard size={20} /> 
    },
    { 
      name: 'Settings', 
      path: '/admin/settings', 
      icon: <Settings size={20} /> 
    }
  ];
  
  const userLinks = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <LayoutDashboard size={20} /> 
    },
    { 
      name: 'My Team', 
      path: '/team', 
      icon: <Users size={20} /> 
    },
    { 
      name: 'Withdrawal', 
      path: '/withdrawal', 
      icon: <Wallet size={20} /> 
    },
    { 
      name: 'Profile', 
      path: '/profile', 
      icon: <User size={20} /> 
    }
  ];
  
  const links = isAdmin ? adminLinks : userLinks;
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out transform md:translate-x-0 md:static",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* <div className="p-6">
          <h1 className="text-2xl font-bold text-primary">RefferX</h1>
          <p className="text-sm text-gray-500">{isAdmin ? 'Admin Portal' : 'User Portal'}</p>
        </div> */}
        
        <nav className="mt-6">
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={cn(
                    "flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:bg-opacity-10 hover:text-primary",
                    location.pathname === link.path && "bg-primary bg-opacity-10 text-primary font-medium border-l-4 border-primary"
                  )}
                >
                  <span className="mr-4">{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
