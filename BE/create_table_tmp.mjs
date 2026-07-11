const SUPABASE_URL = 'https://pwamtywehxnhjhfkvdwa.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3YW10eXdlaHhuaGpoZmt2ZHdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MTg3MDksImV4cCI6MjA5ODI5NDcwOX0.Af17xSCCsCRJByC_IWgy0X7JYkleROHML7TlzlCA7t0';

const sql = `CREATE TABLE IF NOT EXISTS career_notes (
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
);`;

async function main() {
  // Try 1: via exec_sql RPC
  try {
    const r = await fetch(SUPABASE_URL + '/rest/v1/rpc/exec_sql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': ANON_KEY, 'Authorization': 'Bearer ' + ANON_KEY },
      body: JSON.stringify({ query: sql }),
    });
    const text = await r.text();
    console.log('exec_sql:', r.status, text.slice(0, 200));
  } catch(e) { console.log('exec_sql error:', e.message); }

  // Try 2: via pg_dump or introspection endpoint
  try {
    const r = await fetch(SUPABASE_URL + '/rest/v1/', {
      method: 'GET',
      headers: { 'apikey': ANON_KEY },
    });
    console.log('root:', r.status);
  } catch(e) { console.log('root error:', e.message); }

  // Try 3: use the Supabase client to create the table via raw query
  // Some Supabase projects have the pg_dump extension
  try {
    const r = await fetch(SUPABASE_URL + '/rest/v1/rpc/', {
      method: 'GET',
      headers: { 'apikey': ANON_KEY, 'Authorization': 'Bearer ' + ANON_KEY },
    });
    const t = await r.text();
    console.log('rpc list:', r.status, t.slice(0, 300));
  } catch(e) { console.log('rpc error:', e.message); }
  
  // Try 4: Check supabase client's from().select() for the table again
  // Maybe the schema cache needs to be refreshed
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(SUPABASE_URL, ANON_KEY);
  
  // First, try to query the table
  const { data, error } = await supabase.from('career_notes').select('count');
  console.log('Table check:', error ? error.message : 'EXISTS, count: ' + JSON.stringify(data));
}

main().then(() => process.exit(0));
