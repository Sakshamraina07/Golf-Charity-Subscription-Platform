import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

export async function GET() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) return NextResponse.json({ active: false })

  const adminClient = createAdminClient()
  const { data } = await adminClient
    .from('subscriptions')
    .select('status')
    .eq('user_id', session.user.id)
    .single()

  return NextResponse.json({ active: data?.status === 'active' })
}