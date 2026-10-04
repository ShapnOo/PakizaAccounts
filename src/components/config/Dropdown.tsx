import React from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownProps {
  value: string;
  onChange: (val: string) => void;
  options: (string | { label: string; value: string })[];
  disabled?: boolean;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  value,
  onChange,
  options,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`relative inline-block w-full max-w-[280px] ${className}`}>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full h-8.5 pl-3 pr-8 rounded-lg bg-card border border-border/80 text-xs font-semibold text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer shadow-2xs ${
          disabled ? 'opacity-50 cursor-not-allowed bg-muted/30' : 'hover:border-border'
        }`}
      >
        {options.map((opt) => {
          const val = typeof opt === 'string' ? opt : opt.value;
          const lbl = typeof opt === 'string' ? opt : opt.label;
          return (
            <option key={val} value={val} className="text-foreground bg-card">
              {lbl}
            </option>
          );
        })}
      </select>
      <ChevronDown className="size-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" />
    </div>
  );
};
