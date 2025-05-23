const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

async function applyChatMigrations() {
  console.log('Starting chat migrations...');
  
  // Check if we have the required environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing required environment variables:');
    console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
    console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Set' : 'Missing');
    return;
  }
  
  // Create admin client
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
  
  try {
    // Read chat tables migration
    const chatTablesPath = path.join(__dirname, 'supabase', 'migrations', '20250523_chat_tables.sql');
    const chatTablesSQL = fs.readFileSync(chatTablesPath, 'utf8');
    
    console.log('Applying chat tables migration...');
    const { data: tablesData, error: tablesError } = await supabase.rpc('exec_sql', {
      sql: chatTablesSQL
    });
    
    if (tablesError) {
      console.error('Error applying chat tables migration:', tablesError);
      return;
    }
    
    console.log('Chat tables migration applied successfully');
    
    // Read chat functions migration
    const chatFunctionsPath = path.join(__dirname, 'supabase', 'migrations', '20250523_chat_functions.sql');
    const chatFunctionsSQL = fs.readFileSync(chatFunctionsPath, 'utf8');
    
    console.log('Applying chat functions migration...');
    const { data: functionsData, error: functionsError } = await supabase.rpc('exec_sql', {
      sql: chatFunctionsSQL
    });
    
    if (functionsError) {
      console.error('Error applying chat functions migration:', functionsError);
      return;
    }
    
    console.log('Chat functions migration applied successfully');
    console.log('All chat migrations completed!');
    
  } catch (error) {
    console.error('Error reading migration files:', error);
  }
}

applyChatMigrations();
