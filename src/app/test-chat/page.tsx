'use client';
import React, { useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

export default function ChatTestPage() {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const testChatFunctionality = async () => {
    setLoading(true);
    const testResults: any = { tables: [], functions: [], errors: [] };

    // Test table access
    const tables = ['chat_rooms', 'chat_room_participants', 'chat_messages', 'mentors', 'mentees'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (!error) {
          testResults.tables.push(`✅ ${table}: ${data?.length || 0} records found`);
        } else {
          testResults.tables.push(`❌ ${table}: ${error.message}`);
        }
      } catch (error) {
        testResults.tables.push(`❌ ${table}: ${error.message}`);
      }
    }

    // Test chat functions
    try {
      const { data, error } = await supabase.rpc('get_user_chat_rooms');
      if (!error) {
        testResults.functions.push(`✅ get_user_chat_rooms: Found ${data?.length || 0} rooms`);
      } else {
        testResults.functions.push(`❌ get_user_chat_rooms: ${error.message}`);
      }
    } catch (error) {
      testResults.functions.push(`❌ get_user_chat_rooms: ${error.message}`);
    }

    // Test room creation function
    if (session?.user?.id) {
      try {
        const dummyUserId = '00000000-0000-0000-0000-000000000001';
        const { data, error } = await supabase.rpc('get_or_create_one_to_one_room', {
          user1: session.user.id,
          user2: dummyUserId
        });
        if (!error) {
          testResults.functions.push(`✅ get_or_create_one_to_one_room: Working`);
        } else {
          testResults.functions.push(`❌ get_or_create_one_to_one_room: ${error.message}`);
        }
      } catch (error) {
        testResults.functions.push(`❌ get_or_create_one_to_one_room: ${error.message}`);
      }
    } else {
      testResults.functions.push(`❌ Not authenticated - cannot test room creation`);
    }

    setResults(testResults);
    setLoading(false);
  };

  useEffect(() => {
    if (session) {
      testChatFunctionality();
    }
  }, [session]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Chat System Test</h1>
      
      {!session ? (
        <div className="bg-yellow-100 p-4 rounded">
          <p>Please log in to test chat functionality</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded">
            <p><strong>User ID:</strong> {session.user.id}</p>
            <p><strong>Email:</strong> {session.user.email}</p>
          </div>

          {loading ? (
            <p>Testing chat functionality...</p>
          ) : (
            <>
              <div>
                <h2 className="text-xl font-semibold mb-3">Table Access Test</h2>
                <div className="bg-gray-50 p-4 rounded">
                  {results.tables?.map((result: string, index: number) => (
                    <div key={index} className="mb-1">{result}</div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Function Test</h2>
                <div className="bg-gray-50 p-4 rounded">
                  {results.functions?.map((result: string, index: number) => (
                    <div key={index} className="mb-1">{result}</div>
                  ))}
                </div>
              </div>

              {results.errors?.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">Errors</h2>
                  <div className="bg-red-50 p-4 rounded">
                    {results.errors?.map((error: string, index: number) => (
                      <div key={index} className="mb-1">{error}</div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <button
            onClick={testChatFunctionality}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Run Test Again'}
          </button>
        </div>
      )}
    </div>
  );
}
