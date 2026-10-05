import React from 'react';
import { Star } from 'lucide-react';

interface BaseCurrencyToggleProps {
  isBase: boolean;
  currencyCode: string;
  onSetBase: () => void;
}

export const BaseCurrencyToggle: React.FC<BaseCurrencyToggleProps> = ({
  isBase,
  currencyCode,
  onSetBase,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isBase) return;

    const confirmed = window.confirm(
      `Set ${currencyCode} as the base currency? Any existing base currency will be unset, and ${currencyCode}'s rate will be locked to 1.00.`
    );
    if (confirmed) {
      onSetBase();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={isBase ? 'Active Base Currency (Locked to 1.00)' : `Click to make ${currencyCode} base currency`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
        isBase
          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 ring-1 ring-amber-500/20'
          : 'bg-muted/60 text-muted-foreground border border-border hover:bg-muted hover:text-foreground'
      }`}
    >
      <Star
        className={`size-3.5 ${
          isBase ? 'fill-amber-500 text-amber-600' : 'text-muted-foreground/60'
        }`}
      />
      <span>{isBase ? 'Base' : 'Set as Base'}</span>
    </button>
  );
};
