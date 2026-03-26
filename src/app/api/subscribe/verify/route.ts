import { NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) return NextResponse.json({ active: false })

  const { data } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', session.user.id)
    .single()

  return NextResponse.json({ active: data?.status === 'active' })
}
