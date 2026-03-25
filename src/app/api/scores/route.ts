import { createServerComponentClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { validateScore } from '@/lib/scores'

export async function POST(req: Request) {
  const supabase = await createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { score, playedAt } = body

  if (!validateScore(score)) {
    return NextResponse.json({ error: 'Score must be between 1 and 45' }, { status: 400 })
  }

  if (!playedAt) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('scores')
    .insert({
      user_id: user.id,
      score,
      played_at: playedAt,
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function GET() {
  const supabase = await createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: scores, error } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', user.id)
    .order('played_at', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ scores })
}
