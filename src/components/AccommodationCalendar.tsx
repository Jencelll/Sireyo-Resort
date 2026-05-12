import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Calendar, Settings, ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Accommodation, Booking } from '../types';
import { fetchCalendarBookings } from '../lib/api';

interface CalendarModalProps {
  accommodation: Accommodation;
  onClose?: () => void;
  variant?: 'modal' | 'inline';
}

export const AccommodationCalendar = ({ accommodation, onClose, variant = 'modal' }: CalendarModalProps) => {
  const isModal = variant === 'modal';
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    let active = true;
    const loadBookings = async () => {
      try {
        const data = await fetchCalendarBookings(String(accommodation.id));
        if (active) setBookings(data);
      } catch (e) {
        console.error('Failed to load bookings');
      }
    };
    loadBookings();
    return () => { active = false; };
  }, [accommodation.id]);

  const goToPreviousMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const monthLabel = viewDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const addDays = (date: Date, offset: number) => {
    const next = new Date(date);
    next.setDate(date.getDate() + offset);
    return next;
  };

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const getBookingForDay = (date: Date) => {
    return bookings.find(b => {
      if (!b.checkInDate) return false;
      const start = new Date(b.checkInDate);
      const end = b.checkOutDate ? new Date(b.checkOutDate) : start;
      return date >= start && date <= end;
    });
  };

  const getBookingSegment = (date: Date, b: Booking) => {
    const start = new Date(b.checkInDate);
    const end = b.checkOutDate ? new Date(b.checkOutDate) : start;
    if (isSameDay(date, start) && isSameDay(date, end)) return 'single';
    if (isSameDay(date, start)) return 'start';
    if (isSameDay(date, end)) return 'end';
    return 'middle';
  };

  const calendarDays = useMemo(() => {
    const startOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const startDay = startOfMonth.getDay();
    const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
    const totalCells = 42;

    return Array.from({ length: totalCells }, (_, index) => {
      const dayOffset = index - startDay + 1;
      const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), dayOffset);
      const isCurrentMonth = date.getMonth() === viewDate.getMonth();
      const isToday = isSameDay(date, today);
      
      const matchedBooking = getBookingForDay(date);
      const bookingSegment = matchedBooking ? getBookingSegment(date, matchedBooking) : null;
      
      const isWeekend = date.getDay() === 5 || date.getDay() === 6;
      const price = isWeekend ? 'P3.2K' : 'P2.6K';

      return {
        id: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        day: date.getDate(),
        date,
        isCurrentMonth,
        isToday,
        price,
        isSelected: !!matchedBooking && (bookingSegment === 'end' || bookingSegment === 'single'),
        bookingSegment,
        guestImg: (bookingSegment === 'start' || bookingSegment === 'single') && matchedBooking ? matchedBooking.image : null,
        booking: matchedBooking
      };
    });
  }, [viewDate, today, bookings]);

  const calendarContent = (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: 10 }}
      className={
        isModal
          ? 'bg-white w-full max-w-md h-[85vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative'
          : 'bg-white w-full min-h-[85vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative'
      }
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
        {onClose ? (
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
        ) : (
          <div className="w-10 h-10" />
        )}
        <div className="flex-1 ml-4">
          <h2 className="text-lg font-bold text-gray-900 truncate">
            {accommodation.name} at Sireyo Resort
          </h2>
          <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
            <button onClick={goToPreviousMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Previous month">
              <ChevronLeft size={16} />
            </button>
            <span className="font-semibold text-gray-700 uppercase tracking-widest text-[10px]">{monthLabel}</span>
            <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Next month">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Calendar size={20} className="text-gray-700" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Settings size={20} className="text-gray-700" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-24 bg-white custom-scrollbar">
        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Calendar Month</p>
            <h3 className="text-2xl font-headline font-semibold text-gray-900 mt-1">{monthLabel}</h3>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#1A1A1A]"></span>
              Booked
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#E11D48]"></span>
              Today
            </span>
          </div>
        </div>

        <div className="grid grid-cols-7 mt-6 mb-4 sticky top-0 bg-white z-20 pt-4 pb-2 border-b border-gray-100">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="text-center text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-4 relative z-10 w-full">
          {calendarDays.map((cDay) => (
            <DayCell key={cDay.id} data={cDay} />
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-6 right-6 z-30">
        <button onClick={() => {}} className="flex items-center gap-2 px-6 py-4 bg-white border border-gray-200 text-gray-900 rounded-full font-bold text-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-gray-50 transition-all hover:scale-105 active:scale-95">
          <ArrowUp size={18} />
          Today
        </button>
      </div>
    </motion.div>
  );

  if (!isModal) {
    return <div className="w-full py-6">{calendarContent}</div>;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        {calendarContent}
      </div>
    </AnimatePresence>
  );
};

const DayCell = ({ data }: { data: any }) => {
  const isBookedStart = data.bookingSegment === 'start';
  const isBookedEnd = data.bookingSegment === 'end';
  const isBookedMiddle = data.bookingSegment === 'middle';
  const isBookedSingle = data.bookingSegment === 'single';
  const isToday = data.isToday;
  const isSelected = data.isSelected;
  
  return (
    <div className={`relative h-28 flex flex-col items-center rounded-2xl transition-all border ${
      !data.isCurrentMonth
        ? 'bg-gray-50/50 border-gray-100 text-gray-300'
        : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
    }`}>
      
      {/* Background connections for continuous booking placed in bottom half */}
      {isBookedStart && (
        <div className="absolute bottom-2 left-2 right-[-8px] h-10 bg-[#1A1A1A] z-0 rounded-l-full"></div>
      )}
      {isBookedMiddle && (
        <div className="absolute bottom-2 left-[-8px] right-[-8px] h-10 bg-[#1A1A1A] z-0"></div>
      )}
      {isBookedEnd && (
        <div className="absolute bottom-2 left-[-8px] right-2 h-10 bg-[#1A1A1A] z-0 rounded-r-full"></div>
      )}
      {isBookedSingle && (
        <div className="absolute bottom-2 left-2 right-2 h-10 bg-[#1A1A1A] z-0 rounded-full"></div>
      )}

      {/* Top half: Date Number */}
      <div className="mt-4 relative z-10 flex justify-center items-center h-8 w-8">
        <div className={`absolute inset-0 rounded-full ${
          isToday ? 'bg-[#E11D48]' : isSelected ? 'border border-[#E11D48]' : ''
        }`}></div>
        <span className={`relative z-10 text-sm font-bold ${
          isToday ? 'text-white' : isSelected ? 'text-[#E11D48]' : 'text-gray-900'
        }`}>
          {data.day}
        </span>
      </div>
      
      {/* Bottom half: Price or Guest Image depending on booking */}
      <div className="mt-auto mb-5 relative z-10 w-full flex justify-center items-center h-8">
        {!(isBookedStart || isBookedEnd || isBookedMiddle || isBookedSingle) && (
          <span className={`text-[11px] font-semibold tracking-tight ${
            !data.isCurrentMonth ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {data.price}
          </span>
        )}
        
        {(isBookedStart || isBookedSingle) && data.guestImg && (
          <img 
            src={data.guestImg || 'https://i.pravatar.cc/150'} 
            alt="Guest" 
            className={`absolute ${isBookedSingle ? 'left-1/2 -translate-x-1/2' : 'left-3'} w-8 h-8 rounded-full border-2 border-[#1A1A1A] object-cover`}
          />
        )}
        {(isBookedStart || isBookedSingle) && data.booking && !data.guestImg && (
           <div className={`absolute ${isBookedSingle ? 'left-1/2 -translate-x-1/2' : 'left-3'} w-8 h-8 rounded-full border-2 border-[#1A1A1A] bg-zinc-700 flex items-center justify-center text-white text-xs font-bold`}>
             {data.booking.guestName ? data.booking.guestName.charAt(0) : '?'}
           </div>
        )}
      </div>
    </div>
  );
};

