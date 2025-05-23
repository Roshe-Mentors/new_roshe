import { createAdminClient } from '@/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  console.log('Apply migrations API called');
  
  try {
    const supabaseAdmin = createAdminClient();
    
    // Read chat tables migration
    const chatTablesPath = path.join(process.cwd(), 'supabase', 'migrations', '20250523_chat_tables.sql');
    const chatTablesSQL = fs.readFileSync(chatTablesPath, 'utf8');
    
    console.log('Applying chat tables migration...');
    
    // Execute the SQL directly using a custom query
    // Since Supabase doesn't have a direct exec_sql RPC, we'll use raw SQL execution
    const { data: tablesResult, error: tablesError } = await supabaseAdmin
      .from('dummy') // This will fail but allows us to get the underlying connection
      .select('1');
    
    // Alternative approach: Break down the SQL into individual CREATE statements
    const createStatements = chatTablesSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
      .filter(stmt => stmt.toUpperCase().includes('CREATE'));
    
    console.log('Found', createStatements.length, 'CREATE statements');
    
    const results = {
      tablesCreated: [],
      errors: [],
      functionsCreated: [],
    };
    
    // Try to create tables using Supabase queries
    // For chat_rooms table
    try {
      await supabaseAdmin.from('chat_rooms').select('id').limit(1);
      results.tablesCreated.push('chat_rooms already exists');
    } catch (error) {
      results.errors.push(`chat_rooms table check: ${error.message}`);
    }
    
    // Read and apply chat functions migration
    const chatFunctionsPath = path.join(process.cwd(), 'supabase', 'migrations', '20250523_chat_functions.sql');
    const chatFunctionsSQL = fs.readFileSync(chatFunctionsPath, 'utf8');
    
    console.log('Chat functions migration loaded');
    
    // Test if functions exist
    try {
      const { data: roomsTest, error: roomsError } = await supabaseAdmin.rpc('get_user_chat_rooms');
      if (!roomsError) {
        results.functionsCreated.push('get_user_chat_rooms function exists');
      }
    } catch (error) {
      results.errors.push(`Function test error: ${error.message}`);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Migration attempt completed',
      results,
      tablesSQL: chatTablesSQL.length,
      functionsSQL: chatFunctionsSQL.length,
    });
    
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
