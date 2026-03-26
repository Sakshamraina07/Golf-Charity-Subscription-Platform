'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@/lib/supabase/client'
import {
  Heart,
  ArrowRight,
  Loader2,
  Info,
  ChevronDown,
  LayoutDashboard
} from 'lucide-react'
import Link from 'next/link'

interface Charity {
  id: string
  name: string
  description: string
  image_url: string
}

export default function SubscribePage() {
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('monthly')
  const [charityId, setCharityId] = useState<string>('')
  const [charityPercent, setCharityPercent] = useState(10)
  const [charities, setCharities] = useState<Charity[]>([])
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchCharities() {
      setLoading(true)
      const { data } = await supabase
        .from('charities')
        .select('id, name, description, image_url')
        .eq('is_active', true)
        .order('name')

      if (data) {
        setCharities(data)
        if (data.length > 0) setCharityId(data[0].id)
      }
      setLoading(false)
    }
    fetchCharities()
  }, [supabase])

  const amount = plan === 'monthly' ? 9.99 : 99.99
  const charityAmount = (amount * charityPercent) / 100
  const prizePool = (amount - charityAmount) * 0.5
  const platformFee = amount - charityAmount - prizePool

  const handleSubscribe = async () => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, charityId, charityPercent })
      })

      const { url, error } = await res.json()

      if (url) {
        window.location.href = url
      } else {
        alert(error || 'Something went wrong')
        setSubmitting(false)
      }
    } catch (err) {
      console.error(err)
      alert('Failed to connect to Stripe')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 pt-12 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Heart className="w-5 h-5 text-zinc-950" />
            </div>
            <span className="text-xl font-bold">Birdie<span className="text-emerald-400">Bet</span></span>
          </Link>
          <h1 className="text-4xl font-black mb-4">Start your <span className="gradient-text">impact</span></h1>
          <p className="text-zinc-400">Choose your plan and the charity you wish to support.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="p-1 bg-zinc-900 rounded-xl flex">
              <button
                onClick={() => setPlan('monthly')}
                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${plan === 'monthly' ? 'bg-zinc-800 text-emerald-400 shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Monthly (£9.99)
              </button>
              <button
                onClick={() => setPlan('yearly')}
                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all relative ${plan === 'yearly' ? 'bg-zinc-800 text-emerald-400 shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Yearly (£99.99)
                <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-emerald-500 text-zinc-950 text-[10px] font-black rounded-full">SAVE 17%</span>
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-zinc-400 flex items-center gap-2">
                <Heart className="w-4 h-4" /> Select Charity
              </label>
              <div className="relative">
                <select
                  value={charityId}
                  onChange={(e) => setCharityId(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 appearance-none focus:outline-none focus:border-emerald-500/50 transition-all text-zinc-100"
                >
                  {charities.map(charity => (
                    <option key={charity.id} value={charity.id}>{charity.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-zinc-400">Your Contribution</label>
                <span className="text-2xl font-black text-emerald-400">{charityPercent}%</span>
              </div>
              <input
                type="range" min="10" max="100" step="5"
                value={charityPercent}
                onChange={(e) => setCharityPercent(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <p className="text-xs text-zinc-500 leading-relaxed italic">
                "A minimum 10% contribution ensures we can support our partner charities adequately."
              </p>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl space-y-8 h-fit">
            <h3 className="text-xl font-bold">Contribution Breakdown</h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 text-sm">Direct to Charity</span>
                <span className="font-bold text-emerald-400">£{charityAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400 text-sm">
                <span className="flex items-center gap-1.5">
                  Prize Pool Allocation
                  <Info className="w-3.5 h-3.5 opacity-50" />
                </span>
                <span>£{prizePool.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400 text-sm">
                <span className="font-medium">Platform Operations</span>
                <span>£{platformFee.toFixed(2)}</span>
              </div>

              <div className="pt-4 border-t border-zinc-800 mt-4 flex justify-between items-end">
                <span className="text-sm font-medium text-zinc-300">Total Subscription</span>
                <div className="text-right">
                  <div className="text-3xl font-black">£{amount.toFixed(2)}</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest">{plan}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleSubscribe}
                disabled={submitting}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Confirm & Subscribe
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-zinc-500 px-4">
                Powered by Stripe. Secure payment processing.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/dashboard" className="text-zinc-500 hover:text-emerald-400 text-sm inline-flex items-center gap-2 group">
            <LayoutDashboard className="w-4 h-4" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}