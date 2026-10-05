import React, { useState, useEffect } from 'react';
import { Landmark, X, Check, Loader2 } from 'lucide-react';
import { Bank } from '../../types/bank';
import { useBankStore } from '../../stores/bankStore';
import { updateBank } from '../../services/bankService';
import { toast } from 'sonner';

interface BankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (bank: Bank) => void;
  onBankCreated?: (bank: Bank) => void;
  onAddBank?: (p: { name: string; alias: string }) => Promise<Bank>;
  initialBank?: Bank | null;
}

export const BankModal: React.FC<BankModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onBankCreated,
  onAddBank,
  initialBank,
}) => {
  const store = useBankStore();
  const [name, setName] = useState('');
  const [alias, setAlias] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialBank) {
      setName(initialBank.name);
      setAlias(initialBank.alias);
    } else {
      setName('');
      setAlias('');
    }
    setError(null);
  }, [initialBank, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 3) {
      setError('Bank name is required (minimum 3 characters).');
      return;
    }
    if (!alias.trim() || alias.trim().length < 2) {
      setError('Bank alias is required (minimum 2 characters).');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      let savedBank: Bank;
      if (initialBank) {
        // Edit existing bank
        savedBank = await updateBank(initialBank.id, {
          name: name.trim(),
          alias: alias.trim().toUpperCase(),
        });
        await store.loadBanks();
        toast.success(`Updated bank "${savedBank.name}"`);
      } else {
        // Create new bank
        if (onAddBank) {
          savedBank = await onAddBank({
            name: name.trim(),
            alias: alias.trim().toUpperCase(),
          });
        } else {
          savedBank = await store.addBank({
            name: name.trim(),
            alias: alias.trim().toUpperCase(),
          });
        }
        toast.success(`Bank "${savedBank.name}" registered successfully`);
      }

      setName('');
      setAlias('');
      if (onSuccess) onSuccess(savedBank);
      if (onBankCreated) onBankCreated(savedBank);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save bank entity.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-card w-full max-w-sm rounded-2xl border border-border shadow-2xl p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Landmark className="size-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">
                {initialBank ? 'Edit Bank' : 'New Bank'}
              </h4>
              <p className="text-[11px] text-muted-foreground">
                {initialBank
                  ? 'Update bank entity in the Bank master'
                  : 'Register bank entity to the Bank master'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-foreground block">
              Bank Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              autoFocus
              placeholder="e.g. Dutch Bangla Bank Lt."
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-foreground block">
                Alias (Short Code) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-muted-foreground font-mono">
                e.g. DBBL
              </span>
            </div>
            <input
              type="text"
              maxLength={10}
              placeholder="e.g. DBBL"
              value={alias}
              onChange={(e) => {
                setAlias(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''));
                setError(null);
              }}
              className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-mono font-bold tracking-wider uppercase text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
            />
          </div>

          {error && (
            <p className="text-[11px] text-rose-500 font-medium">{error}</p>
          )}

          {/* Footer actions: Close + Save (from sheet 2) */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-bold text-muted-foreground hover:bg-muted cursor-pointer transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="size-3.5" />
                  <span>Save Bank</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
