"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { Chat, ChatMessage, Conversations } from '../common/types';

const MenteeChat: React.FC = () => {
  // Sample data for chats
  const [chats, setChats] = useState<Chat[]>([
    {
      id: 1,
      name: "Chris Lee",
      lastMessage: "We'll continue with the animation techniques next session.",
      timestamp: "10:23 AM",
      imageUrl: "/images/chris_lee_mentor.png",
      unread: 0,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      lastMessage: "Thank you for sending your portfolio. I'll review it by tomorrow.",
      timestamp: "Yesterday",
      imageUrl: "/images/woman3.jpg",
      unread: 2,
    },
    {
      id: 3,
      name: "David Martinez",
      lastMessage: "Here's the resource I mentioned during our session.",
      timestamp: "Apr 22",
      imageUrl: "/images/man5.jpg",
      unread: 0,
    },
    {
      id: 4,
      name: "Aisha Khan",
      lastMessage: "Looking forward to our next meeting!",
      timestamp: "Apr 20",
      imageUrl: "/images/woman8.jpg",
      unread: 0,
    }
  ]);
  
  // Sample conversation data
  const [conversations, setConversations] = useState<Conversations>({
    1: {
      messages: [
        {
          id: 1,
          sender: "Chris Lee",
          text: "Hello there! How are you doing with the project?",
          timestamp: "10:05 AM",
          read: true
        },
        {
          id: 2,
          sender: "me",
          text: "Hi Chris! I'm making good progress. I've completed the initial setup and started working on the character rigging.",
          timestamp: "10:10 AM",
          read: true
        },
        {
          id: 3,
          sender: "Chris Lee",
          text: "That sounds great! Did you encounter any issues with the weight painting we discussed?",
          timestamp: "10:12 AM",
          read: true
        },
        {
          id: 4,
          sender: "me",
          text: "Yes, I had some trouble with the shoulder deformation, but I applied your technique of using multiple influence zones and it worked much better!",
          timestamp: "10:15 AM",
          read: true
        },
        {
          id: 5,
          sender: "Chris Lee",
          text: "Perfect! I'm glad that helped. For our next session, let's focus on the facial rigging system. We'll continue with the animation techniques next session.",
          timestamp: "10:23 AM",
          read: true
        }
      ]
    },
    2: {
      messages: [
        {
          id: 1,
          sender: "Sarah Johnson",
          text: "Hi there, I've received your application for mentorship.",
          timestamp: "Yesterday",
          read: true
        },
        {
          id: 2,
          sender: "me",
          text: "Thank you for accepting me! I'm excited to work with you.",
          timestamp: "Yesterday",
          read: true
        },
        {
          id: 3,
          sender: "Sarah Johnson",
          text: "Could you send me your portfolio so I can get a better sense of your current skill level?",
          timestamp: "Yesterday",
          read: true
        },
        {
          id: 4,
          sender: "me",
          text: "Of course! Here's a link to my latest work: https://myportfolio.com/latest",
          timestamp: "Yesterday",
          read: true
        },
        {
          id: 5,
          sender: "Sarah Johnson",
          text: "Thank you for sending your portfolio. I'll review it by tomorrow.",
          timestamp: "Yesterday",
          read: false
        },
        {
          id: 6,
          sender: "Sarah Johnson",
          text: "Also, please think about what specific areas you'd like to focus on during our sessions.",
          timestamp: "Yesterday",
          read: false
        }
      ]
    }
  });
  
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [newMessage, setNewMessage] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Filter chats based on search term
  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;
    
    const newMsg: ChatMessage = {
      id: conversations[selectedChat].messages.length + 1,
      sender: "me",
      text: newMessage,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }),
      read: true
    };
    
    // Update conversations
    setConversations(prevConversations => ({
      ...prevConversations,
      [selectedChat]: {
        messages: [...prevConversations[selectedChat].messages, newMsg]
      }
    }));
    
    // Update last message in chat list
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === selectedChat 
          ? { 
              ...chat, 
              lastMessage: newMessage,
              timestamp: 'Just now',
            } 
          : chat
      )
    );
    
    // Clear input
    setNewMessage('');
  };
  
  // Mark messages as read when chat is selected
  const handleChatSelect = (chatId: number) => {
    setSelectedChat(chatId);
    
    // Mark all messages as read in this conversation
    if (conversations[chatId]) {
      setConversations(prevConversations => ({
        ...prevConversations,
        [chatId]: {
          messages: prevConversations[chatId].messages.map(msg => ({
            ...msg,
            read: true
          }))
        }
      }));
      
      // Update unread count in chat list
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === chatId 
            ? { ...chat, unread: 0 } 
            : chat
        )
      );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-250px)]">
        {/* Chat List */}
        <div className="md:col-span-1 border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search messages..."
                className="py-2 pl-10 pr-4 block w-full rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-y-auto" style={{ height: 'calc(100% - 73px)' }}>
            {filteredChats.map(chat => (
              <div
                key={chat.id}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedChat === chat.id ? 'bg-indigo-50' : ''
                }`}
                onClick={() => handleChatSelect(chat.id)}
              >
                <div className="flex items-start">
                  <div className="relative mr-3">
                    <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                      {chat.imageUrl ? (
                        <Image 
                          src={chat.imageUrl} 
                          alt={chat.name}
                          className="h-full w-full object-cover"
                          width={48}
                          height={48}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-medium text-lg">
                          {chat.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    {chat.unread > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {chat.unread}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{chat.name}</h3>
                      <p className="text-xs text-gray-500 whitespace-nowrap">{chat.timestamp}</p>
                    </div>
                    <p className={`text-sm truncate ${chat.unread > 0 ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Chat Messages */}
        <div className="md:col-span-2 flex flex-col">
          {selectedChat && conversations[selectedChat] ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center bg-white">
                <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                  {chats.find(c => c.id === selectedChat)?.imageUrl ? (
                    <Image 
                      src={chats.find(c => c.id === selectedChat)?.imageUrl || ''} 
                      alt={chats.find(c => c.id === selectedChat)?.name || 'Chat user'}
                      className="h-full w-full object-cover"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-medium">
                      {chats.find(c => c.id === selectedChat)?.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {chats.find(c => c.id === selectedChat)?.name}
                  </h3>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                <div className="space-y-4">
                  {conversations[selectedChat].messages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                      <div 
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender === 'me' 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-white border border-gray-200 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${message.sender === 'me' ? 'text-indigo-200' : 'text-gray-500'}`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 py-2 px-4 block rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button 
                    className="ml-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    onClick={handleSendMessage}
                    aria-label="Send message"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="bg-indigo-100 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">No conversation selected</h3>
                <p className="mt-1 text-gray-600">Choose a chat from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenteeChat;