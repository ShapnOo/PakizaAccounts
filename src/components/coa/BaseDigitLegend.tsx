import React from 'react';
import { Hash } from 'lucide-react';
import { BASE_DIGIT } from '../../constants/accountsTypeTree';

interface BaseDigitLegendProps {
  className?: string;
  showPrefixCol?: boolean;
}

export const BaseDigitLegend: React.FC<BaseDigitLegendProps> = ({
  className = '',
  showPrefixCol = true,
}) => {
  return (
    <div
      className={`border-t-2 border-border/80 bg-muted/40 font-mono text-[11px] text-muted-foreground select-none transition-colors ${className}`}
    >
      <div className="flex items-center">
        {/* Label cell */}
        <div className="w-56 sm:w-64 px-4 py-2 flex items-center gap-1.5 border-r border-border/50 font-sans font-bold text-foreground/80 shrink-0">
          <Hash className="size-3.5 text-primary" />
          <span>Base Digit</span>
          <span className="text-[10px] font-normal text-muted-foreground/70 italic ml-1">
            (2 digits/lvl)
          </span>
        </div>

        {/* 6 Level cells */}
        <div className="flex-1 grid grid-cols-6 text-center divide-x divide-border/40 font-bold">
          {[1, 2, 3, 4, 5, 6].map((lvl) => (
            <div key={lvl} className="py-2 px-2 flex items-center justify-center gap-1">
              <span className="text-muted-foreground/60 text-[9.5px]">L{lvl}:</span>
              <span className="text-foreground font-black bg-card px-1.5 py-0.5 rounded border border-border/60 shadow-2xs">
                {BASE_DIGIT}
              </span>
            </div>
          ))}
        </div>

        {/* Actions column spacer */}
        {showPrefixCol && <div className="w-12 shrink-0 border-l border-border/50" />}
      </div>
    </div>
  );
};
