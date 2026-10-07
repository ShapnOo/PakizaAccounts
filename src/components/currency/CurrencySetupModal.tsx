import React, { useState, useEffect } from 'react';
import { useCurrencyStore } from '../../stores/currencyStore';
import { CommaFormat, CurrencyMaster, CurrencySetup } from '../../types/currency';
import { CurrencyCodePicker } from './CurrencyCodePicker';
import { SymbolPreview } from './SymbolPreview';
import { CommaFormatSelect } from './CommaFormatSelect';
import { currencySetupSchema } from '../../lib/validation/currency';
import { X, Save, Coins } from 'lucide-react';
import { toast } from 'sonner';

interface CurrencySetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCurrency?: CurrencySetup | null;
}

export const CurrencySetupModal: React.FC<CurrencySetupModalProps> = ({
  isOpen,
  onClose,
  initialCurrency,
}) => {
  const { setups, addSetup, updateSetup } = useCurrencyStore();

  const isEdit = Boolean(initialCurrency);

  const [code, setCode] = useState('');
  const [country, setCountry] = useState('');
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [decimalPlace, setDecimalPlace] = useState(2);
  const [subunit, setSubunit] = useState('');
  const [commaFormat, setCommaFormat] = useState<CommaFormat>('1,234,567,890');
  const [initialRate, setInitialRate] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialCurrency) {
      setCode(initialCurrency.code);
      setCountry(initialCurrency.country);
      setName(initialCurrency.name);
      setSymbol(initialCurrency.symbol);
      setDecimalPlace(initialCurrency.decimalPlace);
      setSubunit(initialCurrency.subunit);
      setCommaFormat(initialCurrency.commaFormat);
      setErrors({});
    } else {
      setCode('');
      setCountry('');
      setName('');
      setSymbol('');
      setDecimalPlace(2);
      setSubunit('');
      setCommaFormat('1,234,567,890');
      setInitialRate(1);
      setErrors({});
    }
  }, [initialCurrency, isOpen]);

  if (!isOpen) return null;

  // Auto-populate on code select
  const handleSelectMaster = (master: CurrencyMaster) => {
    setCode(master.code);
    setCountry(master.country);
    setName(master.currencyName || master.code);
    setSymbol(master.symbol || '');
    setSubunit(master.subunit || 'Cent');
    setErrors((prev) => ({ ...prev, code: '', symbol: '', name: '', subunit: '' }));
  };

  const validate = () => {
    const displayCode = `${code}-${country}`;
    const payload = {
      code,
      country,
      displayCode,
      name,
      symbol,
      decimalPlace,
      subunit,
      commaFormat,
    };

    const res = currencySetupSchema.safeParse(payload);
    if (!res.success) {
      const errMap: Record<string, string> = {};
      res.error.issues.forEach((err) => {
        errMap[err.path[0]?.toString() || 'global'] = err.message;
      });
      setErrors(errMap);
      toast.error('Please resolve the errors in the form');
      return false;
    }

    // Check code uniqueness on create
    if (
      !isEdit &&
      setups.some((s) => s.code.toUpperCase() === code.toUpperCase())
    ) {
      setErrors((prev) => ({
        ...prev,
        code: `Currency code ${code} is already configured`,
      }));
      toast.error(`Currency ${code} already exists`);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    const displayCode = `${code}-${country}`;
    const payload = {
      code,
      country,
      displayCode,
      name,
      symbol,
      decimalPlace,
      subunit,
      commaFormat,
    };

    try {
      if (isEdit && initialCurrency) {
        await updateSetup(initialCurrency.id, payload);
        toast.success(`Currency ${code} updated successfully`);
      } else {
        await addSetup(payload, initialRate > 0 ? initialRate : 1);
        toast.success(`Currency ${code} added successfully`);
      }
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save currency');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
      <div className="w-full max-w-xl max-h-[92vh] flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border/80 flex items-center justify-between bg-muted/30 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-8.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 grid place-items-center shadow-2xs">
              <Coins className="size-4.5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-foreground">
                {isEdit ? `Edit Currency — ${code}` : 'Add New Currency'}
              </h2>
              <p className="text-[11px] text-muted-foreground">
                International currency definitions & formatting
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4 sidebar-scroll">
          {/* 1. Currency Code */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground flex items-center justify-between">
              <span>
                Currency Code <span className="text-rose-500">*</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-normal">
                200+ ISO 4217 currencies
              </span>
            </label>
            <CurrencyCodePicker
              value={code}
              onChange={handleSelectMaster}
              disabled={isEdit}
            />
            {errors.code && <p className="text-[10.5px] text-rose-500 font-medium">{errors.code}</p>}
          </div>

          {/* 2. Currency Symbol & Name in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Symbol */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span>
                  Symbol <span className="text-rose-500">*</span>
                </span>
                <span className="text-[10px] text-muted-foreground font-normal">Auto</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  placeholder="e.g. $, €"
                  value={symbol}
                  className="flex-1 h-8.5 px-3 rounded-lg border border-border/60 bg-muted/30 text-xs font-medium text-foreground/80 outline-none select-all"
                />
                <SymbolPreview symbol={symbol} />
              </div>
              {errors.symbol && <p className="text-[10.5px] text-rose-500 font-medium">{errors.symbol}</p>}
            </div>

            {/* Currency Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span>
                  Currency Name <span className="text-rose-500">*</span>
                </span>
                <span className="text-[10px] text-muted-foreground font-normal">Auto</span>
              </label>
              <input
                type="text"
                readOnly
                placeholder="e.g. US Dollar"
                value={name}
                className="w-full h-8.5 px-3 rounded-lg border border-border/60 bg-muted/30 text-xs font-medium text-foreground/80 outline-none select-all"
              />
              {errors.name && <p className="text-[10.5px] text-rose-500 font-medium">{errors.name}</p>}
            </div>
          </div>

          {/* 3. Decimal Place & Subunit Name in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Decimal Place */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span>Decimal Place</span>
                <span className="text-[10px] text-muted-foreground font-normal">0 to 4</span>
              </label>
              <input
                type="number"
                min={0}
                max={4}
                value={decimalPlace}
                onChange={(e) => setDecimalPlace(parseInt(e.target.value) || 0)}
                className="w-full h-8.5 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono font-bold text-foreground outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Subunit Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span>
                  Subunit Name <span className="text-rose-500">*</span>
                </span>
                <span className="text-[10px] text-muted-foreground font-normal">Auto</span>
              </label>
              <input
                type="text"
                readOnly
                placeholder="e.g. Cent, Poisa"
                value={subunit}
                className="w-full h-8.5 px-3 rounded-lg border border-border/60 bg-muted/30 text-xs font-medium text-foreground/80 outline-none select-all"
              />
              {errors.subunit && (
                <p className="text-[10.5px] text-rose-500 font-medium">{errors.subunit}</p>
              )}
            </div>
          </div>

          {/* 4. Comma Format */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground flex items-center justify-between">
              <span>Comma Format</span>
              <span className="text-[10px] text-muted-foreground font-normal">Digit grouping</span>
            </label>
            <CommaFormatSelect
              value={commaFormat}
              onChange={setCommaFormat}
              decimals={decimalPlace}
            />
          </div>

          {/* 5. Initial Exchange Rate (only on create) */}
          {!isEdit && (
            <div className="space-y-1 pt-2 border-t border-border/50">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span>Initial Exchange Rate (vs Base Currency)</span>
                <span className="text-[10px] text-muted-foreground font-normal">Optional</span>
              </label>
              <input
                type="number"
                step="any"
                min={0.0001}
                value={initialRate}
                onChange={(e) => setInitialRate(parseFloat(e.target.value) || 1)}
                placeholder="1.00"
                className="w-full h-8.5 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono font-bold text-foreground outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="text-[10.5px] text-muted-foreground">
                Relative to system base currency. Can be updated anytime in the rate list.
              </p>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground rounded-lg border border-border hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-600/20 transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Save className="size-3.5 stroke-[2.5]" />
              <span>{isEdit ? 'Save Changes' : 'Save Currency'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
