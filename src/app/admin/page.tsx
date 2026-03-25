import { createAdminClient } from '@/lib/supabase/server'
import { 
  Users, 
  Target, 
  Heart, 
  Trophy, 
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const supabase = createAdminClient()

  
  const [profilesRes, subsRes, winnersRes, charitiesRes] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact' }),
    supabase.from('subscriptions').select('mock_amount', { count: 'exact' }).eq('status', 'active'),
    supabase.from('winners').select('prize_amount'),
    supabase.from('charities').select('id', { count: 'exact' })
  ])

  const userCount = profilesRes.count || 0
  const activeSubs = subsRes.count || 0
  const totalPrizePool = (subsRes.data?.reduce((acc, s) => acc + Number(s.mock_amount), 0) || 0) * 0.5
  const prizePaid = winnersRes.data?.reduce((acc, w) => acc + Number(w.prize_amount), 0) || 0
  const charityCount = charitiesRes.count || 0

  const stats = [
    { name: 'Total Users', value: userCount.toString(), icon: Users, trend: '+12%', color: 'blue' },
    { name: 'Active Subs', value: activeSubs.toString(), icon: Activity, trend: '+5%', color: 'emerald' },
    { name: 'Current Prize Pool', value: `�$${totalPrizePool.toFixed(2)}`, icon: Target, trend: '+8%', color: 'amber' },
    { name: 'Total Prizes Paid', value: `�$${prizePaid.toFixed(2)}`, icon: Trophy, trend: '+�$1.2K', color: 'purple' },
  ]

  return (
    <div className="space-y-12">
      {}
      <div>
        <h1 className="text-4xl font-black">Overview</h1>
        <p className="text-zinc-500">Platform statistics and performance</p>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${stat.color}-500/10`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded-full">
                {stat.trend}
                <ArrowUpRight className="w-3 h-3" />
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{stat.name}</p>
              <h3 className="text-3xl font-black mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {}
        <div className="lg:col-span-2 glass p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Growth Analytics
            </h3>
            <button className="text-xs font-bold text-zinc-500 hover:text-emerald-400 transition-colors">Export CSV</button>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 pt-8">
            {}
            {[45, 60, 52, 70, 65, 80, 75, 90, 85, 95, 88, 100].map((h, i) => (
              <div key={i} className="flex-1 space-y-2 group">
                 <div className="w-full bg-emerald-500/10 hover:bg-emerald-500/30 transition-all rounded-t-lg relative" style={{ height: `${h}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity">
                      {h*12}
                    </div>
                 </div>
                 <div className="text-[10px] text-zinc-600 text-center font-bold">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</div>
              </div>
            ))}
          </div>
        </div>

        {}
        <div className="glass p-8 rounded-3xl space-y-6">
           <h3 className="text-xl font-bold flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-400" />
              Impact Hub
           </h3>
           <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                <div className="text-sm font-bold truncate">Partner Charities</div>
                <div className="text-lg font-black text-emerald-400">{charityCount}</div>
              </div>
              <div className="relative w-40 h-40 mx-auto">
                 {}
                 <div className="absolute inset-0 rounded-full border-[10px] border-zinc-800" />
                 <div className="absolute inset-0 rounded-full border-[10px] border-emerald-500 border-t-transparent border-l-transparent -rotate-45" />
                 <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-black">94%</span>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">Retention</span>
                 </div>
              </div>
              <p className="text-center text-[10px] text-zinc-600 px-4">
                Global outreach health programs received 40% of contributions this month.
              </p>
           </div>
        </div>
      </div>
    </div>
  )
}
