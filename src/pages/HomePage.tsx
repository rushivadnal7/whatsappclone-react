import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useNavigate } from 'react-router-dom';
import { fetchConversations } from '../store/slices/conversationsSlice';
import { ArrowLeft, Plus, MoreVertical, Search, Pin } from 'lucide-react';
import ConversationItem from '../components/ConversationItem';
import { FaUser, FaLock, FaComments, FaBell, FaKeyboard, FaQuestionCircle, FaSignOutAlt } from 'react-icons/fa';
import { setHomeContent } from '@/store/slices/uiSlice';


type FilterType = 'all' | 'unread' | 'favourites' | 'groups';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { conversations, loading } = useAppSelector((state) => state.conversations);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const homeContent = useAppSelector((state) => state.ui.homeContent);


  console.log(conversations);


  useEffect(() => {
    console.log('Fetching conversations with filter:', filter);
    dispatch(fetchConversations(filter));
  }, [dispatch, filter]);

  const handleConversationClick = (wa_id: string) => {
    navigate(`/chat/${wa_id}`);
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.last_message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const menuItems = [
    { icon: <FaUser />, label: 'Account', action: () => dispatch(setHomeContent('account')) },
    { icon: <FaLock />, label: 'Privacy' },
    { icon: <FaComments />, label: 'Chats', action: () => dispatch(setHomeContent('chats')) },
    { icon: <FaBell />, label: 'Notifications' },
    { icon: <FaKeyboard />, label: 'Keyboard shortcuts' },
    { icon: <FaQuestionCircle />, label: 'Help' },
  ];


  return (
    <>
      <div className='w-full h-full flex flex-col lg:flex-row'>

        <div className="flex w-full lg:w-1/2 flex-col h-full bg-gray-900">
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Chats</h1>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
                <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
              </button>
            </div>
          </div>

          <div className="p-4">
            <div className="relative">
              <ArrowLeft className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder=""
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>
          </div>


          {
            homeContent === 'chats' ? (
              <>
                <div className="px-4 pb-4">
                  <div className="flex space-x-1 sm:space-x-2 overflow-x-auto">
                    {(['all', 'unread', 'favourites', 'groups'] as FilterType[]).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-2 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${filter === tab
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto ">
                  {loading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {filteredConversations.map((conversation) => (
                        <ConversationItem
                          key={conversation.wa_id}
                          conversation={conversation}
                          onClick={() => handleConversationClick(conversation.wa_id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="w-full bg-gray-900 text-white flex flex-col h-screen">
                  <div className="p-4 flex items-center gap-3 border-b border-gray-700">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border rounded-full text-sm sm:text-base">
                      R
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm sm:text-base truncate">Rushikesh Vadnal</p>
                      <p className="text-xs sm:text-sm text-gray-400 truncate">
                        Stack your money, build your credit, have fun...
                      </p>
                    </div>
                  </div>

                  <div className="flex-1">
                    {menuItems.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={item.action}
                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-800 ${homeContent === 'account' && item.label === 'Account'}`}
                      >
                        <span className="text-base sm:text-lg">{item.icon}</span>
                        <span className="text-sm sm:text-base">{item.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="px-4 py-3 border-t border-gray-700 text-red-500 cursor-pointer hover:bg-gray-800 flex items-center gap-3">
                    <FaSignOutAlt className="text-base sm:text-lg" />
                    <span className="text-sm sm:text-base">Log out</span>
                  </div>
                </div>
              </>
            )
          }

        </div>
        <div className='hidden lg:flex w-1/2 h-full justify-center items-center bg-gray-800'>
          <img className='w-1/2 h-auto' src="/whatsapp-laptop-screen.png" alt="whatsapp" />
        </div>
      </div>
    </>

  );
};

export default HomePage; 