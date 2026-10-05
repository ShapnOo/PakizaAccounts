import React, { useEffect, useState } from 'react';
import { FileText, Calculator, AlertCircle } from 'lucide-react';
import { listBillsBySupplier } from '../../services/mastersService';
import { Bill } from '../../mock/bills';

interface BillInfoBlockProps {
  supplierId?: string;
  billNo: string;
  billDate: string;
  billValue: number;
  prevPaid: number;
  balance: number;
  payAmount: number;
  onBillSelect: (bill: Bill | null) => void;
  onPayAmountChange: (val: number) => void;
  errors?: Record<string, string | undefined>;
}

export const BillInfoBlock: React.FC<BillInfoBlockProps> = ({
  supplierId,
  billNo,
  billDate,
  billValue,
  prevPaid,
  balance,
  payAmount,
  onBillSelect,
  onPayAmountChange,
  errors = {},
}) => {
  const [bills, setBills] = useState<Bill[]>([]);

  useEffect(() => {
    if (supplierId) {
      listBillsBySupplier(supplierId).then(setBills);
    } else {
      setBills([]);
    }
  }, [supplierId]);

  const handleBillChange = (selectedBillNo: string) => {
    const matched = bills.find((b) => b.billNo === selectedBillNo) || null;
    onBillSelect(matched);
  };

  return (
    <div className="bg-card rounded-xl border border-amber-500/30 dark:border-amber-500/20 p-5 space-y-4 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-border/80">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <FileText className="size-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Bill Reference Information
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Outstanding supplier invoice details and settlement calculation
            </p>
          </div>
        </div>

        {supplierId && bills.length > 0 && (
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            {bills.length} Pending {bills.length === 1 ? 'Bill' : 'Bills'}
          </span>
        )}
      </div>

      {/* 6-Column Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Bill No */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1">
            <span>Bill No</span>
            <span className="text-rose-500 font-bold">*</span>
          </label>
          <select
            value={billNo}
            onChange={(e) => handleBillChange(e.target.value)}
            disabled={!supplierId || bills.length === 0}
            className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-amber-500 shadow-2xs cursor-pointer ${
              !supplierId || bills.length === 0 ? 'bg-muted/40 text-muted-foreground' : ''
            } ${errors['bill.billNo'] || errors.bill ? 'border-rose-400 focus:ring-rose-500' : 'border-border'}`}
          >
            <option value="">
              {!supplierId
                ? '-- Select Supplier First --'
                : bills.length === 0
                ? '-- No pending bills --'
                : '-- Select Bill No --'}
            </option>
            {bills.map((b) => (
              <option key={b.id} value={b.billNo}>
                {b.billNo}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Bill Date */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Bill Date</label>
          <input
            type="text"
            readOnly
            value={billDate || '—'}
            className="w-full h-9 px-3 rounded-lg border border-border bg-muted/40 text-xs font-medium text-foreground outline-none cursor-not-allowed"
          />
        </div>

        {/* 3. Bill Value */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Bill Value (৳)</label>
          <input
            type="text"
            readOnly
            value={billValue ? billValue.toLocaleString('en-IN') : '0.00'}
            className="w-full h-9 px-3 rounded-lg border border-border bg-muted/40 text-xs font-mono font-bold text-foreground text-right outline-none cursor-not-allowed"
          />
        </div>

        {/* 4. Prev. Paid */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Prev. Paid (৳)</label>
          <input
            type="text"
            readOnly
            value={prevPaid ? prevPaid.toLocaleString('en-IN') : '0.00'}
            className="w-full h-9 px-3 rounded-lg border border-border bg-muted/40 text-xs font-mono font-medium text-muted-foreground text-right outline-none cursor-not-allowed"
          />
        </div>

        {/* 5. Balance (Formula: Value - Prev Paid) */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <Calculator className="size-3" />
            <span>Balance (৳)</span>
          </label>
          <input
            type="text"
            readOnly
            value={balance ? balance.toLocaleString('en-IN') : '0.00'}
            className="w-full h-9 px-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-xs font-mono font-extrabold text-amber-600 dark:text-amber-400 text-right outline-none cursor-not-allowed"
          />
        </div>

        {/* 6. Pay Amount */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-foreground flex items-center gap-1">
            <span>Pay Amount (৳)</span>
            <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min={0.01}
            max={balance || undefined}
            step="any"
            value={payAmount || ''}
            onChange={(e) => {
              const val = parseFloat(e.target.value) || 0;
              onPayAmountChange(val);
            }}
            placeholder="0.00"
            className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-mono font-bold text-foreground text-right outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-2xs ${
              errors['bill.payAmount'] || (payAmount > balance && balance > 0)
                ? 'border-rose-400'
                : 'border-border'
            }`}
          />
        </div>
      </div>

      {payAmount > balance && balance > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-rose-500 font-semibold pt-1">
          <AlertCircle className="size-3.5" />
          <span>Pay amount cannot exceed available balance of ৳{balance.toLocaleString('en-IN')}.</span>
        </div>
      )}
    </div>
  );
};
