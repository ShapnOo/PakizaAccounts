import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CurrencySetup, ExchangeRate } from '../../types/currency';
import { BaseCurrencyToggle } from './BaseCurrencyToggle';
import { formatNumber, formatWithCommaStyle } from '../../lib/format/currency';
import {
  Lock,
  Pencil,
  History,
  MoreVertical,
  Trash2,
  Calendar,
  Check,
  Loader2,
  Globe,
} from 'lucide-react';

interface RateRowProps {
  setup: CurrencySetup;
  rate?: ExchangeRate;
  onUpdateRate: (currencyId: string, rate: number, effectiveDate: string) => Promise<void>;
  onSetBase: (currencyId: string) => Promise<void>;
  onDelete: (currencyId: string) => Promise<void>;
  onOpenHistory: (setup: CurrencySetup) => void;
  density?: 'comfortable' | 'compact';
}

export const RateRow: React.FC<RateRowProps> = ({
  setup,
  rate,
  onUpdateRate,
  onSetBase,
  onDelete,
  onOpenHistory,
  density = 'comfortable',
}) => {
  const navigate = useNavigate();
  const isBase = Boolean(rate?.isBase);

  const [localRate, setLocalRate] = useState<string>(rate?.rate?.toString() || '1');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setLocalRate(rate?.rate?.toString() || (isBase ? '1' : '0'));
  }, [rate?.rate, isBase]);

  const handleBlur = async () => {
    setIsEditing(false);
    if (isBase) return;

    const num = parseFloat(localRate);
    if (!isNaN(num) && num > 0 && num !== rate?.rate) {
      setIsSaving(true);
      const today = new Date().toISOString().split('T')[0];
      await onUpdateRate(setup.id, num, today);
      setIsSaving(false);
    } else {
      setLocalRate(rate?.rate?.toString() || '1');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  const rowPadding = density === 'comfortable' ? 'py-2.5' : 'py-1.5';

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

      {/* ── 2. Exchange Rate (Inline editable or locked for base) ── */}
      <td className={`px-4 ${rowPadding} text-right`}>
        <div className="inline-flex items-center justify-end gap-1.5">
          {isSaving && <Loader2 className="size-3 animate-spin text-indigo-600" />}

          {isBase ? (
            <div
              title="Base currency exchange rate is locked to 1.00"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/30 border border-border/50 text-foreground font-mono font-bold text-xs tabular-nums select-none"
            >
              <Lock className="size-3 text-muted-foreground/70" />
              <span>1.0000</span>
            </div>
          ) : isEditing ? (
            <input
              type="number"
              step="any"
              min={0.0001}
              autoFocus
              value={localRate}
              onChange={(e) => setLocalRate(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="w-28 h-7 px-2 text-right font-mono font-bold text-xs bg-background border border-indigo-500 rounded-md outline-none ring-2 ring-indigo-500/20"
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md hover:bg-muted/50 border border-transparent hover:border-border/80 transition-all font-mono font-bold text-xs tabular-nums text-foreground cursor-pointer"
            >
              <span>
                {formatWithCommaStyle(
                  rate?.rate || 0,
                  setup.commaFormat,
                  setup.decimalPlace || 4
                )}
              </span>
              <Pencil className="size-3 text-muted-foreground/40 group-hover:text-indigo-600 transition-colors" />
            </button>
          )}
        </div>
      </td>

      {/* ── 3. Effective Date ── */}
      <td className={`px-4 ${rowPadding} text-muted-foreground font-mono text-[11px]`}>
        <div className="flex items-center gap-1.5">
          <Calendar className="size-3 text-muted-foreground/60 shrink-0" />
          <span>{rate?.effectiveDate || '—'}</span>
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
      <td className={`px-4 ${rowPadding} text-center`}>
        <BaseCurrencyToggle
          isBase={isBase}
          currencyCode={setup.code}
          onSetBase={() => onSetBase(setup.id)}
        />
      </td>

      {/* ── 6. Row Actions (⋮) ── */}
      <td className={`px-4 ${rowPadding} text-right`}>
        <div className="relative inline-block">
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
              className="absolute right-0 top-full mt-1 z-30 w-36 bg-popover rounded-xl border border-border shadow-xl p-1 animate-in fade-in-50 zoom-in-95 duration-100"
            >
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate(`/currency-setup/${setup.id}/edit`);
                }}
                className="w-full px-2.5 py-1.5 text-left text-xs font-semibold rounded-lg hover:bg-muted text-foreground flex items-center gap-2 cursor-pointer"
              >
                <Pencil className="size-3 text-muted-foreground" />
                <span>Edit Details</span>
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
                <span>View History</span>
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
