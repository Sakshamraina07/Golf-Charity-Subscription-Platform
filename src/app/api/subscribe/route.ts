import { createServerComponentClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = await createServerComponentClient()

  
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { plan, charityId, charityPercent } = body

  if (!['monthly', 'yearly'].includes(plan)) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  if (charityPercent < 10 || charityPercent > 100) {
    return NextResponse.json({ error: 'Invalid charity percent' }, { status: 400 })
  }

  const mockAmount = plan === 'monthly' ? 9.99 : 99.99
  const now = new Date()
  const expiresAt = new Date()
  
  if (plan === 'monthly') {
    expiresAt.setMonth(expiresAt.getMonth() + 1)
  } else {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1)
  }

  
  const { error } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: user.id,
      plan,
      status: 'active',
      started_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      mock_amount: mockAmount,
      charity_percent: charityPercent,
      charity_id: charityId
    }, { onConflict: 'user_id' })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}