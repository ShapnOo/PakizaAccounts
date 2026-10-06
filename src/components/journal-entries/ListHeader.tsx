import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  ChevronDown,
  BookOpen,
  ArrowDownRight,
  ArrowUpRight,
  Repeat,
} from 'lucide-react';
import { VoucherType, VOUCHER_NAMES, VOUCHER_TYPE_CONFIG, VoucherNameOption } from '../../types/journalEntry';

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

  const handleSelectVoucherName = (vn: VoucherNameOption) => {
    setPopoverOpen(false);
    navigate(`/journal-entries/new?voucherName=${encodeURIComponent(vn.name)}&type=${vn.type}`);
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
              Master log of all financial vouchers across voucher definitions and transaction sources
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
          <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl z-50 p-2 space-y-1 animate-in fade-in-50 zoom-in-95 duration-150 max-h-[75vh] overflow-y-auto sidebar-scroll">
            <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 mb-1">
              Select Voucher Name
            </div>

            {VOUCHER_NAMES.map((vn) => {
              const cfg = VOUCHER_TYPE_CONFIG[vn.type];
              return (
                <button
                  key={vn.name}
                  type="button"
                  onClick={() => handleSelectVoucherName(vn)}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted/80 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="p-1.5 rounded-md bg-background border border-border group-hover:border-border/80 shadow-2xs shrink-0 mt-0.5">
                      {getIcon(vn.type)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-foreground truncate">
                        {vn.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {vn.description}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ml-2 ${cfg.color.badge}`}
                  >
                    {vn.shortCode}
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
