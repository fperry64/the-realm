import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://njtpmuhajftirkeywbzy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qdHBtdWhhamZ0aXJrZXl3Ynp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MDY2OTQsImV4cCI6MjA5NjI4MjY5NH0.TQcWl9n0VBFBxJa8B3z6RRh4HxvDpa6boFxgfZSh-DI'

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)