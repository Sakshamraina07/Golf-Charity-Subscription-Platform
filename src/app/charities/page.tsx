import { createServerComponentClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Target, Heart, ExternalLink, Search, Star } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CharitiesPage() {
  const supabase = await createServerComponentClient()

  const { data: charities } = await supabase
    .from('charities')
    .select('*')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('name')

  return (
    <div className="min-h-screen bg-zinc-950">
      {}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                <Target className="w-5 h-5 text-zinc-950" />
              </div>
              <span className="text-xl font-bold">
                Birdie<span className="text-emerald-400">Bet</span>
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors">
                Log In
              </Link>
              <Link href="/signup" className="px-4 py-2 text-sm font-medium bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-lg transition-all">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-sm mb-6">
              <Heart className="w-4 h-4" />
              <span>Our Partner Charities</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-4">
              Causes that <span className="gradient-text">matter</span>
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Choose the charity closest to your heart. Every subscription helps
              fund meaningful change.
            </p>
          </div>

          {}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                id="charity-search"
                type="text"
                placeholder="Search charities..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-all"
              />
            </div>
          </div>

          {}
          {!charities || charities.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500 text-lg">
                No charities found. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {charities.map((charity) => (
                <div
                  key={charity.id}
                  className={`group relative p-6 rounded-2xl border bg-zinc-900/50 transition-all hover:shadow-lg ${
                    charity.is_featured
                      ? 'border-emerald-500/30 hover:shadow-emerald-500/10'
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {charity.is_featured && (
                    <div className="absolute -top-3 left-6 px-3 py-1 bg-emerald-500 text-zinc-950 text-xs font-bold rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Featured
                    </div>
                  )}

                  {charity.image_url ? (
                    <div className="w-full h-40 rounded-xl bg-zinc-800 mb-4 overflow-hidden">
                      <img
                        src={charity.image_url}
                        alt={charity.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-40 rounded-xl bg-zinc-800 mb-4 flex items-center justify-center">
                      <Heart className="w-10 h-10 text-zinc-700" />
                    </div>
                  )}

                  <h3 className="text-lg font-bold mb-2 group-hover:text-emerald-400 transition-colors">
                    {charity.name}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-3">
                    {charity.description || 'Supporting meaningful causes.'}
                  </p>

                  {charity.website_url && (
                    <a
                      href={charity.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      Visit website
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}