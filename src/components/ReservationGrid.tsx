import React from 'react';
import { motion } from 'motion/react';
import { Users, Home, MapPin, Waves, Palmtree, Tent, Moon, Clock, Search, CalendarDays, Printer, Plus } from 'lucide-react';
import { Accommodation } from '../types';
import { BookingCard, EmptySlot } from './BookingCard';
import { useState } from 'react';

import { AccommodationCalendar } from './AccommodationCalendar';
import { BookingDetailsModal } from './BookingDetailsModal';
import { Booking } from '../types';

export const getAccommodationIcon = (name: string, size: number = 24) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('tent')) return <Tent size={size} strokeWidth={1.5} />;
  if (lowerName.includes('payag')) return <Waves size={size} strokeWidth={1.5} />;
  if (lowerName.includes('kubo')) return <Palmtree size={size} strokeWidth={1.5} />;
  if (lowerName.includes('hall')) return <Users size={size} strokeWidth={1.5} />;
  if (lowerName.includes('house')) return <Home size={size} strokeWidth={1.5} />;
  if (lowerName.includes('grounds')) return <MapPin size={size} strokeWidth={1.5} />;
  return <Home size={size} strokeWidth={1.5} />;
};

interface ReservationGridProps {
  accommodations: Accommodation[];
  onNewBooking: (room?: string, type?: string) => void;
  onViewGrounds: () => void;
  onCheckoutGuest?: (roomId: string, bookingId: string, bookingType: 'DAYTOUR' | 'OVERNIGHT' | 'EXTENDED STAY') => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const ReservationGrid = ({ accommodations, onNewBooking, onViewGrounds, onCheckoutGuest, selectedDate, onDateChange }: ReservationGridProps) => {
  const [activeFilter, setActiveFilter] = useState('All Units');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccommodation, setSelectedAccommodation] = useState<Accommodation | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Use local timezone format to avoid shift
  const formatForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    const [year, month, day] = e.target.value.split('-');
    onDateChange(new Date(Number(year), Number(month) - 1, Number(day)));
  };

  const filteredAccommodations = accommodations.filter(acc => {
    const matchesSearch = acc.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeFilter === 'All Units') return true;
    if (activeFilter === 'Cottages') return acc.name.toLowerCase().includes('cottage');
    if (activeFilter === 'Payags') return acc.name.toLowerCase().includes('payag');
    if (activeFilter === 'Grounds') return acc.name.toLowerCase().includes('grounds');
    if (activeFilter === 'Reservation') {
      const isRes = (b?: any) => b && !(b.isWalkIn || b.eta?.toLowerCase().includes('walk-in'));
      return isRes(acc.daytourBooking) || isRes(acc.overnightBooking) || isRes(acc.extendedBooking);
    }
    if (activeFilter === 'Walk-in') {
      const isWalk = (b?: any) => b && (b.isWalkIn || b.eta?.toLowerCase().includes('walk-in'));
      return isWalk(acc.daytourBooking) || isWalk(acc.overnightBooking) || isWalk(acc.extendedBooking);
    }
    return true;
  });

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
      <div className="mb-10 lg:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative"
        >
          <div className="absolute -left-4 top-0 w-1 h-full bg-primary rounded-full opacity-20"></div>
          <h2 className="font-headline font-medium text-4xl lg:text-6xl text-on-surface tracking-tight">Reservation Grid</h2>
          <p className="text-on-surface-variant font-medium mt-3 tracking-wide text-sm lg:text-lg opacity-60">
            Managing <span className="text-on-surface font-bold">{filteredAccommodations.length}</span> luxury accommodations for {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search units..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-11 pr-6 py-3 bg-surface-container-lowest border border-on-surface/5 rounded-2xl text-xs font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all w-64"
            />
          </div>

          <div className="flex flex-wrap bg-surface-container p-1.5 rounded-2xl border border-on-surface/5">
            {['All Units', 'Cottages', 'Payags', 'Grounds', 'Reservation', 'Walk-in'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 lg:px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeFilter === tab ? 'bg-surface-container-lowest shadow-lg text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeFilter === 'Grounds' && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={onViewGrounds}
              className="flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary border border-primary/20 rounded-2xl text-[10px] font-bold tracking-widest uppercase hover:bg-primary/20 transition-all shadow-sm"
            >
              <Users size={16} />
              View Grounds Guest List
            </motion.button>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="p-3 bg-surface-container-lowest border border-on-surface/5 rounded-2xl text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all shadow-sm"
              title="Print Log"
            >
              <Printer size={18} />
            </button>
            <div className="relative">
              <button 
                onClick={(e) => {
                  try {
                    const input = e.currentTarget.nextElementSibling as HTMLInputElement;
                    if (input && 'showPicker' in input) {
                      input.showPicker();
                    } else {
                      input?.focus();
                    }
                  } catch (err) {
                    console.log("Picker failed", err);
                  }
                }}
                className="flex items-center gap-3 px-5 py-3 bg-surface-container-lowest border border-on-surface/5 rounded-2xl text-[10px] font-bold tracking-widest uppercase text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all shadow-sm"
              >
                <CalendarDays size={16} />
                <span className="hidden sm:inline">{selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </button>
              <input
                type="date"
                value={formatForInput(selectedDate)}
                onChange={handleDateChange}
                className="absolute right-0 top-0 opacity-0 pointer-events-none"
                style={{ width: '1px', height: '1px' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-[2.5rem] border border-on-surface/5 overflow-hidden shadow-2xl shadow-on-surface/5">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <div className="min-w-[1000px]">
            <div className="grid grid-cols-[1.8fr_2fr_2fr] border-b border-on-surface/5 bg-surface-container/20">
              <div className="p-6 text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/50">Accommodation</div>
              <div className="p-6 text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/50 text-center border-l border-on-surface/5">Daytour <span className="text-[8px] opacity-40 ml-2">(08:00 - 17:00)</span></div>
              <div className="p-6 text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/50 text-center border-l border-on-surface/5">Overnight <span className="text-[8px] opacity-40 ml-2">(18:00 - 07:00)</span></div>
            </div>
            <div className="divide-y divide-on-surface/5">
              {filteredAccommodations.map((acc, idx) => (
                <motion.div
                  key={acc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="grid grid-cols-[1.8fr_2fr_2fr] items-stretch group hover:bg-surface-container/5 transition-colors"
                >
                  <div className="p-6 lg:p-8 flex items-center gap-5">
                    <div className="relative cursor-pointer" onClick={() => setSelectedAccommodation(acc)}>
                      <div className="p-4 bg-surface-container rounded-2xl text-primary group-hover:scale-110 transition-transform duration-500">
                        {getAccommodationIcon(acc.name, 24)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-tertiary border-2 border-surface-container-lowest rounded-full"></div>
                    </div>
                    <div className="cursor-pointer" onClick={() => setSelectedAccommodation(acc)}>
                      <p className="text-lg font-headline font-medium text-on-surface group-hover:text-primary transition-colors flex items-center gap-2">
                        {acc.name}
                        <CalendarDays size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40 bg-on-surface/5 px-2 py-0.5 rounded-md">{acc.capacity}</span>
                        <span className="w-1 h-1 rounded-full bg-on-surface/10"></span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">{acc.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 lg:p-6 border-l border-on-surface/5">
                    {acc.name.includes('Grounds') ? (
                      <div className="h-full flex flex-col gap-2">
                        <button onClick={() => onNewBooking(acc.id, 'DAYTOUR')} className="flex-1 flex items-center justify-center gap-2 bg-primary/5 hover:bg-primary/10 text-primary rounded-2xl border border-dashed border-primary/20 transition-all text-[10px] font-bold tracking-widest uppercase group/groundsadd">
                          <Plus size={16} className="group-hover/groundsadd:scale-110 transition-transform" /> Book Daytour
                        </button>
                        <button onClick={onViewGrounds} className="py-3 flex items-center justify-center gap-2 bg-surface-container hover:bg-surface-container-high rounded-xl text-[9px] font-bold tracking-widest uppercase text-on-surface-variant transition-all">
                          <Users size={14} /> Guest List
                        </button>
                      </div>
                    ) : acc.extendedBooking ? (
                      <div className="col-span-2 h-full"><BookingCard booking={acc.extendedBooking} onCheckout={() => onCheckoutGuest?.(acc.id, acc.extendedBooking!.id, 'EXTENDED STAY')} onClick={() => setSelectedBooking(acc.extendedBooking!)} /></div>
                    ) : acc.daytourBooking ? (
                      <BookingCard booking={acc.daytourBooking} onCheckout={() => onCheckoutGuest?.(acc.id, acc.daytourBooking!.id, 'DAYTOUR')} onClick={() => setSelectedBooking(acc.daytourBooking!)} />
                    ) : (
                      <EmptySlot type="Daytour" onBook={() => onNewBooking(acc.id, 'DAYTOUR')} />
                    )}
                  </div>

                  <div className="p-4 lg:p-6 border-l border-on-surface/5">
                    {acc.name.includes('Grounds') ? (
                      <div className="h-full flex flex-col gap-2">
                        <button onClick={() => onNewBooking(acc.id, 'OVERNIGHT')} className="flex-1 flex items-center justify-center gap-2 bg-tertiary/5 hover:bg-tertiary/10 text-tertiary rounded-2xl border border-dashed border-tertiary/20 transition-all text-[10px] font-bold tracking-widest uppercase group/groundsadd">
                          <Plus size={16} className="group-hover/groundsadd:scale-110 transition-transform" /> Book Overnight
                        </button>
                        <button onClick={onViewGrounds} className="py-3 flex items-center justify-center gap-2 bg-surface-container hover:bg-surface-container-high rounded-xl text-[9px] font-bold tracking-widest uppercase text-on-surface-variant transition-all">
                          <Moon size={14} /> Guest List
                        </button>
                      </div>
                    ) : acc.extendedBooking ? (
                      <div className="h-full flex flex-col items-center justify-center text-on-surface-variant/10 gap-3">
                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-on-surface/10 flex items-center justify-center">
                          <Clock size={24} strokeWidth={1} />
                        </div>
                        <span className="text-[8px] font-bold uppercase tracking-widest">Extended Stay Active</span>
                      </div>
                    ) : acc.overnightBooking ? (
                      <BookingCard booking={acc.overnightBooking} onCheckout={() => onCheckoutGuest?.(acc.id, acc.overnightBooking!.id, 'OVERNIGHT')} onClick={() => setSelectedBooking(acc.overnightBooking!)} />
                    ) : (
                      <EmptySlot type="Overnight" onBook={() => onNewBooking(acc.id, 'OVERNIGHT')} />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-on-surface/5">
          {filteredAccommodations.map((acc, idx) => (
            <motion.div
              key={acc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-6 space-y-6"
            >
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setSelectedAccommodation(acc)}>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-surface-container rounded-xl text-primary">{getAccommodationIcon(acc.name, 20)}</div>
                  <div>
                    <p className="text-base font-headline font-medium text-on-surface flex items-center gap-2">
                       {acc.name}
                       <CalendarDays size={14} className="text-primary"/>
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40 mt-0.5">{acc.capacity} • {acc.location}</p>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-tertiary"></div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-tertiary/40"></div>
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">Daytour</span>
                    </div>
                    <span className="text-[9px] font-medium text-on-surface-variant/40">08:00 - 17:00</span>
                  </div>
                  {acc.name.includes('Grounds') ? (
                    <div className="flex gap-2 h-[80px]">
                      <button onClick={() => onNewBooking(acc.id, 'DAYTOUR')} className="flex-1 flex flex-col items-center justify-center gap-1.5 bg-primary/5 hover:bg-primary/10 text-primary rounded-2xl border border-dashed border-primary/20 transition-all">
                        <Plus size={18} />
                        <span className="text-[9px] font-bold tracking-widest uppercase">Book</span>
                      </button>
                      <button onClick={onViewGrounds} className="flex-1 flex flex-col items-center justify-center gap-1.5 bg-surface-container hover:bg-surface-container-high rounded-2xl text-on-surface-variant transition-all">
                        <Users size={18} />
                        <span className="text-[9px] font-bold tracking-widest uppercase">List</span>
                      </button>
                    </div>
                  ) : acc.extendedBooking ? (
                    <BookingCard booking={acc.extendedBooking} onCheckout={() => onCheckoutGuest?.(acc.id, acc.extendedBooking!.id, 'EXTENDED STAY')} onClick={() => setSelectedBooking(acc.extendedBooking!)} />
                  ) : acc.daytourBooking ? (
                    <BookingCard booking={acc.daytourBooking} onCheckout={() => onCheckoutGuest?.(acc.id, acc.daytourBooking!.id, 'DAYTOUR')} onClick={() => setSelectedBooking(acc.daytourBooking!)} />
                  ) : (
                    <EmptySlot type="Daytour" onBook={() => onNewBooking(acc.id, 'DAYTOUR')} />
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">Overnight</span>
                    </div>
                    <span className="text-[9px] font-medium text-on-surface-variant/40">18:00 - 07:00</span>
                  </div>
                  {acc.name.includes('Grounds') ? (
                    <div className="flex gap-2 h-[80px]">
                      <button onClick={() => onNewBooking(acc.id, 'OVERNIGHT')} className="flex-1 flex flex-col items-center justify-center gap-1.5 bg-tertiary/5 hover:bg-tertiary/10 text-tertiary rounded-2xl border border-dashed border-tertiary/20 transition-all">
                        <Plus size={18} />
                        <span className="text-[9px] font-bold tracking-widest uppercase">Book</span>
                      </button>
                      <button onClick={onViewGrounds} className="flex-1 flex flex-col items-center justify-center gap-1.5 bg-surface-container hover:bg-surface-container-high rounded-2xl text-on-surface-variant transition-all">
                        <Moon size={18} />
                        <span className="text-[9px] font-bold tracking-widest uppercase">List</span>
                      </button>
                    </div>
                  ) : acc.extendedBooking ? (
                    <div className="h-20 flex flex-col items-center justify-center bg-surface-container/10 rounded-2xl border border-dashed border-on-surface/10 gap-2">
                      <Clock size={20} strokeWidth={1} className="text-on-surface-variant/20" />
                      <span className="text-[8px] font-bold uppercase tracking-widest text-on-surface-variant/20">Extended Stay</span>
                    </div>
                  ) : acc.overnightBooking ? (
                    <BookingCard booking={acc.overnightBooking} onCheckout={() => onCheckoutGuest?.(acc.id, acc.overnightBooking!.id, 'OVERNIGHT')} onClick={() => setSelectedBooking(acc.overnightBooking!)} />
                  ) : (
                    <EmptySlot type="Overnight" onBook={() => onNewBooking(acc.id, 'OVERNIGHT')} />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedAccommodation && (
        <AccommodationCalendar
          accommodation={selectedAccommodation}
          onClose={() => setSelectedAccommodation(null)}
        />
      )}

      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
};

export default ReservationGrid;
