import { createAdminClient } from './supabase/server'

export async function runDrawSimulation(month: string, drawType: string = 'random') {
  const supabase = createAdminClient()

  // 1. Get all active subscribers
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('user_id, mock_amount')
    .eq('status', 'active')

  if (!subscriptions || subscriptions.length === 0) {
    return { error: 'No active subscriptions found.' }
  }

  const totalSubscribers = subscriptions.length
  const totalAmount = subscriptions.reduce((acc, sub) => acc + Number(sub.mock_amount || 0), 0)

  // 2. Prize pool allocation (50% of total revenue)
  const prizePool = totalAmount * 0.5

  // 3. Roll-over from previous draw
  // Get latest PUBLISHED draw
  const { data: lastDraw } = await supabase
    .from('draws')
    .select('jackpot_rollover')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const carryOver = lastDraw?.jackpot_rollover || 0

  const jackpotPool = (prizePool * 0.4) + carryOver
  const match4Pool = prizePool * 0.35
  const match3Pool = prizePool * 0.25

  // 4. Collect participants and their scores
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

  // 5. Generate winning numbers based on draw type
  let winningNumbers: number[] = []

  if (drawType === 'algorithmic') {
    // Algorithmic (V2): Focus on frequency analysis of submitted scores
    const frequency: Record<number, number> = {}
    participants.forEach(p => {
      p.scores.forEach(s => {
        frequency[s] = (frequency[s] || 0) + 1
      })
    })

    // Sort numbers by frequency (with a bit of random salt for variety if frequencies are tied)
    const sortedByFreq = Object.keys(frequency)
      .map(Number)
      .sort((a, b) => (frequency[b] + Math.random()) - (frequency[a] + Math.random()))
    
    // Pick top 5 most common numbers (or top 3 + 2 random if not enough variety)
    winningNumbers = sortedByFreq.slice(0, 5).sort((a, b) => a - b)

    // Fallback if not enough participants/scores
    if (winningNumbers.length < 5) {
      const numbers = new Set<number>(winningNumbers)
      while (numbers.size < 5) {
        numbers.add(Math.floor(Math.random() * 45) + 1)
      }
      winningNumbers = Array.from(numbers).sort((a, b) => a - b)
    }
  } else {
    // Random (Classic)
    const numbers = new Set<number>()
    while (numbers.size < 5) {
      numbers.add(Math.floor(Math.random() * 45) + 1)
    }
    winningNumbers = Array.from(numbers).sort((a, b) => a - b)
  }

  // 6. Match participants against winning numbers
  const match5Winners: string[] = []
  const match4Winners: string[] = []
  const match3Winners: string[] = []

  const winNumbersSet = new Set(winningNumbers)

  participants.forEach(p => {
    let matchCount = 0
    // Use a Set to ensure we only match against distinct participant numbers
    const participantScoresSet = new Set(p.scores)
    
    participantScoresSet.forEach(s => {
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
    draw_type: drawType,
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
