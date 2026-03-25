'use client'

import { useState, useEffect } from 'react'
import { 
  Trophy, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  History, 
  Eye, 
  MoreVertical, 
  Loader2,
  Table as TableIcon,
  Search,
  ExternalLink,
  Ban,
  Check
} from 'lucide-react'
import { formatDate } from '@/lib/scores'

interface Winner {
  id: string
  match_type: string
  prize_amount: number
  verification_status: string
  payment_status: string
  proof_url: string
  notes: string
  created_at: string
  profiles: {
    full_name: string
    email: string
  }
  draws: {
    month: string
    winning_numbers: number[]
  }
}

export default function AdminWinnersPage() {
  const [loading, setLoading] = useState(true)
  const [winners, setWinners] = useState<Winner[]>([])
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchWinners()
  }, [])

  const fetchWinners = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/winners')
    const data = await res.json()
    if (data.winners) setWinners(data.winners)
    setLoading(false)
  }

  const handleUpdate = async (winnerId: string, updates: any) => {
    setIsUpdating(winnerId)
    const res = await fetch('/api/admin/winners', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: winnerId, ...updates })
    })

    if (res.ok) {
       setWinners(prev => prev.map(w => w.id === winnerId ? { ...w, ...updates } : w))
    }
    setIsUpdating(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black">Prize Winners</h1>
          <p className="text-zinc-500">Verify winnings and manage payouts</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 border border-zinc-800 bg-zinc-900 rounded-xl text-xs font-black text-emerald-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Â$45.2K TOTAL PAID
           </div>
        </div>
      </div>

      <div className="glass overflow-hidden rounded-3xl border border-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-900/50 border-b border-zinc-900">
                <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Player</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Draw</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Win Tier</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Prize</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Verification</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Payment</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/50">
              {winners.map((w) => (
                <tr key={w.id} className="hover:bg-zinc-900/20 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                        <User className="w-4 h-4 text-zinc-500" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-zinc-200">{w.profiles.full_name}</div>
                        <div className="text-[10px] text-zinc-500">{w.profiles.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <div className="text-sm font-bold text-zinc-300">{w.draws.month}</div>
                     <div className="text-[10px] text-zinc-600 font-mono tracking-tighter">
                        {w.draws.winning_numbers.join(' â€¢ ')}
                     </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                       w.match_type === 'match_5' ? 'bg-amber-500/10 text-amber-500' :
                       w.match_type === 'match_4' ? 'bg-blue-500/10 text-blue-400' :
                       'bg-zinc-800 text-zinc-500'
                     }`}>
                        {w.match_type.replace('_', ' ')}
                     </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <div className="text-sm font-black text-emerald-400">Â${Number(w.prize_amount).toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     {isUpdating === w.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                     ) : (
                        <div className="flex gap-1">
                           <button 
                             onClick={() => handleUpdate(w.id, { verification_status: 'approved' })}
                             className={`p-1.5 rounded-lg border transition-all ${w.verification_status === 'approved' ? 'bg-emerald-500 text-zinc-950 border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-zinc-900 border-zinc-800 text-zinc-600 hover:text-emerald-400'}`}
                           >
                              <CheckCircle className="w-3.5 h-3.5" />
                           </button>
                           <button 
                             onClick={() => handleUpdate(w.id, { verification_status: 'rejected' })}
                             className={`p-1.5 rounded-lg border transition-all ${w.verification_status === 'rejected' ? 'bg-red-500 text-zinc-950 border-red-500 shadow-lg shadow-red-500/20' : 'bg-zinc-900 border-zinc-800 text-zinc-600 hover:text-red-400'}`}
                           >
                              <XCircle className="w-3.5 h-3.5" />
                           </button>
                        </div>
                     )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <button 
                        onClick={() => handleUpdate(w.id, { payment_status: w.payment_status === 'paid' ? 'pending' : 'paid' })}
                        disabled={isUpdating === w.id}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                           w.payment_status === 'paid' 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-zinc-900 text-zinc-600 border border-zinc-800 hover:text-zinc-300'
                        }`}
                     >
                        <Clock className="w-3 h-3" />
                        {w.payment_status === 'paid' ? 'PAID' : 'PENDING'}
                     </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-zinc-700 hover:text-zinc-300 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {winners.length === 0 && (
            <div className="py-20 text-center text-zinc-500">
               No winners found in the specified month.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
