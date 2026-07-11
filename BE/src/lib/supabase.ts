// ============================================================================
// DATABASE CLIENTS — Shared instance untuk semua module (TypeScript)
// ============================================================================
// Menyediakan dua jalur koneksi:
//   1. pool (pg.Pool)   → Direct PostgreSQL connection untuk query kompleks.
//   2. supabase client  → @supabase/supabase-js untuk fitur Auth & Storage.
// ============================================================================

import pg from 'pg';
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// 1. PostgreSQL Direct Connection Pool (pg)
//    Digunakan untuk query SQL mentah, transaksi kompleks, dan pooling.
// ---------------------------------------------------------------------------

const connectionString: string =
  process.env.DATABASE_URL ||
  'postgresql://postgres.pwamtywehxnhjhfkvdwa:Alief%20Satrio@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true';

export const pool = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 15000,
  max: 5, // kurangi ke 5 agar tidak terlalu banyak koneksi gagal
});

pool.on('error', (err: Error) => {
  console.error('[POOL] ❌ Unexpected error on idle database client:', err.message);
});

// ---------------------------------------------------------------------------
// 2. Supabase JS Client — untuk Auth & Storage
// ---------------------------------------------------------------------------
const supabaseUrl: string = process.env.SUPABASE_URL ?? '';
const supabaseKey: string = process.env.SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '[SUPABASE] SUPABASE_URL dan/atau SUPABASE_ANON_KEY belum diisi — Supabase client tidak aktif.'
  );
}

const supabaseClient = createClient(supabaseUrl, supabaseKey);

export default supabaseClient;
