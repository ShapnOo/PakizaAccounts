import React from 'react';
import { Orientation } from '../../types/voucherTemplate';

interface OrientationToggleProps {
  value: Orientation;
  onChange: (val: Orientation) => void;
  disabled?: boolean;
}

export const OrientationToggle: React.FC<OrientationToggleProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-bold text-slate-700 dark:text-muted-foreground block">
        Orientation
      </label>
      <div className="flex rounded-lg border border-border p-0.5 bg-muted/30">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange('Portrait')}
          className={`flex-1 py-1.5 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            value === 'Portrait'
              ? 'bg-card text-foreground shadow-2xs border border-border/80'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {/* Portrait Glyph */}
          <div className="w-2.5 h-3.5 border-1.5 border-current rounded-[2px]" />
          <span>Portrait</span>
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange('Landscape')}
          className={`flex-1 py-1.5 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            value === 'Landscape'
              ? 'bg-card text-foreground shadow-2xs border border-border/80'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {/* Landscape Glyph */}
          <div className="w-3.5 h-2.5 border-1.5 border-current rounded-[2px]" />
          <span>Landscape</span>
        </button>
      </div>
    </div>
  );
};
