import { createAdminClient } from './supabase/server'

export async function runDrawSimulation(month: string) {
  const supabase = createAdminClient()

  
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('user_id, mock_amount')
    .eq('status', 'active')

  if (!subscriptions || subscriptions.length === 0) {
    return { error: 'No active subscriptions found.' }
  }

  const totalSubscribers = subscriptions.length
  const totalAmount = subscriptions.reduce((acc, sub) => acc + Number(sub.mock_amount || 0), 0)

  
  const prizePool = totalAmount * 0.5

  
  
  const { data: lastDraw } = await supabase
    .from('draws')
    .select('jackpot_rollover')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const carryOver = lastDraw?.jackpot_rollover || 0

  const jackpotPool = (prizePool * 0.4) + carryOver
  const match4Pool = prizePool * 0.35
  const match3Pool = prizePool * 0.25

  
  const numbers = new Set<number>()
  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1)
  }
  const winningNumbers = Array.from(numbers).sort((a, b) => a - b)

  
  const participants: { userId: string, scores: number[] }[] = []

  for (const sub of subscriptions) {
    const { data: scoresData } = await supabase
      .from('scores')
      .select('score')
      .eq('user_id', sub.user_id)
      .order('played_at', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(5)

    if (scoresData && scoresData.length === 5) {
      participants.push({
        userId: sub.user_id,
        scores: scoresData.map(s => s.score)
      })
    }
  }

  
  const match5Winners: string[] = []
  const match4Winners: string[] = []
  const match3Winners: string[] = []

  const winNumbersSet = new Set(winningNumbers)

  participants.forEach(p => {
    let matchCount = 0
    p.scores.forEach(s => {
      if (winNumbersSet.has(s)) matchCount++
    })

    if (matchCount === 5) match5Winners.push(p.userId)
    else if (matchCount === 4) match4Winners.push(p.userId)
    else if (matchCount === 3) match3Winners.push(p.userId)
  })

  const newRollover = match5Winners.length === 0 ? jackpotPool : 0

  return {
    month,
    status: 'simulated',
    draw_type: 'random',
    winningNumbers,
    pools: {
      totalSubscribers,
      jackpotPool,
      match4Pool,
      match3Pool,
      jackpotRollover: newRollover
    },
    participants,
    winners: {
      match5: match5Winners,
      match4: match4Winners,
      match3: match3Winners
    }
  }
}
