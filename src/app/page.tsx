'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Target, 
  Heart, 
  Users, 
  Trophy, 
  ChevronRight,
  Shield,
  Zap
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-emerald-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center rotate-3 hover:rotate-0 transition-transform cursor-pointer">
              <Target className="w-6 h-6 text-zinc-950" />
            </div>
            <span className="text-xl font-black tracking-tighter">BIRDIEBET</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="/charities" className="hover:text-emerald-400 transition-colors">Charities</Link>
            <Link href="/admin" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
              <Shield className="w-4 h-4" />
              Admin
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
            <Link 
              href="/signup" 
              className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 rounded-xl text-white transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-8 animate-fade-in">
            <Shield className="w-3 h-3" />
            SECURE STRIPE PAYMENTS ENABLED
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9]">
            PLAY FOR THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">MISSION</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-zinc-400 text-xl mb-12">
            The premium golf charity platform where every subscription funds life-changing projects and enters you into the monthly prize draw.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/signup"
              className="group px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-lg rounded-xl transition-all hover:shadow-xl hover:shadow-emerald-500/25 flex items-center gap-2"
            >
              Start for £9.99/mo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/charities"
              className="px-8 py-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white font-bold text-lg rounded-xl transition-all"
            >
              Learn the Impact
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-white/5">
            <div>
              <div className="text-3xl font-black text-white mb-1">£125k+</div>
              <div className="text-zinc-500 text-sm">Raised for Charity</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white mb-1">2,400+</div>
              <div className="text-zinc-500 text-sm">Active Members</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white mb-1">£45k</div>
              <div className="text-zinc-500 text-sm">Monthly Prize Pool</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white mb-1">12</div>
              <div className="text-zinc-500 text-sm">Partner Charities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: 'Charity First',
                desc: 'Choose your charity and 50% of your subscription goes directly to their active projects.',
                icon: Heart,
                color: 'text-pink-500'
              },
              {
                title: 'Rolling Scores',
                desc: 'Upload your golf scores. We track your rolling average for the monthly prize pool.',
                icon: Trophy,
                color: 'text-amber-500'
              },
              {
                title: 'Global Community',
                desc: 'Join players worldwide competing to make an impact through the sport they love.',
                icon: Users,
                color: 'text-emerald-500'
              }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 hover:border-emerald-500/30 transition-all">
                <feature.icon className={`w-12 h-12 ${feature.color} mb-6`} />
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-zinc-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="p-12 rounded-[32px] bg-emerald-500 relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)]" />
            <h2 className="relative z-10 text-4xl md:text-5xl font-black text-zinc-950 mb-6">
              READY TO CHANGE THE GAME?
            </h2>
            <p className="relative z-10 text-emerald-950/70 text-lg mb-10 max-w-xl mx-auto font-medium">
              Join BirdieBet today. Fund local charities, track your game, and win big every single month.
            </p>
            <Link 
              href="/signup"
              className="relative z-10 inline-flex items-center gap-2 px-10 py-5 bg-zinc-950 text-white font-black text-xl rounded-2xl hover:scale-105 transition-transform"
            >
              GET STARTED NOW
              <ChevronRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 opacity-50 grayscale">
            <Target className="w-5 h-5" />
            <span className="text-sm font-black tracking-tighter uppercase">BIRDIEBET</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-zinc-500">
            <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link>
          </div>
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
            © 2026 BirdieBet. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
