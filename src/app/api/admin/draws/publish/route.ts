import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = createAdminClient()
  const body = await req.json()
  const { drawId } = body

  if (!drawId) {
    return NextResponse.json({ error: 'Draw ID is required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('draws')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
    })
    .eq('id', drawId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
