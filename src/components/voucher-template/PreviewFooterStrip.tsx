import React from 'react';

interface PreviewFooterStripProps {
  showPrintDateTime: boolean;
  showPageNumber: boolean;
  footerName: string;
  fontSize: number;
  textColor: string;
}

export const PreviewFooterStrip: React.FC<PreviewFooterStripProps> = ({
  showPrintDateTime,
  showPageNumber,
  footerName,
  fontSize = 9,
  textColor,
}) => {
  return (
    <div
      className="flex items-center justify-between pt-3 border-t border-slate-300 dark:border-border/60 text-slate-500 dark:text-slate-400 font-mono"
      style={{
        fontSize: `${Math.max(fontSize - 1.5, 7.5)}px`,
      }}
    >
      {/* Left: Date & Time */}
      <div className="w-1/3 text-left">
        {showPrintDateTime ? (
          <span>2026-10-01 18:42:00</span>
        ) : (
          <span className="opacity-0">hidden</span>
        )}
      </div>

      {/* Center: Footer Name / Website */}
      <div className="w-1/3 text-center font-semibold text-slate-700 dark:text-slate-300">
        {footerName || 'www.Pakizasoftware.com'}
      </div>

      {/* Right: Page Number */}
      <div className="w-1/3 text-right">
        {showPageNumber ? (
          <span>Page-1 of 1</span>
        ) : (
          <span className="opacity-0">hidden</span>
        )}
      </div>
    </div>
  );
};
