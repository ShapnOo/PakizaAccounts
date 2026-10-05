import React from 'react';

interface SymbolPreviewProps {
  symbol: string;
}

export const SymbolPreview: React.FC<SymbolPreviewProps> = ({ symbol }) => {
  return (
    <div
      title="Currency Symbol Preview"
      className="size-9 rounded-lg border border-border/80 bg-muted/30 flex items-center justify-center font-mono text-base font-black text-indigo-700 dark:text-indigo-400 shrink-0 select-none shadow-2xs"
    >
      {symbol || '—'}
    </div>
  );
};
