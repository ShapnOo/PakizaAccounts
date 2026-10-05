import React from 'react';

interface MandatoryPillProps {
  mandatory: boolean;
  onToggle?: () => void;
  interactive?: boolean;
  size?: 'sm' | 'md';
}

export const MandatoryPill: React.FC<MandatoryPillProps> = ({
  mandatory,
  onToggle,
  interactive = true,
  size = 'md',
}) => {
  const content = (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold border transition-all ${
        size === 'sm' ? 'px-2 py-0.5 text-[10.5px]' : 'px-2.5 py-0.5 text-xs'
      } ${
        mandatory
          ? 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-200/50 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900'
          : 'bg-slate-100 text-slate-600 border-slate-200 ring-1 ring-slate-200/50 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
      } ${
        interactive
          ? 'hover:scale-105 active:scale-95 cursor-pointer shadow-2xs select-none'
          : ''
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${
          mandatory ? 'bg-rose-600 animate-pulse' : 'bg-slate-400'
        }`}
      />
      <span>{mandatory ? 'Yes' : 'No'}</span>
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
        title={`Click to switch to ${mandatory ? 'Optional (No)' : 'Required (Yes)'}`}
        className="focus:outline-none"
      >
        {content}
      </button>
    );
  }

  return content;
};
