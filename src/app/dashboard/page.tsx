'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@/lib/supabase/client'
import {
  Plus,
  Trophy,
  Heart,
  CreditCard,
  Target,
  LogOut,
  Calendar,
  Zap,
  Loader2,
  Trash2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  History,
  Coins
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/lib/scores'

interface Score {
  id: string
  score: number
  played_at: string
}

interface Subscription {
  plan: string
  status: string
  expires_at: string
  charity_percent: number
  mock_amount: number
  charities?: {
    name: string
    website_url: string
  }
}

interface Winner {
  id: string
  match_type: string
  prize_amount: number
  payment_status: string
  draws: {
    month: string
  }
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState<Score[]>([])
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [winners, setWinners] = useState<Winner[]>([])
  const [showAddScore, setShowAddScore] = useState(false)
  const [newScore, setNewScore] = useState(30)
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)

  const router = useRouter()
  const supabase = createClientComponentClient()

  const fetchData = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const [profileRes, scoresRes, subRes, winnersRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('scores').select('*').eq('user_id', user.id).order('played_at', { ascending: false }).limit(5),
      supabase.from('subscriptions').select('*, charities(name, website_url)').eq('user_id', user.id).single(),
      supabase.from('winners').select('*, draws(month)').eq('user_id', user.id).order('created_at', { ascending: false })
    ])

    setUserProfile(profileRes.data)
    setScores(scoresRes.data || [])
    setSubscription(subRes.data)
    setWinners(winnersRes.data || [])
    setLoading(false)
  }, [supabase, router])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const handleAddScore = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('scores').insert({
      user_id: user?.id,
      score: newScore,
      played_at: newDate
    })

    if (error) {
      alert(error.message)
    } else {
      setShowAddScore(false)
      fetchData()
    }
    setIsSubmitting(false)
  }

  const handleDeleteScore = async (id: string) => {
    const { error } = await supabase.from('scores').delete().eq('id', id)
    if (!error) fetchData()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    )
  }

  const totalWon = winners.reduce((acc, w) => acc + Number(w.prize_amount), 0)
  const charityContribution = subscription ? (Number(subscription.mock_amount) * subscription.charity_percent) / 100 : 0

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col">
      <nav className="glass sticky top-0 z-50 border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Target className="w-5 h-5 text-zinc-950" />
            </div>
            <span className="text-xl font-bold">Birdie<span className="text-emerald-400">Bet</span></span>
          </Link>
          <div className="flex items-center gap-4">
            {userProfile?.role === 'admin' && (
              <Link
                href="/admin"
                className="text-xs font-bold text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 px-2 py-1 rounded hover:bg-emerald-500/15 transition-all"
              >
                ADMIN PANEL
              </Link>
            )}
            <button
              onClick={handleSignOut}
              className="p-2 text-zinc-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black">Dashboard</h1>
            <p className="text-zinc-500">Welcome back, {userProfile?.full_name?.split(' ')[0] || 'Golfer'}</p>
          </div>
          <div className="flex items-center gap-4 text-sm bg-zinc-900 border border-zinc-800 p-2 rounded-xl">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <Zap className="w-4 h-4 fill-emerald-400/20" />
              <span className="font-bold">Next Draw: April 1st</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Subscription */}
          <section className="glass p-6 rounded-3xl space-y-4 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-400" />
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${subscription?.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                {subscription?.status || 'Inactive'}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Subscription</h3>
              <div className="text-2xl font-black capitalize mt-1">{subscription?.plan || 'Free'} Plan</div>
              <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Renews {formatDate(subscription?.expires_at || new Date())}
              </p>
            </div>
            <Link href="/subscribe" className="text-xs font-bold text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1 group">
              Manage Subscription
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </section>

          {/* Charity */}
          <section className="glass p-6 rounded-3xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-pink-400" />
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-pink-400">£{charityContribution.toFixed(2)}</div>
                <div className="text-[10px] text-zinc-500 uppercase font-bold">Total Donated</div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Supporting</h3>
              <div className="text-xl font-black mt-1 truncate">{subscription?.charities?.name || 'Loading...'}</div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-pink-500" style={{ width: `${subscription?.charity_percent || 0}%` }} />
                </div>
                <span className="text-[10px] font-black text-zinc-400">{subscription?.charity_percent || 0}%</span>
              </div>
            </div>
            {subscription?.charities?.website_url && (
              <a href={subscription.charities.website_url} target="_blank" className="text-xs font-bold text-zinc-400 hover:text-pink-400 transition-colors flex items-center gap-1">
                Charity Details <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </section>

          {/* Scores */}
          <section className="glass p-6 rounded-3xl space-y-6 flex flex-col md:row-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Rolling 5 Scores</h3>
                  <p className="text-[10px] text-zinc-600">Latest scores enter the draw</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddScore(!showAddScore)}
                className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg shadow-emerald-500/20"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {showAddScore && (
              <form onSubmit={handleAddScore} className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-black text-zinc-500 uppercase">Stableford</label>
                    <input
                      type="number" min="1" max="45" value={newScore}
                      onChange={(e) => setNewScore(parseInt(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-emerald-500/50 outline-none"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-black text-zinc-500 uppercase">Date</label>
                    <input
                      type="date" value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-emerald-500/50 outline-none"
                    />
                  </div>
                </div>
                <button
                  disabled={isSubmitting}
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-sm font-bold rounded-lg transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Add Score'}
                </button>
              </form>
            )}

            <div className="flex-1 space-y-3 overflow-y-auto pr-2">
              {scores.map(s => (
                <div key={s.id} className="group flex items-center justify-between p-3 bg-zinc-900/40 rounded-xl hover:bg-zinc-900 transition-colors border border-transparent hover:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-950 flex items-center justify-center font-black text-emerald-400 border border-zinc-800 group-hover:border-emerald-500/30 transition-all">
                      {s.score}
                    </div>
                    <div>
                      <div className="text-sm font-bold">Stableford</div>
                      <div className="text-[10px] text-zinc-600">{formatDate(s.played_at)}</div>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteScore(s.id)} className="opacity-0 group-hover:opacity-100 p-2 text-zinc-700 hover:text-red-400 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {scores.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center py-8 text-zinc-700">
                  <History className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-xs">No scores yet</p>
                </div>
              )}
            </div>

            <p className="text-[10px] text-zinc-600 italic">
              *Only your 5 most recent rounds are used in the draw. Older scores are automatically removed.
            </p>
          </section>

          {/* Winnings */}
          <section className="glass p-6 rounded-3xl space-y-4 flex flex-col justify-between lg:col-span-2 md:col-span-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Total Winnings</h3>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-amber-500">£{totalWon.toFixed(2)}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {winners.slice(0, 4).map(w => (
                <div key={w.id} className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold capitalize text-zinc-300">{w.match_type.replace('_', ' ')}</div>
                    <div className="text-[10px] text-zinc-500 capitalize">{w.draws.month} Draw • {w.payment_status}</div>
                  </div>
                  <div className="font-black text-emerald-400">+£{Number(w.prize_amount).toFixed(2)}</div>
                </div>
              ))}
              {winners.length === 0 && (
                <p className="col-span-2 text-center text-xs text-zinc-600 py-4 border border-dashed border-zinc-800 rounded-xl">
                  No winnings yet. Keep submitting scores!
                </p>
              )}
            </div>

            <button className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs font-bold rounded-xl transition-all border border-zinc-800 flex items-center justify-center gap-2">
              <Coins className="w-3.5 h-3.5" />
              Withdrawal History
            </button>
          </section>

          {/* Draw Info */}
          <section className="glass p-6 rounded-3xl space-y-6 lg:col-span-1 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Draw Information</h3>
            </div>

            <div className="space-y-4">
              <div className="relative p-4 bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-5">
                  <Target className="w-16 h-16" />
                </div>
                <div className="text-xs text-zinc-600 uppercase font-black">Upcoming Draw</div>
                <div className="text-xl font-black mt-1">April 2026</div>
                <div className="mt-4 flex gap-1">
                  {scores.length >= 5 ? (
                    scores.map((s, i) => (
                      <div key={i} className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xs font-black text-emerald-400">
                        {s.score}
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-amber-400">Add {5 - scores.length} more scores to enter</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase">Recent Draw Results</h4>
                <div className="text-xs text-zinc-500 flex justify-between items-center py-1 border-b border-zinc-800/50">
                  <span>March 2026</span>
                  <span className="text-zinc-300 font-mono">04 • 12 • 23 • 35 • 41</span>
                </div>
                <div className="text-xs text-zinc-500 flex justify-between items-center py-1 border-b border-zinc-800/50">
                  <span>February 2026</span>
                  <span className="text-zinc-300 font-mono">01 • 15 • 22 • 29 • 44</span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}