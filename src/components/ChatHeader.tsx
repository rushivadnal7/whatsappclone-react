import React from 'react';
import { useAppSelector } from '../store/hooks';
import { ArrowLeft, Phone, Video, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatHeader: React.FC = () => {
  const navigate = useNavigate();
  const selectedConversation = useAppSelector((state) => state.conversations.selectedConversation);

  if (!selectedConversation) {
    return (
          <div className="flex items-center justify-center h-16 bg-gray-800 border-b border-gray-700">
      <p className="text-gray-400 text-sm sm:text-base">Select a conversation to start chatting</p>
    </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-800 border-b border-gray-700">
      <div className="flex items-center space-x-2 sm:space-x-3">
        <button
          onClick={() => navigate('/')}
          className="p-1 sm:p-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
        </button>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-xs sm:text-sm">
              {getInitials(selectedConversation.contact_name)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm sm:text-lg font-semibold text-white truncate">
              {selectedConversation.contact_name}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 truncate">
              {selectedConversation.is_online ? 'online' : 'last seen recently'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-2">
        <button className="p-1 sm:p-2 rounded-lg hover:bg-gray-700 transition-colors">
          <Video className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
        </button>
        <button className="p-1 sm:p-2 rounded-lg hover:bg-gray-700 transition-colors">
          <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
        </button>
        <button className="p-1 sm:p-2 rounded-lg hover:bg-gray-700 transition-colors">
          <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader; 