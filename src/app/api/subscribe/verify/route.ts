import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, createServerComponentClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerComponentClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ active: false })

    const adminClient = createAdminClient()

    // Check if already active
    const { data: sub } = await adminClient
      .from('subscriptions')
      .select('status')
      .eq('user_id', session.user.id)
      .single()

    if (sub?.status === 'active') {
      return NextResponse.json({ active: true })
    }

    // Try to activate using Stripe session ID
    const sessionId = req.nextUrl.searchParams.get('session_id')
    if (sessionId) {
      const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId)
      if (checkoutSession.payment_status === 'paid') {
        const { plan, charity_id, charity_percent } = checkoutSession.metadata || {}
        const now = new Date()
        const expiresAt = new Date(now)
        plan === 'monthly'
          ? expiresAt.setMonth(expiresAt.getMonth() + 1)
          : expiresAt.setFullYear(expiresAt.getFullYear() + 1)

        await adminClient.from('subscriptions').upsert({
          user_id: session.user.id,
          plan: plan || 'monthly',
          status: 'active',
          started_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
          mock_amount: plan === 'monthly' ? 9.99 : 99.99,
          charity_id: charity_id || null,
          charity_percent: parseInt(charity_percent || '10'),
          stripe_subscription_id: checkoutSession.subscription as string,
        }, { onConflict: 'user_id' })

        return NextResponse.json({ active: true })
      }
    }

    return NextResponse.json({ active: false })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ active: false })
  }
}