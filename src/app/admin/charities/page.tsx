'use client'

import { useState, useEffect } from 'react'
import { 
  Heart, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Star, 
  ExternalLink, 
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  XCircle
} from 'lucide-react'

interface Charity {
  id: string
  name: string
  description: string
  image_url: string
  website_url: string
  is_featured: boolean
  is_active: boolean
}

export default function AdminCharitiesPage() {
  const [loading, setLoading] = useState(true)
  const [charities, setCharities] = useState<Charity[]>([])
  const [editingCharity, setEditingCharity] = useState<Partial<Charity> | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchCharities()
  }, [])

  const fetchCharities = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/charities')
    const data = await res.json()
    if (data.charities) setCharities(data.charities)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const method = editingCharity?.id ? 'PATCH' : 'POST'
    const res = await fetch('/api/admin/charities', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingCharity)
    })

    if (res.ok) {
      setEditingCharity(null)
      fetchCharities()
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this charity?')) return
    const res = await fetch(`/api/admin/charities?id=${id}`, { method: 'DELETE' })
    if (res.ok) fetchCharities()
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
          <h1 className="text-4xl font-black">Charities</h1>
          <p className="text-zinc-500">Partner organizations and impact tracking</p>
        </div>
        <button 
          onClick={() => setEditingCharity({ name: '', is_featured: false, is_active: true })}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-5 h-5" />
          Add Charity
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {}
        <div className="space-y-4">
          {charities.map((c) => (
            <div key={c.id} className="glass p-6 rounded-3xl flex items-center justify-between gap-4 group">
               <div className="flex items-center gap-4 flex-1">
                 <div className="w-16 h-16 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0 flex items-center justify-center">
                   {c.image_url ? (
                     <img src={c.image_url} alt={c.name} className="w-full h-full object-cover" />
                   ) : (
                     <Heart className="w-6 h-6 text-zinc-700" />
                   )}
                 </div>
                 <div className="overflow-hidden">
                    <div className="flex items-center gap-2">
                       <h3 className="font-bold text-lg truncate">{c.name}</h3>
                       {c.is_featured && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                    </div>
                    <p className="text-xs text-zinc-500 truncate">{c.description || 'No description provided.'}</p>
                    <div className="flex items-center gap-3 mt-1">
                       <span className={`text-[10px] font-black uppercase tracking-widest ${c.is_active ? 'text-emerald-500' : 'text-zinc-600'}`}>
                          {c.is_active ? 'Active' : 'Archived'}
                       </span>
                       {c.website_url && (
                          <a href={c.website_url} target="_blank" className="text-zinc-700 hover:text-emerald-400">
                             <ExternalLink className="w-3 h-3" />
                          </a>
                       )}
                    </div>
                 </div>
               </div>
               <div className="flex gap-2">
                  <button 
                    onClick={() => setEditingCharity(c)}
                    className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:text-emerald-400 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(c.id)}
                    className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
               </div>
            </div>
          ))}
        </div>

        {}
        {editingCharity ? (
          <div className="glass p-8 rounded-3xl space-y-8 animate-fade-in h-fit border-emerald-500/20">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-emerald-400" />
               </div>
               <h3 className="text-xl font-bold uppercase tracking-widest text-zinc-300">
                  {editingCharity.id ? 'Edit Charity' : 'Add New Charity'}
               </h3>
             </div>

             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-zinc-500 uppercase">Charity Name</label>
                      <input 
                        type="text" 
                        required
                        value={editingCharity.name || ''}
                        onChange={(e) => setEditingCharity({ ...editingCharity, name: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-emerald-500/50 outline-none"
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-zinc-500 uppercase">Featured</label>
                      <div className="flex items-center gap-4 py-3">
                         <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={editingCharity.is_featured || false}
                              onChange={(e) => setEditingCharity({ ...editingCharity, is_featured: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                         </label>
                         <span className="text-xs font-bold text-zinc-400">Mark as Featured</span>
                      </div>
                   </div>
                </div>

                <div className="space-y-1">
                   <label className="text-[10px] font-black text-zinc-500 uppercase">Description</label>
                   <textarea 
                     rows={3}
                     value={editingCharity.description || ''}
                     onChange={(e) => setEditingCharity({ ...editingCharity, description: e.target.value })}
                     className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-emerald-500/50 outline-none resize-none"
                   />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase">Image URL (Optional)</label>
                      <div className="relative">
                         <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                         <input 
                           type="url" 
                           value={editingCharity.image_url || ''}
                           onChange={(e) => setEditingCharity({ ...editingCharity, image_url: e.target.value })}
                           className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm focus:border-emerald-500/50 outline-none"
                         />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase">Website URL (Optional)</label>
                      <div className="relative">
                         <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                         <input 
                           type="url" 
                           value={editingCharity.website_url || ''}
                           onChange={(e) => setEditingCharity({ ...editingCharity, website_url: e.target.value })}
                           className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm focus:border-emerald-500/50 outline-none"
                         />
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
                   <button 
                     type="submit"
                     disabled={isSubmitting}
                     className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black rounded-xl transition-all disabled:opacity-50"
                   >
                     {isSubmitting ? 'Saving...' : (editingCharity.id ? 'Save Changes' : 'Create Charity')}
                   </button>
                   <button 
                     type="button"
                     onClick={() => setEditingCharity(null)}
                     className="px-8 py-4 border border-zinc-800 bg-zinc-900 text-zinc-100 font-bold rounded-xl hover:bg-zinc-800 transition-all"
                   >
                     Cancel
                   </button>
                </div>
             </form>
          </div>
        ) : (
          <div className="hidden lg:flex flex-col items-center justify-center border-2 border-dashed border-zinc-900 rounded-3xl p-20 text-zinc-800">
             <Heart className="w-16 h-16 mb-6 opacity-5" />
             <p className="text-sm font-bold uppercase tracking-widest opacity-20 text-center max-w-xs">
                Select a charity to edit or create a new partner entry to highlight their impact.
             </p>
          </div>
        )}
      </div>
    </div>
  )
}