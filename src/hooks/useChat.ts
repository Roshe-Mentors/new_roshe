'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

interface ChatRoom {
  id: string;
  participants: Array<{ user_id: string; full_name: string; avatar_url: string }>;
  last_message: string;
  last_message_at: string;
}

interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  text: string;
  inserted_at: string;
}

export default function useChat() {
  const supabase = useSupabaseClient();
  const session = useSession();
  const userId = session?.user?.id;

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // Fetch rooms and preload messages
  const fetchRooms = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data: roomsData, error: roomsError } = await supabase.rpc('get_user_chat_rooms', {});
    console.log('useChat: get_user_chat_rooms result', { roomsData, roomsError });
    if (roomsError) { setError(roomsError.message); setLoading(false); return; }
    setChatRooms(roomsData || []);
    await Promise.all(
      (roomsData || []).map(async (r: ChatRoom) => {
        const { data: msgs, error: msgErr } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('room_id', r.id)
          .order('inserted_at', { ascending: true });
        if (!msgErr) setMessages(prev => ({ ...prev, [r.id]: msgs }));
        else console.error('useChat: fetchRooms messages error for room', r.id, msgErr);
      })
    );
    setLoading(false);
  }, [userId, supabase]);
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Subscribe to new rooms
  useEffect(() => {
    if (!userId) return;
    const roomChannel = supabase
      .channel('public:chat_rooms')
      .on('postgres_changes', { schema: 'public', table: 'chat_rooms', event: 'INSERT' }, () => {
        fetchRooms();
      })
      .subscribe();
    return () => { supabase.removeChannel(roomChannel); };
  }, [supabase, userId, fetchRooms]);

  // Subscribe to new messages
  useEffect(() => {
    if (!userId) return;
    const msgChannel = supabase
      .channel('public:chat_messages')
      .on('postgres_changes', { schema: 'public', table: 'chat_messages', event: 'INSERT' }, (payload) => {
        console.log('useChat: new message payload', payload);
        const m = payload.new as Message;
        setMessages(prev => ({ ...prev, [m.room_id]: prev[m.room_id] ? [...prev[m.room_id], m] : [m] }));
        setChatRooms(prev => prev.map(r => r.id === m.room_id ? { ...r, last_message: m.text, last_message_at: m.inserted_at } : r));
      })
      .subscribe();
    return () => { supabase.removeChannel(msgChannel); };
  }, [supabase, userId]);

  // Create or fetch room and send a message
  async function sendMessageToUser(otherUserId: string, text: string) {
    if (!userId) { setError('Not authenticated'); return; }
    // get-or-create room
    const { data: roomData, error: roomErr } = await supabase.rpc('get_or_create_one_to_one_room', { user1: userId, user2: otherUserId });
    if (roomErr || !roomData?.length) { setError(roomErr?.message || 'Room error'); return; }
    const roomId = (roomData as ChatRoom[])[0].id;
    // insert message
    const { error: insertErr } = await supabase.from('chat_messages').insert({ room_id: roomId, sender_id: userId, text });
    if (insertErr) { setError(insertErr.message); return; }
    // refresh rooms so new 1:1 appears
    await fetchRooms();
  }  // Get or create a 1:1 chat room without sending message
  async function getOrCreateRoomWithUser(otherUserId: string): Promise<string | null> {
    if (!userId) {
      setError('Not authenticated');
      return null;
    }
    const { data: roomData, error: roomErr } = await supabase.rpc(
      'get_or_create_one_to_one_room',
      { user1: userId, user2: otherUserId }
    );
    if (roomErr || !roomData?.length) {
      setError(roomErr?.message || 'Room error');
      return null;
    }
    const roomId = (roomData as ChatRoom[])[0].id;
    // Refresh rooms to update the UI
    await fetchRooms();
    return roomId;
  }

  // Send message to existing room
  async function sendMessageToRoom(roomId: string, text: string): Promise<boolean> {
    if (!userId) {
      setError('Not authenticated');
      return false;
    }
    const { error: insertErr } = await supabase
      .from('chat_messages')
      .insert({ room_id: roomId, sender_id: userId, text });
    if (insertErr) {
      setError(insertErr.message);
      return false;
    }
    return true;
  }

  return { chatRooms, messages, sendMessageToUser, sendMessageToRoom, getOrCreateRoomWithUser, loading, error, userId };
}
