import React from 'react';

interface ToggleYesNoProps {
  value: boolean;
  onChange: (val: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const ToggleYesNo: React.FC<ToggleYesNoProps> = ({
  value,
  onChange,
  label,
  disabled = false,
}) => {
  return (
    <div className="inline-flex items-center gap-2 select-none">
      {label && (
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
          {label}:
        </span>
      )}
      <div
        className={`inline-flex items-center h-7 p-0.5 rounded-lg bg-muted/60 dark:bg-muted/40 border border-border/70 transition-all ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(true)}
          className={`h-5.5 px-3 rounded-md text-[11px] font-bold transition-all duration-150 cursor-pointer flex items-center justify-center ${
            value
              ? 'bg-primary text-primary-foreground shadow-2xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(false)}
          className={`h-5.5 px-3 rounded-md text-[11px] font-bold transition-all duration-150 cursor-pointer flex items-center justify-center ${
            !value
              ? 'bg-card text-foreground border border-border/80 shadow-2xs font-extrabold'
              : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
          }`}
        >
          No
        </button>
      </div>
    </div>
  );
};
