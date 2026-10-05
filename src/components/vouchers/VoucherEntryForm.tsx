import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { VoucherType, VoucherLine, VoucherEntry } from '../../types/voucher';
import {
  VOUCHER_TYPE_CONFIGS,
  DEFAULT_DATE,
  COST_CENTERS,
} from '../../constants/voucherTypeConfig';
import { calculateVoucherTotals } from '../../lib/voucherMath';
import { VoucherTypeChip } from './VoucherTypeChip';
import { LineItemTable } from './LineItemTable';
import { VoucherFooterTotals } from './VoucherFooterTotals';
import { AccountHeadPicker } from './AccountHeadPicker';
import {
  Calendar,
  Save,
  ArrowLeft,
  Receipt,
  Building2,
  FileText,
  Wallet,
  Landmark,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCustomFields } from '../../hooks/useCustomFields';
import { CustomFieldContext } from '../../types/customField';

interface VoucherEntryFormProps {
  type: VoucherType;
  onSave?: (entry: VoucherEntry) => void;
}

export const VoucherEntryForm: React.FC<VoucherEntryFormProps> = ({ type, onSave }) => {
  const navigate = useNavigate();
  const config = VOUCHER_TYPE_CONFIGS[type];

  const [date, setDate] = useState<string>(DEFAULT_DATE);
  const [headerAccountId, setHeaderAccountId] = useState<string>('');
  const [headerAccountName, setHeaderAccountName] = useState<string>('');
  const [headerCostCenterId, setHeaderCostCenterId] = useState<string>('');
  const [narration, setNarration] = useState<string>('');

  // Initial seed lines
  const [lines, setLines] = useState<VoucherLine[]>(() => {
    return [
      {
        id: `vl-seed-1`,
        accountHeadId: '',
        accountHeadName: '',
        costCenterId: '',
        subsidiaryId: '',
        employeeId: '',
        vehicleId: '',
        reference: '',
        description: '',
        currency: 'BDT',
        exchangeRate: 1,
        debit: config.showDebit ? 0 : undefined,
        credit: config.showCredit ? 0 : undefined,
        debitBDT: config.showDebit ? 0 : undefined,
        creditBDT: config.showCredit ? 0 : undefined,
      },
    ];
  });

  // Calculate live totals and reconciliation
  const totals = useMemo(() => {
    return calculateVoucherTotals(lines, type);
  }, [lines, type]);

  // Check save validity
  const isSaveValid = useMemo(() => {
    // Must have at least 1 line with an account selected
    const hasValidLine = lines.some((l) => l.accountHeadId.trim() !== '');
    if (!hasValidLine) return false;

    // Receive/Payment requires header account
    if (config.hasHeaderAccount && !headerAccountId) {
      return false;
    }

    // Double-entry requires balanced (difference == 0 and total > 0)
    if (config.isDoubleEntry) {
      return totals.isBalanced;
    }

    // Single-sided requires at least one non-zero amount
    if (type === 'Payment Voucher') {
      return totals.totalDebitBDT > 0;
    }
    if (type === 'Receive Voucher') {
      return totals.totalCreditBDT > 0;
    }

    return true;
  }, [lines, config, headerAccountId, totals, type]);

  const voucherContext: CustomFieldContext =
    type === 'Journal Voucher'
      ? 'journal'
      : type === 'Payment Voucher'
      ? 'payment'
      : type === 'Receive Voucher'
      ? 'receive'
      : 'contra';

  const { fields: customFields } = useCustomFields(voucherContext);

  const handleSaveVoucher = () => {
    if (!isSaveValid) {
      if (config.isDoubleEntry && !totals.isBalanced) {
        toast.error('Cannot post voucher: Debit and Credit are not balanced (Difference must = 0.00)');
      } else if (config.hasHeaderAccount && !headerAccountId) {
        toast.error(`Please select a ${config.headerAccountLabel}`);
      } else {
        toast.error('Please complete all required fields and amounts before saving.');
      }
      return;
    }

    // Check mandatory custom fields
    const mandatoryFields = customFields.filter((cf) => cf.mandatory && cf.activeStatus === 'Active');
    for (const mf of mandatoryFields) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.accountHeadId) {
          const val = line.customFields?.[mf.id];
          if (val === undefined || val === null || String(val).trim() === '') {
            toast.error(`Line #${i + 1}: Custom field "${mf.label}" is required before saving.`);
            return;
          }
        }
      }
    }

    const newVoucher: VoucherEntry = {
      id: `ve-${Date.now()}`,
      voucherNumber: `${config.shortName}-${Date.now().toString().slice(-6)}`,
      voucherType: type,
      date,
      headerAccountId: config.hasHeaderAccount ? headerAccountId : undefined,
      headerAccountName: config.hasHeaderAccount ? headerAccountName : undefined,
      headerCostCenterId: config.hasHeaderAccount ? headerCostCenterId : undefined,
      lines,
      narration,
      totals: {
        debit: totals.totalDebit,
        credit: totals.totalCredit,
        debitBDT: totals.totalDebitBDT,
        creditBDT: totals.totalCreditBDT,
      },
      difference: totals.difference,
      createdAt: new Date().toISOString(),
    };

    if (onSave) {
      onSave(newVoucher);
    }
    toast.success(`${type} #${newVoucher.voucherNumber} posted successfully!`);
    navigate('/vouchers');
  };

  return (
    <div className="space-y-4">
      {/* ── Top Header Strip ── */}
      <div className="bg-card border border-border/80 rounded-xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-3">
          {/* Breadcrumb Title */}
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-primary/10 text-primary grid place-items-center">
              <Receipt className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-foreground">
                  {config.breadcrumbTitle}
                </h1>
                <VoucherTypeChip type={type} size="sm" />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Financial transaction entry form with automated multi-currency reconciliation.
              </p>
            </div>
          </div>

          {/* Date Picker */}
          <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-lg border border-border/70 shadow-2xs shrink-0">
            <Calendar className="size-3.5 text-primary" />
            <span className="text-xs font-bold text-foreground">Date:</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent font-mono text-xs font-bold text-foreground outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* ── Type-Specific Special Header Fields (Receive / Payment) ── */}
        {config.hasHeaderAccount && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-muted/20 border border-border/60">
            {/* Header Account Picker (Cash & Bank restricted) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground/85 flex items-center justify-between">
                <span>
                  {config.headerAccountLabel} <span className="text-rose-500">*</span>
                </span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  Cash & Bank only
                </span>
              </label>
              <AccountHeadPicker
                value={headerAccountId}
                onChange={(id, name) => {
                  setHeaderAccountId(id);
                  setHeaderAccountName(name);
                }}
                onlyCashAndBank={true}
                placeholder={`Select ${config.headerAccountLabel}...`}
              />
            </div>

            {/* Cost Center Picker */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground/85">Header Cost Center</label>
              <select
                value={headerCostCenterId}
                onChange={(e) => setHeaderCostCenterId(e.target.value)}
                className="w-full h-8.5 px-3 rounded-lg bg-card border border-border/80 text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-primary cursor-pointer shadow-2xs"
              >
                <option value="">Select Cost Center...</option>
                {COST_CENTERS.map((cc) => (
                  <option key={cc.id} value={cc.id}>
                    {cc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* ── Line-Item Table ── */}
      <LineItemTable voucherType={type} lines={lines} onChange={setLines} />

      {/* ── Summary & Reconciliation Footer ── */}
      <VoucherFooterTotals voucherType={type} totals={totals} />

      {/* ── Narration Textarea ── */}
      <div className="bg-card border border-border/80 rounded-xl p-3.5 shadow-2xs space-y-1.5">
        <label className="text-xs font-bold text-foreground/85 flex items-center gap-1.5">
          <FileText className="size-3.5 text-muted-foreground" />
          <span>Narration / Notes</span>
        </label>
        <textarea
          rows={2}
          value={narration}
          onChange={(e) => setNarration(e.target.value)}
          placeholder="Enter formal accounting narration or voucher notes here..."
          className="w-full p-2.5 rounded-lg bg-muted/15 border border-border/80 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs resize-none"
        />
      </div>

      {/* ── Sticky Bottom Action Bar ── */}
      <div className="sticky bottom-0 z-20 bg-card/95 backdrop-blur-md border border-border/80 rounded-xl p-3 shadow-lg flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate('/vouchers')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border hover:bg-muted text-xs font-bold text-muted-foreground hover:text-foreground transition-all cursor-pointer"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to List</span>
        </button>

        <button
          type="button"
          onClick={handleSaveVoucher}
          disabled={!isSaveValid}
          className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
            isSaveValid
              ? 'bg-primary text-primary-foreground hover:bg-primary/95 shadow-primary/20'
              : 'bg-muted text-muted-foreground/50 border border-border/40 cursor-not-allowed shadow-none'
          }`}
        >
          <Save className="size-3.5 stroke-[2.5]" />
          <span>Post & Save {type}</span>
        </button>
      </div>
    </div>
  );
};
