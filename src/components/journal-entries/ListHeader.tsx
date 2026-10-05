import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  ChevronDown,
  BookOpen,
  ArrowDownRight,
  ArrowUpRight,
  Repeat,
  SlidersHorizontal,
} from 'lucide-react';
import { VoucherType, VOUCHER_TYPES, VOUCHER_TYPE_CONFIG } from '../../types/journalEntry';

interface ListHeaderProps {
  totalCount: number;
}

export const ListHeader: React.FC<ListHeaderProps> = ({ totalCount }) => {
  const navigate = useNavigate();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleSelectType = (type: VoucherType) => {
    setPopoverOpen(false);
    navigate(`/journal-entries/new?type=${type}`);
  };

  const getIcon = (type: VoucherType) => {
    switch (type) {
      case 'Journal':
        return <BookOpen className="size-4 text-indigo-600 dark:text-indigo-400" />;
      case 'Receive':
        return <ArrowDownRight className="size-4 text-emerald-600 dark:text-emerald-400" />;
      case 'Payment':
        return <ArrowUpRight className="size-4 text-rose-600 dark:text-rose-400" />;
      case 'Contra':
        return <Repeat className="size-4 text-amber-600 dark:text-amber-400" />;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <BookOpen className="size-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-foreground tracking-tight flex items-center gap-2">
              <span>Journal Entries</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/80">
                {totalCount} Total
              </span>
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Comprehensive master log of all financial vouchers across types and transaction sources
            </p>
          </div>
        </div>
      </div>

      <div className="relative" ref={popoverRef}>
        <button
          type="button"
          onClick={() => setPopoverOpen((prev) => !prev)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm shadow-primary/25 transition-all cursor-pointer whitespace-nowrap active:scale-95"
        >
          <Plus className="size-4 stroke-[2.5]" />
          <span>New Voucher</span>
          <ChevronDown
            className={`size-3.5 transition-transform duration-200 ${
              popoverOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {popoverOpen && (
          <div className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-popover text-popover-foreground shadow-xl z-50 p-2 space-y-1 animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Select Voucher Type
            </div>

            {VOUCHER_TYPES.map((type) => {
              const cfg = VOUCHER_TYPE_CONFIG[type];
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleSelectType(type)}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted/80 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-md bg-background border border-border group-hover:border-border/80 shadow-2xs">
                      {getIcon(type)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground">
                        {cfg.label}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {type === 'Journal'
                          ? 'Double entry (Dr = Cr)'
                          : type === 'Receive'
                          ? 'Credit lines with cash/bank header'
                          : type === 'Payment'
                          ? 'Debit lines with cash/bank header'
                          : 'Cash to Bank / Bank to Bank'}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${cfg.color.badge}`}
                  >
                    {cfg.shortCode}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
