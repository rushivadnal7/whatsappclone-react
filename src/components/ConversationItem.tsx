import React from 'react';
import type { Conversation } from '../store/slices/conversationsSlice';
import { formatDistanceToNow } from 'date-fns';
import { Pin, Check, CheckCheck } from 'lucide-react';

interface ConversationItemProps {
  conversation: Conversation;
  onClick: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ conversation, onClick }) => {
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(parseInt(timestamp) * 1000);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      
      if (diffInHours < 24) {
        return date.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }).toLowerCase();
      } else if (diffInHours < 48) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString('en-US', { weekday: 'long' });
      }
    } catch {
      return 'Unknown';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  // Use stable values based on conversation data instead of random
  const isPinned = conversation.wa_id.length % 3 === 0; // Stable based on wa_id
  const isRead = conversation.unread_count === 0; // Use actual unread count

  return (
    <div
      onClick={onClick}
      className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 hover:bg-gray-800 cursor-pointer transition-colors border-b border-gray-800"
    >
      <div className="flex-shrink-0 relative">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-xs sm:text-sm">
            {getInitials(conversation.contact_name)}
          </span>
        </div>
        {conversation.is_online && (
          <div className="absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-medium text-white truncate">
            {conversation.contact_name}
          </h3>
          <div className="flex items-center space-x-1">
            {isPinned && (
              <Pin className="w-2 h-2 sm:w-3 sm:h-3 text-gray-400" />
            )}
            <span className={`text-xs ${
              conversation.unread_count > 0 ? 'text-green-500' : 'text-gray-400'
            }`}>
              {formatTime(conversation.last_message_time)}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center space-x-1 flex-1 min-w-0">
            {isRead ? (
              <CheckCheck className="w-2 h-2 sm:w-3 sm:h-3 text-blue-400 flex-shrink-0" />
            ) : (
              <Check className="w-2 h-2 sm:w-3 sm:h-3 text-gray-400 flex-shrink-0" />
            )}
            <p className="text-xs sm:text-sm text-gray-300 truncate">
              {conversation.last_message}
            </p>
          </div>
          {conversation.unread_count > 0 && (
            <span className="flex-shrink-0 ml-2 bg-green-500 text-white text-xs rounded-full h-4 sm:h-5 min-w-4 sm:min-w-5 flex items-center justify-center px-1">
              {conversation.unread_count}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem; 