import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ikawqjkplqvjhwybzcqd.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_iKPqZl7MK_QYJqqlZztUlg_3xbk0d7E";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
