import React from 'react';
import { motion } from 'motion/react';
import { Users, Clock, ChevronRight, Plus, LogOut } from 'lucide-react';
import { Booking } from '../types';

export const BookingCard = ({ booking, onCheckout, onClick }: { booking: Booking, onCheckout?: () => void, onClick?: () => void }) => {
  const isDaytour = booking.type === 'DAYTOUR';
  const isOvernight = booking.type === 'OVERNIGHT';
  const isExtended = booking.type === 'EXTENDED STAY';
  const isWalkIn = booking.isWalkIn || booking.eta?.toLowerCase().includes('walk-in');
  const isReservation = !isWalkIn;

  let bgColor = 'bg-surface-container';
  let accentColor = 'bg-primary';
  let borderColor = 'border-on-surface/5';

  if (isDaytour) {
    bgColor = 'bg-tertiary/5';
    accentColor = 'bg-tertiary';
    borderColor = 'border-tertiary/10';
  } else if (isOvernight) {
    bgColor = 'bg-primary/5';
    accentColor = 'bg-primary';
    borderColor = 'border-primary/10';
  } else if (isExtended) {
    bgColor = 'bg-surface-container-highest';
    accentColor = 'bg-on-surface';
    borderColor = 'border-on-surface/10';
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={`relative p-4 lg:p-5 rounded-2xl ${bgColor} border ${borderColor} flex flex-col gap-3 h-full min-h-[100px] lg:min-h-[120px] group cursor-pointer transition-all duration-300`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-lg text-[8px] font-bold tracking-widest uppercase ${accentColor} text-on-surface shadow-sm`}>
            {booking.type}
          </span>
          {booking.status && (
            <span className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-widest text-on-surface-variant/60">
              <span className={`w-1.5 h-1.5 rounded-full ${booking.status === 'Checked In' ? 'bg-tertiary' : 'bg-primary'}`}></span>
              {booking.status}
            </span>
          )}
          {isWalkIn && (
            <span className="px-2 py-0.5 rounded-md bg-secondary text-on-secondary text-[7px] font-black uppercase tracking-tighter animate-pulse">
              Walk-in
            </span>
          )}
          {isReservation && (
            <span className="px-2 py-0.5 rounded-md bg-on-surface/10 text-on-surface text-[7px] font-black uppercase tracking-tighter">
              Reservation
            </span>
          )}
        </div>
        {booking.eta && (
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-bold uppercase tracking-widest text-on-surface-variant/40">ETA</span>
            <span className="text-[10px] font-bold text-on-surface-variant">{booking.eta}</span>
          </div>
        )}
      </div>

      <div className="mt-1">
        <p className="text-sm lg:text-base font-headline font-medium text-on-surface leading-tight group-hover:text-primary transition-colors">{booking.guestName}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-on-surface/5 flex items-center justify-center">
              <Users size={10} className="text-on-surface-variant" />
            </div>
            <span className="text-[10px] font-medium text-on-surface-variant">
              {booking.pax} Pax {booking.minorCount ? `(${booking.minorCount}M)` : ''}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`w-5 h-5 rounded-md ${booking.paymentStatus === 'Paid Adv.' ? 'bg-tertiary/10' : 'bg-error/10'} flex items-center justify-center`}>
              <Clock size={10} className={booking.paymentStatus === 'Paid Adv.' ? 'text-tertiary' : 'text-error'} />
            </div>
            <span className={`text-[10px] font-bold ${booking.paymentStatus === 'Paid Adv.' ? 'text-tertiary' : 'text-error'}`}>
              {booking.paymentStatus} {booking.advancePayment ? `₱${booking.advancePayment}` : ''}
            </span>
          </div>
        </div>
      </div>

      {isExtended && (
        <div className="mt-auto flex justify-between items-center border-t border-on-surface/5 pt-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">Active Stay</span>
          </div>
          <ChevronRight size={14} className="text-on-surface-variant/40 group-hover:text-primary transition-colors" />
        </div>
      )}

      {onCheckout && (booking.status === 'Checked In' || booking.status === 'Confirmed') && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onCheckout();
          }}
          className="absolute right-3 top-3 p-2 rounded-xl bg-surface hover:bg-error/10 hover:text-error text-on-surface-variant opacity-0 transform scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 shadow-sm border border-on-surface/5 z-10 hidden lg:flex"
          title="Check Out Guest"
        >
          <LogOut size={14} />
        </button>
      )}
    </motion.div>
  );
};

export const EmptySlot = ({ type, onBook }: { type: 'Daytour' | 'Overnight', onBook?: () => void }) => (
  <motion.div
    onClick={onBook}
    whileHover={{ scale: 0.99 }}
    className="h-full min-h-[80px] lg:min-h-[120px] rounded-2xl border-2 border-dashed border-on-surface/5 flex flex-col items-center justify-center gap-2 group hover:border-primary/20 transition-all cursor-pointer bg-surface-container/10"
  >
    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant/20 group-hover:bg-primary/10 group-hover:text-primary transition-all">
      <Plus size={18} />
    </div>
    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/30 group-hover:text-primary/60 transition-colors">Book {type}</span>
  </motion.div>
);
