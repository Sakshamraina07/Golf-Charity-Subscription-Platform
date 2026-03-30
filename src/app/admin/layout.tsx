'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Users, 
  Target, 
  Heart, 
  Trophy, 
  LayoutDashboard,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Draws', href: '/admin/draws', icon: Target },
    { name: 'Charities', href: '/admin/charities', icon: Heart },
    { name: 'Winners', href: '/admin/winners', icon: Trophy },
  ]

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex">
      {}
      <aside className="w-64 border-r border-zinc-900 bg-zinc-950 flex flex-col fixed h-full z-50">
        <div className="p-6 border-b border-zinc-900 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-zinc-950" />
          </div>
          <span className="text-xl font-bold tracking-tight">Admin<span className="text-emerald-400">Panel</span></span>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all mb-4 group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive 
                    ? 'bg-emerald-500/10 text-emerald-400' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-6 border-t border-zinc-900 mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-800" />
            <div className="overflow-hidden">
              <p className="text-xs font-black truncate">Administrator</p>
              <p className="text-[10px] text-zinc-500 truncate">admin@birdiebet.io</p>
            </div>
          </div>
        </div>
      </aside>

      {}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
