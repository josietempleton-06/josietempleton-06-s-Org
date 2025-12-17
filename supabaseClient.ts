
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rygpguasttatxazdwypn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5Z3BndWFzdHRhdHhhemR3eXBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMDg3NTEsImV4cCI6MjA4MTU4NDc1MX0.9OIvxaEpYaaRqgESDHwFeRS6LKvPH0Vn2Mmsse13Sos';

export const supabase = createClient(supabaseUrl, supabaseKey);
