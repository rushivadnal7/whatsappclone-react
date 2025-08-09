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
        <p className="text-gray-400">Select a conversation to start chatting</p>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-300" />
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {getInitials(selectedConversation.contact_name)}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              {selectedConversation.contact_name}
            </h2>
            <p className="text-sm text-gray-400">
              {selectedConversation.is_online ? 'online' : 'last seen recently'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
          <Video className="w-5 h-5 text-gray-300" />
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
          <Phone className="w-5 h-5 text-gray-300" />
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-300" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader; 