import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CurrencySetup, ExchangeRate } from '../../types/currency';
import { BaseCurrencyToggle } from './BaseCurrencyToggle';
import { formatWithCommaStyle } from '../../lib/format/currency';
import { useDropdownPosition } from '../../hooks/useDropdownPosition';
import {
  Lock,
  Pencil,
  History,
  MoreVertical,
  Trash2,
  Calendar,
  TrendingUp,
  Clock,
} from 'lucide-react';

interface RateRowProps {
  setup: CurrencySetup;
  rate?: ExchangeRate;
  onUpdateRate?: (currencyId: string, rate: number, effectiveDate: string) => Promise<void>;
  onSetBase: (currencyId: string) => Promise<void>;
  onDelete: (currencyId: string) => Promise<void>;
  onOpenHistory: (setup: CurrencySetup) => void;
  onEdit?: (setup: CurrencySetup) => void;
  onOpenRateModal?: (setup: CurrencySetup, rate?: ExchangeRate) => void;
  density?: 'comfortable' | 'compact';
}

export const RateRow: React.FC<RateRowProps> = ({
  setup,
  rate,
  onSetBase,
  onDelete,
  onOpenHistory,
  onEdit,
  onOpenRateModal,
  density = 'comfortable',
}) => {
  const navigate = useNavigate();
  const isBase = Boolean(rate?.isBase);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const { openUpward } = useDropdownPosition({
    triggerRef: menuRef,
    isOpen: menuOpen,
    minMenuHeight: 180,
  });

  const rowPadding = density === 'comfortable' ? 'py-2.5' : 'py-1.5';
  const scheduled = rate?.scheduledRate;

  return (
    <tr
      className={`border-b border-border/40 transition-colors text-xs hover:bg-muted/15 ${
        isBase ? 'border-l-4 border-l-amber-500 bg-amber-500/[0.03]' : ''
      }`}
    >
      {/* ── 1. Currency Name: CODE (Symbol) with BASE chip ── */}
      <td className={`px-4 ${rowPadding}`}>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-foreground text-sm font-mono tracking-tight">
              {setup.code}
            </span>
            <span className="text-muted-foreground font-semibold">({setup.symbol})</span>
          </div>

          {isBase && (
            <span className="text-[10px] font-mono font-black px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
              BASE
            </span>
          )}

          <span className="text-[11px] text-muted-foreground/70 hidden sm:inline truncate max-w-[140px]">
            — {setup.country}
          </span>
        </div>
      </td>

      {/* ── 2. Exchange Rate (Clean display, modal trigger) ── */}
      <td className={`px-4 ${rowPadding} text-right`}>
        <div className="inline-flex items-center justify-end gap-1.5">
          {isBase ? (
            <div
              title="Base currency exchange rate is locked to 1.00"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/30 border border-border/50 text-foreground font-mono font-bold text-xs tabular-nums select-none"
            >
              <Lock className="size-3 text-muted-foreground/70" />
              <span>1.0000</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onOpenRateModal?.(setup, rate)}
              title="Click to open exchange rate update modal"
              className="group inline-flex flex-col items-end gap-0.5 px-2.5 py-1 rounded-md hover:bg-muted/50 border border-transparent hover:border-border/80 transition-all font-mono font-bold text-xs tabular-nums text-foreground cursor-pointer text-right"
            >
              <div className="inline-flex items-center gap-1.5">
                <span>
                  {formatWithCommaStyle(
                    rate?.rate || 0,
                    setup.commaFormat,
                    setup.decimalPlace || 4
                  )}
                </span>
                <Pencil className="size-3 text-muted-foreground/40 group-hover:text-primary transition-colors" />
              </div>
              {scheduled && (
                <span className="text-[9.5px] font-medium text-amber-600 dark:text-amber-400 font-sans tracking-tight">
                  Next: {formatWithCommaStyle(scheduled.rate, setup.commaFormat, setup.decimalPlace || 4)}
                </span>
              )}
            </button>
          )}
        </div>
      </td>

      {/* ── 3. Effective Date (Clean display with upcoming notice) ── */}
      <td className={`px-4 ${rowPadding} text-muted-foreground font-mono text-[11px]`}>
        <div className="inline-flex flex-col items-start gap-0.5">
          <div className="inline-flex items-center gap-1.5 text-foreground font-semibold">
            <Calendar className="size-3 text-muted-foreground/70 shrink-0" />
            <span>{rate?.effectiveDate || '—'}</span>
          </div>
          {scheduled && (
            <div className="inline-flex items-center gap-1 text-[9.5px] font-sans font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 rounded-full">
              <Clock className="size-2.5" />
              <span>Starts {scheduled.effectiveDate}</span>
            </div>
          )}
        </div>
      </td>

      {/* ── 4. History (H) Button ── */}
      <td className={`px-4 ${rowPadding} text-center`}>
        <button
          type="button"
          onClick={() => onOpenHistory(setup)}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold transition-colors cursor-pointer border border-transparent hover:border-indigo-200"
          title={`View historical exchange rates for ${setup.code}`}
        >
          <History className="size-3" />
          <span>(H)</span>
        </button>
      </td>

      {/* ── 5. Base Currency Toggle ── */}
      <td className={`px-4 ${rowPadding} text-center whitespace-nowrap min-w-[140px]`}>
        <div className="flex items-center justify-center">
          <BaseCurrencyToggle
            isBase={isBase}
            currencyCode={setup.code}
            onSetBase={() => onSetBase(setup.id)}
          />
        </div>
      </td>

      {/* ── 6. Row Actions (⋮) ── */}
      <td className={`px-4 ${rowPadding} text-right`}>
        <div ref={menuRef} className="relative inline-block">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="size-7 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground grid place-items-center transition-colors cursor-pointer"
          >
            <MoreVertical className="size-3.5" />
          </button>

          {menuOpen && (
            <div
              onMouseLeave={() => setMenuOpen(false)}
              className={`absolute right-0 z-30 w-48 bg-popover rounded-xl border border-border shadow-xl p-1 ${
                openUpward
                  ? 'bottom-full mb-1 origin-bottom animate-in fade-in-50 zoom-in-95 duration-100'
                  : 'top-full mt-1 origin-top animate-in fade-in-50 zoom-in-95 duration-100'
              }`}
            >
              {!isBase && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenRateModal?.(setup, rate);
                  }}
                  className="w-full px-2.5 py-1.5 text-left text-xs font-semibold rounded-lg hover:bg-muted text-foreground flex items-center gap-2 cursor-pointer"
                >
                  <TrendingUp className="size-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Update Exchange Rate</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  if (onEdit) {
                    onEdit(setup);
                  } else {
                    navigate(`/currency-setup/${setup.id}/edit`);
                  }
                }}
                className="w-full px-2.5 py-1.5 text-left text-xs font-semibold rounded-lg hover:bg-muted text-foreground flex items-center gap-2 cursor-pointer"
              >
                <Pencil className="size-3 text-muted-foreground" />
                <span>Edit Currency Details</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenHistory(setup);
                }}
                className="w-full px-2.5 py-1.5 text-left text-xs font-semibold rounded-lg hover:bg-muted text-foreground flex items-center gap-2 cursor-pointer"
              >
                <History className="size-3 text-muted-foreground" />
                <span>View Rate History</span>
              </button>

              <div className="my-1 border-t border-border/60" />

              <button
                type="button"
                disabled={isBase}
                onClick={() => {
                  setMenuOpen(false);
                  if (confirm(`Delete currency ${setup.code}?`)) {
                    onDelete(setup.id);
                  }
                }}
                className={`w-full px-2.5 py-1.5 text-left text-xs font-semibold rounded-lg flex items-center gap-2 ${
                  isBase
                    ? 'text-muted-foreground/40 cursor-not-allowed'
                    : 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer'
                }`}
              >
                <Trash2 className="size-3" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

