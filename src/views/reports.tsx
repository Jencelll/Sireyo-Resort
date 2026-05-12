import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Download, Wallet, TrendingUp, Calendar, Smile, ChevronLeft, ChevronRight, Users, Search, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import StatCard from '../components/StatCard';
import { fetchAnalytics } from '../lib/api';

const ReportsView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [filterType, setFilterType] = useState<'day' | 'month' | 'year'>('day');
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await fetchAnalytics();
        setTransactions(data.transactions);
      } catch (e) {
        console.error('Failed to load transactions');
      }
    };
    loadAnalytics();
  }, []);

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  
  const isSelected = (day: number) => {
    return selectedDate.getDate() === day && 
           selectedDate.getMonth() === currentMonth.getMonth() && 
           selectedDate.getFullYear() === currentMonth.getFullYear();
  };

  const filteredTransactions = transactions.filter(tx => {
    // Append T00:00:00 to prevent timezone offset bugs in local date
    const txDate = new Date(tx.date + 'T00:00:00');
    if (filterType === 'day') {
      return txDate.getDate() === selectedDate.getDate() &&
             txDate.getMonth() === selectedDate.getMonth() &&
             txDate.getFullYear() === selectedDate.getFullYear();
    } else if (filterType === 'month') {
      return txDate.getMonth() === currentMonth.getMonth() &&
             txDate.getFullYear() === currentMonth.getFullYear();
    } else if (filterType === 'year') {
      return txDate.getFullYear() === currentMonth.getFullYear();
    }
    return true;
  });

  const getIncomeByFilter = (type: 'day' | 'month' | 'year') => {
    return transactions.filter(tx => {
      const txDate = new Date(tx.date + 'T00:00:00');
      if (type === 'day') {
        return txDate.getDate() === selectedDate.getDate() &&
               txDate.getMonth() === selectedDate.getMonth() &&
               txDate.getFullYear() === selectedDate.getFullYear();
      } else if (type === 'month') {
        return txDate.getMonth() === currentMonth.getMonth() &&
               txDate.getFullYear() === currentMonth.getFullYear();
      } else if (type === 'year') {
        return txDate.getFullYear() === currentMonth.getFullYear();
      }
      return true;
    }).reduce((acc, curr) => acc + (curr.amount || 0), 0);
  };

  const todaysIncome = getIncomeByFilter('day');
  const monthlyIncome = getIncomeByFilter('month');
  const yearlyIncome = getIncomeByFilter('year');
  const wholeEarnings = transactions.reduce((acc, curr) => acc + curr.amount, 0);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Replace mock revenueData with dynamically structured data from transactions
  const revenueData = React.useMemo(() => {
    const monthlyAcc = transactions.reduce((acc, tx) => {
      const txDate = new Date(tx.date + 'T00:00:00');
      const monthIdx = txDate.getMonth();
      const monthName = monthNames[monthIdx].substring(0, 3);
      if (!acc[monthName]) acc[monthName] = { month: monthName, revenue: 0, bookings: 0 };
      acc[monthName].revenue += tx.amount || 0;
      acc[monthName].bookings += 1;
      return acc;
    }, {} as Record<string, any>);
    return monthNames.slice(0, currentMonth.getMonth() + 1).map(m => {
      const shortM = m.substring(0, 3);
      return monthlyAcc[shortM] || { month: shortM, revenue: 0, bookings: 0 };
    });
  }, [transactions, currentMonth]);

  const guestTypeData = [
    { name: 'Local', value: 65, color: '#FFD700' },
    { name: 'International', value: 35, color: '#E5E7EB' },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
      <div className="mb-8 lg:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 lg:gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
          <h2 className="font-headline font-medium text-3xl lg:text-5xl text-on-surface tracking-tight">Sanctuary Analytics</h2>
          <p className="text-on-surface-variant font-medium mt-2 tracking-wide text-xs lg:text-base">Comprehensive performance and occupancy reports</p>
        </motion.div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex bg-surface-container-highest rounded-xl p-1 border border-on-surface/5">
            {(['day', 'month', 'year'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${filterType === f ? 'bg-primary text-on-surface shadow-md' : 'text-on-surface-variant hover:bg-on-surface/5'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-on-surface rounded-xl text-xs font-bold tracking-widest uppercase shadow-xl shadow-primary/20 hover:scale-105 transition-all duration-300">
            <Download size={18} strokeWidth={2} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-on-surface/5" />
          <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-on-surface-variant/40 shrink-0">Financial Overview</h3>
          <div className="h-px flex-1 bg-on-surface/5" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <StatCard icon={<Wallet size={24} strokeWidth={1.5} className="text-primary" />} label="Today's Income" value={`₱${todaysIncome.toLocaleString()}`} trend="+8.2%" trendUp={true} />
          <StatCard icon={<TrendingUp size={24} strokeWidth={1.5} className="text-tertiary" />} label="Monthly Income" value={`₱${monthlyIncome.toLocaleString()}`} trend="+15.4%" trendUp={true} />
          <StatCard icon={<Calendar size={24} strokeWidth={1.5} className="text-on-surface-variant" />} label="Yearly Income" value={`₱${yearlyIncome.toLocaleString()}`} trend="+12.5%" trendUp={true} />
          <StatCard icon={<Wallet size={24} strokeWidth={1.5} className="text-primary" />} label="Whole Earnings" value={`₱${wholeEarnings.toLocaleString()}`} trend="All Time" trendUp={true} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-panel p-6 rounded-[2rem] border border-on-surface/5 shadow-xl bg-surface-container-low">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-headline font-medium text-on-surface">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h3>
              <div className="flex gap-2">
                <button onClick={prevMonth} className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors"><ChevronLeft size={18} /></button>
                <button onClick={nextMonth} className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors"><ChevronRight size={18} /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-4">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => <span key={day} className="text-[10px] font-bold text-on-surface-variant/30 uppercase tracking-widest">{day}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-y-2 text-center">
              {Array.from({ length: startOfMonth(currentMonth) }).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: daysInMonth(currentMonth) }).map((_, i) => {
                const day = i + 1;
                const active = isSelected(day);
                return (
                  <button key={day} onClick={() => setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))} className={`aspect-square flex items-center justify-center rounded-xl text-xs font-bold transition-all ${active ? 'bg-primary text-on-surface shadow-lg shadow-primary/20 scale-110' : 'text-on-surface-variant hover:bg-surface-container'}`}>
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="glass-panel p-6 rounded-[2rem] border border-on-surface/5 shadow-xl bg-surface-container-low">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-on-surface/60 mb-6 flex items-center gap-2"><Users size={16} />Occupancy Overview</h3>
            <div className="space-y-6">
              <div className="flex flex-col gap-2"><div className="flex justify-between items-end"><span className="text-xs font-medium text-on-surface-variant">Cottages (Daytour)</span><span className="text-xs font-bold text-on-surface">12/20</span></div><div className="h-2 bg-on-surface/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: '60%' }} className="h-full bg-primary" /></div></div>
              <div className="flex flex-col gap-2"><div className="flex justify-between items-end"><span className="text-xs font-medium text-on-surface-variant">Cabins (Overnight)</span><span className="text-xs font-bold text-on-surface">8/10</span></div><div className="h-2 bg-on-surface/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: '80%' }} className="h-full bg-tertiary" /></div></div>
              <div className="flex flex-col gap-2"><div className="flex justify-between items-end"><span className="text-xs font-medium text-on-surface-variant">Items (Rental)</span><span className="text-xs font-bold text-on-surface">45/100</span></div><div className="h-2 bg-on-surface/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: '45%' }} className="h-full bg-on-surface-variant" /></div></div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-8 space-y-8">
          <div className="glass-panel p-8 rounded-[2.5rem] border border-on-surface/5 shadow-xl min-h-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div><h3 className="text-2xl font-headline font-medium text-on-surface">Income Ledger</h3><p className="text-xs text-on-surface-variant/60 uppercase tracking-widest mt-1">Report for {filterType === 'day' ? selectedDate.toLocaleDateString(undefined, { dateStyle: 'long' }) : filterType === 'month' ? `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}` : currentMonth.getFullYear()}</p></div>
              <div className="flex items-center px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-bold uppercase tracking-widest">{filteredTransactions.length} Transactions</div>
            </div>
            {filteredTransactions.length > 0 ? (
              <div className="overflow-x-auto -mx-8 px-8">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-on-surface/5">
                      <th className="pb-4 text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Guest Info</th>
                      <th className="pb-4 text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Unit / Accom</th>
                      <th className="pb-4 text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Time</th>
                      <th className="pb-4 text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Status</th>
                      <th className="pb-4 text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="group hover:bg-on-surface/[0.02] border-b border-on-surface/5 transition-colors">
                        <td className="py-5"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-xs font-bold text-on-surface">{tx.guest.charAt(0)}</div><div><p className="text-sm font-bold text-on-surface">{tx.guest}</p><p className="text-[10px] text-on-surface-variant/50 font-mono tracking-tighter uppercase">{tx.id}</p></div></div></td>
                        <td className="py-5"><span className="text-xs font-medium text-on-surface-variant">{tx.type}</span></td>
                        <td className="py-5"><span className="text-xs font-medium text-on-surface-variant">{tx.time}</span></td>
                        <td className="py-5"><div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${tx.status === 'Paid' ? 'bg-primary/10 text-primary' : 'bg-on-surface/5 text-on-surface-variant'}`}>{tx.status}</div></td>
                        <td className="py-5 text-right"><span className="font-mono text-sm font-bold text-on-surface">₱{tx.amount.toLocaleString()}</span></td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot><tr><td colSpan={4} className="pt-8 text-sm font-headline font-medium text-on-surface text-right">Total ({filterType}):</td><td className="pt-8 text-right"><span className="font-mono text-xl font-bold text-primary">₱{filteredTransactions.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</span></td></tr></tfoot>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center"><div className="w-16 h-16 rounded-full bg-on-surface/5 flex items-center justify-center text-on-surface-variant/20 mb-4"><Search size={32} /></div><h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">No Records Found</h4><p className="text-xs text-on-surface-variant/50 mt-2">There are no transactions recorded for this specific date.</p></div>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 glass-panel p-8 rounded-[2.5rem] border border-on-surface/5 shadow-xl bg-surface-container-low">
          <div className="flex justify-between items-center mb-8"><div><h3 className="text-lg font-headline font-medium text-on-surface">Revenue Growth</h3><p className="text-xs text-on-surface-variant/60 uppercase tracking-widest mt-1">Monthly performance overview</p></div></div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(var(--on-surface), 0.05)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'rgba(var(--on-surface-variant), 0.6)', fontSize: 10, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(var(--on-surface-variant), 0.6)', fontSize: 10, fontWeight: 600 }} tickFormatter={(value) => `₱${value/1000}k`} />
                <Tooltip cursor={{ fill: 'rgba(var(--primary), 0.05)' }} contentStyle={{ backgroundColor: 'rgba(var(--surface-container-highest), 0.9)', border: '1px solid rgba(var(--on-surface), 0.1)', borderRadius: '16px', backdropFilter: 'blur(10px)' }} itemStyle={{ color: 'rgba(var(--on-surface), 1)', fontSize: '12px', fontWeight: 600 }} labelStyle={{ color: 'rgba(var(--primary), 1)', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }} />
                <Bar dataKey="revenue" fill="rgba(var(--primary), 1)" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="lg:col-span-4 glass-panel p-8 rounded-[2.5rem] border border-on-surface/5 shadow-xl bg-surface-container-low flex flex-col items-center justify-center">
          <h3 className="text-lg font-headline font-medium text-on-surface mb-2">Guest Origin</h3><p className="text-xs text-on-surface-variant/60 uppercase tracking-widest mb-8">Demographic distribution</p>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={guestTypeData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">{guestTypeData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}</Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"><span className="text-3xl font-headline font-bold text-on-surface">65%</span><span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Local</span></div>
          </div>
          <div className="w-full space-y-3 mt-8">
            {guestTypeData.map((item) => <div key={item.name} className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} /><span className="text-xs font-medium text-on-surface">{item.name}</span></div><span className="text-xs font-bold text-on-surface-variant">{item.value}%</span></div>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
