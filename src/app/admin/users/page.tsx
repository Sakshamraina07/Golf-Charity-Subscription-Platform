'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Search, 
  Shield, 
  User, 
  CreditCard,
  Target,
  Mail,
  MoreVertical,
  Loader2,
  Calendar,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { formatDate } from '@/lib/scores'

interface UserProfile {
  id: string
  full_name: string
  email: string
  role: string
  created_at: string
  subscriptions: {
    plan: string
    status: string
    expires_at: string
    mock_amount: number
    charity_percent: number
  } | null
}

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<UserProfile[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true)
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      if (data.users) setUsers(data.users)
      setLoading(false)
    }
    fetchUsers()
  }, [])

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    setIsUpdating(userId)
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role: newRole })
    })

    if (res.ok) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
    }
    setIsUpdating(null)
  }

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <h1 className="text-4xl font-black">Users</h1>
          <p className="text-zinc-500">Manage platform members and their roles</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>

      {}
      <div className="glass overflow-hidden rounded-3xl border border-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-900/50 border-b border-zinc-900">
                <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-500 tracking-widest">User</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Plan</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Impact</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Role</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/50">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-900/20 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                        <User className="w-4 h-4 text-zinc-500" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-zinc-200">{u.full_name}</div>
                        <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {u.subscriptions ? (
                      <div>
                        <div className="text-sm font-bold capitalize text-zinc-300">{u.subscriptions.plan}</div>
                        <div className="text-[10px] text-zinc-600 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Exp: {formatDate(u.subscriptions.expires_at)}
                        </div>
                      </div>
                    ) : (
                       <span className="text-[10px] font-black text-zinc-700 uppercase">No active plan</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {u.subscriptions?.status === 'active' ? (
                       <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full uppercase tracking-widest">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Active
                       </span>
                    ) : (
                       <span className="inline-flex items-center gap-1 text-[10px] font-black bg-red-500/10 text-red-400 px-2.5 py-1 rounded-full uppercase tracking-widest">
                          <XCircle className="w-2.5 h-2.5" />
                          Inactive
                       </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {u.subscriptions && (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-pink-500" style={{ width: `${u.subscriptions.charity_percent}%` }} />
                        </div>
                        <span className="text-[10px] font-black text-zinc-400">{u.subscriptions.charity_percent}%</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <button 
                        onClick={() => handleRoleToggle(u.id, u.role)}
                        disabled={isUpdating === u.id}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          u.role === 'admin' 
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                            : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                     >
                        {isUpdating === u.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Shield className="w-3 h-3" />
                            {u.role === 'admin' ? 'Admin' : 'User'}
                          </>
                        )}
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
          {filteredUsers.length === 0 && (
            <div className="py-20 text-center text-zinc-500">
               No users found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
