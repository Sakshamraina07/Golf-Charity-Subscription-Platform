import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServerComponentClient } from '@/lib/supabase/server'

const PRICE_IDS = {
  monthly: 'price_1TF800HwHQD9c5OvUIF4vTvC',
  yearly: 'price_1TF811HwHQD9c5OvSHFCOAMa',
}

export async function POST(req: NextRequest) {
  const supabase = await createServerComponentClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { plan, charityId, charityPercent } = await req.json()

  if (!['monthly', 'yearly'].includes(plan)) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: PRICE_IDS[plan as 'monthly' | 'yearly'], quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe?cancelled=true`,
      metadata: {
        user_id: session.user.id,
        charity_id: charityId,
        charity_percent: String(charityPercent),
        plan,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
