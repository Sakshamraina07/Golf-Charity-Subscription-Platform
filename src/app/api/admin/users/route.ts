import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createAdminClient()

  // Try fetching users with their subscriptions
  const { data: users, error } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      role,
      created_at,
      subscriptions (
        plan,
        status,
        expires_at,
        charity_percent
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Admin users fetch error:', error)
    // Updated fallback to still include subscriptions
    const { data: fallbackUsers, error: fallbackError } = await supabase
      .from('profiles')
      .select(`
        id, 
        full_name, 
        role, 
        created_at,
        subscriptions (
          plan,
          status,
          expires_at,
          charity_percent
        )
      `)
      .order('created_at', { ascending: false })

    if (fallbackError) {
      return NextResponse.json({ error: fallbackError.message }, { status: 500 })
    }
    
    return NextResponse.json({ users: fallbackUsers || [] })
  }

  return NextResponse.json({ users: users || [] })
}

export async function PATCH(req: Request) {
  const supabase = createAdminClient()
  const body = await req.json()
  const { userId, role } = body

  if (!userId || !['user', 'admin'].includes(role)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
