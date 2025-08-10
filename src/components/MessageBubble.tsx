import React from 'react';
import type { Message } from '../store/slices/messagesSlice';
import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isOutgoing = message.is_outgoing;
  
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(parseInt(timestamp) * 1000);
      return format(date, 'HH:mm');
    } catch {
      return '00:00';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Check className="w-4 h-4 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-4 h-4 text-blue-400" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[70%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-lg ${
          isOutgoing
            ? 'bg-green-500 text-white rounded-br-none'
            : 'bg-gray-700 text-white rounded-bl-none'
        }`}
      >
        <p className="text-xs sm:text-sm break-words">{message.text}</p>
        <div className={`flex items-center justify-end space-x-1 mt-1 ${
          isOutgoing ? 'text-green-100' : 'text-gray-400'
        }`}>
          <span className="text-xs">{formatTime(message.timestamp)}</span>
          {isOutgoing && getStatusIcon(message.status)}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble; 