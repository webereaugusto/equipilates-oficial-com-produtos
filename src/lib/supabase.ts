import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Valores padrão para build (serão substituídos em runtime pelo Vercel)
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://hijmbsxcvcugnmkvldgl.supabase.co';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhpam1ic3hjdmN1Z25ta3ZsZGdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2Nzk1MzUsImV4cCI6MjA4NDI1NTUzNX0.Q4Hy-K8RxhVDCarj_ojD5ILb11iO4Jk7KC-5fYlrTh0';

// Cliente público para uso no frontend
export const supabase: SupabaseClient<Database> = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Cliente com service role para operações administrativas (server-side only)
export const getServiceSupabase = () => {
  const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    console.warn('Missing SUPABASE_SERVICE_ROLE_KEY - using anon client');
    return supabase;
  }
  return createClient<Database>(supabaseUrl, serviceRoleKey);
};
