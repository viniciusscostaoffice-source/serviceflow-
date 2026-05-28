import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://nhmgzhdjwyddgnvjeptm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'sb_publishable_bK4Szcigp1dGUD88_qECbQ_GfVJXsI7';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
