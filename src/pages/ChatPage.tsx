import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMessages } from '../store/slices/messagesSlice';
import { fetchConversation, markConversationAsRead } from '../store/slices/conversationsSlice';
import { setSelectedConversation } from '../store/slices/conversationsSlice';
import ChatHeader from '../components/ChatHeader';
import MessageBubble from '../components/MessageBubble';
import MessageInput from '../components/MessageInput';
import { AnimatePresence } from 'framer-motion';

const ChatPage: React.FC = () => {
  const { wa_id } = useParams<{ wa_id: string }>();
  const dispatch = useAppDispatch();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { conversations } = useAppSelector((state) => state.conversations);
  const { messages, loading } = useAppSelector((state) => state.messages);

  useEffect(() => {
    if (wa_id) {
      // Find conversation in the list
      const conversation = conversations.find(conv => conv.wa_id === wa_id);
      if (conversation) {
        dispatch(setSelectedConversation(conversation));
      } else {
        // Fetch conversation details if not in list
        dispatch(fetchConversation(wa_id));
      }
      
      // Fetch messages
      dispatch(fetchMessages({ wa_id }));
      
      // Mark conversation as read
      dispatch(markConversationAsRead(wa_id));
    }
  }, [wa_id, dispatch, conversations]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, wa_id]);

  if (!wa_id) {
    return <div>No conversation selected</div>;
  }

  const currentMessages = messages[wa_id] || [];

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gray-900 p-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <AnimatePresence>
            {currentMessages.map((message) => (
              <MessageBubble key={message._id} message={message} />
            ))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatPage; 