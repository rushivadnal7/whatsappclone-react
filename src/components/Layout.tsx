import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut, User } from 'lucide-react';
import Sidebar from './Sidebar';
import { Button } from './ui/button';
import { logout } from '../store/slices/authSlice';
import type { RootState, AppDispatch } from '../store';
import socketService from '../services/socketService';
import { useToast } from '../hooks/use-toast';

const Layout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    try {
      // Disconnect WebSocket
      socketService.disconnect();
      
      // Logout from server
      await dispatch(logout()).unwrap();
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Fixed Sidebar - always visible */}
      <div className="w-20 bg-gray-800 flex-shrink-0 flex flex-col items-center py-4">
        <Sidebar />
        
        {/* User profile and logout */}
        <div className="mt-auto space-y-2">
          {user && (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                {user.profile.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-gray-400 mt-1 text-center">
                {user.profile.name}
              </span>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-8 h-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-900">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout; 