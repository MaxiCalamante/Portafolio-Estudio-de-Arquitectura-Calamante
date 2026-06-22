import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

export const supabaseConfigured = Boolean(supabaseUrl && supabaseKey)

export const supabase: SupabaseClient | null = supabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

export function publicImageUrl(storagePath: string | null | undefined) {
  if (!storagePath || !supabase) return null
  return supabase.storage.from('project-images').getPublicUrl(storagePath).data.publicUrl
}
