import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useCurrencyStore } from '../../stores/currencyStore';
import { CommaFormat, CurrencyMaster, CurrencySetup } from '../../types/currency';
import { CurrencyPageHeader } from '../../components/currency/CurrencyPageHeader';
import { CurrencyCodePicker } from '../../components/currency/CurrencyCodePicker';
import { SymbolPreview } from '../../components/currency/SymbolPreview';
import { CommaFormatSelect } from '../../components/currency/CommaFormatSelect';
import { currencySetupSchema } from '../../lib/validation/currency';
import {
  Save,
  ArrowLeft,
  Coins,
  Info,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { toast } from 'sonner';

export const CurrencySetupFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { setups, addSetup, updateSetup, loading, load } = useCurrencyStore();

  const isEdit = Boolean(id);
  const existingSetup = id ? setups.find((s) => s.id === id) : undefined;

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
    if (setups.length === 0) {
      load();
    }
  }, [setups.length, load]);

  useEffect(() => {
    if (existingSetup) {
      setCode(existingSetup.code);
      setCountry(existingSetup.country);
      setName(existingSetup.name);
      setSymbol(existingSetup.symbol);
      setDecimalPlace(existingSetup.decimalPlace);
      setSubunit(existingSetup.subunit);
      setCommaFormat(existingSetup.commaFormat);
    }
  }, [existingSetup]);

  // Rule C4: Auto-populate Symbol, Name, Subunit on Currency Code select
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
    if (!isEdit && setups.some((s) => s.code.toUpperCase() === code.toUpperCase())) {
      setErrors((prev) => ({ ...prev, code: `Currency code ${code} is already configured` }));
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
      if (isEdit && id) {
        await updateSetup(id, payload);
      } else {
        await addSetup(payload, initialRate > 0 ? initialRate : 1);
      }
      navigate('/currency-setup');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-4 pb-20">
      {/* ── Page Header Strip ── */}
      <CurrencyPageHeader showNewButton={false} />

      {/* ── Main Setup Card (Full width, responsive 2-column layout) ── */}
      <div className="bg-card border border-border/80 rounded-xl shadow-2xs overflow-hidden">
        {/* Form Title Banner */}
        <div className="p-4 sm:p-5 border-b border-border/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 grid place-items-center">
              <Coins className="size-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                {isEdit ? `Edit Currency — ${code}` : 'Add New Currency'}
              </h2>
              <p className="text-xs text-muted-foreground">
                Configure international currency definitions, subunit terminology, and comma formatting.
              </p>
            </div>
          </div>

          <Link
            to="/currency-setup"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-bold text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Rates</span>
          </Link>
        </div>

        {/* Form Fields: Two columns on desktop, stacked on mobile */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ── LEFT COLUMN: Interactive Form Inputs (8 cols) ── */}
            <div className="lg:col-span-8 space-y-5">
              {/* 1. Currency Code */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>
                    Currency Code <span className="text-rose-500">*</span>
                  </span>
                  <span className="text-[11px] text-muted-foreground font-normal">
                    Search from 200+ ISO 4217 currencies
                  </span>
                </label>
                <CurrencyCodePicker
                  value={code}
                  onChange={handleSelectMaster}
                  disabled={isEdit}
                />
                {errors.code && <p className="text-[11px] text-rose-500 font-medium">{errors.code}</p>}
              </div>

              {/* 2. Currency Symbol */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>
                    Currency Symbol <span className="text-rose-500">*</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground font-normal">Auto-populated</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    placeholder="Auto-populates from code selection"
                    value={symbol}
                    className="flex-1 h-9 px-3 rounded-lg border border-border/60 bg-muted/30 text-xs font-medium text-foreground/80 outline-none select-all"
                  />
                  <SymbolPreview symbol={symbol} />
                </div>
                {errors.symbol && <p className="text-[11px] text-rose-500 font-medium">{errors.symbol}</p>}
              </div>

              {/* 3. Currency Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>
                    Currency Name <span className="text-rose-500">*</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground font-normal">Auto-populated</span>
                </label>
                <input
                  type="text"
                  readOnly
                  placeholder="Auto-populates from code selection"
                  value={name}
                  className="w-full h-9 px-3 rounded-lg border border-border/60 bg-muted/30 text-xs font-medium text-foreground/80 outline-none select-all"
                />
                {errors.name && <p className="text-[11px] text-rose-500 font-medium">{errors.name}</p>}
              </div>

              {/* 4. Decimal Place */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>Decimal Place</span>
                  <span className="text-[10px] text-muted-foreground font-normal">0 to 4 digits</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={4}
                    value={decimalPlace}
                    onChange={(e) => setDecimalPlace(parseInt(e.target.value) || 0)}
                    className="w-32 h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono font-bold text-foreground outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <span className="text-xs text-muted-foreground">digits of precision (default 2)</span>
                </div>
              </div>

              {/* 5. Subunit Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>
                    Subunit Name <span className="text-rose-500">*</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground font-normal">Auto-populated</span>
                </label>
                <input
                  type="text"
                  readOnly
                  placeholder="e.g. Cent, Poisa, Penny, Fils"
                  value={subunit}
                  className="w-full h-9 px-3 rounded-lg border border-border/60 bg-muted/30 text-xs font-medium text-foreground/80 outline-none select-all"
                />
                {errors.subunit && (
                  <p className="text-[11px] text-rose-500 font-medium">{errors.subunit}</p>
                )}
              </div>

              {/* 6. Comma Format */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>Comma Format</span>
                  <span className="text-[10px] text-muted-foreground font-normal">Digit grouping style</span>
                </label>
                <CommaFormatSelect
                  value={commaFormat}
                  onChange={setCommaFormat}
                  decimals={decimalPlace}
                />
              </div>

              {/* Initial Exchange Rate (only on create) */}
              {!isEdit && (
                <div className="space-y-1.5 pt-2 border-t border-border/60">
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
                    className="w-44 h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono font-bold text-foreground outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Initial exchange rate relative to the system base currency. Can be updated anytime on the rate list.
                  </p>
                </div>
              )}
            </div>

            {/* ── RIGHT COLUMN: N.B. Specification Hints (4 cols) ── */}
            <div className="lg:col-span-4 bg-slate-50/80 dark:bg-muted/15 rounded-xl border border-border/70 p-4 space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground border-b border-border/60 pb-2">
                <Info className="size-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Field Guidance & Constraints</span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="font-semibold text-foreground text-[11px]">1. Currency Code</span>
                  <p className="text-[11px] text-muted-foreground italic mt-0.5">
                    Select from 200+ countries. Once created, code is locked to preserve ledger audit trail.
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-foreground text-[11px]">2. Symbol, Name & Subunit</span>
                  <p className="text-[11px] text-muted-foreground italic mt-0.5">
                    Value will populate automatically after selecting currency code from the master lookup.
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-foreground text-[11px]">3. Decimal Place</span>
                  <p className="text-[11px] text-muted-foreground italic mt-0.5">
                    Number field. Governs transaction decimal precision across vouchers and reports.
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-foreground text-[11px]">4. Comma Format</span>
                  <p className="text-[11px] text-muted-foreground italic mt-0.5">
                    Select regional number presentation style: Indian (lakh/crore), Western, or European.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-border/80">
            <button
              type="button"
              onClick={() => navigate('/currency-setup')}
              className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground rounded-lg border border-border hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-600/20 transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Save className="size-3.5 stroke-[2.5]" />
              <span>{isEdit ? 'Save Changes' : 'Save Currency Setup'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CurrencySetupFormPage;
