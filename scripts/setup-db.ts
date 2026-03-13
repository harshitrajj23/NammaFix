import { Client } from 'pg'
import * as dotenv from 'dotenv'
import path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function setup() {
  const password = process.env.SUPABASE_DB_PASSWORD
  const projectRef = 'nldflvkajsdbkbmldoyq'
  
  if (!password) {
    console.error('SUPABASE_DB_PASSWORD not found in .env.local')
    process.exit(1)
  }

  // Trying port 6543 (Transaction Pooler) which is often more reliable for this user format
  const client = new Client({
    host: 'aws-0-us-east-1.pooler.supabase.com',
    port: 6543, 
    database: 'postgres',
    user: `postgres.nldflvkajsdbkbmldoyq`,
    password: password,
    ssl: {
      rejectUnauthorized: false
    }
  })

  try {
    console.log('Connecting to Supabase via Pooler...')
    await client.connect()
    
    console.log('Checking for profiles table...')
    const res = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE  table_schema = 'public'
        AND    table_name   = 'profiles'
      );
    `)

    if (!res.rows[0].exists) {
      console.log('Creating profiles table...')
      
      await client.query(`
        CREATE TABLE public.profiles (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          full_name TEXT NOT NULL,
          email TEXT NOT NULL,
          mobile_number TEXT,
          aadhaar_number TEXT,
          role TEXT NOT NULL CHECK (role IN ('citizen', 'government', 'media')),
          government_identity TEXT,
          media_organization TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );
      `)

      await client.query(`ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;`)
      
      console.log('Creating RLS policies...')
      await client.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public profiles are viewable by everyone.') THEN
                CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own profile.') THEN
                CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile.') THEN
                CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);
            END IF;
        END
        $$;
      `)
      
      console.log('Setup completed successfully.')
    } else {
      console.log('Profiles table already exists.')
    }
  } catch (error) {
    console.error('Error during setup:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

setup()
