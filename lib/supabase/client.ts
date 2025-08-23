import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zlxdgosmhxjirkcnlrrq.supabase.co"
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpseGRnb3NtaHhqaXJrY25scnJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NzgzMDAsImV4cCI6MjA3MTU1NDMwMH0.UhcEhR5FEFpVMbifXyFM717dnNIEQELAnKInxx4hQZQ"

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
