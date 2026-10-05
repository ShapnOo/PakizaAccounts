import React from 'react';
import { CommaFormat, COMMA_FORMATS } from '../../types/currency';
import { formatWithCommaStyle } from '../../lib/format/currency';

interface CommaFormatSelectProps {
  value: CommaFormat;
  onChange: (val: CommaFormat) => void;
  decimals?: number;
}

export const CommaFormatSelect: React.FC<CommaFormatSelectProps> = ({
  value,
  onChange,
  decimals = 2,
}) => {
  const previewSample = 123456789;

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as CommaFormat)}
        className="flex-1 h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium text-foreground outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
      >
        {COMMA_FORMATS.map((fmt) => (
          <option key={fmt.value} value={fmt.value}>
            {fmt.label}
          </option>
        ))}
      </select>

      {/* Live Sample Preview on Right */}
      <div className="h-9 px-3 rounded-lg bg-slate-100 dark:bg-muted/40 border border-border/70 flex items-center gap-2 shrink-0">
        <span className="text-[10px] uppercase font-bold text-muted-foreground">Sample:</span>
        <span className="font-mono text-xs font-bold text-foreground tabular-nums">
          {formatWithCommaStyle(previewSample, value, decimals)}
        </span>
      </div>
    </div>
  );
};
