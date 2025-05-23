import { createAdminClient } from '@/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('Test chat functions API called');
  
  try {
    const supabaseAdmin = createAdminClient();
    
    const results = {
      functions: [],
      tests: [],
      errors: [],
    };
    
    // Test get_user_chat_rooms function
    try {
      const { data: roomsData, error: roomsError } = await supabaseAdmin.rpc('get_user_chat_rooms');
      
      if (!roomsError) {
        results.functions.push('get_user_chat_rooms - EXISTS and working');
        results.tests.push(`Found ${roomsData?.length || 0} chat rooms`);
      } else {
        results.functions.push(`get_user_chat_rooms - ERROR: ${roomsError.message}`);
      }
    } catch (error) {
      results.functions.push(`get_user_chat_rooms - EXCEPTION: ${error.message}`);
    }
    
    // Test get_or_create_one_to_one_room function with dummy IDs
    try {
      const dummyUserId1 = '00000000-0000-0000-0000-000000000001';
      const dummyUserId2 = '00000000-0000-0000-0000-000000000002';
      
      const { data: roomData, error: roomError } = await supabaseAdmin.rpc('get_or_create_one_to_one_room', {
        user1: dummyUserId1,
        user2: dummyUserId2
      });
      
      if (!roomError) {
        results.functions.push('get_or_create_one_to_one_room - EXISTS and working');
        results.tests.push(`Room creation/fetch test successful`);
      } else {
        results.functions.push(`get_or_create_one_to_one_room - ERROR: ${roomError.message}`);
      }
    } catch (error) {
      results.functions.push(`get_or_create_one_to_one_room - EXCEPTION: ${error.message}`);
    }
    
    // Check table structures
    try {
      const { data: chatRoomsStructure, error: structError } = await supabaseAdmin
        .from('chat_rooms')
        .select('*')
        .limit(1);
      
      if (!structError) {
        results.tests.push('chat_rooms table structure is accessible');
      } else {
        results.errors.push(`chat_rooms structure check: ${structError.message}`);
      }
    } catch (error) {
      results.errors.push(`chat_rooms structure error: ${error.message}`);
    }
    
    return NextResponse.json({
      success: true,
      results,
    });
    
  } catch (error) {
    console.error('Function test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
