'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Target,
  Settings,
  Play,
  CheckCircle2,
  Loader2,
  Users,
  Calendar,
  Zap,
  ShieldCheck,
  AlertTriangle,
  History
} from 'lucide-react'

export default function AdminDrawsPage() {
  const [loading, setLoading] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [month, setMonth] = useState('March 2026')
  const [simulationResult, setSimulationResult] = useState<any>(null)
  const [drawType, setDrawType] = useState('random')
  const [error, setError] = useState('')

  const handleSimulate = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/draws/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month, draw_type: drawType })
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setSimulationResult(data)
      }
    } catch (err) {
      setError('Communication error with simulation engine')
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async () => {
    if (!simulationResult) return
    setPublishing(true)
    try {
      const res = await fetch('/api/admin/draws/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drawId: simulationResult.draw.id })
      })
      const data = await res.json()
      if (data.success) {
        setSimulationResult({ ...simulationResult, draw: { ...simulationResult.draw, status: 'published' } })
      } else {
        alert(data.error)
      }
    } catch (err) {
      alert('Failed to publish draw')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black">Draw Management</h1>
          <p className="text-zinc-500">Configure and execute monthly prize draws</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/winners" className="px-4 py-2 border border-zinc-800 bg-zinc-900 rounded-xl text-xs font-bold text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-2">
            <History className="w-4 h-4" />
            View Past Draws
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Config */}
        <section className="glass p-8 rounded-3xl space-y-8 h-fit">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-widest text-zinc-300">Phase 01: Config</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Draw Month</label>
              <div className="relative">
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 appearance-none focus:outline-none focus:border-blue-500/50 transition-all text-sm font-bold"
                >
                  <option>January 2026</option>
                  <option>February 2026</option>
                  <option>March 2026</option>
                  <option>April 2026</option>
                  <option>May 2026</option>
                  <option>June 2026</option>
                </select>
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Draw Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setDrawType('random')}
                  className={`p-3 border-2 rounded-xl text-xs font-black transition-all ${
                    drawType === 'random' 
                      ? 'border-emerald-500 bg-emerald-500/5 text-emerald-400' 
                      : 'border-zinc-900 bg-zinc-950 text-zinc-600 hover:text-zinc-400'
                  }`}
                >
                  RANDOM
                </button>
                <button 
                  onClick={() => setDrawType('algorithmic')}
                  className={`p-3 border-2 rounded-xl text-xs font-black transition-all ${
                    drawType === 'algorithmic' 
                      ? 'border-blue-500 bg-blue-500/5 text-blue-400' 
                      : 'border-zinc-900 bg-zinc-950 text-zinc-600 hover:text-zinc-400'
                  }`}
                >
                  ALGORITHMIC (V2)
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-900">
              <button
                onClick={handleSimulate}
                disabled={loading}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Run Simulation
                    <Play className="w-5 h-5 fill-zinc-950 group-hover:scale-110 transition-transform" />
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            )}
          </div>
        </section>

        {/* Results */}
        <section className="lg:col-span-2 space-y-8 relative min-h-[400px]">
          {!simulationResult && !loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/50 rounded-3xl border-2 border-dashed border-zinc-900 text-zinc-800">
              <Zap className="w-12 h-12 mb-4 opacity-5" />
              <p className="text-sm font-bold uppercase tracking-widest opacity-20">Awaiting simulation input</p>
            </div>
          )}

          {simulationResult && (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-widest text-zinc-300">Phase 02: Results Preview</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Winning numbers */}
                <div className="glass p-6 rounded-3xl space-y-4">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Winning Sequence</p>
                  <div className="flex gap-2">
                    {simulationResult.winningNumbers.map((n: number) => (
                      <div key={n} className="w-10 h-10 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-black text-emerald-400 text-lg">
                        {n}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Participants */}
                <div className="glass p-6 rounded-3xl flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Participants</p>
                    <h4 className="text-2xl font-black">{simulationResult.pools.totalSubscribers} Users</h4>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                </div>

                {/* Prize distribution */}
                <div className="glass p-6 rounded-3xl space-y-4 lg:col-span-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Prize Distribution</p>
                    <span className="text-[10px] font-black text-emerald-400 px-2 py-0.5 bg-emerald-500/10 rounded-full">SIMULATED</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <div className="text-[10px] text-zinc-600 font-bold">MATCH 5</div>
                      <div className="text-lg font-black text-amber-500">£{simulationResult.pools.jackpotPool.toFixed(2)}</div>
                      <div className="text-[10px] text-zinc-500">{simulationResult.winners.match5.length} winners</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] text-zinc-600 font-bold">MATCH 4</div>
                      <div className="text-lg font-black text-zinc-200">£{simulationResult.pools.match4Pool.toFixed(2)}</div>
                      <div className="text-[10px] text-zinc-500">{simulationResult.winners.match4.length} winners</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] text-zinc-600 font-bold">MATCH 3</div>
                      <div className="text-lg font-black text-zinc-400">£{simulationResult.pools.match3Pool.toFixed(2)}</div>
                      <div className="text-[10px] text-zinc-500">{simulationResult.winners.match3.length} winners</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] text-zinc-600 font-bold">MATCH 2</div>
                      <div className="text-lg font-black text-emerald-400/70">£{simulationResult.pools.match2Pool.toFixed(2)}</div>
                      <div className="text-[10px] text-zinc-500">{simulationResult.winners.match2.length} winners</div>
                    </div>
                  </div>
                </div>

                {/* Rollover */}
                {simulationResult.pools.jackpotRollover > 0 && (
                  <div className="glass p-6 rounded-3xl border-amber-500/30 bg-amber-500/5 flex items-center lg:col-span-2 gap-4">
                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                    <div>
                      <div className="text-sm font-black text-amber-500">No Match 5 Winners</div>
                      <p className="text-xs text-zinc-500 mt-0.5">£{simulationResult.pools.jackpotRollover.toFixed(2)} will be rolled over to the next month.</p>
                    </div>
                  </div>
                )}

                {/* Publish */}
                <div className="lg:col-span-2 pt-12 text-center space-y-6">
                  <div className="flex flex-col items-center gap-1">
                    <h3 className="text-2xl font-black">Ready to Publish?</h3>
                    <p className="text-sm text-zinc-500 max-w-sm">Publishing will notify winners and make the results public to all subscribers.</p>
                  </div>
                  {simulationResult.draw.status === 'published' ? (
                    <div className="inline-flex items-center gap-2 px-6 py-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl font-black uppercase tracking-widest">
                      <CheckCircle2 className="w-6 h-6" />
                      Officially Published
                    </div>
                  ) : (
                    <button
                      onClick={handlePublish}
                      disabled={publishing}
                      className="px-12 py-4 bg-zinc-100 hover:bg-white text-zinc-950 font-black rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-2xl flex items-center gap-3 mx-auto disabled:opacity-50"
                    >
                      {publishing ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <>
                          <ShieldCheck className="w-6 h-6" />
                          Publish Results Now
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}