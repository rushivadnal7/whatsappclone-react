import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Target, 
  MessageCircle, 
  Users, 
  Phone, 
  Settings,
  User
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setHomeContent } from '@/store/slices/uiSlice';

const MobileNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-50 safe-area-bottom">
      <div className="flex justify-around items-center py-2">
        <button
          onClick={() => navigate('/')}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            isActive('/') 
              ? 'text-green-500' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Target className="w-5 h-5 mb-1" />
          <span className="text-xs">Chats</span>
        </button>

        <button 
          onClick={() => dispatch(setHomeContent('chats'))}
          className="flex flex-col items-center p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
        >
          <MessageCircle className="w-5 h-5 mb-1" />
          <span className="text-xs">Messages</span>
        </button>

        <button 
          onClick={() => dispatch(setHomeContent('account'))}
          className="flex flex-col items-center p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
        >
          <Users className="w-5 h-5 mb-1" />
          <span className="text-xs">Groups</span>
        </button>

        <button className="flex flex-col items-center p-2 rounded-lg text-gray-400 hover:text-white transition-colors">
          <Phone className="w-5 h-5 mb-1" />
          <span className="text-xs">Calls</span>
        </button>

        <button className="flex flex-col items-center p-2 rounded-lg text-gray-400 hover:text-white transition-colors">
          <Settings className="w-5 h-5 mb-1" />
          <span className="text-xs">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default MobileNav;
