import React from 'react';
import { motion } from 'motion/react';

const TopNavItem = ({ 
  icon: Icon, 
  label, 
  active = false, 
  onClick,
  dark = false
}: { 
  icon: React.ElementType, 
  label: string, 
  active?: boolean,
  onClick?: () => void,
  dark?: boolean
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-300 relative group ${
      active 
        ? 'text-primary font-bold' 
        : dark 
          ? 'text-white/60 hover:text-white' 
          : 'text-on-surface-variant hover:text-on-surface'
    }`}
  >
    <Icon size={15} strokeWidth={active ? 2.5 : 2} />
    <span className="text-[11px] uppercase tracking-wider font-semibold">{label}</span>
    {active && (
      <motion.div 
        layoutId="topNavActive"
        className="absolute -bottom-[13px] left-0 right-0 h-0.5 bg-primary rounded-t-full"
      />
    )}
  </button>
);

export default TopNavItem;
