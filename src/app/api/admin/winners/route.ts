import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createAdminClient()

  const { data: winners, error } = await supabase
    .from('winners')
    .select(`
      *,
      profiles:user_id (full_name, email),
      draws:draw_id (month, winning_numbers)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ winners })
}

export async function PATCH(req: Request) {
  const supabase = createAdminClient()
  const body = await req.json()
  const { id, verification_status, payment_status, notes } = body

  if (!id) {
    return NextResponse.json({ error: 'Winner ID is required' }, { status: 400 })
  }

  const updates: Record<string, string> = {}
  if (verification_status) updates.verification_status = verification_status
  if (payment_status) updates.payment_status = payment_status
  if (notes !== undefined) updates.notes = notes

  const { error } = await supabase
    .from('winners')
    .update(updates)
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
