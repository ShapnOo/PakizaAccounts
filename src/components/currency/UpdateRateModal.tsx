import React, { useState, useEffect } from 'react';
import { CurrencySetup, ExchangeRate } from '../../types/currency';
import { formatWithCommaStyle } from '../../lib/format/currency';
import { X, TrendingUp, Calendar, AlertCircle, CheckCircle2, Clock, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface UpdateRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  setup: CurrencySetup | null;
  rate?: ExchangeRate;
  onSave: (currencyId: string, rate: number, effectiveDate: string) => Promise<void>;
}

export const UpdateRateModal: React.FC<UpdateRateModalProps> = ({
  isOpen,
  onClose,
  setup,
  rate,
  onSave,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const [newRate, setNewRate] = useState<string>('');
  const [effectiveDate, setEffectiveDate] = useState<string>(today);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && setup) {
      setNewRate(rate?.rate ? rate.rate.toString() : '1');
      setEffectiveDate(today);
    }
  }, [isOpen, setup, rate, today]);

  if (!isOpen || !setup) return null;

  const isBase = Boolean(rate?.isBase);
  const isFutureDate = effectiveDate > today;
  const scheduled = rate?.scheduledRate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBase) {
      toast.info('Base currency exchange rate is locked to 1.0000');
      onClose();
      return;
    }

    const num = parseFloat(newRate);
    if (isNaN(num) || num <= 0) {
      toast.error('Please enter a valid exchange rate greater than 0');
      return;
    }

    if (!effectiveDate) {
      toast.error('Please select an effective date');
      return;
    }

    if (effectiveDate < today) {
      toast.error('Backdating is not allowed. Effective date must be today or a future date.');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(setup.id, num, effectiveDate);
      if (isFutureDate) {
        toast.success(
          `Exchange rate scheduled for ${effectiveDate}. Current rate remains active until then.`
        );
      } else {
        toast.success(`Exchange rate updated successfully for ${setup.code}`);
      }
      onClose();
    } catch {
      // Error handled by store toast
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border/80 flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 grid place-items-center shadow-2xs">
              <TrendingUp className="size-4.5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-foreground">
                Update Exchange Rate
              </h2>
              <p className="text-[11px] text-muted-foreground font-mono">
                {setup.code} ({setup.symbol}) — {setup.country}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground grid place-items-center transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Current Active Rate Card */}
          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/70 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-muted-foreground">Current Active Rate:</span>
              <span className="font-mono font-bold text-sm text-foreground">
                {formatWithCommaStyle(
                  rate?.rate || 0,
                  setup.commaFormat,
                  setup.decimalPlace || 4
                )}{' '}
                <span className="text-[11px] font-normal text-muted-foreground">
                  (since {rate?.effectiveDate || '—'})
                </span>
              </span>
            </div>

            {scheduled && (
              <div className="pt-2 border-t border-border/60 flex items-start gap-2 text-[11px] text-amber-700 dark:text-amber-400">
                <Clock className="size-3.5 shrink-0 mt-0.5 text-amber-500" />
                <div>
                  <span className="font-bold">Pending Scheduled Rate:</span>{' '}
                  <span className="font-mono font-semibold">
                    {formatWithCommaStyle(
                      scheduled.rate,
                      setup.commaFormat,
                      setup.decimalPlace || 4
                    )}
                  </span>{' '}
                  from <span className="font-semibold font-mono">{scheduled.effectiveDate}</span>
                </div>
              </div>
            )}
          </div>

          {isBase ? (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <Lock className="size-4 shrink-0" />
              <span>
                This is the system base currency. Its exchange rate is locked to 1.0000.
              </span>
            </div>
          ) : (
            <>
              {/* New Rate Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>
                    New Exchange Rate <span className="text-rose-500">*</span>
                  </span>
                  <span className="text-[10.5px] text-muted-foreground font-mono">
                    1 {setup.code} in Base
                  </span>
                </label>
                <input
                  type="number"
                  step="any"
                  min={0.0001}
                  required
                  autoFocus
                  value={newRate}
                  onWheel={(e) => e.currentTarget.blur()}
                  onChange={(e) => setNewRate(e.target.value)}
                  placeholder="0.0000"
                  className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono font-bold text-foreground outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Effective Date Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>
                    Effective Date <span className="text-rose-500">*</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    Future dates allowed
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={today}
                    required
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono font-bold text-foreground outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Dynamic Helper Note */}
              <div
                className={`p-3 rounded-xl border text-[11px] leading-relaxed flex items-start gap-2.5 transition-colors ${
                  isFutureDate
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300'
                    : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-900 dark:text-indigo-300'
                }`}
              >
                {isFutureDate ? (
                  <>
                    <Clock className="size-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div>
                      <p className="font-bold">Future Scheduled Rate:</p>
                      <p className="text-[10.5px] opacity-90">
                        This rate is set for <strong>{effectiveDate}</strong>. The current rate (
                        {formatWithCommaStyle(
                          rate?.rate || 0,
                          setup.commaFormat,
                          setup.decimalPlace || 4
                        )}
                        ) will remain active until that date arrives. When{' '}
                        <strong>{effectiveDate}</strong> arrives, this new rate will automatically
                        become active.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-4 shrink-0 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                    <div>
                      <p className="font-bold">Immediate Activation:</p>
                      <p className="text-[10.5px] opacity-90">
                        This rate will become active immediately today ({today}) and will be logged
                        into the rate history.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/80">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground rounded-lg border border-border hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>

            {!isBase && (
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-600/20 transition-all cursor-pointer whitespace-nowrap active:scale-95"
              >
                {isSaving ? (
                  <span>Saving…</span>
                ) : (
                  <>
                    <TrendingUp className="size-3.5 stroke-[2.5]" />
                    <span>{isFutureDate ? 'Schedule Rate' : 'Update Rate'}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
