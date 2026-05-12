import React from 'react';
import { motion } from 'motion/react';
import { X, Users, Clock, Banknote, ShieldCheck } from 'lucide-react';
import { Booking } from '../types';

interface BookingDetailsModalProps {
  booking: Booking;
  onClose: () => void;
}

export const BookingDetailsModal = ({ booking, onClose }: BookingDetailsModalProps) => {
  const isDaytour = booking.type === 'DAYTOUR';
  const isOvernight = booking.type === 'OVERNIGHT';

  // Determine theme colors based on booking type
  const theme = {
    text: isDaytour ? 'text-[#0072ff]' : isOvernight ? 'text-[#f12711]' : 'text-on-surface-variant',
    bg: isDaytour ? 'bg-[#0072ff]/10' : isOvernight ? 'bg-[#f12711]/10' : 'bg-on-surface/5',
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#0a0a0a]/40 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-[480px] bg-surface rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/20 border border-white/10"
      >
        <div className="p-8">
          {/* Header Row */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-[1rem] ${theme.bg} flex items-center justify-center`}>
                <span className={`text-xl font-black font-headline ${theme.text}`}>
                  {getInitials(booking.guestName || 'G')}
                </span>
              </div>
              <div>
                <h2 className="font-headline font-bold text-2xl text-on-surface leading-tight drop-shadow-sm">{booking.guestName}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">ID: {booking.id}</span>
                  <span className="w-1 h-1 rounded-full bg-on-surface/20"></span>
                  <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-md ${theme.bg} ${theme.text}`}>
                    {booking.type}
                  </span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 bg-surface-container hover:bg-surface-container-highest rounded-full transition-all text-on-surface-variant"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Status & Payment Row */}
            <div className="flex gap-4">
              <div className="flex-1 p-5 bg-surface-container-lowest border border-on-surface/5 hover:border-on-surface/10 hover:shadow-md transition-all duration-300 rounded-[1.5rem] flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck size={14} className="text-on-surface-variant/50" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Status</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full shadow-inner ${booking.status === 'Confirmed' ? 'bg-[#f5af19]' : booking.status === 'Checked In' ? 'bg-[#00c6ff]' : 'bg-on-surface-variant'}`}></div>
                  <span className="font-bold text-on-surface">{booking.status || 'Pending'}</span>
                </div>
              </div>
              
              <div className="flex-1 p-5 bg-surface-container-lowest border border-on-surface/5 hover:border-on-surface/10 hover:shadow-md transition-all duration-300 rounded-[1.5rem] flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <Banknote size={14} className="text-on-surface-variant/50" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Payment</span>
                </div>
                <div className="flex flex-col">
                  <span className={`font-bold ${booking.paymentStatus === 'Paid Adv.' ? 'text-[#00c6ff]' : booking.paymentStatus === 'No Adv.' ? 'text-error' : 'text-on-surface'}`}>
                    {booking.paymentStatus}
                  </span>
                  {booking.advancePayment && (
                    <span className="text-[10px] font-bold text-on-surface-variant mt-0.5">₱{booking.advancePayment} Advanced</span>
                  )}
                </div>
              </div>
            </div>

            {/* Grid Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-surface-container-lowest border border-on-surface/5 hover:border-on-surface/10 hover:shadow-md transition-all duration-300 rounded-[1.5rem] flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${theme.bg} ${theme.text}`}>
                  <Users size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-0.5">Guests</p>
                  <p className="font-bold text-sm text-on-surface leading-none">{booking.pax} Pax</p>
                </div>
              </div>
              
              <div className="p-5 bg-surface-container-lowest border border-on-surface/5 hover:border-on-surface/10 hover:shadow-md transition-all duration-300 rounded-[1.5rem] flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${theme.bg} ${theme.text}`}>
                  <Clock size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-0.5">Arrival</p>
                  <p className="font-bold text-sm text-on-surface leading-none">{booking.eta || 'Walk-in'}</p>
                </div>
              </div>
            </div>
            
            {/* Walkin badge if true */}
            {(booking.isWalkIn || booking.eta?.toLowerCase()?.includes('walk-in')) && (
               <div className="mt-4 w-full flex items-center justify-center p-3.5 rounded-xl bg-secondary/10 border border-secondary/20">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Walk-in Guest</span>
               </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
