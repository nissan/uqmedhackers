import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export async function logActivity(action: string, details: string) {
  const supabase = createClientComponentClient()
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('activity_logs').insert({
        user_id: user.id,
        user_email: user.email,
        action,
        details,
      })
    }
  } catch (error) {
    console.error('Error logging activity:', error)
  }
} 