import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { sendMessage } from '../store/slices/messagesSlice';
import { Send, Smile, Paperclip } from 'lucide-react';
import { motion } from 'framer-motion';
import socketService from '../services/socketService';

const MessageInput: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedConversation = useAppSelector((state) => state.conversations.selectedConversation);
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && selectedConversation) {
      // Send message via WebSocket for real-time communication
      socketService.sendMessage({
        wa_id: selectedConversation.wa_id,
        to: selectedConversation.wa_id,
        text: message.trim(),
        contact_name: selectedConversation.contact_name
      });
      
      // Also send via API for persistence
      dispatch(sendMessage({
        wa_id: selectedConversation.wa_id,
        text: message.trim(),
        contact_name: selectedConversation.contact_name
      }));
      
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!selectedConversation) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="p-4 bg-gray-800 border-t border-gray-700"
    >
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        <button
          type="button"
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Smile className="w-5 h-5 text-gray-300" />
        </button>
        
        <button
          type="button"
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Paperclip className="w-5 h-5 text-gray-300" />
        </button>

        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 resize-none max-h-32"
            rows={1}
          />
        </div>

        <button
          type="submit"
          disabled={!message.trim()}
          className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </motion.div>
  );
};

export default MessageInput; 