import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, CreditCard, Building, Info, UserCheck, Calculator, Plus, Check } from 'lucide-react';
import { BankDetails } from '../../types/coa';
import { BANK_ACCOUNT_TYPES } from '../../constants/accountsTypeTree';

const DEFAULT_MASTER_BANKS = [
  'Dutch Bangla Bank Lt.',
  'Mutual Trust Bank Ltd.',
  'BRAC Bank Ltd.',
  'Eastern Bank Ltd.',
  'Islami Bank Bangladesh Ltd.',
  'City Bank Ltd.',
  'Standard Chartered Bank',
  'Prime Bank Ltd.',
  'HSBC Bangladesh',
];

interface BankDetailsSectionProps {
  detailsType?: string;
  bankDetails?: Partial<BankDetails>;
  onChange: (details: Partial<BankDetails>) => void;
  errors?: {
    bankName?: string;
    accountNumber?: string;
    accountType?: string;
  };
}

export const BankDetailsSection: React.FC<BankDetailsSectionProps> = ({
  detailsType,
  bankDetails = { bankName: '', accountNumber: '', accountType: 'CD' },
  onChange,
  errors = {},
}) => {
  const [bankOptions, setBankOptions] = useState<string[]>(() => {
    const initial = [...DEFAULT_MASTER_BANKS];
    if (bankDetails.bankName && !initial.includes(bankDetails.bankName)) {
      initial.unshift(bankDetails.bankName);
    }
    return initial;
  });

  const [isAddingBank, setIsAddingBank] = useState(false);
  const [newBankInput, setNewBankInput] = useState('');

  useEffect(() => {
    if (bankDetails.bankName && !bankOptions.includes(bankDetails.bankName)) {
      setBankOptions((prev) => [bankDetails.bankName!, ...prev]);
    }
  }, [bankDetails.bankName, bankOptions]);

  const updateField = (field: keyof BankDetails, val: string) => {
    onChange({
      ...bankDetails,
      [field]: val,
    });
  };

  const handleSaveNewBank = () => {
    const trimmed = newBankInput.trim();
    if (!trimmed) return;
    if (!bankOptions.includes(trimmed)) {
      setBankOptions((prev) => [trimmed, ...prev]);
    }
    updateField('bankName', trimmed);
    setNewBankInput('');
    setIsAddingBank(false);
  };

  const isBank = detailsType === 'Bank';
  const isCash = detailsType === 'Cash';
  const isParty =
    detailsType === 'Accounts Receivable' ||
    detailsType === 'Others Receivable' ||
    detailsType === 'Accounts Payable' ||
    detailsType === 'Others Payable';
  const isCostCenter =
    detailsType === 'Cost of Raw Materials' || detailsType === 'Overhead';

  return (
    <AnimatePresence>
      {isBank && (
        <motion.div
          key="bank-section"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 space-y-3 mt-2">
            <div className="flex items-center gap-2 border-b border-primary/10 pb-2">
              <Landmark className="size-4 text-primary" />
              <span className="text-xs font-bold text-foreground">
                Bank Account Details
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                Required for Bank
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Bank Name Dropdown + Add Button */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-bold text-foreground/80 flex items-center justify-between">
                  <span>
                    Bank Name <span className="text-rose-500">*</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground font-normal">
                    Master Data Options
                  </span>
                </label>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Building className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
                    <select
                      value={bankDetails.bankName || ''}
                      onChange={(e) => updateField('bankName', e.target.value)}
                      className={`w-full h-8.5 pl-8 pr-8 rounded-lg bg-card border text-xs font-semibold text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-2xs cursor-pointer ${
                        errors.bankName ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-border/80'
                      }`}
                    >
                      <option value="">-- Select Master Bank Name --</option>
                      {bankOptions.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddingBank(!isAddingBank)}
                    className="h-8.5 px-3 rounded-lg border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold shadow-2xs transition-all cursor-pointer whitespace-nowrap active:scale-95 flex items-center gap-1"
                  >
                    <Plus className="size-3.5 stroke-[2.5]" />
                    <span>Add+</span>
                  </button>
                </div>

                {errors.bankName && (
                  <p className="text-[10.5px] font-medium text-rose-500">{errors.bankName}</p>
                )}

                {/* Inline New Bank Name Creator */}
                {isAddingBank && (
                  <div className="mt-2 p-2 rounded-lg bg-card border border-primary/30 flex items-center gap-2 animate-in fade-in-50 zoom-in-95 duration-150">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Enter new Bank Name..."
                      value={newBankInput}
                      onChange={(e) => setNewBankInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSaveNewBank();
                        }
                      }}
                      className="flex-1 h-8 px-2.5 rounded-md bg-background border border-border/80 text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={handleSaveNewBank}
                      className="h-8 px-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold flex items-center gap-1 shadow-2xs"
                    >
                      <Check className="size-3.5 stroke-[2.5]" />
                      <span>Save</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingBank(false)}
                      className="h-8 px-2.5 rounded-md border border-border hover:bg-muted text-xs text-muted-foreground"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Account Number */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-foreground/80 flex items-center justify-between">
                  <span>
                    Accounts Number <span className="text-rose-500">*</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground font-normal">Numeric</span>
                </label>
                <div className="relative">
                  <CreditCard className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 100001122"
                    value={bankDetails.accountNumber || ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      updateField('accountNumber', val);
                    }}
                    className={`w-full h-8.5 pl-8 pr-3 rounded-lg bg-card border text-xs font-mono font-bold text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-2xs ${
                      errors.accountNumber
                        ? 'border-rose-500 ring-2 ring-rose-500/10'
                        : 'border-border/80'
                    }`}
                  />
                </div>
                {errors.accountNumber && (
                  <p className="text-[10.5px] font-medium text-rose-500">{errors.accountNumber}</p>
                )}
              </div>

              {/* Account Type [CD | SB | CC | OD] */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-foreground/80">
                  Accounts Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={bankDetails.accountType || 'CD'}
                  onChange={(e) => updateField('accountType', e.target.value)}
                  className="w-full h-8.5 px-3 rounded-lg bg-card border border-border/80 text-xs font-bold text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-2xs cursor-pointer"
                >
                  {BANK_ACCOUNT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t} ({t === 'CD' ? 'Current Deposit' : t === 'SB' ? 'Savings Bank' : t === 'CC' ? 'Cash Credit' : 'Overdraft'})
                    </option>
                  ))}
                </select>
                {errors.accountType && (
                  <p className="text-[10.5px] font-medium text-rose-500">{errors.accountType}</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Cash Details Sub-block */}
      {isCash && (
        <motion.div
          key="cash-section"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2 mt-2">
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
              <Calculator className="size-3.5" />
              <span>Cash Register Setup</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10.5px] font-semibold text-muted-foreground">
                  Cash Counter Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Main Cash Desk 01"
                  className="w-full h-8 px-2.5 rounded-lg bg-card border border-border/80 text-xs text-foreground outline-none"
                />
              </div>
              <div>
                <label className="text-[10.5px] font-semibold text-muted-foreground">
                  Cash Account Ref
                </label>
                <input
                  type="text"
                  placeholder="e.g. CASH-HQ-01"
                  className="w-full h-8 px-2.5 rounded-lg bg-card border border-border/80 text-xs font-mono text-foreground outline-none"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Party / Receivable / Payable Details Sub-block */}
      {isParty && (
        <motion.div
          key="party-section"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="p-3 rounded-xl border border-sky-500/20 bg-sky-500/5 space-y-2 mt-2">
            <div className="flex items-center gap-1.5 text-sky-700 dark:text-sky-400 font-bold text-xs">
              <UserCheck className="size-3.5" />
              <span>Party Ledger Mapping</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="text-[10.5px] font-semibold text-muted-foreground">Party Name</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp"
                  className="w-full h-8 px-2.5 rounded-lg bg-card border border-border/80 text-xs text-foreground outline-none"
                />
              </div>
              <div>
                <label className="text-[10.5px] font-semibold text-muted-foreground">Party Code</label>
                <input
                  type="text"
                  placeholder="e.g. CUST-009"
                  className="w-full h-8 px-2.5 rounded-lg bg-card border border-border/80 text-xs font-mono text-foreground outline-none"
                />
              </div>
              <div>
                <label className="text-[10.5px] font-semibold text-muted-foreground">Credit Days</label>
                <input
                  type="number"
                  placeholder="30"
                  className="w-full h-8 px-2.5 rounded-lg bg-card border border-border/80 text-xs font-mono text-foreground outline-none"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Cost Center / Overhead Details Sub-block */}
      {isCostCenter && (
        <motion.div
          key="cost-center-section"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2 mt-2">
            <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 font-bold text-xs">
              <div className="flex items-center gap-1.5">
                <Info className="size-3.5" />
                <span>Cost Center Allocation</span>
              </div>
              <a
                href="/accounts-config/master-config"
                className="text-[10.5px] underline hover:text-amber-800"
              >
                Configure in Section 3.1
              </a>
            </div>
            <div>
              <label className="text-[10.5px] font-semibold text-muted-foreground">
                Linked Cost Center Unit
              </label>
              <select className="w-full h-8 px-2.5 rounded-lg bg-card border border-border/80 text-xs text-foreground outline-none cursor-pointer">
                <option value="factory">Factory Production Floor</option>
                <option value="dyeing">Dyeing & Finishing Unit</option>
                <option value="knitting">Knitting Unit</option>
                <option value="admin">Head Office Admin</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BankDetailsSection;
