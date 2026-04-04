import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createAdminClient()

  // Step 1: Fetch all profiles (this should ALWAYS work)
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, role, created_at')
    .order('created_at', { ascending: false })

  if (profileError) {
    console.error('Profiles fetch error:', profileError)
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  // Step 2: Fetch all subscriptions separately (won't crash if FK is missing)
  const { data: subscriptions, error: subError } = await supabase
    .from('subscriptions')
    .select('user_id, plan, status, expires_at, charity_percent')

  if (subError) {
    console.error('Subscriptions fetch error (non-fatal):', subError)
  }

  // Step 3: Merge them in code — bulletproof, no join needed
  const users = (profiles || []).map(profile => {
    const userSubs = (subscriptions || []).filter(s => s.user_id === profile.id)
    return {
      ...profile,
      subscriptions: userSubs.length > 0 ? userSubs : null
    }
  })

  return NextResponse.json({ users })
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
