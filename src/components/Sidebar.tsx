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
import { useAppSelector } from '@/store/hooks';
import { setHomeContent, toggleHomeContent } from '@/store/slices/uiSlice';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();


  const accountToggle = () => {
    dispatch(toggleHomeContent())
  }
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col items-center space-y-4 sm:space-y-6 h-full">
      <div className="relative">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-600 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-semibold">64</span>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-3 sm:space-y-4">
        <div className="relative">
          <button
            onClick={() => navigate('/')}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors ${
              isActive('/') 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Target className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          {isActive('/') && (
            <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full"></div>
          )}
        </div>

        <button onClick={() => dispatch(setHomeContent('chats'))} className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 hover:bg-gray-600 transition-colors">
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button onClick={() => dispatch(setHomeContent('account'))} className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 hover:bg-gray-600 transition-colors">
          <Users className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 hover:bg-gray-600 transition-colors">
          <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      <div className="mt-auto">
        <button className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 hover:bg-gray-600 transition-colors">
          <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      <div onClick={accountToggle} className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-600 rounded-full flex items-center justify-center">
        <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
      </div>
    </div>
  );
};

export default Sidebar; 