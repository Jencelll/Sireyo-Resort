import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { Accommodation } from '../types';

interface NewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: { roomId?: string; type?: string };
  accommodations: Accommodation[];
  accommodationsError?: string | null;
  onAddBooking: (data: any) => Promise<void> | void;
}

const NewBookingModal = ({ isOpen, onClose, initialData, accommodations, accommodationsError, onAddBooking }: NewBookingModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    guestName: '',
    contactNumber: '',
    address: '',
    pax: '',
    minorCount: '',
    type: initialData?.type || 'DAYTOUR',
    roomId: initialData?.roomId || '',
    bookingSource: 'RESERVATION',
    advancePayment: '',
    paymentMethod: '',
    referenceNo: '',
    date: new Date().toISOString().split('T')[0],
    checkOutDate: '',
    checkOutTime: '',
    eta: '',
    specialRequest: '',
    remarks: '',
  });

  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setFormData(prev => ({
        ...prev,
        guestName: '',
        contactNumber: '',
        address: '',
        pax: '',
        minorCount: '',
        type: initialData?.type || 'DAYTOUR',
        roomId: initialData?.roomId || '',
        bookingSource: 'RESERVATION',
        advancePayment: '',
        paymentMethod: '',
        referenceNo: '',
        date: new Date().toISOString().split('T')[0],
        checkOutDate: '',
        checkOutTime: '',
        eta: '',
        specialRequest: '',
        remarks: '',
      }));
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!formData.roomId) {
      setErrorMessage('Please select an accommodation.');
      return;
    }
    setIsLoading(true);
    try {
      await onAddBooking(formData);
    } catch (err) {
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        setErrorMessage('Unable to connect to the server. Please check that the backend is running.');
      } else {
        setErrorMessage(err instanceof Error ? err.message : 'Failed to create booking.');
      }
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
        className="relative w-full max-w-5xl max-h-[95vh] flex flex-col bg-surface rounded-[32px] overflow-hidden shadow-2xl border border-on-surface/5"
      >
        <div className="p-6 lg:p-8 overflow-y-auto flex-1 custom-scrollbar">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="font-headline font-medium text-3xl text-on-surface tracking-tight">New Booking</h2>
              <p className="text-on-surface-variant mt-1 text-sm font-medium">Register a new guest for Sireyo Resort</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-xl transition-colors">
              <X size={20} />
            </button>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1">Guest Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  className="w-full bg-surface-container border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl px-4 py-2.5 text-sm transition-all duration-300"
                  value={formData.guestName}
                  onChange={e => setFormData({ ...formData, guestName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1">Contact Number</label>
                <input
                  type="text"
                  placeholder="e.g. 09123456789"
                  className="w-full bg-surface-container border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl px-4 py-2.5 text-sm transition-all duration-300"
                  value={formData.contactNumber}
                  onChange={e => setFormData({ ...formData, contactNumber: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1">Address</label>
                <input
                  type="text"
                  placeholder="e.g. Manila"
                  className="w-full bg-surface-container border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl px-4 py-2.5 text-sm transition-all duration-300"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1">No. of Adult Guest</label>
                <input
                  type="number"
                  placeholder="e.g. 4"
                  className="w-full bg-surface-container border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl px-4 py-2.5 text-sm transition-all duration-300"
                  value={formData.pax}
                  onChange={e => setFormData({ ...formData, pax: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1">No. of Minor Guest</label>
                <input
                  type="number"
                  placeholder="e.g. 2"
                  className="w-full bg-surface-container border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl px-4 py-2.5 text-sm transition-all duration-300"
                  value={formData.minorCount}
                  onChange={e => setFormData({ ...formData, minorCount: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1">Amount Paid / Reservation</label>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  className="w-full bg-surface-container border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl px-4 py-2.5 text-sm transition-all duration-300"
                  value={formData.advancePayment}
                  onChange={e => setFormData({ ...formData, advancePayment: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1">Mode of Payment</label>
                <select
                  className="w-full bg-surface-container border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl px-4 py-2.5 text-sm transition-all duration-300 appearance-none"
                  value={formData.paymentMethod}
                  onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                >
                  <option value="">Select Mode...</option>
                  <option value="Cash">Cash</option>
                  <option value="Check">Check</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="GCash">GCash</option>
                  <option value="Mobile Banking">Mobile Banking</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1">Ref. No.</label>
                <input
                  type="text"
                  placeholder="e.g. 123456789"
                  className="w-full bg-surface-container border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl px-4 py-2.5 text-sm transition-all duration-300"
                  value={formData.referenceNo}
                  onChange={e => setFormData({ ...formData, referenceNo: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1">Booking Type</label>
                <select
                  className="w-full bg-surface-container border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl px-4 py-2.5 text-sm transition-all duration-300 appearance-none"
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="DAYTOUR">Daytour (08:00 - 17:00)</option>
                  <option value="OVERNIGHT">Overnight (18:00 - 07:00)</option>
                  <option value="EXTENDED STAY">Extended Stay</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1">Accommodation</label>
                <select
                  className="w-full bg-surface-container border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl px-4 py-2.5 text-sm transition-all duration-300 appearance-none"
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
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1">Booking Source</label>
                <select
                  className="w-full bg-surface-container border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl px-4 py-2.5 text-sm transition-all duration-300 appearance-none"
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
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1">Check-in Date</label>
                <input
                  type="date"
                  className="w-full bg-surface-container border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl px-4 py-2.5 text-sm transition-all duration-300"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1">Check-out Date & Time (Optional)</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="flex-1 bg-surface-container border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl px-3 py-2.5 text-sm transition-all duration-300"
                    value={formData.checkOutDate}
                    onChange={e => setFormData({ ...formData, checkOutDate: e.target.value })}
                    min={formData.date}
                  />
                  <input
                    type="time"
                    className="w-32 bg-surface-container border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl px-3 py-2.5 text-sm transition-all duration-300"
                    value={formData.checkOutTime}
                    onChange={e => setFormData({ ...formData, checkOutTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1">
                  {formData.bookingSource === 'WALK_IN' ? 'Check-in Time' : 'Check-in Time (ETA)'}
                </label>
                <input
                  type="time"
                  className="w-full bg-surface-container border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl px-4 py-2.5 text-sm transition-all duration-300"
                  value={formData.eta}
                  onChange={e => setFormData({ ...formData, eta: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1">Special Request</label>
                <textarea
                  placeholder="e.g. Extra pillows..."
                  className="w-full bg-surface-container border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl px-4 py-2.5 text-sm transition-all duration-300 resize-none h-16"
                  value={formData.specialRequest}
                  onChange={e => setFormData({ ...formData, specialRequest: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1">Remarks</label>
                <textarea
                  placeholder="e.g. Needs wheelchair access..."
                  className="w-full bg-surface-container border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl px-4 py-2.5 text-sm transition-all duration-300 resize-none h-16"
                  value={formData.remarks}
                  onChange={e => setFormData({ ...formData, remarks: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-surface-container text-on-surface py-3.5 rounded-2xl font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-surface-container-highest transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-primary text-on-surface py-3.5 rounded-2xl font-bold text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Confirming...' : 'Confirm Booking'}
              </button>
            </div>
            {errorMessage && (
              <div className="text-xs font-medium text-error mt-4">
                {errorMessage}
              </div>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default NewBookingModal;
