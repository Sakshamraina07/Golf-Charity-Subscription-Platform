import { createAdminClient } from '@/lib/supabase/server'
import { runDrawSimulation } from '@/lib/draw'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const { month, draw_type } = body

  if (!month) {
    return NextResponse.json({ error: 'Month is required' }, { status: 400 })
  }

  try {
    const result = await runDrawSimulation(month, draw_type)

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    const supabase = createAdminClient()

    
    const { data: draw, error: drawError } = await supabase
      .from('draws')
      .upsert({
        month,
        status: 'simulated',
        draw_type: draw_type || 'random',
        winning_numbers: result.winningNumbers,
        jackpot_pool: result.pools.jackpotPool,
        match4_pool: result.pools.match4Pool,
        match3_pool: result.pools.match3Pool,
        match2_pool: result.pools.match2Pool,
        jackpot_rollover: result.pools.jackpotRollover,
        total_subscribers: result.pools.totalSubscribers,
      }, { onConflict: 'month' })
      .select()
      .single()

    if (drawError) {
      return NextResponse.json({ error: drawError.message }, { status: 500 })
    }

    // 4. Record entry for participants & delete old winners (rerun protection)
    await supabase.from('winners').delete().eq('draw_id', draw.id)

    for (const p of result.participants) {
      await supabase
        .from('draw_entries')
        .upsert({
          draw_id: draw.id,
          user_id: p.userId,
          scores: p.scores,
        }, { onConflict: 'draw_id,user_id' })
    }

    
    const allWinners = [
      ...result.winners.match5.map(uid => ({ userId: uid, matchType: 'match_5', pool: result.pools.jackpotPool, count: result.winners.match5.length })),
      ...result.winners.match4.map(uid => ({ userId: uid, matchType: 'match_4', pool: result.pools.match4Pool, count: result.winners.match4.length })),
      ...result.winners.match3.map(uid => ({ userId: uid, matchType: 'match_3', pool: result.pools.match3Pool, count: result.winners.match3.length })),
      ...result.winners.match2.map(uid => ({ userId: uid, matchType: 'match_2', pool: result.pools.match2Pool, count: result.winners.match2.length })),
    ]

    for (const w of allWinners) {
      await supabase
        .from('winners')
        .insert({
          draw_id: draw.id,
          user_id: w.userId,
          match_type: w.matchType,
          prize_amount: w.pool / w.count,
          matched_numbers: result.winningNumbers,
        })
    }

    return NextResponse.json({
      draw,
      winningNumbers: result.winningNumbers,
      winners: result.winners,
      pools: result.pools,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
