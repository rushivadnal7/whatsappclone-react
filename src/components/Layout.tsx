import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut, User } from 'lucide-react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
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
      socketService.disconnect();

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

  // const isChatScreen = window.loc
  const isChatScreen = location.pathname.includes('chat');

  return (
    <div className="flex h-screen bg-gray-900">
      <div className="hidden md:flex w-20 bg-gray-800 flex-shrink-0 flex flex-col items-center py-4">
        <Sidebar />

        <div className="mt-auto space-y-2">
          {user && (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                {user.profile.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-gray-400 mt-1 text-center hidden lg:block">
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

      <div className="flex-1 flex flex-col bg-gray-900 pb-16 md:pb-0 safe-area-bottom">
        <Outlet />
      </div>


      {!isChatScreen && <MobileNav />}
    </div>
  );
};

export default Layout; 