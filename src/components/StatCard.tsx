import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpDown } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  sparklineData?: number[];
  bgColor?: string;
  iconBgColor?: string;
  textColor?: string;
  valueColor?: string;
}

const StatCard = ({ 
  icon, 
  label, 
  value, 
  trend, 
  trendUp = true,
  sparklineData = [30, 45, 35, 50, 40, 60, 55],
  bgColor = 'bg-surface-container-lowest', 
  iconBgColor = 'bg-primary-container', 
  textColor = 'text-on-surface-variant', 
  valueColor = 'text-on-surface' 
}: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -4, shadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
    className={`bento-card ${bgColor} p-4 rounded-xl flex flex-col justify-between min-h-[160px] border border-on-surface/5 relative overflow-hidden group transition-all duration-500`}
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
    
    <div className="flex justify-between items-start relative z-10">
      <div className={`p-2.5 ${iconBgColor} rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-500`}>
        {icon}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 rounded-full ${trendUp ? 'bg-tertiary/10 text-tertiary' : 'bg-error/10 text-error'}`}>
          {trendUp ? <ArrowUpDown size={10} className="rotate-0" /> : <ArrowUpDown size={10} className="rotate-180" />}
          {trend}
        </div>
      )}
    </div>

    <div className="relative z-10 mt-4">
      <h3 className={`${textColor} text-[10px] font-bold uppercase tracking-[0.2em] mb-1 opacity-60`}>{label}</h3>
      <div className="flex items-end justify-between gap-4">
        <p className={`text-3xl lg:text-4xl font-headline font-medium ${valueColor} leading-none tracking-tight`}>{value}</p>
        {/* Simple Sparkline */}
        <div className="w-20 h-10 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
          <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
            <motion.path
              d={`M ${sparklineData.map((d, i) => `${(i * 100) / (sparklineData.length - 1)} ${40 - d}`).join(' L ')}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={trendUp ? 'text-tertiary' : 'text-error'}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </svg>
        </div>
      </div>
    </div>
  </motion.div>
);

export default StatCard;
