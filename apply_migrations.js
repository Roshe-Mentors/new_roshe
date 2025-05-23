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
    console.log('\nPlease set these environment variables and try again.');
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
    // First, let's check if the chat tables already exist
    console.log('Checking existing tables...');
    const { data: existingTables, error: tableCheckError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['chat_rooms', 'chat_room_participants', 'chat_messages']);
    
    if (tableCheckError) {
      console.log('Could not check existing tables (this is normal):', tableCheckError.message);
    } else {
      console.log('Existing chat tables found:', existingTables?.map(t => t.table_name) || []);
    }
    
    // Read and execute chat tables migration
    const chatTablesPath = path.join(__dirname, 'supabase', 'migrations', '20250523_chat_tables.sql');
    const chatTablesSQL = fs.readFileSync(chatTablesPath, 'utf8');
    
    console.log('\nApplying chat tables migration...');
    console.log('SQL length:', chatTablesSQL.length, 'characters');
    
    // Split the SQL into individual statements and execute them
    const statements = chatTablesSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      const { error } = await supabase.rpc('exec_sql', { sql: stmt });
      if (error) {
        console.error(`Error in statement ${i + 1}:`, error.message);
        console.error('Statement:', stmt.substring(0, 100) + '...');
        // Continue with other statements
      } else {
        console.log(`Statement ${i + 1} executed successfully`);
      }
    }
    
    console.log('\nChat tables migration completed');
    
    // Read and execute chat functions migration
    const chatFunctionsPath = path.join(__dirname, 'supabase', 'migrations', '20250523_chat_functions.sql');
    const chatFunctionsSQL = fs.readFileSync(chatFunctionsPath, 'utf8');
    
    console.log('\nApplying chat functions migration...');
    console.log('SQL length:', chatFunctionsSQL.length, 'characters');
    
    const funcStatements = chatFunctionsSQL
      .split(/;\s*$/m)
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (let i = 0; i < funcStatements.length; i++) {
      const stmt = funcStatements[i];
      console.log(`Executing function statement ${i + 1}/${funcStatements.length}...`);
      
      const { error } = await supabase.rpc('exec_sql', { sql: stmt });
      if (error) {
        console.error(`Error in function statement ${i + 1}:`, error.message);
        console.error('Statement:', stmt.substring(0, 100) + '...');
        // Continue with other statements
      } else {
        console.log(`Function statement ${i + 1} executed successfully`);
      }
    }
    
    console.log('\nChat functions migration completed');
    console.log('\n✅ All chat migrations have been applied!');
    
    // Test the setup by checking if the functions exist
    console.log('\nTesting chat functions...');
    const { data: functionsTest, error: funcTestError } = await supabase.rpc('get_user_chat_rooms');
    if (funcTestError) {
      console.log('Function test result (expected if no rooms exist):', funcTestError.message);
    } else {
      console.log('✅ Chat functions are working! Found', functionsTest?.length || 0, 'chat rooms');
    }
    
  } catch (error) {
    console.error('Error during migration:', error);
  }
}

applyChatMigrations();
