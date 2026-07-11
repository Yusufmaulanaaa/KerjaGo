// Using postgres.js which handles Supabase pooler better
import postgres from 'postgres';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pwamtywehxnhjhfkvdwa.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3YW10eXdlaHhuaGpoZmt2ZHdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MTg3MDksImV4cCI6MjA5ODI5NDcwOX0.Af17xSCCsCRJByC_IWgy0X7JYkleROHML7TlzlCA7t0';

const sql = postgres({
  host: 'aws-1-ap-southeast-2.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  username: 'postgres.pwamtywehxnhjhfkvdwa',
  password: 'Alief Satrio',
  ssl: false,
  max: 1,
  connection: 'transaction',
  idle_timeout: 10,
  max_lifetime: 30,
});

async function main() {
  try {
    console.log('Connecting with postgres.js...');
    const r = await sql`SELECT 1 as test`;
    console.log('Connected!', r[0]);
    
    await sql`
      CREATE TABLE IF NOT EXISTS career_notes (
        id_note SERIAL PRIMARY KEY,
        judul TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        kategori TEXT DEFAULT 'umum',
        konten TEXT NOT NULL,
        excerpt TEXT DEFAULT '',
        gambar TEXT DEFAULT '',
        penulis TEXT DEFAULT 'Admin',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    console.log('TABLE career_notes created!');
  } catch(e) {
    console.log('Error:', e.message || e);
    console.log('Detail:', e.description || e.stack?.slice(0, 200));
  } finally {
    process.exit(0);
  }
}
main();
