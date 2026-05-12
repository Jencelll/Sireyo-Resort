import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { Accommodation } from '../types';

interface NewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: { roomId?: string; type?: string };
  accommodations: Accommodation[];
  onAddBooking: (data: any) => Promise<void> | void;
}

const NewBookingModal = ({ isOpen, onClose, initialData, accommodations, onAddBooking }: NewBookingModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    guestName: '',
    pax: '',
    type: initialData?.type || 'DAYTOUR',
    roomId: initialData?.roomId || '',
    bookingSource: 'RESERVATION',
    date: new Date().toISOString().split('T')[0],
    eta: '',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        guestName: '',
        pax: '',
        type: initialData?.type || 'DAYTOUR',
        roomId: initialData?.roomId || '',
        bookingSource: 'RESERVATION',
        date: new Date().toISOString().split('T')[0],
        eta: '',
      }));
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onAddBooking(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-surface rounded-[32px] overflow-hidden shadow-2xl border border-on-surface/5"
      >
        <div className="p-8 lg:p-12">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="font-headline font-medium text-4xl text-on-surface tracking-tight">New Booking</h2>
              <p className="text-on-surface-variant mt-2 font-medium">Register a new guest for Sireyo Resort</p>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-surface-container rounded-2xl transition-colors">
              <X size={24} />
            </button>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1">Guest Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  className="w-full bg-surface-container border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl px-6 py-4 text-sm transition-all duration-300"
                  value={formData.guestName}
                  onChange={e => setFormData({ ...formData, guestName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1">Number of Guests</label>
                <input
                  type="number"
                  placeholder="e.g. 4"
                  className="w-full bg-surface-container border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl px-6 py-4 text-sm transition-all duration-300"
                  value={formData.pax}
                  onChange={e => setFormData({ ...formData, pax: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1">Booking Type</label>
                <select
                  className="w-full bg-surface-container border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl px-6 py-4 text-sm transition-all duration-300 appearance-none"
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="DAYTOUR">Daytour (08:00 - 17:00)</option>
                  <option value="OVERNIGHT">Overnight (18:00 - 07:00)</option>
                  <option value="EXTENDED STAY">Extended Stay</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1">Accommodation</label>
                <select
                  className="w-full bg-surface-container border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl px-6 py-4 text-sm transition-all duration-300 appearance-none"
                  value={formData.roomId}
                  onChange={e => setFormData({ ...formData, roomId: e.target.value })}
                  required
                >
                  <option value="">Select a unit...</option>
                  {accommodations.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1">Booking Source</label>
                <select
                  className="w-full bg-surface-container border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl px-6 py-4 text-sm transition-all duration-300 appearance-none"
                  value={formData.bookingSource}
                  onChange={e => {
                    const newSource = e.target.value;
                    let newEta = formData.eta;
                    if (newSource === 'WALK_IN' && !newEta) {
                      newEta = new Date().toTimeString().substring(0, 5);
                    }
                    setFormData({ ...formData, bookingSource: newSource, eta: newEta });
                  }}
                >
                  <option value="RESERVATION">Reservation</option>
                  <option value="WALK_IN">Walk-in</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1">Check-in Date</label>
                <input
                  type="date"
                  className="w-full bg-surface-container border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl px-6 py-4 text-sm transition-all duration-300"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1">
                  {formData.bookingSource === 'WALK_IN' ? 'Check-in Time' : 'Check-in Time (ETA)'}
                </label>
                <input
                  type="time"
                  className="w-full bg-surface-container border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl px-6 py-4 text-sm transition-all duration-300"
                  value={formData.eta}
                  onChange={e => setFormData({ ...formData, eta: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-6 flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-surface-container text-on-surface py-5 rounded-2xl font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-surface-container-highest transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-primary text-on-surface py-5 rounded-2xl font-bold text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Confirming...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default NewBookingModal;
