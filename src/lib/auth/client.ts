import { createClient } from "@/lib/supabase/client"

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const supabase = createClient()

  try {
    const { data: { session } } = await supabase.auth.getSession()

    if (session?.access_token) {
      return {
        'Authorization': `Bearer ${session.access_token}`
      }
    }

    return {}
  } catch (error) {
    console.error('Error getting auth headers:', error)
    return {}
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const supabase = createClient()

  try {
    const { data: { session } } = await supabase.auth.getSession()
    return !!session
  } catch (error) {
    console.error('Error checking authentication:', error)
    return false
  }
}