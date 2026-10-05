import React from 'react';

interface ActiveStatusPillProps {
  status: 'Active' | 'Inactive';
  onToggle?: () => void;
  interactive?: boolean;
  size?: 'sm' | 'md';
}

export const ActiveStatusPill: React.FC<ActiveStatusPillProps> = ({
  status,
  onToggle,
  interactive = true,
  size = 'md',
}) => {
  const isActive = status === 'Active';

  const content = (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold border transition-all ${
        size === 'sm' ? 'px-2 py-0.5 text-[10.5px]' : 'px-2.5 py-0.5 text-xs'
      } ${
        isActive
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-200/50 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900'
          : 'bg-slate-100 text-slate-600 border-slate-200 ring-1 ring-slate-200/50 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
      } ${
        interactive
          ? 'hover:scale-105 active:scale-95 cursor-pointer shadow-2xs select-none'
          : ''
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${
          isActive ? 'bg-emerald-600' : 'bg-slate-400'
        }`}
      />
      <span>{status}</span>
    </span>
  );

  if (interactive && onToggle) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        title={`Click to mark ${isActive ? 'Inactive' : 'Active'}`}
        className="focus:outline-none"
      >
        {content}
      </button>
    );
  }

  return content;
};
