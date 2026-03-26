import { NextResponse } from 'next/server'
import { createAdminClient, createServerComponentClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createServerComponentClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return NextResponse.json({ active: false })

    const adminClient = createAdminClient()
    const { data } = await adminClient
      .from('subscriptions')
      .select('status')
      .eq('user_id', session.user.id)
      .single()

    return NextResponse.json({ active: data?.status === 'active' })
  } catch {
    return NextResponse.json({ active: false })
  }
}