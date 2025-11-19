// src/seed.ts
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // <-- IMPORTANT

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'SUPABASE_URL and SUPABASE_SERVICE_KEY must be defined in your .env file',
  );
}

// NOTE: We use the SERVICE_ROLE_KEY here to bypass RLS for seeding.
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const usersToCreate = [
  { email: 'john.doe@example.com', password: 'password123', name: 'John Doe' },
  { email: 'jane.smith@example.com', password: 'password123', name: 'Jane Smith' },
  { email: 'peter.jones@example.com', password: 'password123', name: 'Peter Jones' },
  { email: 'susan.williams@example.com', password: 'password123', name: 'Susan Williams' },
  { email: 'michael.brown@example.com', password: 'password123', name: 'Michael Brown' },
  { email: 'linda.davis@example.com', password: 'password123', name: 'Linda Davis' },
  { email: 'robert.miller@example.com', password: 'password123', name: 'Robert Miller' },
  { email: 'patricia.wilson@example.com', password: 'password123', name: 'Patricia Wilson' },
  { email: 'james.moore@example.com', password: 'password123', name: 'James Moore' },
  { email: 'barbara.taylor@example.com', password: 'password123', name: 'Barbara Taylor' },
];

async function main() {
  console.log('Starting to seed users and contacts...');

  // Delete all existing contacts
  const { error: deleteError } = await supabase.from('contacts').delete().neq('id', -1);
  if (deleteError) {
    console.error('Error deleting contacts:', deleteError.message);
    return;
  }
  console.log('Deleted all existing contacts.');

  const { data, error: listUsersError } = await supabase.auth.admin.listUsers();
  if (listUsersError) {
    console.error('Error listing users:', listUsersError.message);
    return;
  }

  const users = data.users || [];

  for (const userData of usersToCreate) {
    let userId: string;

    const existingUser = users.find(u => u.email === userData.email);

    if (existingUser) {
      userId = existingUser.id;
      console.log(`User ${userData.email} already exists.`);
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true, // Automatically confirm user's email
      });

      if (authError) {
        console.error(`Error creating user ${userData.email}:`, authError.message);
        continue;
      }
      userId = authData.user.id;
      console.log(`Successfully created user: ${authData.user.email}`);
    }

    const { error: contactError } = await supabase
      .from('contacts')
      .insert({
        user_id: userId,
        name: userData.name,
        avatar_url: `https://i.pravatar.cc/150?u=${userId}`,
      });

    if (contactError) {
      console.error(`Error creating contact for ${userData.email}:`, contactError.message);
    } else {
      console.log(`Successfully created contact for ${userData.email}`);
    }
  }

  console.log('Seeding complete.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
