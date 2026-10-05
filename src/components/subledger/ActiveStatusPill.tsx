import React from 'react';
import { Check, X } from 'lucide-react';

interface ActiveStatusPillProps {
  status: 'Active' | 'Inactive';
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export const ActiveStatusPill: React.FC<ActiveStatusPillProps> = ({
  status,
  onClick,
  disabled = false,
  size = 'md',
}) => {
  const isActive = status === 'Active';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      title={disabled ? undefined : `Click to toggle status (currently ${status})`}
      className={[
        'inline-flex items-center gap-1.5 rounded-full font-semibold transition-all duration-200 select-none border',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
        isActive
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 shadow-2xs'
          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 hover:border-slate-300 shadow-2xs',
        disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer active:scale-95 hover:ring-2',
        isActive ? 'hover:ring-emerald-200/60' : 'hover:ring-slate-200/60',
      ].join(' ')}
      aria-label={`Status: ${status}. Click to toggle.`}
    >
      <span
        className={[
          'size-1.5 rounded-full shrink-0 transition-transform duration-200',
          isActive ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400',
        ].join(' ')}
      />
      <span>{status}</span>
      {isActive ? (
        <Check className="size-3 text-emerald-600 shrink-0 opacity-70" />
      ) : (
        <X className="size-3 text-slate-400 shrink-0 opacity-70" />
      )}
    </button>
  );
};
