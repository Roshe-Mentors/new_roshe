"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { FiSearch, FiSend, FiPaperclip, FiSmile } from 'react-icons/fi';
import { Chat, Conversations } from '../common/types';

interface MentorChatProps {
  initialChats?: Chat[];
}

const MentorChat: React.FC<MentorChatProps> = ({ 
  initialChats = [] 
}) => {
  // Mock chat data if none is provided
  const chatList: Chat[] = initialChats.length > 0 ? initialChats : [
    {
      id: 1,
      name: 'Moses Omobolaji',
      lastMessage: "You: Good morning management. We are...",
      timestamp: '2w',
      imageUrl: "/images/bj.jpg",
      unread: 0
    },
    {
      id: 2,
      name: 'Faith Ogundare',
      lastMessage: "Faith: That sounds good! I can help you...",
      timestamp: '21w',
      imageUrl: "/images/7.jpeg",
      unread: 0
    },
    {
      id: 3,
      name: 'Chris Lee',
      lastMessage: "You: Thank you for the feedback on my...",
      timestamp: '11w',
      imageUrl: "/images/chris_lee_mentor.png",
      unread: 0
    },
    {
      id: 4,
      name: 'Jane Smith',
      lastMessage: "Jane: The animation principles we discussed...",
      timestamp: '1d',
      imageUrl: "/images/woman1.jpg",
      unread: 0
    },
    {
      id: 5,
      name: 'Michael Johnson',
      lastMessage: "You: I've been working on the character rig...",
      timestamp: '3h',
      imageUrl: "/images/man1.jpg",
      unread: 0
    },
    {
      id: 6,
      name: 'Sophie Williams',
      lastMessage: "Sophie: Here's my availability for next week...",
      timestamp: '1w',
      imageUrl: "/images/woman2.jpg",
      unread: 2
    },
    {
      id: 7,
      name: 'Robert Chen',
      lastMessage: "You: The render is almost complete, I'll share...",
      timestamp: '5d',
      imageUrl: "/images/man2.jpg",
      unread: 0
    },
    {
      id: 8,
      name: 'Anya Petrova',
      lastMessage: "Anya: Have you tried the new sculpting tool?",
      timestamp: '2d',
      imageUrl: "/images/woman3.jpg",
      unread: 0
    },
    {
      id: 9,
      name: 'Jamal Washington',
      lastMessage: "You: I'd appreciate your feedback on my portfolio...",
      timestamp: '6h',
      imageUrl: "/images/man3.jpg",
      unread: 0
    },
    {
      id: 10,
      name: 'Olivia Parker',
      lastMessage: "Olivia: The lighting in your scene looks amazing...",
      timestamp: '4w',
      imageUrl: "/images/woman4.jpg",
      unread: 5
    }
  ];

  // Add chat-related state variables
  const [chatSearch, setChatSearch] = useState('');
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [conversations, setConversations] = useState<Conversations>({});

  // Function to handle sending a new message
  const handleSendMessage = () => {
    if (!chatMessage.trim() || !selectedChat) return;

    const newMessageId = Date.now();
    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Create a copy of the current conversations
    const updatedConversations = { ...conversations };
    
    // If this is a new conversation, initialize it
    if (!updatedConversations[selectedChat]) {
      updatedConversations[selectedChat] = { messages: [] };
    }
    
    // Add the new message
    updatedConversations[selectedChat].messages.push({
      id: newMessageId,
      sender: 'You',
      text: chatMessage,
      timestamp: formattedTime,
      read: true
    });
    
    // Update the state
    setConversations(updatedConversations);
    setChatMessage('');
  };

  // Function to mark messages as read when a chat is selected
  const handleChatSelect = (chatId: number) => {
    setSelectedChat(chatId);
    
    // If we don't have any conversation for this chat yet, initialize with mock data
    if (!conversations[chatId]) {
      const selectedChatData = chatList.find(chat => chat.id === chatId);
      const mockMessages = [];
      
      // Create mock conversation with 1-5 messages
      const messageCount = Math.floor(Math.random() * 5) + 1;
      const today = new Date();
      const baseTime = Date.now(); // Use as base timestamp
      
      for (let i = 0; i < messageCount; i++) {
        const timeAgo = Math.floor(Math.random() * 24 * 60); // Random minutes ago (up to 24 hours)
        const messageTime = new Date(today.getTime() - timeAgo * 60000);
        const formattedTime = messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        mockMessages.push({
          id: baseTime - (i * 1000), // Ensure each ID is unique by offsetting by index
          sender: i % 2 === 0 ? selectedChatData?.name || 'User' : 'You',
          text: i % 2 === 0 
            ? `Hi there! I'm ${selectedChatData?.name}. How can I help you with your project today?` 
            : "I've been working on a new animation sequence and would love your feedback on it.",
          timestamp: formattedTime,
          read: true
        });
      }
      
      setConversations({
        ...conversations,
        [chatId]: { messages: mockMessages }
      });
    }
  };

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto">
      {/* Chat Interface - Split View */}
      <div className="flex bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* Left side - Chat List */}
        <div className="w-1/3 border-r border-gray-100">
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search member"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                value={chatSearch}
                onChange={(e) => setChatSearch(e.target.value)}
              />
              {chatSearch && (
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setChatSearch('')}
                  title="Clear search"
                  aria-label="Clear search input"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          
          {/* Member List - Scrollable Container */}
          <div className="h-[calc(100vh-250px)] overflow-y-auto scrollbar-hide" style={{ overflowY: 'auto', height: 'calc(100vh - 250px)' }}>
            <style jsx global>{`
              /* Hide scrollbar for Chrome, Safari and Opera */
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
              
              /* Hide scrollbar for IE, Edge and Firefox */
              .scrollbar-hide {
                -ms-overflow-style: none;  /* IE and Edge */
                scrollbar-width: none;  /* Firefox */
                overflow-y: auto !important;
              }
            `}</style>
            
            {/* Filter chat list based on search */}
            {chatList
              .filter(chat => 
                !chatSearch || 
                chat.name.toLowerCase().includes(chatSearch.toLowerCase())
              )
              .map((chat) => (
              <div 
                key={chat.id} 
                className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition duration-150 ${
                  selectedChat === chat.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleChatSelect(chat.id)}
              >
                <div className="flex items-center">
                  <div className="relative">
                    <Image
                      src={chat.imageUrl}
                      alt={chat.name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover w-12 h-12"
                    />
                    {chat.unread > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">{chat.unread}</span>
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex-grow">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-800 text-sm">{chat.name}</h4>
                      <span className="text-xs text-gray-500">{chat.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate w-48">{chat.lastMessage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right side - Chat Messages */}
        <div className="w-2/3 flex flex-col">
          {selectedChat && chatList.find(chat => chat.id === selectedChat) ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 flex items-center">
                <Image
                  src={chatList.find(chat => chat.id === selectedChat)?.imageUrl || '/images/mentor_pic.png'}
                  alt={chatList.find(chat => chat.id === selectedChat)?.name || 'Chat'}
                  width={40}
                  height={40}
                  className="rounded-full object-cover w-10 h-10"
                />
                <div className="ml-3">
                  <h3 className="font-medium text-gray-800">
                    {chatList.find(chat => chat.id === selectedChat)?.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {/* Show online status or role */}
                    Online now
                  </p>
                </div>
              </div>
              
              {/* Messages Container */}
              <div className="flex-grow p-4 overflow-y-auto scrollbar-hide">
                {conversations[selectedChat]?.messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`mb-4 flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender !== 'You' && (
                      <div className="mr-2 flex-shrink-0">
                        <Image
                          src={chatList.find(chat => chat.id === selectedChat)?.imageUrl || '/images/mentor_pic.png'}
                          alt={message.sender}
                          width={32}
                          height={32}
                          className="rounded-full object-cover w-8 h-8"
                        />
                      </div>
                    )}
                    <div 
                      className={`max-w-xs rounded-lg px-4 py-2 ${
                        message.sender === 'You' 
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.sender === 'You' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Message Input */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center">
                  <button className="text-gray-500 hover:text-gray-700 mr-2">
                    <FiPaperclip size={20} />
                  </button>
                  <button className="text-gray-500 hover:text-gray-700 mr-3">
                    <FiSmile size={20} />
                  </button>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-grow px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    className="ml-3 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-150"
                    onClick={handleSendMessage}
                  >
                    <FiSend size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-grow flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                  <FiSearch size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Select a chat</h3>
                <p className="text-gray-500">
                  Choose a conversation from the list or search for a specific mentor
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorChat;