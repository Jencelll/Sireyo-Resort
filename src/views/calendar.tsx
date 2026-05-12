import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { CalendarDays, ChevronDown } from 'lucide-react';
import { Accommodation } from '../types';
import { AccommodationCalendar } from '../components/AccommodationCalendar';

interface CalendarViewProps {
  accommodations: Accommodation[];
}

const CalendarView = ({ accommodations }: CalendarViewProps) => {
  const [selectedId, setSelectedId] = useState(accommodations[0]?.id ?? '');
  const selectedAccommodation = useMemo(
    () => accommodations.find((acc) => acc.id === selectedId) || accommodations[0],
    [accommodations, selectedId]
  );

  return (
    <div className="p-6 lg:p-10 w-full">
      <div className="mb-10 lg:mb-14 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative"
        >
          <div className="absolute -left-4 top-0 w-1 h-full bg-primary rounded-full opacity-20"></div>
          <h2 className="font-headline font-medium text-4xl lg:text-6xl text-on-surface tracking-tight">Calendar</h2>
          <p className="text-on-surface-variant font-medium mt-3 tracking-wide text-sm lg:text-lg opacity-60">
            Open a unit calendar to view pricing and guest stays.
          </p>
        </motion.div>
      </div>

      <div className="bg-surface-container-lowest rounded-[2.5rem] border border-on-surface/5 overflow-hidden shadow-2xl shadow-on-surface/5">
        <div className="p-6 lg:p-10 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/50">Accommodation</p>
              <div className="relative">
                <select
                  value={selectedId}
                  onChange={(event) => setSelectedId(event.target.value)}
                  className="w-full bg-surface-container border border-on-surface/10 rounded-2xl px-5 py-4 text-sm font-medium text-on-surface outline-none focus:ring-4 focus:ring-primary/10 appearance-none"
                >
                  {accommodations.map((acc) => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-variant/60" />
              </div>
            </div>

            <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary/10 via-surface-container to-surface-container-lowest border border-primary/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center">
                  <CalendarDays size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary/60">Calendar View</p>
                  <p className="text-lg font-headline font-medium text-on-surface">See guest stays and daily fees</p>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant/70 mt-4">
                The calendar updates to match the selected accommodation.
              </p>
            </div>
          </div>

          {selectedAccommodation ? (
            <AccommodationCalendar accommodation={selectedAccommodation} variant="inline" />
          ) : (
            <div className="p-6 bg-surface-container/50 rounded-[2rem] border border-on-surface/5 text-on-surface-variant">
              Select an accommodation to view the calendar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
