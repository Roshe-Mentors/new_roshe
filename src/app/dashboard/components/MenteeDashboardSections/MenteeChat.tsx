"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import useChat from '@/hooks/useChat';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { FiSend } from 'react-icons/fi';

const MenteeChat: React.FC = () => {
  const { chatRooms, messages, sendMessageToRoom, getOrCreateRoomWithUser, userId } = useChat();
  const supabase = useSupabaseClient();
  const [members, setMembers] = useState<Array<{ user_id: string; full_name: string; avatar_url: string }>>([]);
  useEffect(() => {
    // fetch mentors as chatable members
    supabase
      .from('mentors')
      .select('user_id, name, profile_image_url')
      .then(({ data, error }) => {
        if (!error && data) {
          setMembers(
            data.map(m => ({ user_id: m.user_id, full_name: m.name || '', avatar_url: m.profile_image_url || '' }))
          );
        }
      });
  }, [supabase]);

  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newMessage, setNewMessage] = useState<string>('');

  // Wait until userId is available before rendering chat
  if (!userId) {
    return <div className="p-4">Loading chat...</div>;
  }

  const filteredRooms = chatRooms.filter(room => {
    const other = room.participants.find(p => p.user_id !== userId);
    return other?.full_name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  const filteredMembers = members.filter(m => m.full_name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleRoomSelect = (roomId: string) => {
    console.log('Room clicked:', roomId);
    setSelectedRoom(roomId);
  };  const handleMemberSelect = async (otherId: string) => {
    console.log('MenteeChat: member clicked', otherId);
    console.log('MenteeChat: current userId', userId);
    
    try {
      const roomId = await getOrCreateRoomWithUser(otherId);
      console.log('MenteeChat: getOrCreateRoomWithUser returned:', roomId);
      
      if (roomId) {
        setSelectedRoom(roomId);
        setSearchTerm(''); // clear search to display rooms
        console.log('MenteeChat: room selected successfully:', roomId);
      } else {
        console.error('MenteeChat: Failed to create/get room');
      }
    } catch (error) {
      console.error('MenteeChat: Error in handleMemberSelect:', error);
    }
  };
  const handleSend = () => {
    console.log('Send clicked for room:', selectedRoom, 'message:', newMessage);
    if (selectedRoom && newMessage.trim()) {
      sendMessageToRoom(selectedRoom, newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto">
      <div className="flex bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* Chat List */}
        <div className="w-1/3 border-r border-gray-100">
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-100">
            <input
              type="text"
              placeholder="Search member"
              className="w-full pl-4 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Member List - Scrollable Container */}
          <div className="h-[calc(100vh-250px)] overflow-y-auto scrollbar-hide" style={{ overflowY: 'auto', height: 'calc(100vh - 250px)' }}>
            <style jsx global>{`
              /* Hide scrollbar for Chrome, Safari and Opera */
              .scrollbar-hide::-webkit-scrollbar { display: none; }
              /* Hide scrollbar for IE, Edge and Firefox */
              .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; overflow-y: auto !important; }
            `}</style>
            {/* show members when searching or if no rooms exist, else show existing rooms */}
            {(searchTerm || chatRooms.length === 0)
              ? filteredMembers.map(m => (
                  <div key={m.user_id} onClick={() => handleMemberSelect(m.user_id)} className="p-4 flex items-center cursor-pointer hover:bg-gray-50">
                    <Image src={m.avatar_url} alt={m.full_name} width={40} height={40} className="rounded-full" />
                    <div className="ml-4 flex-1">
                      <h4 className="font-semibold text-gray-900">{m.full_name}</h4>
                    </div>
                  </div>
                ))
              : filteredRooms.map(room => {
                  const other = room.participants.find(p => p.user_id !== userId);
                  return (
                    <div key={room.id} onClick={() => handleRoomSelect(room.id)} className="p-4 flex items-center cursor-pointer hover:bg-gray-50">
                      <Image src={other?.avatar_url || ''} alt={other?.full_name || 'User'} width={40} height={40} className="rounded-full" />
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-semibold text-gray-900">{other?.full_name}</h4>
                          <span className="text-xs text-gray-400">{new Date(room.last_message_at).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{room.last_message}</p>
                      </div>
                    </div>
                  );
                })}
           </div>
         </div>
         {/* Message Area */}
         <div className="flex-1 flex flex-col">
           <div className="flex-1 overflow-y-auto p-4">
             {selectedRoom && messages[selectedRoom]?.map(msg => (
               <div key={msg.id} className={`mb-2 ${msg.sender_id === userId ? 'text-right' : 'text-left'}`}>
                 <p className="inline-block px-4 py-2 rounded-lg bg-blue-100 text-gray-800">{msg.text}</p>
                 <p className="text-xs text-gray-400 mt-1">{new Date(msg.inserted_at).toLocaleTimeString()}</p>
               </div>
             ))}
           </div>
           <div className="p-4 border-t border-gray-100 flex">
             <input
               type="text"
               className="flex-1 pl-4 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
               placeholder="Type a message"
               value={newMessage}
               onChange={e => setNewMessage(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && handleSend()}
             />
             <button onClick={handleSend} className="ml-4 text-blue-500 hover:text-blue-600" aria-label="Send message">
               <FiSend size={20} />
             </button>
           </div>
         </div>
       </div>
    </div>
  );
};

export default MenteeChat;