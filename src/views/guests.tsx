import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Edit3, UserPlus, Search, Bed, Trash2, MoreHorizontal, User, Edit } from 'lucide-react';
import { Guest } from '../types';

const GuestListView = ({ guests, onUpdateGuest, onDeleteGuest }: { guests: Guest[], onUpdateGuest: (id: string, field: keyof Guest, value: any) => void, onDeleteGuest: (id: string) => void }) => {
  const [filter, setFilter] = useState<'all' | 'OVERNIGHT' | 'DAYTOUR'>('all');
  const [search, setSearch] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const filteredGuests = guests.filter(guest => {
    const matchesFilter = filter === 'all' || guest.type === filter;
    const matchesSearch = guest.name.toLowerCase().includes(search.toLowerCase()) || guest.room.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    if (activeMenuId) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeMenuId]);

  return (
    <div className="space-y-8 p-6 lg:p-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <h2 className="font-headline font-medium text-3xl lg:text-5xl text-on-surface tracking-tight">Guest Registry</h2>
          <p className="text-on-surface-variant font-medium mt-2 tracking-wide text-xs lg:text-base">Managing {guests.length} total guests in your sanctuary</p>
        </motion.div>
        <div className="flex gap-3">
          <button onClick={() => setIsEditing(!isEditing)} className={`flex items-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl text-[10px] lg:text-xs font-bold tracking-widest uppercase transition-all duration-300 ${isEditing ? 'bg-tertiary text-on-tertiary shadow-lg shadow-tertiary/20' : 'bg-surface-container-lowest border border-on-surface/5 hover:bg-surface-container'}`}>
            {isEditing ? <Check size={16} /> : <Edit3 size={16} />} <span>{isEditing ? 'Save Changes' : 'Edit Registry'}</span>
          </button>
          <button className="flex items-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-primary text-on-surface rounded-xl text-[10px] lg:text-xs font-bold tracking-widest uppercase shadow-xl shadow-primary/20 hover:scale-105 transition-all duration-300">
            <UserPlus size={18} strokeWidth={2} /> <span>Add Guest</span>
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-[2.5rem] overflow-hidden border border-on-surface/5">
        <div className="p-6 lg:p-8 border-b border-on-surface/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-2 p-1 bg-surface-container rounded-2xl w-fit">
            {(['all', 'OVERNIGHT', 'DAYTOUR'] as const).map((t) => (
              <button key={t} onClick={() => setFilter(t)} className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${filter === t ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>{t}</button>
            ))}
          </div>
          <div className="relative group w-full md:w-72">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
            <input type="text" placeholder="Search guests or rooms..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-surface-container border-none focus:ring-2 focus:ring-primary/20 rounded-2xl pl-12 pr-6 py-3 text-sm font-medium placeholder:text-on-surface-variant/30" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container/30"><th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">Guest</th><th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">Status</th><th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">Accommodation</th><th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">Type</th><th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-on-surface/5">
              {filteredGuests.map((guest) => (
                <motion.tr key={guest.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-surface-container/20 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img src={guest.image} alt={guest.name} className="w-10 h-10 rounded-full object-cover border-2 border-primary/10" referrerPolicy="no-referrer" />
                      <div>
                        {isEditing ? <input type="text" value={guest.name} onChange={(e) => onUpdateGuest(guest.id, 'name', e.target.value)} className="bg-surface-container border border-on-surface/5 rounded-lg px-2 py-1 text-sm font-bold text-on-surface focus:ring-1 focus:ring-primary outline-none" /> : <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{guest.name}</p>}
                        {isEditing ? <input type="email" value={guest.email || ''} onChange={(e) => onUpdateGuest(guest.id, 'email', e.target.value)} className="bg-surface-container border border-on-surface/5 rounded-lg px-2 py-1 text-[10px] text-on-surface-variant/60 font-medium focus:ring-1 focus:ring-primary outline-none mt-1 w-full" /> : <p className="text-[10px] text-on-surface-variant/60 font-medium">{guest.email || 'no-email@sireyo.com'}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {isEditing ? (
                      <select value={guest.status} onChange={(e) => onUpdateGuest(guest.id, 'status', e.target.value)} className="bg-surface-container border border-on-surface/5 rounded-lg px-2 py-1 text-[9px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-primary outline-none"><option value="In-House">In-House</option><option value="Checked Out">Checked Out</option><option value="Upcoming">Upcoming</option></select>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${guest.status === 'In-House' ? 'bg-tertiary/10 text-tertiary' : guest.status === 'Checked Out' ? 'bg-on-surface/5 text-on-surface-variant' : 'bg-primary/10 text-primary'}`}>{guest.status || 'Upcoming'}</span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <Bed size={14} className="text-primary/40" />
                      {isEditing ? <input type="text" value={guest.room} onChange={(e) => onUpdateGuest(guest.id, 'room', e.target.value)} className="bg-surface-container border border-on-surface/5 rounded-lg px-2 py-1 text-xs font-medium focus:ring-1 focus:ring-primary outline-none" /> : <span className="text-xs font-medium">{guest.room}</span>}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${guest.type === 'OVERNIGHT' ? 'bg-primary' : 'bg-secondary'}`} />
                      {isEditing ? <select value={guest.type} onChange={(e) => onUpdateGuest(guest.id, 'type', e.target.value)} className="bg-surface-container border border-on-surface/5 rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-primary outline-none"><option value="OVERNIGHT">OVERNIGHT</option><option value="DAYTOUR">DAYTOUR</option></select> : <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{guest.type}</span>}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right relative">
                    {isEditing ? <button onClick={() => onDeleteGuest(guest.id)} className="p-2 text-error hover:bg-error/10 rounded-xl transition-all"><Trash2 size={18} /></button> : <button onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === guest.id ? null : guest.id); }} className={`p-2 rounded-xl transition-all ${activeMenuId === guest.id ? 'bg-primary text-on-surface' : 'hover:bg-surface-container text-on-surface-variant hover:text-primary'}`}><MoreHorizontal size={18} /></button>}
                    <AnimatePresence>
                      {activeMenuId === guest.id && (
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }} className="absolute right-8 top-16 z-50 w-48 bg-surface-container-highest border border-on-surface/10 rounded-2xl shadow-2xl overflow-hidden p-2">
                          <button className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-xl transition-all"><User size={14} /> View Profile</button>
                          <button className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-xl transition-all"><Edit size={14} /> Edit Guest</button>
                          <div className="h-px bg-on-surface/5 my-1" />
                          <button className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-error hover:bg-error/5 rounded-xl transition-all"><Trash2 size={14} /> Remove Guest</button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GuestListView;
