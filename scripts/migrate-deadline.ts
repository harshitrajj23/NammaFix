import { Client } from 'pg'
import * as dotenv from 'dotenv'
import path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function migrate() {
  const password = process.env.SUPABASE_DB_PASSWORD
  
  if (!password) {
    console.error('SUPABASE_DB_PASSWORD not found in .env.local')
    process.exit(1)
  }

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
    console.log('Connecting to Supabase...')
    await client.connect()
    
    console.log('Adding deadline columns to complaints table...')
    await client.query(`
      ALTER TABLE public.complaints 
      ADD COLUMN IF NOT EXISTS deadline_at TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS officer_email TEXT,
      ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT false;
    `)
    
    console.log('Migration completed successfully.')
  } catch (error) {
    console.error('Error during migration:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

migrate()
