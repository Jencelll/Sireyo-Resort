import React from 'react';
import { motion } from 'motion/react';
import { 
  Printer, Plus, Bed, LogIn, Clock, MessageSquare, PlusCircle, Sparkles, Smile, CloudSun, ArrowUpDown
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { REVENUE_DATA } from '../constants';
import { Accommodation, Guest, StatCardProps } from '../types';

import StatCard from '../components/StatCard';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-container-highest border border-on-surface/10 p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-sm font-bold text-primary">
            ₱{payload[0].value.toLocaleString()} <span className="text-[10px] font-normal text-on-surface-variant/60 ml-1">Revenue</span>
          </p>
          {payload[1] && (
            <p className="text-xs font-medium text-on-surface-variant/60">
              ₱{payload[1].value.toLocaleString()} <span className="text-[10px] font-normal opacity-60 ml-1">Forecast</span>
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const ActivityItem = ({ title, time, type, icon: Icon }: any) => (
  <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-surface-container transition-colors group cursor-pointer border border-transparent hover:border-on-surface/5">
    <div className={`p-3 rounded-xl shrink-0 transition-transform group-hover:scale-110 ${
      type === 'checkin' ? 'bg-primary/10 text-primary' :
      type === 'booking' ? 'bg-tertiary/10 text-tertiary' :
      type === 'service' ? 'bg-secondary/10 text-secondary' :
      'bg-on-surface/10 text-on-surface'
    }`}>
      <Icon size={18} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors">{title}</p>
      <p className="text-[10px] text-on-surface-variant mt-1 uppercase tracking-widest font-medium">{time}</p>
    </div>
  </div>
);

const WeatherWidget = () => (
  <div className="bento-card bg-surface-container-lowest p-5 lg:p-6 rounded-2xl border border-on-surface/5 flex justify-between items-center relative overflow-hidden">
    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-8 -mt-8 blur-2xl" />
    <div className="relative z-10">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60 mb-1">Current Weather</p>
      <h4 className="text-3xl font-headline font-medium text-on-surface">28°C</h4>
      <p className="text-sm font-bold text-primary mt-0.5">Partly Cloudy</p>
    </div>
    <CloudSun size={48} strokeWidth={1} className="text-primary relative z-10 opacity-80" />
  </div>
);

const RoomStatusWidget = ({ occupancyPercent, occupiedCount, cleanCount }: { occupancyPercent: number, occupiedCount: number, cleanCount: number }) => (
  <div className="flex flex-col gap-6">
    <div className="flex justify-between items-end">
      <span className="text-sm font-bold text-on-surface-variant">Occupied</span>
      <span className="text-xl font-headline font-medium text-on-surface">{Math.round(occupancyPercent)}%</span>
    </div>
    <div className="h-3 bg-surface-container rounded-full overflow-hidden">
      <motion.div initial={{ width: 0 }} animate={{ width: `${occupancyPercent}%` }} className="h-full bg-primary" />
    </div>
    <div className="grid grid-cols-2 gap-4 mt-2">
      <div className="p-4 bg-surface-container rounded-2xl">
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1">Available</p>
        <p className="text-lg font-headline font-medium text-on-surface">{cleanCount}</p>
      </div>
      <div className="p-4 bg-error/5 rounded-2xl border border-error/10">
        <p className="text-[10px] font-bold uppercase tracking-widest text-error/60 mb-1">Occupied</p>
        <p className="text-lg font-headline font-medium text-error">{occupiedCount}</p>
      </div>
    </div>
  </div>
);

const SatisfactionGauge = () => (
  <div className="relative flex justify-center py-6">
    <svg width="200" height="100" viewBox="0 0 200 100" className="overflow-visible">
      <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="currentColor" strokeWidth="20" strokeLinecap="round" className="text-surface-container" />
      <motion.path 
        d="M 20 100 A 80 80 0 0 1 180 100" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="20" 
        strokeLinecap="round" 
        strokeDasharray="251.2"
        className="text-tertiary"
        initial={{ strokeDashoffset: 251.2 }}
        animate={{ strokeDashoffset: 251.2 * (1 - 0.92) }} 
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
    </svg>
    <div className="absolute bottom-0 flex flex-col items-center">
      <span className="text-4xl font-headline font-medium text-on-surface">4.8</span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mt-1">out of 5.0</span>
    </div>
  </div>
);

export const DashboardView = ({ onOpenNewBooking, accommodations = [], guests = [] }: { onOpenNewBooking: () => void, accommodations?: Accommodation[], guests?: Guest[] }) => {
  const currentDate = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('en-US', dateOptions);

  const occupiedCount = accommodations.filter(a => a.daytourBooking?.status === 'Checked In' || a.overnightBooking?.status === 'Checked In' || a.extendedBooking?.status === 'Checked In').length;
  const cleanCount = accommodations.length - occupiedCount;
  const occupancyPercent = accommodations.length ? (occupiedCount / accommodations.length) * 100 : 0;

  const checkinsToday = guests.filter(g => g.status === 'In-House').length;

  return (
    <div className="p-4 lg:p-6 w-full">
      <div className="mb-6 lg:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 lg:gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
          <h2 className="font-headline font-medium text-2xl lg:text-3xl text-on-surface tracking-tight">Daily Pulse</h2>
          <p className="text-on-surface-variant font-medium mt-1 tracking-wide text-xs">Status overview for {formattedDate}</p>
        </motion.div>
        <div className="flex gap-2 lg:gap-3">
          <button onClick={() => window.print()} className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-surface-container-lowest border border-on-surface/5 rounded-lg text-[10px] lg:text-[11px] font-bold tracking-widest uppercase hover:bg-surface-container transition-all duration-300">
            <Printer size={14} strokeWidth={1.5} />
            <span className="hidden sm:inline">Print Log</span>
          </button>
          <button onClick={onOpenNewBooking} className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-primary text-on-surface rounded-lg text-[10px] lg:text-[11px] font-bold tracking-widest uppercase shadow-xl shadow-primary/20 hover:scale-105 transition-all duration-300">
            <Plus size={14} strokeWidth={2} />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-6">
        <StatCard icon={<Bed size={24} strokeWidth={1.5} className="text-on-primary-container" />} label="Current Occupancy" value={`${Math.round(occupancyPercent)}%`} trend="Target" trendUp={true} sparklineData={[0, 0, 0, 0, occupancyPercent]} />
        <StatCard icon={<LogIn size={24} strokeWidth={1.5} className="text-on-surface" />} label="In-House Guests" value={checkinsToday.toString()} trend="Today" trendUp={true} sparklineData={[0, 0, checkinsToday]} iconBgColor="bg-surface-container" />
        <StatCard icon={<Clock size={24} strokeWidth={1.5} className="text-error" />} label="Pending Actions" value="0" trend="Clear" trendUp={true} sparklineData={[0, 0, 0]} bgColor="bg-error/5" iconBgColor="bg-error/10" textColor="text-error/60" valueColor="text-error" />
        <StatCard icon={<MessageSquare size={24} strokeWidth={1.5} className="text-tertiary" />} label="Guest Messages" value="0" trend="All Read" trendUp={true} sparklineData={[0, 0, 0]} bgColor="bg-tertiary/5" iconBgColor="bg-tertiary/10" textColor="text-tertiary/60" valueColor="text-tertiary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-8 bento-card bg-surface-container-lowest p-5 lg:p-6 rounded-2xl border border-on-surface/5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <div><h3 className="font-headline font-medium text-lg">Revenue Performance</h3><p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-widest mt-0.5">Weekly analysis vs forecast</p></div>
            <div className="flex items-center gap-6 text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
              <span className="flex items-center gap-2.5"><span className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm"></span> Revenue</span>
              <span className="flex items-center gap-2.5"><span className="w-2.5 h-2.5 rounded-full bg-surface-container shadow-sm"></span> Forecast</span>
            </div>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs><linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/><stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(var(--on-surface), 0.05)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'rgba(var(--on-surface-variant), 0.4)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'rgba(var(--on-surface-variant), 0.4)' }} tickFormatter={(value) => `₱${value/1000}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-primary)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="forecast" stroke="rgba(var(--on-surface), 0.1)" fill="rgba(var(--on-surface), 0.03)" strokeWidth={2} strokeDasharray="5 5" />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={4} animationDuration={2000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="lg:col-span-4 space-y-5">
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}><WeatherWidget /></motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bento-card bg-surface-container-lowest p-5 lg:p-6 rounded-2xl border border-on-surface/5">
            <h3 className="font-headline font-medium text-lg mb-5">Room Status</h3>
            <RoomStatusWidget occupancyPercent={occupancyPercent} occupiedCount={occupiedCount} cleanCount={cleanCount} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="bento-card bg-surface-container-lowest p-5 lg:p-6 rounded-2xl border border-on-surface/5">
            <div className="flex justify-between items-center mb-4"><h3 className="font-headline font-medium text-lg">Satisfaction</h3><div className="flex items-center gap-2 text-tertiary"><Smile size={16} /><span className="text-[10px] font-bold uppercase tracking-widest">High</span></div></div>
            <SatisfactionGauge />
            <p className="text-[10px] text-on-surface-variant/60 text-center mt-4 font-medium italic">"Excellent service and breathtaking views!" - Recent Review</p>
          </motion.div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-4 bento-card bg-surface-container-lowest p-5 lg:p-6 rounded-2xl border border-on-surface/5">
          <h3 className="font-headline font-medium text-lg mb-6">Live Activity</h3>
          <div className="space-y-6">
            {guests.slice(0, 4).map((guest) => (
              <ActivityItem 
                key={guest.id} 
                title={`${guest.name} (${guest.room})`} 
                time={guest.status === 'In-House' ? 'Currently Checked In' : guest.status} 
                type={guest.status === 'In-House' ? 'checkin' : 'booking'} 
                icon={guest.status === 'In-House' ? LogIn : PlusCircle} 
              />
            ))}
            {guests.length === 0 && (
              <p className="text-xs text-on-surface-variant">No recent activity.</p>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="lg:col-span-8 bento-card bg-primary text-on-surface p-6 lg:p-8 rounded-2xl shadow-2xl shadow-primary/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-all duration-700" />
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div><h3 className="font-headline font-medium text-2xl lg:text-3xl tracking-tight mb-4">Sanctuary <br />Intelligence</h3><p className="text-on-surface/70 text-sm font-light max-w-md leading-relaxed">Occupancy is currently at <span className="text-on-surface font-bold">{Math.round(occupancyPercent)}%</span>. Available capacity allows for up to {cleanCount} additional bookings today.</p></div>
            <div className="mt-8 flex gap-3"><button className="px-6 py-3 bg-on-surface text-primary rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all">Generate Report</button><button className="px-6 py-3 bg-white/10 backdrop-blur-md text-on-surface rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-white/20 transition-all">View Insights</button></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
