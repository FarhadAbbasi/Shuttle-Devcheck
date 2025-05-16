import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nazwjoeruujlkqvduqzn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hendqb2VydXVqbGtxdmR1cXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNjU4NTAsImV4cCI6MjA2MDY0MTg1MH0.fZDxWJRvbU3Qwl0mXAqMVTmvU62kLTujQQi3FIVVt8Y'

    // const supabaseUrl: string = process.env.SUPABASE_URL ? process.env.SUPABASE_URL : '';
    // const supabaseKey: string = process.env.SUPABASE_KEY ? process.env.SUPABASE_KEY : '';

console.log('sypabase URL :', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
