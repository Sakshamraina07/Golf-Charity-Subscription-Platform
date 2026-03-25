import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServerComponentClient } from '@/lib/supabase/server'

const PRICE_IDS = {
  monthly: 'price_xxx',
  yearly:  'price_xxx',
}

export async function POST(req: NextRequest) {
  const supabase = await createServerComponentClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { plan, charityId, charityPercent } = await req.json()

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ 
      price: PRICE_IDS[plan as keyof typeof PRICE_IDS], 
      quantity: 1 
    }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscribed=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe?cancelled=true`,
    metadata: {
      user_id: session.user.id,
      charity_id: charityId,
      charity_percent: charityPercent.toString(),
      plan,
    },
  })

  return NextResponse.json({ url: checkoutSession.url })
}
