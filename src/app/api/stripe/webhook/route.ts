import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const { user_id, charity_id, charity_percent, plan } = session.metadata

    const supabase = createAdminClient()
    const now = new Date()
    const expiresAt = new Date(now)
    
    if (plan === 'monthly') {
      expiresAt.setMonth(expiresAt.getMonth() + 1)
    } else {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1)
    }

    await supabase.from('subscriptions').upsert({
      user_id,
      plan,
      status: 'active',
      started_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      mock_amount: plan === 'monthly' ? 9.99 : 99.99,
      charity_id,
      charity_percent: parseInt(charity_percent),
      stripe_subscription_id: session.subscription,
    }, { onConflict: 'user_id' })
  }

  return NextResponse.json({ received: true })
}
