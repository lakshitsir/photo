import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://reqpycnfjibegvwpkeeu.supabase.co',
  'EyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlcXB5Y25mamliZWd2d3BrZWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNDgwNDcsImV4cCI6MjA5MTgyNDA0N30.di8sdXxx6bwB_cIu69l_Sq6MVSKdi5uVHsxM-DuvaFc'
);
