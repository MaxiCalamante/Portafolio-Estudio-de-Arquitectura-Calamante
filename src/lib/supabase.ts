import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

export const supabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  !supabaseUrl.includes('your-project-ref') &&
  !supabaseKey.includes('your_key')
)

export const supabase: SupabaseClient | null = supabaseConfigured
  ? createClient(supabaseUrl!, supabaseKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

export function publicImageUrl(storagePath: string | null | undefined) {
  if (!storagePath) return null
  if (storagePath.startsWith('/') || storagePath.startsWith('http://') || storagePath.startsWith('https://')) {
    return storagePath
  }
  if (!supabase) return null
  return supabase.storage.from('project-images').getPublicUrl(storagePath).data.publicUrl
}
