import Link from 'next/link'
import {
  Heart,
  Trophy,
  TrendingUp,
  ArrowRight,
  Check,
  Sparkles,
  Users,
  Target,
} from 'lucide-react'

export default function HomePage() {
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
              <span className="text-xl font-bold tracking-tight">
                Birdie<span className="text-emerald-400">Bet</span>
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/charities"
                className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors"
              >
                Charities
              </Link>
              <Link
                href="/login"
                className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 text-sm font-medium bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-lg transition-all hover:shadow-lg hover:shadow-emerald-500/25"
              >
                Get Started
              </Link>
            </div>
            <div className="md:hidden flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm text-zinc-400"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1.5 text-sm font-medium bg-emerald-500 text-zinc-950 rounded-lg"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-600/5 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-sm mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>Charity-first golf platform</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6 animate-slide-up">
            Play golf.{' '}
            <span className="gradient-text">Change lives.</span>
            <br />
            Win prizes.
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Your Stableford scores power monthly prize draws while funding the
            charities you care about. Every round makes a difference.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link
              href="/signup"
              className="group px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-lg rounded-xl transition-all hover:shadow-xl hover:shadow-emerald-500/25 flex items-center gap-2"
            >
              Start for Â$9.99/mo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/charities"
              className="px-8 py-4 border border-zinc-700 hover:border-emerald-500/50 text-zinc-300 hover:text-emerald-400 font-medium text-lg rounded-xl transition-all"
            >
              View Charities
            </Link>
          </div>
        </div>
      </section>

      {}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How it <span className="gradient-text">works</span>
            </h2>
            <p className="text-zinc-400 text-lg">
              Three simple steps to make your golf count
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                step: '01',
                title: 'Subscribe & Choose',
                desc: 'Pick a plan and select the charity you want to support. Set how much of your subscription goes to charity (minimum 10%).',
              },
              {
                icon: TrendingUp,
                step: '02',
                title: 'Submit Your Scores',
                desc: 'Enter your Stableford scores after each round. We keep your latest 5 â€” they become your draw numbers.',
              },
              {
                icon: Trophy,
                step: '03',
                title: 'Win & Give',
                desc: 'Monthly draws match your scores against random numbers. Match 3+ and win from the prize pool. Your charity always wins too.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group relative p-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-emerald-500/30 transition-all hover:shadow-lg hover:shadow-emerald-500/5"
              >
                <div className="text-6xl font-black text-zinc-800 group-hover:text-emerald-500/10 transition-colors absolute top-4 right-6">
                  {item.step}
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                  <item.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-emerald-500/10 to-emerald-500/5" />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Charity <span className="gradient-text">impact</span>
            </h2>
            <p className="text-zinc-400 text-lg">
              Every subscription directly funds real change
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: 'Â$125K+', label: 'Raised for Charity', icon: Heart },
              { value: '2,400+', label: 'Active Subscribers', icon: Users },
              { value: 'Â$45K', label: 'Monthly Prize Pool', icon: Trophy },
              { value: '12', label: 'Partner Charities', icon: Target },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center p-8 rounded-2xl border border-emerald-500/20 bg-zinc-900/80"
              >
                <stat.icon className="w-8 h-8 text-emerald-400 mx-auto mb-4" />
                <div className="text-3xl sm:text-4xl font-black gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-zinc-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="py-24 px-4" id="pricing">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple, transparent{' '}
              <span className="gradient-text">pricing</span>
            </h2>
            <p className="text-zinc-400 text-lg">
              Join the community. Support a cause. Win prizes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {}
            <div className="relative p-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-all">
              <div className="text-sm font-medium text-zinc-400 mb-2">
                Monthly
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-black">Â$9.99</span>
                <span className="text-zinc-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Monthly prize draw entry',
                  'Choose your charity',
                  'Set your giving percentage',
                  'Score tracking dashboard',
                  'Cancel anytime',
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-300">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-sm">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block text-center py-3 rounded-xl border border-zinc-700 hover:border-emerald-500/50 text-zinc-300 hover:text-emerald-400 font-medium transition-all"
              >
                Get Started
              </Link>
            </div>

            {}
            <div className="relative p-8 rounded-2xl border border-emerald-500/30 bg-zinc-900/50 animate-pulse-glow">
              <div className="absolute -top-3 right-6 px-3 py-1 bg-emerald-500 text-zinc-950 text-xs font-bold rounded-full">
                SAVE 17%
              </div>
              <div className="text-sm font-medium text-emerald-400 mb-2">
                Yearly
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-black">Â$99.99</span>
                <span className="text-zinc-500">/year</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'All monthly benefits',
                  '2 months free',
                  'Priority support',
                  'Exclusive annual draws',
                  'Founding member badge',
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-300">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-sm">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block text-center py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition-all hover:shadow-lg hover:shadow-emerald-500/25"
              >
                Get Started â€” Best Value
              </Link>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to make your{' '}
            <span className="gradient-text">rounds count</span>?
          </h2>
          <p className="text-zinc-400 text-lg mb-8">
            Join thousands of golfers who are winning prizes and changing lives
            with every score they submit.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-lg rounded-xl transition-all hover:shadow-xl hover:shadow-emerald-500/25"
          >
            Join BirdieBet Today
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {}
      <footer className="border-t border-zinc-800 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center">
              <Target className="w-4 h-4 text-zinc-950" />
            </div>
            <span className="font-bold">
              Birdie<span className="text-emerald-400">Bet</span>
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <Link href="/charities" className="hover:text-emerald-400 transition-colors">
              Charities
            </Link>
            <Link href="/login" className="hover:text-emerald-400 transition-colors">
              Log In
            </Link>
            <Link href="/signup" className="hover:text-emerald-400 transition-colors">
              Sign Up
            </Link>
          </div>
          <div className="text-sm text-zinc-600">
            Â© 2026 BirdieBet. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
