import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { X, CalendarDays, Clock } from 'lucide-react';
import { Booking } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  booking: Booking | null;
  onClose: () => void;
  onConfirm: (payload: { checkOutDate: string; checkOutTime: string }) => Promise<void> | void;
}

const formatToday = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatNowTime = () => {
  const now = new Date();
  return now.toTimeString().slice(0, 5);
};

const CheckoutModal = ({ isOpen, booking, onClose, onConfirm }: CheckoutModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [checkOutDate, setCheckOutDate] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');

  useEffect(() => {
    if (isOpen && booking) {
      setCheckOutDate(booking.checkOutDate || formatToday());
      setCheckOutTime(booking.checkOutTime || formatNowTime());
    }
  }, [isOpen, booking]);

  if (!isOpen || !booking) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onConfirm({ checkOutDate, checkOutTime });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        className="relative w-full max-w-[520px] bg-surface rounded-[2.5rem] overflow-hidden shadow-2xl border border-on-surface/5"
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="font-headline font-bold text-2xl text-on-surface">{booking.guestName}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">ID: {booking.id}</span>
                <span className="w-1 h-1 rounded-full bg-on-surface/20"></span>
                <span className="text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-md bg-primary/10 text-primary">
                  {booking.type}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 bg-surface-container hover:bg-surface-container-highest rounded-full transition-all text-on-surface-variant">
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1 flex items-center gap-2">
                  <CalendarDays size={12} /> Check-out Date
                </label>
                <input
                  type="date"
                  className="w-full bg-surface-container border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl px-5 py-3 text-sm transition-all duration-300"
                  value={checkOutDate}
                  onChange={e => setCheckOutDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1 flex items-center gap-2">
                  <Clock size={12} /> Check-out Time
                </label>
                <input
                  type="time"
                  className="w-full bg-surface-container border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl px-5 py-3 text-sm transition-all duration-300"
                  value={checkOutTime}
                  onChange={e => setCheckOutTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-surface-container text-on-surface py-4 rounded-2xl font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-surface-container-highest transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-primary text-on-surface py-4 rounded-2xl font-bold text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Checking out...' : 'Confirm Checkout'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutModal;
