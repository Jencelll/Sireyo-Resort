import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Check, Edit3, Trash2, Sparkles, ChevronRight } from 'lucide-react';
import { Guest } from '../types';

interface GroundsListViewProps {
  guests: Guest[];
  onUpdateGuest: (id: string, field: keyof Guest, value: any) => void;
  onDeleteGuest: (id: string) => void;
}

const GroundsListView = ({ guests, onUpdateGuest, onDeleteGuest }: GroundsListViewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const groundsGuests = guests.filter(g => g.room.toLowerCase().includes('grounds'));
  const totalPax = groundsGuests.reduce((sum, g) => sum + g.guests, 0);

  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    if (activeMenuId) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeMenuId]);

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h2 className="font-headline font-medium text-4xl lg:text-6xl text-on-surface tracking-tight">Grounds Guest List</h2>
          <p className="text-on-surface-variant font-medium mt-3 tracking-wide text-sm lg:text-lg opacity-60">
            Currently hosting <span className="text-primary font-bold">{totalPax}</span> guests in the open grounds area
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${isEditing ? 'bg-tertiary text-on-tertiary shadow-lg shadow-tertiary/20' : 'bg-surface-container-lowest border border-on-surface/5 hover:bg-surface-container'}`}
          >
            {isEditing ? <Check size={16} /> : <Edit3 size={16} />}
            <span>{isEditing ? 'Save' : 'Edit'}</span>
          </button>
          <div className="px-6 py-4 bg-surface-container rounded-2xl border border-on-surface/5 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1">Groups</p>
            <p className="text-2xl font-headline font-medium text-on-surface">{groundsGuests.length}</p>
          </div>
          <div className="px-6 py-4 bg-primary/10 rounded-2xl border border-primary/10 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mb-1">Pax</p>
            <p className="text-2xl font-headline font-medium text-primary">{totalPax}</p>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-[2.5rem] border border-on-surface/5 overflow-hidden shadow-2xl shadow-on-surface/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container/20 border-b border-on-surface/5">
                <th className="p-6 text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/50">Guest / Group</th>
                <th className="p-6 text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/50 text-center">Pax</th>
                <th className="p-6 text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/50 text-center">Type</th>
                <th className="p-6 text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/50 text-center">Status</th>
                <th className="p-6 text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/50 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-on-surface/5">
              {groundsGuests.length > 0 ? (
                groundsGuests.map(guest => (
                  <tr key={guest.id} className="group hover:bg-surface-container/30 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <img src={guest.image} alt={guest.name} className="w-10 h-10 rounded-full object-cover border border-on-surface/10" />
                        <div>
                          {isEditing ? (
                            <input type="text" value={guest.name} onChange={e => onUpdateGuest(guest.id, 'name', e.target.value)} className="bg-surface-container border border-on-surface/5 rounded-lg px-2 py-1 text-sm font-bold text-on-surface focus:ring-1 focus:ring-primary outline-none" />
                          ) : (
                            <p className="font-headline font-medium text-on-surface group-hover:text-primary transition-colors">{guest.name}</p>
                          )}
                          <p className="text-[10px] text-on-surface-variant/60 font-medium uppercase tracking-widest">{guest.email || 'No email provided'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      {isEditing ? (
                        <input type="number" value={guest.guests} onChange={e => onUpdateGuest(guest.id, 'guests', parseInt(e.target.value))} className="w-16 bg-surface-container border border-on-surface/5 rounded-lg px-2 py-1 text-sm font-bold text-on-surface focus:ring-1 focus:ring-primary outline-none text-center" />
                      ) : (
                        <span className="px-3 py-1 bg-surface-container rounded-lg font-mono text-sm font-bold text-on-surface">{guest.guests}</span>
                      )}
                    </td>
                    <td className="p-6 text-center">
                      <span className={`px-2.5 py-1 rounded-lg text-[8px] font-bold tracking-widest uppercase ${guest.type === 'DAYTOUR' ? 'bg-tertiary/10 text-tertiary' : 'bg-primary/10 text-primary'}`}>{guest.type}</span>
                    </td>
                    <td className="p-6 text-center">
                      {isEditing ? (
                        <select value={guest.status} onChange={e => onUpdateGuest(guest.id, 'status', e.target.value)} className="bg-surface-container border border-on-surface/5 rounded-lg px-2 py-1 text-[9px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-primary outline-none">
                          <option value="In-House">In-House</option>
                          <option value="Checked Out">Checked Out</option>
                          <option value="Upcoming">Upcoming</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${guest.status === 'In-House' ? 'bg-tertiary/10 text-tertiary' : guest.status === 'Checked Out' ? 'bg-on-surface/5 text-on-surface-variant' : 'bg-primary/10 text-primary'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${guest.status === 'In-House' ? 'bg-tertiary' : guest.status === 'Checked Out' ? 'bg-on-surface-variant/40' : 'bg-primary'}`}></span>
                          {guest.status}
                        </span>
                      )}
                    </td>
                    <td className="p-6 text-right relative">
                      <button onClick={e => { e.stopPropagation(); setActiveMenuId(activeMenuId === guest.id ? null : guest.id); }} className="p-2 hover:bg-primary/10 text-on-surface-variant hover:text-primary rounded-xl transition-all">
                        <ChevronRight size={18} className={`transition-transform duration-300 ${activeMenuId === guest.id ? 'rotate-90' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {activeMenuId === guest.id && (
                          <motion.div initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }} className="absolute right-6 top-16 w-48 bg-surface-container-lowest border border-on-surface/5 rounded-2xl shadow-2xl z-50 overflow-hidden">
                            <div className="p-2 space-y-1">
                              <button onClick={() => { onUpdateGuest(guest.id, 'status', guest.status === 'Checked Out' ? 'In-House' : 'Checked Out'); setActiveMenuId(null); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-all">
                                <Sparkles size={16} />
                                {guest.status === 'Checked Out' ? 'Check In' : 'Check Out'}
                              </button>
                              <button onClick={() => { onDeleteGuest(guest.id); setActiveMenuId(null); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-error hover:bg-error/5 transition-all">
                                <Trash2 size={16} />
                                Remove Group
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-20">
                      <Users size={48} strokeWidth={1} />
                      <p className="text-sm font-bold uppercase tracking-widest">No guests currently in grounds</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GroundsListView;
