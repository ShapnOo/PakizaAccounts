import React from 'react';

interface ActiveStatusPillProps {
  status: 'Active' | 'Inactive';
  onClick?: () => void;
  clickable?: boolean;
}

export const ActiveStatusPill: React.FC<ActiveStatusPillProps> = ({
  status,
  onClick,
  clickable = false,
}) => {
  const isActive = status === 'Active';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!clickable}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border transition-colors ${
        clickable ? 'cursor-pointer hover:opacity-85' : 'cursor-default'
      } ${
        isActive
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
          : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${
          isActive ? 'bg-emerald-500' : 'bg-slate-400'
        }`}
      />
      <span>{status}</span>
    </button>
  );
};
