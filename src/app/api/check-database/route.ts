import { createAdminClient } from '@/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('Database check API called');
  
  try {
    const supabaseAdmin = createAdminClient();
    
    // Check what tables exist in the public schema
    const results = {
      tables: [],
      functions: [],
      errors: [],
    };
    
    // Try to check if chat tables exist by querying them
    const chatTables = ['chat_rooms', 'chat_room_participants', 'chat_messages'];
    
    for (const tableName of chatTables) {
      try {
        const { data, error } = await supabaseAdmin
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (!error) {
          results.tables.push(`${tableName} - EXISTS`);
        } else {
          results.tables.push(`${tableName} - NOT FOUND: ${error.message}`);
        }
      } catch (error) {
        results.tables.push(`${tableName} - ERROR: ${error.message}`);
      }
    }
    
    // Check if chat functions exist
    const chatFunctions = ['get_user_chat_rooms', 'get_or_create_one_to_one_room'];
    
    for (const funcName of chatFunctions) {
      try {
        const { data, error } = await supabaseAdmin.rpc(funcName, {});
        
        if (!error || error.message.includes('argument')) {
          results.functions.push(`${funcName} - EXISTS`);
        } else {
          results.functions.push(`${funcName} - NOT FOUND: ${error.message}`);
        }
      } catch (error) {
        results.functions.push(`${funcName} - ERROR: ${error.message}`);
      }
    }
    
    // Check existing tables in public schema
    try {
      const { data: tablesList, error: tablesError } = await supabaseAdmin
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      if (!tablesError && tablesList) {
        results.existingTables = tablesList.map(t => t.table_name);
      } else {
        results.errors.push(`Could not list tables: ${tablesError?.message}`);
      }
    } catch (error) {
      results.errors.push(`Error listing tables: ${error.message}`);
    }
    
    return NextResponse.json({
      success: true,
      results,
    });
    
  } catch (error) {
    console.error('Database check error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
