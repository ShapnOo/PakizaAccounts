import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CurrencySetup, ExchangeRate } from '../../types/currency';
import { BaseCurrencyToggle } from './BaseCurrencyToggle';
import { formatNumber, formatWithCommaStyle } from '../../lib/format/currency';
import { useDropdownPosition } from '../../hooks/useDropdownPosition';
import { toast } from 'sonner';
import {
  Lock,
  Pencil,
  History,
  MoreVertical,
  Trash2,
  Calendar,
  Check,
  X,
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
  onEdit?: (setup: CurrencySetup) => void;
  density?: 'comfortable' | 'compact';
}

export const RateRow: React.FC<RateRowProps> = ({
  setup,
  rate,
  onUpdateRate,
  onSetBase,
  onDelete,
  onOpenHistory,
  onEdit,
  density = 'comfortable',
}) => {
  const navigate = useNavigate();
  const isBase = Boolean(rate?.isBase);
  const today = new Date().toISOString().split('T')[0];

  const [localRate, setLocalRate] = useState<string>(rate?.rate?.toString() || '1');
  const [localEffectiveDate, setLocalEffectiveDate] = useState<string>(
    rate?.effectiveDate || today
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const { openUpward } = useDropdownPosition({
    triggerRef: menuRef,
    isOpen: menuOpen,
    minMenuHeight: 180,
  });

  useEffect(() => {
    setLocalRate(rate?.rate?.toString() || (isBase ? '1' : '0'));
    setLocalEffectiveDate(rate?.effectiveDate || today);
  }, [rate?.rate, rate?.effectiveDate, isBase, today]);

  const handleStartEdit = () => {
    if (isBase) return;
    setLocalRate(rate?.rate?.toString() || '1');
    const existingDate = rate?.effectiveDate || today;
    setLocalEffectiveDate(existingDate < today ? today : existingDate);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setLocalRate(rate?.rate?.toString() || '1');
    setLocalEffectiveDate(rate?.effectiveDate || today);
  };

  const handleSave = async () => {
    if (isBase) {
      setIsEditing(false);
      return;
    }

    const num = parseFloat(localRate);
    if (isNaN(num) || num <= 0) {
      toast.error('Please enter a valid exchange rate greater than 0');
      return;
    }

    if (!localEffectiveDate) {
      toast.error('Please select an effective date');
      return;
    }

    // Strict validation: Backdating is not permitted
    if (localEffectiveDate < today) {
      toast.error('Backdating is not allowed. Effective date must be today or a future date.');
      return;
    }

    setIsSaving(true);
    try {
      await onUpdateRate(setup.id, num, localEffectiveDate);
      setIsEditing(false);
    } catch {
      // Error handled by store toast
    } finally {
      setIsSaving(false);
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
          {isSaving && <Loader2 className="size-3 animate-spin text-primary" />}

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
              onWheel={(e) => e.currentTarget.blur()}
              onChange={(e) => setLocalRate(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancelEdit();
              }}
              placeholder="0.0000"
              className="w-24 h-7 px-2 text-right font-mono font-bold text-xs bg-background border border-primary rounded-md outline-none ring-2 ring-primary/20 shadow-2xs"
            />
          ) : (
            <button
              type="button"
              onClick={handleStartEdit}
              title="Click to edit exchange rate and effective date"
              className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md hover:bg-muted/50 border border-transparent hover:border-border/80 transition-all font-mono font-bold text-xs tabular-nums text-foreground cursor-pointer"
            >
              <span>
                {formatWithCommaStyle(
                  rate?.rate || 0,
                  setup.commaFormat,
                  setup.decimalPlace || 4
                )}
              </span>
              <Pencil className="size-3 text-muted-foreground/40 group-hover:text-primary transition-colors" />
            </button>
          )}
        </div>
      </td>

      {/* ── 3. Effective Date (Editable with backdate restriction) ── */}
      <td className={`px-4 ${rowPadding} text-muted-foreground font-mono text-[11px]`}>
        {isEditing ? (
          <div className="inline-flex items-center gap-1.5">
            <input
              type="date"
              min={today}
              value={localEffectiveDate}
              onChange={(e) => setLocalEffectiveDate(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancelEdit();
              }}
              title="Effective date (advance/future date allowed, no backdates)"
              className="h-7 px-2 font-mono text-xs bg-background border border-primary rounded-md outline-none ring-2 ring-primary/20 shadow-2xs text-foreground cursor-pointer"
            />
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              title="Save rate and effective date"
              className="size-7 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              <Check className="size-3.5 stroke-[2.5]" />
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={isSaving}
              title="Cancel"
              className="size-7 rounded-md border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={isBase}
            onClick={handleStartEdit}
            title={
              isBase
                ? 'Base currency effective date is locked'
                : 'Click to edit effective date & exchange rate'
            }
            className={`group inline-flex items-center gap-1.5 px-2 py-1 rounded-md transition-all font-mono text-[11px] ${
              isBase
                ? 'text-muted-foreground cursor-default'
                : 'hover:bg-muted/50 border border-transparent hover:border-border/80 text-foreground cursor-pointer'
            }`}
          >
            <Calendar className="size-3 text-muted-foreground/60 group-hover:text-primary transition-colors shrink-0" />
            <span className="font-semibold">{rate?.effectiveDate || '—'}</span>
            {!isBase && (
              <Pencil className="size-2.5 opacity-0 group-hover:opacity-70 transition-opacity text-primary" />
            )}
          </button>
        )}
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
              className={`absolute right-0 z-30 w-44 bg-popover rounded-xl border border-border shadow-xl p-1 ${
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
                    handleStartEdit();
                  }}
                  className="w-full px-2.5 py-1.5 text-left text-xs font-semibold rounded-lg hover:bg-muted text-foreground flex items-center gap-2 cursor-pointer"
                >
                  <Calendar className="size-3 text-muted-foreground" />
                  <span>Update Rate & Date</span>
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
